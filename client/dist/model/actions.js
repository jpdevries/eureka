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

var UPDATE_SOURCE = 'update_source';
var updateSource = function updateSource(source) {
  return {
    type: UPDATE_SOURCE,
    source: source
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
  return {
    type: UPDATE_CONFIG,
    config: config
  };
};

var updateSourceTree = function updateSourceTree(source) {
  return function (dispatch) {
    return fetch('/core/components/eureka/media/sources/' + source, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
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
  //console.log('contents',contents);
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
  return function (dispatch) {
    return fetch(_utility2.default.makeURL('/core/components/eureka/media/sources/' + source, params), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
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
      return dispatch(fetchDirectoryContentsSuccess(contents));
    }).catch(function (error) {
      return dispatch(fetchDirectoryContentsError(error));
    });
  };
};

var FETCH_DIRECTORY_CONTENTS_SUCCESS = 'fetch_directory_contents_success';
var FETCH_DIRECTORY_CONTENTS_ERROR = 'fetch_directory_contents_error';

var fetchDirectoryContentsSuccess = function fetchDirectoryContentsSuccess(contents) {
  return {
    type: FETCH_DIRECTORY_CONTENTS_SUCCESS,
    contents: contents
  };
};

exports.fetchDirectoryContentsSuccess = fetchDirectoryContentsSuccess;

var fetchDirectoryContentsError = function fetchDirectoryContentsError(error) {
  return {
    type: FETCH_DIRECTORY_CONTENTS_ERROR,
    error: error
  };
};

exports.fetchDirectoryContentsError = fetchDirectoryContentsError;

var fetchMediaSources = function fetchMediaSources() {
  return function (dispatch) {
    return fetch('/core/components/eureka/media/sources', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
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
var deleteMediaItemSuccess = function deleteMediaItemSuccess(source, absolutePath) {
  console.log('DELETE_MEDIA_ITEM_SUCCESS', source, absolutePath);
  return {
    type: DELETE_MEDIA_ITEM_SUCCESS,
    source: source,
    absolutePath: absolutePath
  };
};

exports.DELETE_MEDIA_ITEM_SUCCESS = DELETE_MEDIA_ITEM_SUCCESS;
exports.deleteMediaItemSuccess = deleteMediaItemSuccess;

exports.UPDATE_CONFIG = UPDATE_CONFIG;
exports.updateConfig = updateConfig;

var DELETE_MEDIA_ITEM_ERROR = 'delete_media_item_error';
var deleteMediaItemError = function deleteMediaItemError(error) {
  console.log('deleteMediaItemError', error);
  return {
    type: DELETE_MEDIA_ITEM_ERROR,
    error: error
  };
};

var deleteMediaItem = function deleteMediaItem(source, absolutePath) {
  return function (dispatch) {
    return fetch(_utility2.default.makeURL('/core/components/eureka/media/sources/' + source, {
      absolutePath: absolutePath
    }), {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
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
      if (contents === false) throw new Error('Unable to delete directory ' + absolutePath);
      return contents;
    }).then(function (contents) {
      return dispatch(deleteMediaItemSuccess(source, absolutePath));
    }).catch(function (error) {
      return dispatch(deleteMediaItemError(error));
    });
  };
};

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
  return function (dispatch) {
    return fetch(_utility2.default.makeURL('/core/components/eureka/media/sources/' + source, {
      dir: directory
    }), {
      method: 'POST',
      body: formData,
      headers: {
        //'Accept': 'application/json',
        //'Content-Type': 'application/json'
      }
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
  return function (dispatch) {
    return fetch(_utility2.default.makeURL('/core/components/eureka/media/sources/' + source, {
      path: dir
    }), {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
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
  return function (dispatch) {
    return fetch(_utility2.default.makeURL('/core/components/eureka/media/sources/' + source, {
      path: dirPath,
      name: name
    }), {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
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
      return dispatch(renameDirectorySuccess(success));
    }).catch(function (error) {
      return dispatch(renameDirectoryError(error));
    });
  };
};

var RENAME_DIRECTORY_SUCCESS = 'rename_directory_success';
var renameDirectorySuccess = function renameDirectorySuccess(success) {
  return {
    type: RENAME_DIRECTORY_SUCCESS,
    success: success
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
  return function (dispatch) {
    return fetch(_utility2.default.makeURL('/core/components/eureka/media/sources/' + source, {
      path: filePath,
      name: name
    }), {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
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
      console.log('response', response);
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
  console.log('renameItemSuccess', contents);
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