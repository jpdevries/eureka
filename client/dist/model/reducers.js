'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _reactAddonsUpdate = require('react-addons-update');

var _reactAddonsUpdate2 = _interopRequireDefault(_reactAddonsUpdate);

var _utility = require('../utility/utility');

var _utility2 = _interopRequireDefault(_utility);

var _filesize = require('filesize');

var _filesize2 = _interopRequireDefault(_filesize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// ES6

var actions = require('./actions'),
    combineReducers = require('redux').combineReducers,
    path = require('path');

var pkg = require("./../../package.json");

var initialConfigState = {
  basePath: '/',
  allowChoose: true,
  allowUploads: true,
  allowDownload: true,
  treeHidden: true,
  useLocalStorage: true,
  storagePrefix: "eureka__",
  allowRename: true,
  allowDelete: true,
  confirmBeforeDelete: false,
  allowDownloadMultiple: true,
  locales: "en-US",
  allowChooseMultiple: true,
  allowInvertSelection: true,
  mediaSource: undefined,
  currentDirectory: "/",
  allowMasonry: true,
  welcome: true,
  alwaysWelcome: false,
  autoSubmitForms: true,
  allowCrop: !_utility2.default.serverSideRendering,
  zoomOnWheel: false,
  learnMore: 'https://github.com/jpdevries/eureka',
  uid: "0",
  iconSVG: './img/icons.' + pkg.version + '.min.svg',
  assetsBasePath: './assets/',
  doDragNDrop: true,
  emphasisFocusedMediaItem: true,
  headers: { 'Powered-By': 'Eureka by Markup.tips' },
  intervals: { searchBarPlaceholder: 60000, fetchDirectoryContents: 18000, updateSourceTree: false },
  callbacks: {
    close: undefined,
    choose: undefined
  },
  handlers: {
    createFile: undefined
  }
};

var cs = void 0;
var configReducer = function configReducer(state, action) {
  state = state || initialConfigState;

  switch (action.type) {
    case actions.UPDATE_CONFIG:
      //console.log('UPDATE_CONFIG!!', action.config);
      return Object.assign({}, state, action.config);
      break;

    case actions.FETCH_MEDIA_SOURCES_SUCCESS:
      if (state.mediaSource === undefined) {
        return Object.assign({}, state, {
          mediaSource: action.sources[0].id
        });
      }
      return;
  }

  return state;
};

var selectionInverted = false;

var initialContentState = Object.assign({}, {
  cd: '/',
  chosenMediaItems: [],
  chosenMediaItemsInverted: [],
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
    return Object.assign({}, JSON.parse(localStorage.getItem('eureka__content')), {
      chosenMediaItems: []
    });
  } catch (e) {
    return {};
  }
}());

function getInvertedChosenItems() {
  var contents = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var chosenMediaItems = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var selectionInverted = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  if (!selectionInverted) return chosenMediaItems;
  return contents.filter(function (item) {
    return !chosenMediaItems.includes(item);
  });
}

