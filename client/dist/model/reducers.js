'use strict';

var _utility = require('../utility/utility');

var _utility2 = _interopRequireDefault(_utility);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var actions = require('./actions'),
    combineReducers = require('redux').combineReducers,
    update = require('react-addons-update'),
    path = require('path');

var pkg = require("./../../package.json");

var initialConfigState = {
  basePath: '/',
  allowUploads: true,
  treeHidden: true,
  useLocalStorage: true,
  storagePrefix: "eureka__",
  allowRename: true,
  allowDelete: true,
  confirmBeforeDelete: false,
  locales: "en-US",
  mediaSource: "0",
  currentDirectory: "/",
  uid: "0",
  iconSVG: './img/icons.' + pkg.version + '.min.svg',
  assetsBasePath: './assets/',
  emphasisFocusedMediaItem: true,
  headers: { 'Powered-By': 'Eureka by Markup.tips' },
  intervals: { searchBarPlaceholder: 60000, fetchDirectoryContents: 18000, updateSourceTree: false },
  callbacks: {
    close: undefined,
    choose: undefined
  }
};

var configReducer = function configReducer(state, action) {
  state = state || initialConfigState;

  switch (action.type) {
    case actions.UPDATE_CONFIG:
      //console.log('UPDATE_CONFIG!!', action.config);
      return Object.assign({}, state, action.config);
      break;
  }

  return state;
};

