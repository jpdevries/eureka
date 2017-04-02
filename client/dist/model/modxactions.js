'use strict';

var _utility = require('./../utility/utility');

var _utility2 = _interopRequireDefault(_utility);

var _actions = require('./actions');

var _actions2 = _interopRequireDefault(_actions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('isomorphic-fetch');

var eurekaConnector = '/assets/components/eureka/media.php';

var updateSourceTree = function updateSourceTree(source) {
  return function (dispatch) {
    return fetch((0, _utility.makeURL)(eurekaConnector, {
      a: 'media/sources/' + source
    }), {
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
      return dispatch((0, _actions.updateSourceTreeSuccess)(contents));
    }).catch(function (error) {
      return dispatch((0, _actions.updateSourceTreeError)(error));
    });
  };
};

var fetchDirectoryContents = function fetchDirectoryContents(source, params) {
  return function (dispatch) {
    return fetch(_utility2.default.makeURL(eurekaConnector, Object.assign({}, params, {
      a: 'media/sources/' + source
    })), {
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
      return dispatch((0, _actions.fetchDirectoryContentsSuccess)(contents));
    }).catch(function (error) {
      return dispatch((0, _actions.fetchDirectoryContentsError)(error));
    });
  };
};

var fetchMediaSources = function fetchMediaSources() {
  return function (dispatch) {
    return fetch(_utility2.default.makeURL(eurekaConnector, {
      a: 'media/sources'
    }), {
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
      return dispatch((0, _actions.fetchMediaSourcesSuccess)(sources));
    }).catch(function (error) {
      return dispatch((0, _actions.fetchMediaSourcesError)(error));
    });
  };
};

var deleteMediaItem = function deleteMediaItem(source, path) {
  return function (dispatch) {
    return fetch(_utility2.default.makeURL(eurekaConnector, {
      path: path,
      a: 'media/sources/' + source
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
      if (contents === false) throw new Error('Unable to delete directory ' + path);
      return contents;
    }).then(function (contents) {
      return dispatch((0, _actions.deleteMediaItemSuccess)(source, path));
    }).catch(function (error) {
      return dispatch((0, _actions.deleteMediaItemError)(error));
    });
  };
};

var uploadFiles = function uploadFiles(source, directory, formData) {
  return function (dispatch) {
    return fetch(_utility2.default.makeURL(eurekaConnector, {
      dir: directory,
      a: 'media/sources/' + source
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
      return dispatch((0, _actions.uploadFilesSuccess)(contents));
    }).catch(function (error) {
      return dispatch((0, _actions.uploadFilesError)(error));
    });
  };
};

var createDirectory = function createDirectory(source, dir) {
  return function (dispatch) {
    return fetch(_utility2.default.makeURL(eurekaConnector, {
      path: dir,
      a: 'media/sources/' + source
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
      return dispatch((0, _actions.createDirectorySuccess)(success));
    }).catch(function (error) {
      return dispatch((0, _actions.createDirectoryError)(error));
    });
  };
};

/*const renameDirectory = (source, dirPath, name) => (
  (dispatch) => (
    fetch(utility.makeURL(eurekaConnector, {
      path:dirPath,
      a: `media/sources/${source}`
    }), {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      if(response.state < 200 || response.state >= 300) {
        var error = new Error(response.statusText)
        error.response = response
        throw error;
      }
      return response;
    }).then((response) => (
      response.json()
    )).then((success) => {
      if(!success) {
        var error = new Error(`unable to create ${dirPath} for media source ${source}`);
        error.response = false;
        throw error;
      }
    }).then((success) => (
      dispatch(
        renameDirectorySuccess(success)
      )
    )).catch((error) => (
      dispatch(
        renameDirectoryError(error)
      )
    ))
  )
);*/

var renameItem = function renameItem(source, filePath, name) {
  return function (dispatch) {
    return fetch(_utility2.default.makeURL(eurekaConnector, {
      path: filePath,
      name: name,
      a: 'media/sources/' + source
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
      //console.log('response',response);
      return response;
    }).then(function (response) {
      return dispatch((0, _actions.renameItemSuccess)(response));
    }).catch(function (error) {
      return dispatch((0, _actions.renameItemError)(error));
    });
  };
};

var actionsOverride = {
  updateSourceTree: updateSourceTree,
  fetchDirectoryContents: fetchDirectoryContents,
  fetchMediaSources: fetchMediaSources,
  deleteMediaItem: deleteMediaItem,
  uploadFiles: uploadFiles,
  createDirectory: createDirectory,
  //renameDirectory: renameDirectory,
  renameItem: renameItem
};

var decoratedActions = Object.assign({}, _actions2.default, actionsOverride);

module.exports = decoratedActions;