var contentReducer = function contentReducer(state, action) {
  state = state || initialContentState;
  var newState = state;
  //console.log('contentReducer', action.type);

  var newChosenMediaItems = void 0;

  var _ret = function () {
    switch (action.type) {
      case actions.UPDATE_CONFIG:
        //console.log('UPDATE_CONFIG!!!', state, action.config);
        if (action.config.currentDirectory) return {
            v: Object.assign({}, state, {
              cd: action.config.currentDirectory
            })
          };

        break;

      case actions.UPDATE_VIEW:
        //console.log('UPDATE_CONFIG!!!', state, action.config);
        //console.log(' update view mo fo', selectionInverted, action.view.selectionInverted);
        try {
          if (selectionInverted !== action.view.selectionInverted || state.contents.chosenMediaItems.length !== state.contents.chosenMediaItemsInverted.length) {
            newState = (0, _reactAddonsUpdate2.default)(state, { $merge: { chosenMediaItemsInverted: getInvertedChosenItems(state.contents, state.chosenMediaItems, action.view.selectionInverted) } });
          }
        } catch (e) {
          console.log(e);
        }

        selectionInverted = action.view.selectionInverted;
        return {
          v: newState
        };
        break;

      case actions.INVERT_SELECTION:
        return {
          v: newState
        };
        break;

      case actions.ADD_MEDIA_ITEM_TO_CHOSEN_ITEMS:
        if (state.chosenMediaItems.includes(action.item)) return {
            v: newState
          };
        newChosenMediaItems = (0, _reactAddonsUpdate2.default)(newState.chosenMediaItems, { $push: [action.item] });
        return {
          v: (0, _reactAddonsUpdate2.default)(newState, { $merge: {
              chosenMediaItems: newChosenMediaItems,
              chosenMediaItemsInverted: getInvertedChosenItems(newState.contents, (0, _reactAddonsUpdate2.default)(newState.chosenMediaItems, { $push: [action.item] }), action.inverted)
            } })
        };
        break;

      case actions.REMOVE_MEDIA_ITEM_FROM_CHOSEN_ITEMS:
        if (!state.chosenMediaItems.includes(action.item)) return {
            v: newState
          };

        newChosenMediaItems = newState.chosenMediaItems.filter(function (item) {
          return item !== action.item;
        });

        return {
          v: (0, _reactAddonsUpdate2.default)(newState, { $merge: {
              chosenMediaItems: newChosenMediaItems,
              chosenMediaItemsInverted: getInvertedChosenItems(newState.contents, newChosenMediaItems, action.inverted)
            } })
        };
        break;

      case actions.DESELECT_ALL:
        return {
          v: (0, _reactAddonsUpdate2.default)(newState, { $merge: {
              chosenMediaItems: [],
              chosenMediaItemsInverted: []
            } })
        };
        break;

      case actions.UPDATE_CONTENT:
        var content = processContentItems(action.content);
        newState = Object.assign({}, state, content);
        if (action.content.cd && action.content.cd !== state.cd) newState = Object.assign({}, newState, { // if updating the current directory clear the chosen media items
          chosenMediaItems: [],
          chosenMediaItemsInverted: []
        });
        if (action.content.chosenMediaItems && state.view !== undefined) {
          newState = (0, _reactAddonsUpdate2.default)(state, { $merge: { chosenMediaItemsInverted: getInvertedChosenItems(state.contents, state.chosenMediaItems, state.view.selectionInverted) } });
        }
        return {
          v: newState
        };
        break;

      case actions.FETCH_DIRECTORY_CONTENTS_SUCCESS:
        //console.log('FETCH_DIRECTORY_CONTENTS_SUCCESS', state, action.contents);
        return {
          v: Object.assign({}, newState, {
            contents: processContentItems(action.contents.filter(function (file) {
              return file.filename;
            }))
          })
        };

      case actions.DELETE_MEDIA_ITEMS_SUCCESS:
        console.log(actions.DELETE_MEDIA_ITEMS_SUCCESS);
        var formData = action.formData;
        /*for(var pair of formData.entries()) {
          console.log(pair[0]+ ', '+ pair[1]);
        }*/

        var deletedFileNames = function () {
          try {
            return formData.getAll('delete_file[]');
          } catch (e) {
            return action.chosenMediaItems.map(function (file) {
              return file.filename;
            });
          }
        }();
        newChosenMediaItems = newState.chosenMediaItems.filter(function (file) {
          return !deletedFileNames.includes(file.filename);
        });
        //if(!Array.isArray(action.contents)) return state; // so the backed can just return res.json([true]) if it wants?
        var newContents = processContentItems(action.contents.filter(function (file) {
          return file.filename;
        }));

        var newChosenMediaItemsInverted = newState.chosenMediaItemsInverted.filter(function (file) {
          return !deletedFileNames.includes(file.filename);
        });
        return {
          v: Object.assign({}, newState, {
            contents: newContents,
            chosenMediaItems: newChosenMediaItems,
            chosenMediaItemsInverted: newChosenMediaItemsInverted
          })
        };

      case actions.UPLOAD_FILES_SUCCESS:
        //if(!Array.isArray(action.contents)) return state; // so the backed can just return res.json([true]) if it wants?
        return {
          v: Object.assign({}, newState, {
            contents: processContentItems(action.contents.filter(function (file) {
              return file.filename;
            }))
          })
        };

      case actions.DELETE_MEDIA_ITEM_SUCCESS:
        //console.log(actions.DELETE_MEDIA_ITEM_SUCCESS, action.source, action.path, state);


        return {
          v: Object.assign({}, newState, {
            cd: state.cd === action.path ? path.join(state.cd, '..') : state.cd,
            contents: state.contents.filter(function (file) {
              return file.path !== action.path;
            })
          })
        };
        break;
    }
  }();

  if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
  return state;

  function processContentItems(contents) {
    try {
      return contents.map(function (item) {
        var editedOnDate = new Date(item.editedOn);
        return Object.assign({}, item, {
          localString: editedOnDate.toLocaleString(),
          localStringVerbose: editedOnDate.toLocaleString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          fileSizeHumanReadable: (0, _filesize2.default)(item.fileSize, { round: 0 }),
          editedOnTwoDigit: new Date(item.editedOn).toLocaleString(undefined, { year: '2-digit', month: '2-digit', day: '2-digit' }),
          editedOnLongTimeZone: new Date(item.editedOn).toLocaleString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: '2-digit', timeZoneName: 'long' })
        });
      });
    } catch (e) {
      return contents;
    }
  }
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
var gotTreeDataFromServer = false;
var treeReducer = function treeReducer(state, action) {
  state = state || initialTreeReducer;

  console.log('treeReducer', action);

  var _ret2 = function () {
    switch (action.type) {
      case actions.UPDATE_SOURCE_TREE_SUCCESS:
        console.log('UPDATE_SOURCE_TREE_SUCCESS!!!');
        var newState = gotTreeDataFromServer ? state.slice(0) : [];

        var directoryInState = function directoryInState(directory) {
          for (var i = 0; i < newState.length; i++) {
            if (newState[i].cd === directory.cd) return true;
          }

          return false;
        };

        console.log('.');

        var directoryOnServer = function directoryOnServer(directory) {
          for (var i = 0; i < contents.length; i++) {
            if (contents[i].cd === directory.cd) return true;
          }
          return false;
        };

        console.log('..');

        var contents = action.contents.map(function (file) {
          return Object.assign({}, file, {
            children: file.children ? file.children : []
          });
        });

        console.log('...');

        // loop through top level directories returned from server add any we don't already have
        contents.map(function (directory) {
          if (!directoryInState(directory)) {
            newState.push(directory);
          }
        });

        console.log('....');

        var actionContents = action.contents;

        console.log('actionContents', actionContents);

        /*function recursivelyGetDirectoryChildren(cd, contents) {
          console.log('recursivelyGetDirectoryChildren',cd,contents);
          for(let i = 0; i < contents.length; i++) {
            const directory = contents[i];
            console.log(i);
            if(directory) {
              console.log('directory',directory,cd);
              if(directory.cd == cd) return (() => {
                console.log('found some shit');
                try {
                  return directory.children || []
                } catch (e) {
                  //console.log(e);
                  return []
                }
              })();
              if(directory.children) return recursivelyGetDirectoryChildren(cd, directory.children);
            }
          }
          return [];
        }*/

        var recursivelyGetDirectoryChildren = function recursivelyGetDirectoryChildren(cd, contents) {
          console.log('recursivelyGetDirectoryChildren', cd, contents);
          for (var i = 0; i < contents.length; i++) {
            var directory = contents[i];
            console.log(directory);
          }
          return [];
        };

        var loopIt = function loopIt(contents) {
          //console.log('loopIt', contents);
          return contents.filter(function (directory) {
            return directory !== undefined;
          }).map(function (directory) {
            console.log(directory, directory.children);
            if (!directory.children) {
              console.log('the server didn\'t tell us if ' + directory.cd + ' has children');
              if (directory && directory.cd) {
                //console.log('here we fuckin go',directory.cd, newState);
                var children = recursivelyGetDirectoryChildren(directory.cd, newState);
                if (children && children.length) {
                  console.log('gonna return some shit!', children);
                  return Object.assign({}, directory, {
                    children: children
                  });
                } else {
                  return directory;
                }
              }
            } else {
              if (directory) {
                if (directory.children) loopIt(directory.children);
                return directory;
              }
            }
          });
        };

        console.log('---------');

        console.log('loop it::::');
        var r = loopIt(actionContents);

        console.log('---------');

        console.log('actionContents', actionContents);

        gotTreeDataFromServer = true;

        return {
          v: r
        };

        // if any of the top-level directories in our local state are no longer on the store remove them
        return {
          v: newState.filter(function (directory) {
            return directoryOnServer(directory);
          })
        };

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

        console.log('foldersToAdd', foldersToAdd);

        var addChildrenToCurrentFolder = function addChildrenToCurrentFolder(children) {
          console.log(children);
          return Array.isArray(children) ? children.map(function (child) {
            return Object.assign({}, child, {
              children: child.children || []
            });
          }).map(function (child) {
            return Object.assign({}, child, {
              children: child.cd === cd ? _utility2.default.removeDuplicates([].concat(_toConsumableArray(child.children), _toConsumableArray(foldersToAdd)), 'name') : addChildrenToCurrentFolder(child.children)
            });
          }) : [];
        };

        return {
          v: addChildrenToCurrentFolder(state)
        };

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

        return {
          v: recursivelyRemoveDirectory(state)
        };

        break;

    }
  }();

  if ((typeof _ret2 === 'undefined' ? 'undefined' : _typeof(_ret2)) === "object") return _ret2.v;
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
  chooseMultiple: false,
  showAdvControls: false,
  sort: {
    by: 'filename',
    dir: _utility2.default.ASCENDING
  },
  cropAspectRatio: NaN,
  rememberAspectRatio: true,
  isTableScrolling: false,
  selectionInverted: selectionInverted,
  allowFullscreen: true,
  isUploading: false,
  isCropping: false,
  isTouch: false,
  fetchingContents: false,
  intervals: {
    searchBarPlaceholder: false,
    fetchDirectoryContents: false,
    updateSourceTree: false
  }
}, function () {
  try {
    var json = JSON.parse(localStorage.getItem('eureka__view'));
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
  } catch (e) {
    return {};
  }
  /*return {
    mode: localStorage.getItem('eureka__mode') || undefined,
    sort: localStorage.getItem('eureka__sort') || undefined,
    sourceTreeOpen: localStorage.getItem('eureka__treeHidden') == 'false' || undefined
  }*/
}());

