'use strict';

var _utility = require('./../utility/utility');

var _utility2 = _interopRequireDefault(_utility);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('isomorphic-fetch');

var ADD_ITEM_SUCCESS = 'add_item_success';
var ADD_ITEM_ERROR = 'add_item_error';
var addItemSuccess = function addItemSuccess(item) {
  return {
    type: ADD_ITEM_SUCCESS,
    item: item
  };
};

var addItemError = function addItemError(task) {
  return {
    type: ADD_ITEM_ERROR,
    task: task
  };
};

var UPDATE_VIEW = 'update_view';
var updateView = function updateView(view) {
  return {
    type: UPDATE_VIEW,
    view: view
  };
};

var DESELECT_ALL = 'deselect_all';
var deselectAll = function deselectAll() {
  return {
    type: DESELECT_ALL
  };
};

var INVERT_SELECTION = 'invert_selection';
var invertSelection = function invertSelection() {
  return {
    type: INVERT_SELECTION
  };
};

var UPDATE_SOURCE = 'update_source';
var updateSource = function updateSource(source) {
  return {
    type: UPDATE_SOURCE,
    source: source
  };
};

var ADD_MEDIA_ITEM_TO_CHOSEN_ITEMS = 'add_media_item_to_chosen_items';
var addMediaItemToChosenItems = function addMediaItemToChosenItems(item) {
  var inverted = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  return {
    type: ADD_MEDIA_ITEM_TO_CHOSEN_ITEMS,
    item: item,
    inverted: inverted
  };
};

var REMOVE_MEDIA_ITEM_FROM_CHOSEN_ITEMS = 'remove_media_item_from_chosen_items';
var removeMediaItemFromChosenItems = function removeMediaItemFromChosenItems(item) {
  var inverted = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  return {
    type: REMOVE_MEDIA_ITEM_FROM_CHOSEN_ITEMS,
    item: item,
    inverted: inverted
  };
};

var UPDATE_CONTENT = 'update_content';
var updateContent = function updateContent(content) {
  return {
    type: UPDATE_CONTENT,
    content: content
  };
};

var UPDATE_CONFIG = 'update_config';
var updateConfig = function updateConfig(config) {
  //console.log('updateConfig', config);
  return {
    type: UPDATE_CONFIG,
    config: config
  };
};

var UPDATE_TREE_NODE_STATUS = 'update_tree_node_status';
var updateTreeNodeStatus = function updateTreeNodeStatus(cd, open) {
  //console.log('updateConfig', config);
  return {
    type: UPDATE_TREE_NODE_STATUS,
    cd: cd,
    open: open
  };
};

exports.UPDATE_TREE_NODE_STATUS = UPDATE_TREE_NODE_STATUS;
exports.updateTreeNodeStatus = updateTreeNodeStatus;

/*const downloadMediaItems = (source, customHeaders = {}) => (
  (dispatch) => (
    fetch(`/assets/components/eureka/media/attachments/${source}`, {
      method: 'GET',
      body: formData,
      headers: Object.assign({}, {
        'Accept': 'application/json',
        //'Content-Type': 'application/json'
      }, customHeaders)
    }).then((response) => {
      if(response.state < 200 || response.state >= 300) {
        var error = new Error(response.statusText)
        error.response = response
        throw error;
      }
      return response;
    }).then((response) => (
      response.json()
    )).then((contents) => (
      dispatch(
        downloadMediaItemsSuccess(formData)
      )
    )).catch((error) => (
      dispatch(
        downloadMediaItemsError(error)
      )
    ))
  )
);

const DOWNLOAD_MEDIA_ITEM_SUCCESS = 'download_media_item_success';
const DOWNLOAD_MEDIA_ITEM_ERROR = 'download_media_item_error';
const downloadMediaItemsSuccess = function(formData) {
  return {
    type: DOWNLOAD_MEDIA_ITEM_SUCCESS,
    formData: formData,
  }
}

const downloadMediaItemsError = function(error) {
  //console.log('updateSourceTreeError',error);
  return {
    type: DOWNLOAD_MEDIA_ITEM_ERROR,
    error: error
  }
}


exports.downloadMediaItems = downloadMediaItems;
exports.DOWNLOAD_MEDIA_ITEM_SUCCESS = DOWNLOAD_MEDIA_ITEM_SUCCESS;
exports.DOWNLOAD_MEDIA_ITEM_ERROR = DOWNLOAD_MEDIA_ITEM_ERROR;
*/

