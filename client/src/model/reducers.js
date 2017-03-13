const actions = require('./actions'),
combineReducers = require('redux').combineReducers,
update = require('react-addons-update'),
path = require('path');

import utility from '../utility/utility';

var initialContentState = {
  cd: '/',
  contents:[
    /*{
      filename:'foo.jpg',
      directory:'assets/images',
      absolutePath:'http://placehold.it/350x150',
      absoluteURL:'http://placehold.it/350x150',
      dimensions:[350,150],
      fileSize:24800,
      editedOn:1487107348619
    },
    {
      filename:'bar.jpg',
      directory:'assets/images',
      absolutePath:'http://placehold.it/300x150',
      absoluteURL:'http://placehold.it/350x150',
      dimensions:[300,150],
      fileSize:24800,
      editedOn:1487107348619
    }*/
  ]
};

var contentReducer = function(state, action) {
  state = state || initialContentState;

  switch(action.type) {
    case actions.UPDATE_CONTENT:
    console.log('UPDATE_CONTENT', state, action.content);
    return Object.assign({},state,action.content);
    break;

    case actions.FETCH_DIRECTORY_CONTENTS_SUCCESS:
    return Object.assign({},state,{
      contents:action.contents.filter((file) => (
        file.filename
      ))
    });

    case actions.UPLOAD_FILES_SUCCESS:
    //if(!Array.isArray(action.contents)) return state; // so the backed can just return res.json([true]) if it wants?
    return Object.assign({},state,{
      contents:action.contents.filter((file) => (
        file.filename
      ))
    });

    case actions.DELETE_MEDIA_ITEM_SUCCESS:
    console.log(actions.DELETE_MEDIA_ITEM_SUCCESS, action.source, action.absolutePath, state);


    return Object.assign({},state,{
      cd: (state.cd === action.absolutePath) ? path.join(state.cd, '..') : state.cd,
      contents:state.contents.filter((file) => (
        file.absolutePath !== action.absolutePath
      ))
    });
    break;
  }

  return state;
}

var initialTreeReducer = [/*{
  name:'assets',
  cd:'assets',
  children:[{
    name:'img',
    cd:'assets/img'
  }]
},{
  name:'uploads',
  cd:'uploads'
}*/];

let cd = '';
var treeReducer = function(state, action) {
  state = state || initialTreeReducer;

  switch(action.type) {
    case actions.UPDATE_SOURCE_TREE_SUCCESS:

    let newState = state.slice(0);

    function directoryInState(directory) {
      for(let i = 0; i < newState.length; i++) {
        if(newState[i].cd === directory.cd) return true;
      }

      return false;
    }

    function directoryOnServer(directory) {
      for(let i = 0; i < contents.length; i++) {
        if(contents[i].cd === directory.cd) return true;
      }
      return false;
    }


    const contents = action.contents.map((file) => (
      Object.assign({},file,{
        children: (file.children) ? file.children : []
      })
    ));

    // loop through top level directories returned from server add any we don't already have
    contents.map((directory) => {
      if(!directoryInState(directory)) {
        newState.push(directory);
      }
    });



    // if any of the top-level directories in our local state are no longer on the store remove them
    return newState.filter((directory) => (
      directoryOnServer(directory)
    ));

    break;

    case actions.UPDATE_CONTENT:
    if(action.content.cd) cd = action.content.cd;
    break;

    case actions.FETCH_DIRECTORY_CONTENTS_SUCCESS:
    // loop over just the folders and create data objects for them
    let foldersToAdd = action.contents.filter((file) => (file.foldername)).map((file) => ({
      name:file.foldername,
      cd:file.directory,
      children:[]
    }));

    function addChildrenToCurrentFolder(children) {
      return children.map((child) => (
        Object.assign({}, child, {
          children: (child.cd === cd) ? utility.removeDuplicates([...child.children, ...foldersToAdd], 'name') : addChildrenToCurrentFolder(child.children)
        })
      ))
    }

    return addChildrenToCurrentFolder(state);

    /*return state.map((file) => (
      Object.assign({}, file, {
        children:(file.children && file.cd !== cd) ? addChildrenToCurrentFolder(file.children) : foldersToAdd
      })
    ));*/

    break;

    case actions.DELETE_MEDIA_ITEM_SUCCESS:
    let stillSearching = true;
    function recursivelyRemoveDirectory(children) {
      return children.map((child) => {
        if(child.cd === action.absolutePath) {
          stillSearching = false;
          return undefined;
        }
        return Object.assign({}, child, {
          children:(child.children && stillSearching) ? recursivelyRemoveDirectory(child.children) : child.children
        });
      }).filter(Boolean);
    }

    return recursivelyRemoveDirectory(state);

    break;

  }

  return state;
}

