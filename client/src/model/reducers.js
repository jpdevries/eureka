import update from 'react-addons-update'; // ES6

const actions = require('./actions'),
combineReducers = require('redux').combineReducers,
path = require('path');

const pkg = require("./../../package.json");

import utility from '../utility/utility';

import filesize from 'filesize';

const initialConfigState = {
  basePath:'/',
  allowChoose:true,
  allowUploads:true,
  allowDownload:true,
  treeHidden:true,
  useLocalStorage:true,
  storagePrefix:"eureka__",
  allowRename:true,
  allowDelete:true,
  confirmBeforeDelete:false,
  allowDownloadMultiple: true,
  locales:"en-US",
  allowChooseMultiple:true,
  allowInvertSelection:true,
  mediaSource:"0",
  currentDirectory:"/",
  welcome: true,
  alwaysWelcome: false,
  learnMore: 'https://github.com/jpdevries/eureka',
  uid:"0",
  iconSVG:`./img/icons.${pkg.version}.min.svg`,
  assetsBasePath:'./assets/',
  doDragNDrop: true,
  emphasisFocusedMediaItem:true,
  headers:{'Powered-By': 'Eureka by Markup.tips'},
  intervals:{searchBarPlaceholder: 60000, fetchDirectoryContents: 18000, updateSourceTree: false},
  callbacks: {
    close: undefined,
    choose: undefined
  },
  handlers: {
    createFile: undefined
  }
};

var configReducer = function(state, action) {
  state = state || initialConfigState;

  switch(action.type) {
    case actions.UPDATE_CONFIG:
    //console.log('UPDATE_CONFIG!!', action.config);
    return Object.assign({},state,action.config);
    break;
  }


  return state;
}

let selectionInverted = false;

const initialContentState = Object.assign({}, {
  cd: '/',
  chosenMediaItems:[],
  chosenMediaItemsInverted:[],
  contents:[
    /*{
      filename:'foo.jpg',
      directory:'assets/images',
      path:'http://placehold.it/350x150',
      absoluteURL:'http://placehold.it/350x150',
      dimensions:[350,150],
      fileSize:24800,
      editedOn:1487107348619
    },
    {
      filename:'bar.jpg',
      directory:'assets/images',
      path:'http://placehold.it/300x150',
      absoluteURL:'http://placehold.it/350x150',
      dimensions:[300,150],
      fileSize:24800,
      editedOn:1487107348619
    }*/
  ]
}, (() => {
  try {
    return (Object.assign({}, JSON.parse(localStorage.getItem('eureka__content')), {
      chosenMediaItems: []
    }))
  } catch(e) {
    return {};
  }
})());


function getInvertedChosenItems(contents = [], chosenMediaItems = [], selectionInverted = true) {
  if(!selectionInverted) return chosenMediaItems;
  return contents.filter((item) => (
    !chosenMediaItems.includes(item)
  ));
}