var updateSourceTree = function updateSourceTree(source) {
  var customHeaders = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return function (dispatch) {
    return fetch('/assets/components/eureka/media/sources/' + source, {
      method: 'GET',
      headers: Object.assign({}, {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }, customHeaders)
    }).then(function (response) {
      if (response.state < 200 || response.state >= 300) {
        var error = new Error(response.statusText);
        error.response = response;
        throw error;
      }
      return response;
    }).then(function (response) {
      return response.json();
    }).then(function (contents) {
      return dispatch(updateSourceTreeSuccess(contents));
    }).catch(function (error) {
      return dispatch(updateSourceTreeError(error));
    });
  };
};

var UPDATE_SOURCE_TREE_SUCCESS = 'update_source_tree_success';
var UPDATE_SOURCE_TREE_ERROR = 'update_source_tree_error';
var updateSourceTreeSuccess = function updateSourceTreeSuccess(contents) {
  return {
    type: UPDATE_SOURCE_TREE_SUCCESS,
    contents: contents
  };
};

var updateSourceTreeError = function updateSourceTreeError(error) {
  //console.log('updateSourceTreeError',error);
  return {
    type: UPDATE_SOURCE_TREE_ERROR,
    error: error
  };
};

var fetchDirectoryContents = function fetchDirectoryContents(source, params) {
  var customHeaders = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return function (dispatch) {
    return fetch(_utility2.default.makeURL('/assets/components/eureka/media/sources/' + source, params), {
      method: 'GET',
      headers: Object.assign({}, {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }, customHeaders)
    }).then(function (response) {
      if (response.state < 200 || response.state >= 300) {
        var error = new Error(response.statusText);
        console.log(error);
        error.response = response;
        throw error;
      }
      return response;
    }).then(function (response) {
      return response.json();
    }).then(function (contents) {
      return dispatch(fetchDirectoryContentsSuccess(contents, source, params));
    }).catch(function (error) {
      return dispatch(fetchDirectoryContentsError(error));
    });
  };
};

var FETCH_DIRECTORY_CONTENTS_SUCCESS = 'fetch_directory_contents_success';
var FETCH_DIRECTORY_CONTENTS_ERROR = 'fetch_directory_contents_error';

var fetchDirectoryContentsSuccess = function fetchDirectoryContentsSuccess(contents, source, params) {
  //console.log('fetchDirectoryContentsSuccess', contents, source, params);
  return {
    type: FETCH_DIRECTORY_CONTENTS_SUCCESS,
    contents: contents,
    source: source,
    params: params
  };
};

exports.fetchDirectoryContentsSuccess = fetchDirectoryContentsSuccess;

var fetchDirectoryContentsError = function fetchDirectoryContentsError(error) {
  //console.log('fetchDirectoryContentsError', error);
  return {
    type: FETCH_DIRECTORY_CONTENTS_ERROR,
    error: error
  };
};

exports.fetchDirectoryContentsError = fetchDirectoryContentsError;

var fetchMediaSources = function fetchMediaSources() {
  var customHeaders = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return function (dispatch) {
    return fetch('/assets/components/eureka/media/sources', {
      method: 'GET',
      headers: Object.assign({}, {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }, customHeaders)
    }).then(function (response) {
      if (response.state < 200 || response.state >= 300) {
        var error = new Error(response.statusText);
        error.response = response;
        throw error;
      }
      return response;
    }).then(function (sources) {
      return sources.json();
    }).then(function (sources) {
      return dispatch(fetchMediaSourcesSuccess(sources));
    }).catch(function (error) {
      return dispatch(fetchMediaSourcesError(error));
    });
  };
};

var FETCH_MEDIA_SOURCES_SUCCESS = 'fetch_media_sources_success';
var FETCH_MEDIA_SOURCES_ERROR = 'fetch_media_sources_error';

