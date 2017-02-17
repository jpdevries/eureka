const actions = require('./actions'),
combineReducers = require('redux').combineReducers,
update = require('react-addons-update');

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
    return Object.assign({},state,action.content);
    break;
    
    case actions.FETCH_DIRECTORY_CONTENTS_SUCCESS:
    return Object.assign({},state,{
      contents:action.contents.filter((file) => (
        file.filename
      ))
    });
  }

  return state;
}

var initialTreeReducer = [{
  name:'assets',
  cd:'assets',
  children:[{
    name:'img',
    cd:'assets/img'
  }]
},{
  name:'uploads',
  cd:'uploads'
}];

let cd = '';
var treeReducer = function(state, action) {
  state = state || initialTreeReducer;

  switch(action.type) {
    case actions.UPDATE_SOURCE_TREE_SUCCESS:
    return action.contents.map((file) => (
      Object.assign({},file,{
        children: (file.children) ? file.children : []
      })
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
    
    return state.map((file) => (
      Object.assign({}, file, {
        children:(file.children.length) ? addChildrenToCurrentFolder(file.children) : foldersToAdd
      })
    ));
    
    break;
  }

  return state;
}

var initialViewState = {
  focusedMediaItem: undefined,
  filter: undefined,
  //cd: '/',
  mode:'table'
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
  console.log('sourceReducer', action.type);
  switch(action.type) {
    case actions.FETCH_MEDIA_SOURCES_SUCCESS:
    console.log(actions.FETCH_MEDIA_SOURCES_SUCCESS, action.sources);
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
    console.log('cs',cs);
    break;
    
    case actions.FETCH_MEDIA_SOURCES_SUCCESS:
    console.log('directoryReducer', actions.FETCH_MEDIA_SOURCES_SUCCESS, action.sources);
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
    
    console.log(actions.UPDATE_SOURCE_TREE_SUCCESS,'foldersToAdd',foldersToAdd);
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
    
    console.log('foldersToAdd',foldersToAdd);
    
    break;
    
    case actions.UPDATE_SOURCE:

    break;
  }

  return state;
}

var EurekaReducer = combineReducers({
  content: contentReducer,
  view: viewReducer,
  tree: treeReducer,
  source: sourceReducer,
  directory: directoryReducer
});

exports.EurekaReducer = EurekaReducer;