var initialViewState = {
  focusedMediaItem: undefined,
  filter: undefined,
  //cd: '/',
  mode:'table',
  sourceTreeOpen: true,
  enlargeFocusedRows: false,
  locale:undefined,
  sort:'name',
  isTableScrolling:false,
  intervals: {
    searchBarPlaceholder: false,
    fetchDirectoryContents: 18000,
    updateSourceTree: false
  },

};

var viewReducer = function(state, action) {
  state = state || initialViewState;

  switch(action.type) {
    case actions.UPDATE_VIEW:
    return Object.assign({},state,action.view);

    case actions.UPDATE_SOURCE_TREE_SUCCESS:
    return Object.assign({},state,{
      cd:'/'
    });

    case actions.DELETE_MEDIA_ITEM_SUCCESS:
    try {
      if(state.focusedMediaItem.absolutePath === action.absolutePath) return Object.assign({},state,{
        focusedMediaItem:undefined
      });
    } catch (e) {

    }
  }

  return state;
}

var initialSourceState = {
  currentSource: 0,
  sources: [/*{
    name: 'Filesystem',
    id: 'fileystem'
  },{
    name: 'Amazon S3',
    id: 's3'
  }*/]
};



var sourceReducer = function(state, action) {
  state = state || initialSourceState;
  switch(action.type) {
    case actions.FETCH_MEDIA_SOURCES_SUCCESS:
    return Object.assign({},state,{
      sources:action.sources
    });
    break;

    case actions.UPDATE_SOURCE:
    return Object.assign({}, state, {
      currentSource: action.source
    });
    break;
  }

  return state;
}


var initialDirectoryState = [{
  name: 'Filesystem',
  id: 'fileystem',
  directories:[]
}];

let cs;
var directoryReducer = function(state, action) {
  state = state || initialDirectoryState;

  let foldersToAdd = [];

  switch(action.type) {
    case actions.UPDATE_SOURCE:
    cs = action.source;
    break;

    case actions.FETCH_MEDIA_SOURCES_SUCCESS:
    if(cs === undefined) cs = action.sources[0].id;
    return action.sources.map((source) => (
      Object.assign({}, source, {
        directories:[]
      })
    ))
    break;

    case actions.UPDATE_SOURCE_TREE_SUCCESS:
    foldersToAdd = action.contents.map((file) => (
      Object.assign({},file,{
        children: (file.children) ? file.children : []
      })
    ));

    return state.map((source) => (
      Object.assign({}, source, {
        directories:(source.id == cs) ? utility.removeDuplicates([...source.directories, ...foldersToAdd], 'name') : source.directories
      })
    ));


    break;

    case actions.FETCH_DIRECTORY_CONTENTS_SUCCESS:
    // loop over just the folders and create data objects for them
    foldersToAdd = action.contents.filter((file) => (file.foldername)).map((file) => ({
      name:file.foldername,
      cd:file.directory
    }));

    return state.map((source) => (
      Object.assign({}, source, {
        directories:(source.id == cs) ? utility.removeDuplicates([...source.directories, ...foldersToAdd], 'name') : source.directories
      })
    ));

    break;

    case actions.UPDATE_SOURCE:

    break;


  }

  return state;
}

var initialFetchedState = {
  lastDirectoriesFetched:[]
}

var fetchedReducer = function(state, action) {
  state = state || initialFetchedState;

  switch(action.type) {
    case actions.FETCH_DIRECTORY_CONTENTS_SUCCESS:
    // loop over just the folders and create data objects for them
    const namesOfFoldersToAdd = action.contents.filter((file) => (file.foldername)).map((file) => (file.foldername));

    console.log('namesOfFoldersToAdd',namesOfFoldersToAdd);

    return Object.assign({}, state, {
      lastDirectoriesFetched: namesOfFoldersToAdd
    });

    break;

  }

  return state;
}

var EurekaReducer = combineReducers({
  content: contentReducer,
  view: viewReducer,
  tree: treeReducer,
  source: sourceReducer,
  directory: directoryReducer,
  fetched: fetchedReducer
});

exports.EurekaReducer = EurekaReducer;