var fetchMediaSourcesSuccess = function fetchMediaSourcesSuccess(sources) {
  //console.log('fetchMediaSourcesSuccess', sources);
  return {
    type: FETCH_MEDIA_SOURCES_SUCCESS,
    sources: sources
  };
};

var fetchMediaSourcesError = function fetchMediaSourcesError(error) {
  return {
    type: FETCH_MEDIA_SOURCES_ERROR,
    error: error
  };
};

var DELETE_MEDIA_ITEM_SUCCESS = 'delete_media_item_success';
var deleteMediaItemSuccess = function deleteMediaItemSuccess(source, path) {
  //console.log('DELETE_MEDIA_ITEM_SUCCESS', source, path);
  return {
    type: DELETE_MEDIA_ITEM_SUCCESS,
    source: source,
    path: path
  };
};

exports.DELETE_MEDIA_ITEM_SUCCESS = DELETE_MEDIA_ITEM_SUCCESS;
exports.deleteMediaItemSuccess = deleteMediaItemSuccess;

exports.UPDATE_CONFIG = UPDATE_CONFIG;
exports.updateConfig = updateConfig;

var DELETE_MEDIA_ITEM_ERROR = 'delete_media_item_error';
var deleteMediaItemError = function deleteMediaItemError(error) {
  //console.log('deleteMediaItemError', error);
  return {
    type: DELETE_MEDIA_ITEM_ERROR,
    error: error
  };
};

var deleteMediaItem = function deleteMediaItem(source, path) {
  var customHeaders = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return function (dispatch) {
    return fetch(_utility2.default.makeURL('/assets/components/eureka/media/sources/' + source, {
      path: path
    }), {
      method: 'DELETE',
      credentials: 'include',
      headers: Object.assign({}, {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }, customHeaders)
    }).then(function (response) {
      if (response.state < 200 || response.state >= 300) {
        var error = new Error(response.statusText);
        error.response = response;
        throw error;
      }
      return response;
    }).then(function (response) {
      return response.json();
    }).then(function (contents) {
      if (contents === false) throw new Error('Unable to delete directory ' + path);
      return contents;
    }).then(function (contents) {
      return dispatch(deleteMediaItemSuccess(source, path, contents));
    }).catch(function (error) {
      return dispatch(deleteMediaItemError(error));
    });
  };
};

var DELETE_MEDIA_ITEMS_SUCCESS = 'delete_media_items_success';
var deleteMediaItemsSuccess = function deleteMediaItemsSuccess(contents, formData) {
  var chosenMediaItems = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

  //console.log('DELETE_MEDIA_ITEMS_SUCCESS', contents);
  return {
    type: DELETE_MEDIA_ITEMS_SUCCESS,
    contents: contents,
    formData: formData,
    chosenMediaItems: chosenMediaItems
  };
};

exports.DELETE_MEDIA_ITEMS_SUCCESS = DELETE_MEDIA_ITEMS_SUCCESS;
exports.deleteMediaItemsSuccess = deleteMediaItemsSuccess;

var DELETE_MEDIA_ITEMS_ERROR = 'delete_media_items_error';
var deleteMediaItemsError = function deleteMediaItemsError(source, path) {
  //console.log('DELETE_MEDIA_ITEM_SUCCESS', source, path);
  return {
    type: DELETE_MEDIA_ITEMS_ERROR,
    source: source,
    path: path
  };
};

exports.DELETE_MEDIA_ITEMS_ERROR = DELETE_MEDIA_ITEMS_ERROR;
exports.deleteMediaItemsError = deleteMediaItemsError;