var contentReducer = function(state, action) {
  state = state || initialContentState;
  let newState = state;
  //console.log('contentReducer', action.type);

  let newChosenMediaItems;

  switch(action.type) {
    case actions.UPDATE_CONFIG:
    //console.log('UPDATE_CONFIG!!!', state, action.config);
    if(action.config.currentDirectory) return Object.assign({}, state, {
      cd:action.config.currentDirectory
    })

    break;

    case actions.UPDATE_VIEW:
    //console.log('UPDATE_CONFIG!!!', state, action.config);
    //console.log(' update view mo fo', selectionInverted, action.view.selectionInverted);
    try {
      if(selectionInverted !== action.view.selectionInverted || state.contents.chosenMediaItems.length !== state.contents.chosenMediaItemsInverted.length) {
        newState = update(state, {$merge: {chosenMediaItemsInverted: getInvertedChosenItems(state.contents, state.chosenMediaItems, action.view.selectionInverted)}});
      }
    } catch(e) { console.log(e) }

    selectionInverted = action.view.selectionInverted;
    return newState;
    break;

    case actions.INVERT_SELECTION:
    return newState;
    break;

    case actions.ADD_MEDIA_ITEM_TO_CHOSEN_ITEMS:
    if(state.chosenMediaItems.includes(action.item)) return newState;
    newChosenMediaItems = update(newState.chosenMediaItems, {$push: [action.item]});
    return update(newState, {$merge: {
      chosenMediaItems: newChosenMediaItems,
      chosenMediaItemsInverted: getInvertedChosenItems(newState.contents, update(newState.chosenMediaItems, {$push: [action.item]}), action.inverted)
    }});
    break;

    case actions.REMOVE_MEDIA_ITEM_FROM_CHOSEN_ITEMS:
    if(!state.chosenMediaItems.includes(action.item)) return newState;

    newChosenMediaItems = newState.chosenMediaItems.filter((item) => (item !== action.item));

    return update(newState, {$merge: {
      chosenMediaItems: newChosenMediaItems,
      chosenMediaItemsInverted: getInvertedChosenItems(newState.contents, newChosenMediaItems, action.inverted)
    }});
    break;

    case actions.DESELECT_ALL:
    return update(newState, {$merge: {
      chosenMediaItems: [],
      chosenMediaItemsInverted: []
    }});
    break;

    case actions.UPDATE_CONTENT:
    const content = processContentItems(action.content);
    newState = Object.assign({}, state, content);
    if(action.content.cd && action.content.cd !== state.cd) newState = Object.assign({}, newState, { // if updating the current directory clear the chosen media items
      chosenMediaItems: [],
      chosenMediaItemsInverted: []
    });
    if(action.content.chosenMediaItems && state.view !== undefined) {
      newState = update(state, {$merge: {chosenMediaItemsInverted: getInvertedChosenItems(state.contents, state.chosenMediaItems, state.view.selectionInverted)}});
    }
    return newState;
    break;

    case actions.FETCH_DIRECTORY_CONTENTS_SUCCESS:
    //console.log('FETCH_DIRECTORY_CONTENTS_SUCCESS', state, action.contents);
    return Object.assign({},newState,{
      contents: processContentItems(action.contents.filter((file) => (
        file.filename
      )))
    });

    case actions.DELETE_MEDIA_ITEMS_SUCCESS:
    console.log(actions.DELETE_MEDIA_ITEMS_SUCCESS);
    const formData = action.formData;
    for(var pair of formData.entries()) {
      console.log(pair[0]+ ', '+ pair[1]);
    }
    const deletedFileNames = formData.getAll('delete_file[]');
    //if(!Array.isArray(action.contents)) return state; // so the backed can just return res.json([true]) if it wants?
    const newContents = processContentItems(action.contents.filter((file) => (
      file.filename
    )));
    newChosenMediaItems = newState.chosenMediaItems.filter((file) => (
      !deletedFileNames.includes(file.filename)
    ));
    let newChosenMediaItemsInverted = newState.chosenMediaItemsInverted.filter((file) => (
      !deletedFileNames.includes(file.filename)
    ));
    return Object.assign({}, newState, {
      contents: newContents,
      chosenMediaItems: newChosenMediaItems,
      chosenMediaItemsInverted: newChosenMediaItemsInverted
    });

    case actions.UPLOAD_FILES_SUCCESS:
    //if(!Array.isArray(action.contents)) return state; // so the backed can just return res.json([true]) if it wants?
    return Object.assign({},newState,{
      contents: processContentItems(action.contents.filter((file) => (
        file.filename
      )))
    });

    case actions.DELETE_MEDIA_ITEM_SUCCESS:
    //console.log(actions.DELETE_MEDIA_ITEM_SUCCESS, action.source, action.path, state);


    return Object.assign({},newState,{
      cd: (state.cd === action.path) ? path.join(state.cd, '..') : state.cd,
      contents: state.contents.filter((file) => (
        file.path !== action.path
      ))
    });
    break;
  }

  return state;

  function processContentItems(contents) {
    try {
      return contents.map((item) => {
        const editedOnDate = new Date(item.editedOn);
        return (
          Object.assign({}, item, {
            localString: editedOnDate.toLocaleString(),
            localStringVerbose: editedOnDate.toLocaleString(undefined,{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            fileSizeHumanReadable: filesize(item.fileSize, {round: 0}),
            editedOnTwoDigit: new Date(item.editedOn).toLocaleString(undefined, { year: '2-digit', month: '2-digit', day: '2-digit' }),
            editedOnLongTimeZone: new Date(item.editedOn).toLocaleString(undefined, { weekday:'long', year: 'numeric', month: 'long', day: '2-digit', timeZoneName: 'long' })
          })
        )
      });
    } catch(e) { return contents }
  }

}

var initialTreeReducer = (() => {
  try {
    const lt = JSON.parse(localStorage.getItem('eureka__tree'));
    return Array.isArray(lt) ? lt : [];
  } catch(e) {
    return (
      [/*{
        name:'assets',
        cd:'assets',
        children:[{
          name:'img',
          cd:'assets/img'
        }]
      },{
        name:'uploads',
        cd:'uploads'
      }*/]
    );
  }
})();

let cd = '';
let gotTreeDataFromServer = false;
var treeReducer = function(state, action) {
  state = state || initialTreeReducer;

  switch(action.type) {
    case actions.UPDATE_SOURCE_TREE_SUCCESS:
    //console.log('UPDATE_SOURCE_TREE_SUCCESS');
    let newState = (gotTreeDataFromServer) ? state.slice(0) : [];

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


    gotTreeDataFromServer = true;
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
        if(child.cd === action.path) {
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


var initialViewState = Object.assign({}, {
  focusedMediaItem: undefined,
  filter: undefined,
  //cd: '/',
  mode:'table',
  sourceTreeOpen: false,
  enlargeFocusedRows: false,
  locale:"en-US",
  chooseMultiple:false,
  sort:{
    by: 'filename',
    dir: utility.ASCENDING
  },
  isTableScrolling:false,
  selectionInverted: selectionInverted,
  allowFullscreen: true,
  isUploading: false,
  isTouch: false,
  fetchingContents: false,
  intervals: {
    searchBarPlaceholder: false,
    fetchDirectoryContents: false,
    updateSourceTree: false
  }
}, (() => {
  try {
    const json = JSON.parse(localStorage.getItem('eureka__view'));
    //console.log('json',json);
    return Object.assign({}, json, {
      isUploading: false,
      isTableScrolling: false
    });
    /*return (
      Object.assign({}, json, {
        sourceTreeOpen: json.treeHidden == 'false' || undefined
      })
    );*/
  } catch(e) {
    return {};
  }
  /*return {
    mode: localStorage.getItem('eureka__mode') || undefined,
    sort: localStorage.getItem('eureka__sort') || undefined,
    sourceTreeOpen: localStorage.getItem('eureka__treeHidden') == 'false' || undefined
  }*/
})());

//console.log('initialViewState', initialViewState);
let lastCD = initialContentState.cd;
var viewReducer = function(state, action) {
  state = state || initialViewState;

  switch(action.type) {
    case actions.FETCH_DIRECTORY_CONTENTS_SUCCESS:
    case actions.FETCH_DIRECTORY_CONTENTS_ERROR:
    return Object.assign({},state, {
      fetchingContents: false
    });
    break;

    case actions.UPLOAD_FILES_SUCCESS:
    case actions.UPLOAD_FILES_ERROR:
    return Object.assign({},state, {
      isUploading: false
    });
    break;

    case actions.UPDATE_VIEW:
    return Object.assign({},state,action.view);

    case actions.UPDATE_CONTENT:
    if(action.content.cd && action.content.cd !== lastCD) {
      const r = Object.assign({}, state, {
        selectionInverted: false
      });
      lastCD = action.content.cd;
      return r;
    }
    return state;

    case actions.UPDATE_CONFIG:
    let o = {};
    /*o = Object.assign({},o,{
      sourceTreeOpen:action.config.treeHidden !== undefined ? !action.config.treeHidden : o.sourceTreeOpen || undefined
    });*/
    if(action.config.intervals) o = Object.assign({},o,{intervals:action.config.intervals});
    if(action.config.mode) o = Object.assign({},o,{mode:action.config.mode});
    if(action.config.sort) o = Object.assign({},o,{sort:action.config.sort});
    if(action.config.locale) o = Object.assign({},o,{locale:action.config.locale});
    if(action.config.enlargeFocusedRows !== undefined) o = Object.assign({},o,{enlargeFocusedRows:action.config.enlargeFocusedRows});
    if(action.config.treeHidden !== undefined) o = Object.assign({},o,{sourceTreeOpen:!action.config.treeHidden});
    if(action.config.allowFullscreen !== undefined) o = Object.assign({},o,{allowFullscreen:action.config.allowFullscreen});

    return Object.assign({},state,o);


    case actions.UPDATE_SOURCE_TREE_SUCCESS:
    return Object.assign({},state,{
      cd:'/'
    });

    case actions.DELETE_MEDIA_ITEM_SUCCESS:
    try {
      if(state.focusedMediaItem.path === action.path) return Object.assign({},state,{
        focusedMediaItem:undefined
      });
    } catch (e) {

    }
  }

  return state;
}

var initialSourceState = Object.assign({}, {
  currentSource: "0",
  sources: [/*{
    name: 'Filesystem',
    id: 'fileystem'
  },{
    name: 'Amazon S3',
    id: 's3'
  }*/]
}, (() => {
  try {
    return (
      JSON.parse(localStorage.getItem('eureka__source'))
    );
  } catch(e) {
    return {};
  }
})());

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


var initialDirectoryState = (() => {
  try {
    const ld = JSON.parse('eureka__directory');
    if(!Array.isArray(ld)) throw new Error('eureka__directory is not an Array');
    return ld;
  } catch(e) {
    return [{
      name: 'Filesystem',
      id: 'fileystem',
      directories:[]
    }];
  }
})();

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

    function recursivelyCrawlChildren(file) {
      try {
        file.children.map((child) => {
          foldersToAdd.push({
            name:child.name,
            cd:child.cd,
            children:child.children || []
          });
          if(child.children.length) recursivelyCrawlChildren(child);
        })
      } catch (e) { }
    }

    action.contents.map((file) => {
      recursivelyCrawlChildren(file);
    });

    foldersToAdd = utility.removeDuplicates([...foldersToAdd], 'cd');

    return state.map((source) => (
      Object.assign({}, source, {
        directories:(source.id == cs) ? utility.removeDuplicates([...source.directories, ...foldersToAdd], 'cd') : source.directories
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

    //console.log('namesOfFoldersToAdd',namesOfFoldersToAdd);

    return Object.assign({}, state, {
      lastDirectoriesFetched: namesOfFoldersToAdd
    });

    break;

  }

  return state;
}

var initialNotifcationsState = [];

var notificationsReducer = function(state, action) {
  //console.log('notificationsReducer', action.type, actions.NOTIFICATION);
  state = state || initialNotifcationsState;

  let index = 0;
  state.map((notification, i) => {
      if(notification.id == action.id) index = i;
  });

  switch(action.type) {
    case actions.NOTIFICATION:
    let newState = state;
    //console.log('NOTIFICATION!!!!', action);

    try {
      newState = update(state, {[0]: {$apply: (notification) => {
        return update(notification,{ $merge:{ dismissAfter: undefined, archived: true } })
      }} });
    } catch (e) {

    }

    console.log('newState', newState);

    return update(newState, {$push: [Object.assign({}, action, {
      type: action.notificationType
    })]});
    break;

    case actions.NOTIFICATION_DELETED:
    //console.log('NOTIFICATION_DELETED!!!!');
    return state.filter((notification) => (
      notification.id !== action.id
    ))
    break;

    case actions.NOTIFICATION_ARCHIVED:
    return update(state, {[index]: {$apply: (notification) => {
      return update(notification,{ $merge:{ archived: true } })
    }} });
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
  fetched: fetchedReducer,
  config: configReducer,
  notifications: notificationsReducer
});

exports.EurekaReducer = EurekaReducer;