//console.log('initialViewState', initialViewState);
var lastCD = initialContentState.cd;
var viewReducer = function viewReducer(state, action) {
  state = state || initialViewState;

  switch (action.type) {
    case actions.FETCH_DIRECTORY_CONTENTS_SUCCESS:
    case actions.FETCH_DIRECTORY_CONTENTS_ERROR:
      return Object.assign({}, state, {
        fetchingContents: false
      });
      break;

    case actions.UPLOAD_FILES_SUCCESS:
    case actions.UPLOAD_FILES_ERROR:
      return Object.assign({}, state, {
        isUploading: false
      });
      break;

    case actions.UPDATE_VIEW:
      return Object.assign({}, state, action.view);

    case actions.UPDATE_CONTENT:
      if (action.content.cd && action.content.cd !== lastCD) {
        var r = Object.assign({}, state, {
          selectionInverted: false
        });
        lastCD = action.content.cd;
        return r;
      }
      return state;

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
      if (action.config.allowFullscreen !== undefined) o = Object.assign({}, o, { allowFullscreen: action.config.allowFullscreen });

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

var directoryReducer = function directoryReducer(state, action) {
  state = state || initialDirectoryState;

  var foldersToAdd = [];

  var _ret3 = function () {
    switch (action.type) {
      case actions.UPDATE_SOURCE:
        cs = action.source;
        break;

      case actions.FETCH_MEDIA_SOURCES_SUCCESS:
        if (cs === undefined) cs = action.sources[0].id;
        return {
          v: action.sources.map(function (source) {
            return Object.assign({}, source, {
              directories: []
            });
          })
        };
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

        return {
          v: state.map(function (source) {
            return Object.assign({}, source, {
              directories: source.id == cs ? _utility2.default.removeDuplicates([].concat(_toConsumableArray(source.directories), _toConsumableArray(foldersToAdd)), 'cd') : source.directories
            });
          })
        };

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

        return {
          v: state.map(function (source) {
            return Object.assign({}, source, {
              directories: source.id == cs ? _utility2.default.removeDuplicates([].concat(_toConsumableArray(source.directories), _toConsumableArray(foldersToAdd)), 'name') : source.directories
            });
          })
        };

        break;

      case actions.UPDATE_SOURCE:

        break;

    }
  }();

  if ((typeof _ret3 === 'undefined' ? 'undefined' : _typeof(_ret3)) === "object") return _ret3.v;
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

var initialNotifcationsState = [];

var notificationsReducer = function notificationsReducer(state, action) {
  //console.log('notificationsReducer', action.type, actions.NOTIFICATION);
  state = state || initialNotifcationsState;

  var index = 0;
  state.map(function (notification, i) {
    if (notification.id == action.id) index = i;
  });

  switch (action.type) {
    case actions.NOTIFICATION:
      var newState = state;
      //console.log('NOTIFICATION!!!!', action);

      try {
        newState = (0, _reactAddonsUpdate2.default)(state, _defineProperty({}, 0, { $apply: function $apply(notification) {
            return (0, _reactAddonsUpdate2.default)(notification, { $merge: { dismissAfter: undefined, archived: true } });
          } }));
      } catch (e) {}

      console.log('newState', newState);

      return (0, _reactAddonsUpdate2.default)(newState, { $push: [Object.assign({}, action, {
          type: action.notificationType
        })] });
      break;

    case actions.NOTIFICATION_DELETED:
      //console.log('NOTIFICATION_DELETED!!!!');
      return state.filter(function (notification) {
        return notification.id !== action.id;
      });
      break;

    case actions.NOTIFICATION_ARCHIVED:
      return (0, _reactAddonsUpdate2.default)(state, _defineProperty({}, index, { $apply: function $apply(notification) {
          return (0, _reactAddonsUpdate2.default)(notification, { $merge: { archived: true } });
        } }));
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
  config: configReducer,
  notifications: notificationsReducer
});

exports.EurekaReducer = EurekaReducer;