var deleteMediaItems = function deleteMediaItems(source, formData) {
  var customHeaders = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var chosenMediaItems = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;

  console.log('deleteMediaItems');
  /*for(var pair of formData.entries()) {
     console.log(pair[0]+ ', '+ pair[1]);
  }*/
  return function (dispatch) {
    return fetch('/assets/components/eureka/media/sources/' + source, {
      method: 'DELETE',
      body: formData,
      credentials: 'include',
      headers: Object.assign({}, {
        'Accept': 'application/json'
      }, customHeaders)
    }).then(function (response) {
      if (response.state < 200 || response.state >= 300) {
        var error = new Error(response.statusText);
        error.response = response;
        throw error;
      }
      return response;
    }).then(function (response) {
      return response.json();
    }).then(function (contents) {
      //if(contents === false) throw new Error(`Unable to delete directory ${path}`)
      return contents;
    }).then(function (contents) {
      return dispatch(deleteMediaItemsSuccess(contents, formData, chosenMediaItems));
    }).catch(function (error) {
      return dispatch(deleteMediaItemsError(error));
    });
  };
};

//http://localhost:3001/assets/components/eureka/media/sources/0

/*const deleteMediaItems = (source, formData, customHeaders = {}) => (
  (dispatch) => (
    fetch(`/assets/components/eureka/media/sources/${source}`), {
      method: 'DELETE',
      body: formData,
      headers: Object.assign({}, {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }, customHeaders)
    }).then((response) => {
      if(response.state < 200 || response.state >= 300) {
        var error = new Error(response.statusText)
        error.response = response
        throw error;
      }
      return response;
    }).then((response) => (
      response.json()
    )).then((contents) => {
      if(contents === false) throw new Error(`Unable to delete items`)
      return contents;
    }).then((contents) => (
      dispatch(
        deleteMediaItemsSuccess(source, formData)
      )
    )).catch((error) => (
      dispatch(
        deleteMediaItemError(error)
      )
    )
  )
);*/

exports.deleteMediaItems = deleteMediaItems;

var NOTIFICATION = 'notification';
var notify = function notify(message, notificationType, learnMore, dismissAfter) {
  var sticky = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
  var archived = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;

  console.log('notify', message);
  return {
    type: NOTIFICATION,
    message: message,
    id: new Date().getTime(),
    archived: archived,
    notificationType: notificationType,
    learnMore: learnMore,
    dismissAfter: dismissAfter,
    sticky: sticky
  };
};

exports.NOTIFICATION = NOTIFICATION;
exports.notify = notify;

var NOTIFICATION_DELETED = 'notification_dismissed';
var deleteNotification = function deleteNotification(id) {
  return {
    type: NOTIFICATION_DELETED,
    id: id
  };
};

exports.NOTIFICATION_DELETED = NOTIFICATION_DELETED;
exports.deleteNotification = deleteNotification;

var NOTIFICATION_ARCHIVED = 'notification_archived';
var archiveNotification = function archiveNotification(id) {
  return {
    type: NOTIFICATION_ARCHIVED,
    id: id
  };
};

exports.NOTIFICATION_ARCHIVED = NOTIFICATION_ARCHIVED;
exports.archiveNotification = archiveNotification;

var UPLOAD_FILES_SUCCESS = 'upload_files_success';
var uploadFilesSuccess = function uploadFilesSuccess(contents) {
  return {
    type: UPLOAD_FILES_SUCCESS,
    contents: contents
  };
};

exports.UPLOAD_FILES_SUCCESS = UPLOAD_FILES_SUCCESS;
exports.uploadFilesSuccess = uploadFilesSuccess;

var UPLOAD_FILES_ERROR = 'upload_files_error';
var uploadFilesError = function uploadFilesError(error) {
  return {
    type: UPLOAD_FILES_ERROR,
    error: error
  };
};

exports.UPLOAD_FILES_ERROR = UPLOAD_FILES_ERROR;
exports.uploadFilesError = uploadFilesError;

var uploadFiles = function uploadFiles(source, directory, formData) {
  var customHeaders = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  return function (dispatch) {
    return fetch(_utility2.default.makeURL('/assets/components/eureka/media/sources/' + source, {
      path: directory
    }), {
      method: 'POST',
      body: formData,
      headers: Object.assign({}, {
        //'Accept': 'application/json',
        //'Content-Type': 'application/json'
      }, customHeaders)
    }).then(function (response) {
      if (response.state < 200 || response.state >= 300) {
        var error = new Error(response.statusText);
        error.response = response;
        throw error;
      }
      return response;
    }).then(function (response) {
      return response.json();
    }).then(function (contents) {
      return dispatch(uploadFilesSuccess(contents));
    }).catch(function (error) {
      return dispatch(uploadFilesError(error));
    });
  };
};