var initialContentState = Object.assign({}, {
  cd: '/',
  contents: [
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
}, function () {
  try {
    return JSON.parse(localStorage.getItem('eureka__content'));
  } catch (e) {
    return {};
  }
}());

var contentReducer = function contentReducer(state, action) {
  state = state || initialContentState;

  switch (action.type) {
    case actions.UPDATE_CONFIG:
      //console.log('UPDATE_CONFIG!!!', state, action.config);
      if (action.config.currentDirectory) return Object.assign({}, state, {
        cd: action.config.currentDirectory
      });

      break;

    case actions.UPDATE_CONTENT:
      //console.log('UPDATE_CONTENT', state, action.content);
      return Object.assign({}, state, action.content);
      break;

    case actions.FETCH_DIRECTORY_CONTENTS_SUCCESS:
      return Object.assign({}, state, {
        contents: action.contents.filter(function (file) {
          return file.filename;
        })
      });

    case actions.UPLOAD_FILES_SUCCESS:
      //if(!Array.isArray(action.contents)) return state; // so the backed can just return res.json([true]) if it wants?
      return Object.assign({}, state, {
        contents: action.contents.filter(function (file) {
          return file.filename;
        })
      });

    case actions.DELETE_MEDIA_ITEM_SUCCESS:
      //console.log(actions.DELETE_MEDIA_ITEM_SUCCESS, action.source, action.path, state);


      return Object.assign({}, state, {
        cd: state.cd === action.path ? path.join(state.cd, '..') : state.cd,
        contents: state.contents.filter(function (file) {
          return file.path !== action.path;
        })
      });
      break;
  }

  return state;
};

var initialTreeReducer = function () {
  try {
    var lt = JSON.parse(localStorage.getItem('eureka__tree'));
    return Array.isArray(lt) ? lt : [];
  } catch (e) {
    return [/*{
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
  }
}();

var cd = '';
var treeReducer = function treeReducer(state, action) {
  state = state || initialTreeReducer;

  switch (action.type) {
    case actions.UPDATE_SOURCE_TREE_SUCCESS:

      var newState = state.slice(0);

      var directoryInState = function directoryInState(directory) {
        for (var i = 0; i < newState.length; i++) {
          if (newState[i].cd === directory.cd) return true;
        }

        return false;
      };

      var directoryOnServer = function directoryOnServer(directory) {
        for (var i = 0; i < contents.length; i++) {
          if (contents[i].cd === directory.cd) return true;
        }
        return false;
      };

      var contents = action.contents.map(function (file) {
        return Object.assign({}, file, {
          children: file.children ? file.children : []
        });
      });

      // loop through top level directories returned from server add any we don't already have
      contents.map(function (directory) {
        if (!directoryInState(directory)) {
          newState.push(directory);
        }
      });

      // if any of the top-level directories in our local state are no longer on the store remove them
      return newState.filter(function (directory) {
        return directoryOnServer(directory);
      });

      break;

    case actions.UPDATE_CONTENT:
      if (action.content.cd) cd = action.content.cd;
      break;

    case actions.FETCH_DIRECTORY_CONTENTS_SUCCESS:
      // loop over just the folders and create data objects for them
      var foldersToAdd = action.contents.filter(function (file) {
        return file.foldername;
      }).map(function (file) {
        return {
          name: file.foldername,
          cd: file.directory,
          children: []
        };
      });

      var addChildrenToCurrentFolder = function addChildrenToCurrentFolder(children) {
        return children.map(function (child) {
          return Object.assign({}, child, {
            children: child.cd === cd ? _utility2.default.removeDuplicates([].concat(_toConsumableArray(child.children), _toConsumableArray(foldersToAdd)), 'name') : addChildrenToCurrentFolder(child.children)
          });
        });
      };

      return addChildrenToCurrentFolder(state);

      /*return state.map((file) => (
        Object.assign({}, file, {
          children:(file.children && file.cd !== cd) ? addChildrenToCurrentFolder(file.children) : foldersToAdd
        })
      ));*/

      break;

    case actions.DELETE_MEDIA_ITEM_SUCCESS:
      var stillSearching = true;

      var recursivelyRemoveDirectory = function recursivelyRemoveDirectory(children) {
        return children.map(function (child) {
          if (child.cd === action.path) {
            stillSearching = false;
            return undefined;
          }
          return Object.assign({}, child, {
            children: child.children && stillSearching ? recursivelyRemoveDirectory(child.children) : child.children
          });
        }).filter(Boolean);
      };

      return recursivelyRemoveDirectory(state);

      break;

  }

  return state;
};

var initialViewState = Object.assign({}, {
  focusedMediaItem: undefined,
  filter: undefined,
  //cd: '/',
  mode: 'table',
  sourceTreeOpen: false,
  enlargeFocusedRows: false,
  locale: "en-US",
  sort: 'name',
  isTableScrolling: false,
  intervals: {
    searchBarPlaceholder: false,
    fetchDirectoryContents: false,
    updateSourceTree: false
  }
}, function () {
  try {
    var json = JSON.parse(localStorage.getItem('eureka__view'));
    console.log('json', json);
    return json;
    /*return (
      Object.assign({}, json, {
        sourceTreeOpen: json.treeHidden == 'false' || undefined
      })
    );*/
  } catch (e) {
    return {};
  }
  /*return {
    mode: localStorage.getItem('eureka__mode') || undefined,
    sort: localStorage.getItem('eureka__sort') || undefined,
    sourceTreeOpen: localStorage.getItem('eureka__treeHidden') == 'false' || undefined
  }*/
}());

console.log('initialViewState', initialViewState);

var viewReducer = function viewReducer(state, action) {
  state = state || initialViewState;

  switch (action.type) {

    case actions.UPDATE_VIEW:
      return Object.assign({}, state, action.view);

    case actions.UPDATE_CONFIG:
      var o = {};
      /*o = Object.assign({},o,{
        sourceTreeOpen:action.config.treeHidden !== undefined ? !action.config.treeHidden : o.sourceTreeOpen || undefined
      });*/
      if (action.config.intervals) o = Object.assign({}, o, { intervals: action.config.intervals });
      if (action.config.mode) o = Object.assign({}, o, { mode: action.config.mode });
      if (action.config.sort) o = Object.assign({}, o, { sort: action.config.sort });
      if (action.config.locale) o = Object.assign({}, o, { locale: action.config.locale });
      if (action.config.enlargeFocusedRows !== undefined) o = Object.assign({}, o, { enlargeFocusedRows: action.config.enlargeFocusedRows });
      if (action.config.treeHidden !== undefined) o = Object.assign({}, o, { sourceTreeOpen: !action.config.treeHidden });

      return Object.assign({}, state, o);

    case actions.UPDATE_SOURCE_TREE_SUCCESS:
      return Object.assign({}, state, {
        cd: '/'
      });

    case actions.DELETE_MEDIA_ITEM_SUCCESS:
      try {
        if (state.focusedMediaItem.path === action.path) return Object.assign({}, state, {
          focusedMediaItem: undefined
        });
      } catch (e) {}
  }

  return state;
};

var initialSourceState = Object.assign({}, {
  currentSource: "0",
  sources: [/*{
            name: 'Filesystem',
            id: 'fileystem'
            },{
            name: 'Amazon S3',
            id: 's3'
            }*/]
}, function () {
  try {
    return JSON.parse(localStorage.getItem('eureka__source'));
  } catch (e) {
    return {};
  }
}());

var sourceReducer = function sourceReducer(state, action) {
  state = state || initialSourceState;
  switch (action.type) {
    case actions.FETCH_MEDIA_SOURCES_SUCCESS:
      return Object.assign({}, state, {
        sources: action.sources
      });
      break;

    case actions.UPDATE_SOURCE:
      return Object.assign({}, state, {
        currentSource: action.source
      });
      break;
  }

  return state;
};

var initialDirectoryState = function () {
  try {
    var ld = JSON.parse('eureka__directory');
    if (!Array.isArray(ld)) throw new Error('eureka__directory is not an Array');
    return ld;
  } catch (e) {
    return [{
      name: 'Filesystem',
      id: 'fileystem',
      directories: []
    }];
  }
}();

var cs = void 0;
var directoryReducer = function directoryReducer(state, action) {
  state = state || initialDirectoryState;

  var foldersToAdd = [];

  switch (action.type) {
    case actions.UPDATE_SOURCE:
      cs = action.source;
      break;

    case actions.FETCH_MEDIA_SOURCES_SUCCESS:
      if (cs === undefined) cs = action.sources[0].id;
      return action.sources.map(function (source) {
        return Object.assign({}, source, {
          directories: []
        });
      });
      break;

    case actions.UPDATE_SOURCE_TREE_SUCCESS:
      foldersToAdd = action.contents.map(function (file) {
        return Object.assign({}, file, {
          children: file.children ? file.children : []
        });
      });

      var recursivelyCrawlChildren = function recursivelyCrawlChildren(file) {
        try {
          file.children.map(function (child) {
            foldersToAdd.push({
              name: child.name,
              cd: child.cd,
              children: child.children || []
            });
            if (child.children.length) recursivelyCrawlChildren(child);
          });
        } catch (e) {}
      };

      action.contents.map(function (file) {
        recursivelyCrawlChildren(file);
      });

      foldersToAdd = _utility2.default.removeDuplicates([].concat(_toConsumableArray(foldersToAdd)), 'cd');

      return state.map(function (source) {
        return Object.assign({}, source, {
          directories: source.id == cs ? _utility2.default.removeDuplicates([].concat(_toConsumableArray(source.directories), _toConsumableArray(foldersToAdd)), 'cd') : source.directories
        });
      });

      break;

    case actions.FETCH_DIRECTORY_CONTENTS_SUCCESS:
      // loop over just the folders and create data objects for them
      foldersToAdd = action.contents.filter(function (file) {
        return file.foldername;
      }).map(function (file) {
        return {
          name: file.foldername,
          cd: file.directory
        };
      });

      return state.map(function (source) {
        return Object.assign({}, source, {
          directories: source.id == cs ? _utility2.default.removeDuplicates([].concat(_toConsumableArray(source.directories), _toConsumableArray(foldersToAdd)), 'name') : source.directories
        });
      });

      break;

    case actions.UPDATE_SOURCE:

      break;

  }

  return state;
};

var initialFetchedState = {
  lastDirectoriesFetched: []
};

var fetchedReducer = function fetchedReducer(state, action) {
  state = state || initialFetchedState;

  switch (action.type) {
    case actions.FETCH_DIRECTORY_CONTENTS_SUCCESS:
      // loop over just the folders and create data objects for them
      var namesOfFoldersToAdd = action.contents.filter(function (file) {
        return file.foldername;
      }).map(function (file) {
        return file.foldername;
      });

      //console.log('namesOfFoldersToAdd',namesOfFoldersToAdd);

      return Object.assign({}, state, {
        lastDirectoriesFetched: namesOfFoldersToAdd
      });

      break;

  }

  return state;
};

var EurekaReducer = combineReducers({
  content: contentReducer,
  view: viewReducer,
  tree: treeReducer,
  source: sourceReducer,
  directory: directoryReducer,
  fetched: fetchedReducer,
  config: configReducer
});

exports.EurekaReducer = EurekaReducer;