var createDirectory = function createDirectory(source, dir) {
  var customHeaders = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return function (dispatch) {
    return fetch(_utility2.default.makeURL('/assets/components/eureka/media/sources/' + source, {
      path: dir
    }), {
      method: 'PUT',
      headers: Object.assign({}, {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }, customHeaders)
    }).then(function (response) {
      if (response.state < 200 || response.state >= 300) {
        var error = new Error(response.statusText);
        error.response = response;
        throw error;
      }
      return response;
    }).then(function (response) {
      return response.json();
    }).then(function (success) {
      if (!success) {
        var error = new Error('unable to create ' + dir + ' for media source ' + source);
        error.response = false;
        throw error;
      }
    }).then(function (success) {
      return dispatch(createDirectorySuccess(success));
    }).catch(function (error) {
      return dispatch(createDirectoryError(error));
    });
  };
};

var CREATE_DIRECTORY_SUCCESS = 'create_directory_success';
var createDirectorySuccess = function createDirectorySuccess(success) {
  return {
    type: CREATE_DIRECTORY_SUCCESS,
    success: success
  };
};

exports.CREATE_DIRECTORY_SUCCESS = CREATE_DIRECTORY_SUCCESS;
exports.createDirectorySuccess = createDirectorySuccess;

var CREATE_DIRECTORY_ERROR = 'create_directory_error';
var createDirectoryError = function createDirectoryError(error) {
  return {
    type: CREATE_DIRECTORY_ERROR,
    error: error
  };
};

exports.CREATE_DIRECTORY_ERROR = CREATE_DIRECTORY_ERROR;
exports.createDirectoryError = createDirectoryError;

exports.createDirectory = createDirectory;

exports.uploadFiles = uploadFiles;

exports.ADD_ITEM_SUCCESS = ADD_ITEM_SUCCESS;
exports.addItemSuccess = addItemSuccess;

exports.ADD_ITEM_ERROR = ADD_ITEM_ERROR;
exports.addItemError = addItemError;

exports.UPDATE_VIEW = UPDATE_VIEW;
exports.updateView = updateView;

exports.UPDATE_SOURCE = UPDATE_SOURCE;
exports.updateSource = updateSource;

exports.updateSourceTree = updateSourceTree;

exports.UPDATE_SOURCE_TREE_SUCCESS = UPDATE_SOURCE_TREE_SUCCESS;
exports.updateSourceTreeSuccess = updateSourceTreeSuccess;

exports.UPDATE_SOURCE_TREE_ERROR = UPDATE_SOURCE_TREE_ERROR;
exports.updateSourceTreeError = updateSourceTreeError;

exports.UPDATE_CONTENT = UPDATE_CONTENT;
exports.updateContent = updateContent;

exports.FETCH_DIRECTORY_CONTENTS_SUCCESS = FETCH_DIRECTORY_CONTENTS_SUCCESS;
exports.FETCH_DIRECTORY_CONTENTS_ERROR = FETCH_DIRECTORY_CONTENTS_ERROR;
exports.fetchDirectoryContents = fetchDirectoryContents;

exports.fetchMediaSources = fetchMediaSources;

exports.FETCH_MEDIA_SOURCES_SUCCESS = FETCH_MEDIA_SOURCES_SUCCESS;
exports.fetchMediaSourcesSuccess = fetchMediaSourcesSuccess;

exports.FETCH_MEDIA_SOURCES_ERROR = FETCH_MEDIA_SOURCES_ERROR;
exports.fetchMediaSourcesError = fetchMediaSourcesError;

exports.DELETE_MEDIA_ITEM_ERROR = DELETE_MEDIA_ITEM_ERROR;
exports.deleteMediaItemError = deleteMediaItemError;

exports.deleteMediaItem = deleteMediaItem;

var renameDirectory = function renameDirectory(source, dirPath, name) {
  var customHeaders = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  return function (dispatch) {
    return fetch(_utility2.default.makeURL('/assets/components/eureka/media/sources/' + source, {
      path: dirPath,
      name: name
    }), {
      method: 'PUT',
      headers: Object.assign({}, {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }, customHeaders)
    }).then(function (response) {
      if (response.state < 200 || response.state >= 300) {
        var error = new Error(response.statusText);
        error.response = response;
        throw error;
      }
      return response;
    }).then(function (response) {
      return response.json();
    }).then(function (success) {
      if (!success) {
        var error = new Error('unable to create ' + dirPath + ' for media source ' + source);
        error.response = false;
        throw error;
      }
    }).then(function (success) {
      return dispatch(renameDirectorySuccess(success, source, dirPath, name));
    }).catch(function (error) {
      return dispatch(renameDirectoryError(error));
    });
  };
};

var RENAME_DIRECTORY_SUCCESS = 'rename_directory_success';
var renameDirectorySuccess = function renameDirectorySuccess(success, source, dirPath, name) {
  return {
    type: RENAME_DIRECTORY_SUCCESS,
    success: success,
    source: source,
    dirPath: dirPath,
    name: name
  };
};

var RENAME_DIRECTORY_ERROR = 'rename_directory_error';
var renameDirectoryError = function renameDirectoryError(error) {
  return {
    type: RENAME_DIRECTORY_ERROR,
    error: error
  };
};

exports.RENAME_DIRECTORY_SUCCESS = RENAME_DIRECTORY_SUCCESS;
exports.renameDirectorySuccess = renameDirectorySuccess;

exports.RENAME_DIRECTORY_ERROR = RENAME_DIRECTORY_ERROR;
exports.renameDirectoryError = renameDirectoryError;

exports.renameDirectory = renameDirectory;

var renameItem = function renameItem(source, filePath, name) {
  var customHeaders = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  return function (dispatch) {
    return fetch(_utility2.default.makeURL('/assets/components/eureka/media/sources/' + source, {
      path: filePath,
      name: name
    }), {
      method: 'PUT',
      headers: Object.assign({}, {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }, customHeaders)
    }).then(function (response) {
      if (response.state < 200 || response.state >= 300) {
        var error = new Error(response.statusText);
        error.response = response;
        throw error;
      }
      return response;
    }).then(function (response) {
      return response.json();
    }).then(function (response) {
      if (!response) {
        var error = new Error('unable to create ' + filePath + ' for media source ' + source);
        error.response = false;
        throw error;
      }
      //console.log('response',response);
      return response;
    }).then(function (response) {
      return dispatch(renameItemSuccess(response));
    }).catch(function (error) {
      return dispatch(renameItemError(error));
    });
  };
};

var RENAME_ITEM_SUCCESS = 'rename_item_success';
var renameItemSuccess = function renameItemSuccess(contents) {
  //console.log('renameItemSuccess', contents);
  return {
    type: RENAME_ITEM_SUCCESS,
    contents: contents
  };
};

var RENAME_ITEM_ERROR = 'rename_item_error';
var renameItemError = function renameItemError(error) {
  return {
    type: RENAME_ITEM_ERROR,
    error: error
  };
};

exports.RENAME_ITEM_SUCCESS = RENAME_ITEM_SUCCESS;
exports.renameItemSuccess = renameItemSuccess;

exports.RENAME_ITEM_ERROR = RENAME_ITEM_ERROR;
exports.renameItemError = renameItemError;

exports.renameItem = renameItem;

exports.addMediaItemToChosenItems = addMediaItemToChosenItems;
exports.ADD_MEDIA_ITEM_TO_CHOSEN_ITEMS = ADD_MEDIA_ITEM_TO_CHOSEN_ITEMS;

exports.removeMediaItemFromChosenItems = removeMediaItemFromChosenItems;
exports.REMOVE_MEDIA_ITEM_FROM_CHOSEN_ITEMS = REMOVE_MEDIA_ITEM_FROM_CHOSEN_ITEMS;

exports.invertSelection = invertSelection;
exports.INVERT_SELECTION = INVERT_SELECTION;

exports.deselectAll = deselectAll;
exports.DESELECT_ALL = DESELECT_ALL;