import utility from './../utility/utility';

require('isomorphic-fetch');

const ADD_ITEM_SUCCESS = 'add_item_success';
const ADD_ITEM_ERROR = 'add_item_error';
const addItemSuccess = function(item) {
  return {
    type:ADD_ITEM_SUCCESS,
    item:item,
  }
}

const addItemError = function(task) {
  return {
    type:ADD_ITEM_ERROR,
    task:task,
  }
}

const UPDATE_VIEW = 'update_view';
const updateView = function(view) {
  return {
    type:UPDATE_VIEW,
    view:view,
  }
}

const UPDATE_SOURCE = 'update_source';
const updateSource = function(source) {
  return {
    type:UPDATE_SOURCE,
    source:source,
  }
}

const UPDATE_CONTENT = 'update_content';
const updateContent = function(content) {
  return {
    type:UPDATE_CONTENT,
    content:content,
  }
}

const UPDATE_CONFIG = 'update_config';
const updateConfig = function(config) {
  return {
    type:UPDATE_CONFIG,
    config:config,
  }
}

const updateSourceTree = (source) => (
  (dispatch) => (
    fetch(`/core/components/eureka/media/sources/${source}`, {
      method: 'GET',
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
    )).then((contents) => (
      dispatch(
        updateSourceTreeSuccess(contents)
      )
    )).catch((error) => (
      dispatch(
        updateSourceTreeError(error)
      )
    ))
  )
);

const UPDATE_SOURCE_TREE_SUCCESS = 'update_source_tree_success';
const UPDATE_SOURCE_TREE_ERROR = 'update_source_tree_error';
const updateSourceTreeSuccess = function(contents) {
  //console.log('contents',contents);
  return {
    type:UPDATE_SOURCE_TREE_SUCCESS,
    contents:contents,
  }
}

const updateSourceTreeError = function(error) {
  //console.log('updateSourceTreeError',error);
  return {
    type:UPDATE_SOURCE_TREE_ERROR,
    error:error
  }
}

const fetchDirectoryContents = (source, params) => (
  (dispatch) => (
    fetch(utility.makeURL(`/core/components/eureka/media/sources/${source}`, params), {
      method: 'GET',
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
    )).then((contents) => (
      dispatch(
        fetchDirectoryContentsSuccess(contents)
      )
    )).catch((error) => (
      dispatch(
        fetchDirectoryContentsError(error)
      )
    ))
  )
);

const FETCH_DIRECTORY_CONTENTS_SUCCESS = 'fetch_directory_contents_success';
const FETCH_DIRECTORY_CONTENTS_ERROR = 'fetch_directory_contents_error';

const fetchDirectoryContentsSuccess = function(contents) {
  return {
    type:FETCH_DIRECTORY_CONTENTS_SUCCESS,
    contents:contents
  }
}

exports.fetchDirectoryContentsSuccess = fetchDirectoryContentsSuccess;


const fetchDirectoryContentsError = function(error) {
  return {
    type:FETCH_DIRECTORY_CONTENTS_ERROR,
    error:error
  }
}

exports.fetchDirectoryContentsError = fetchDirectoryContentsError;

const fetchMediaSources = () => (
  (dispatch) => (
    fetch('/core/components/eureka/media/sources', {
      method: 'GET',
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
    }).then((sources) => (
      sources.json()
    )).then((sources) => (
      dispatch(
        fetchMediaSourcesSuccess(sources)
      )
    )).catch((error) => (
      dispatch(
        fetchMediaSourcesError(error)
      )
    ))
  )
);

const FETCH_MEDIA_SOURCES_SUCCESS = 'fetch_media_sources_success';
const FETCH_MEDIA_SOURCES_ERROR = 'fetch_media_sources_error';

const fetchMediaSourcesSuccess = function(sources) {
  //console.log('fetchMediaSourcesSuccess', sources);
  return {
    type:FETCH_MEDIA_SOURCES_SUCCESS,
    sources:sources
  }
}

const fetchMediaSourcesError = function(error) {
  return {
    type:FETCH_MEDIA_SOURCES_ERROR,
    error:error
  }
}

const DELETE_MEDIA_ITEM_SUCCESS = 'delete_media_item_success';
const deleteMediaItemSuccess = function(source, absolutePath) {
  console.log('DELETE_MEDIA_ITEM_SUCCESS', source, absolutePath);
  return {
    type:DELETE_MEDIA_ITEM_SUCCESS,
    source: source,
    absolutePath: absolutePath
  }
}

exports.DELETE_MEDIA_ITEM_SUCCESS = DELETE_MEDIA_ITEM_SUCCESS;
exports.deleteMediaItemSuccess = deleteMediaItemSuccess;

exports.UPDATE_CONFIG = UPDATE_CONFIG;
exports.updateConfig = updateConfig;

const DELETE_MEDIA_ITEM_ERROR = 'delete_media_item_error';
const deleteMediaItemError = function(error) {
  console.log('deleteMediaItemError', error);
  return {
    type:DELETE_MEDIA_ITEM_ERROR,
    error:error
  }
}

const deleteMediaItem = (source, absolutePath) => (
  (dispatch) => (
    fetch(utility.makeURL(`/core/components/eureka/media/sources/${source}`, {
      absolutePath: absolutePath
    }), {
      method: 'DELETE',
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
    )).then((contents) => {
      if(contents === false) throw new Error(`Unable to delete directory ${absolutePath}`)
      return contents;
    }).then((contents) => (
      dispatch(
        deleteMediaItemSuccess(source, absolutePath)
      )
    )).catch((error) => (
      dispatch(
        deleteMediaItemError(error)
      )
    ))
  )
);




const UPLOAD_FILES_SUCCESS = 'upload_files_success';
const uploadFilesSuccess = function(contents) {
  return {
    type:UPLOAD_FILES_SUCCESS,
    contents: contents
  }
}

exports.UPLOAD_FILES_SUCCESS = UPLOAD_FILES_SUCCESS;
exports.uploadFilesSuccess = uploadFilesSuccess;

const UPLOAD_FILES_ERROR = 'upload_files_error';
const uploadFilesError = function(error) {
  return {
    type:UPLOAD_FILES_ERROR,
    error:error
  }
}

exports.UPLOAD_FILES_ERROR = UPLOAD_FILES_ERROR;
exports.uploadFilesError = uploadFilesError;


const uploadFiles = (source, directory, formData) => (
  (dispatch) => (
    fetch(utility.makeURL(`/core/components/eureka/media/sources/${source}`, {
      dir: directory
    }), {
      method: 'POST',
      body: formData,
      headers: {
        //'Accept': 'application/json',
        //'Content-Type': 'application/json'
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
    )).then((contents) => (
      dispatch(
        uploadFilesSuccess(contents)
      )
    )).catch((error) => (
      dispatch(
        uploadFilesError(error)
      )
    ))
  )
);


const createDirectory = (source, dir) => (
  (dispatch) => (
    fetch(utility.makeURL(`/core/components/eureka/media/sources/${source}`,{
      path:dir
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
        var error = new Error(`unable to create ${dir} for media source ${source}`);
        error.response = false;
        throw error;
      }
    }).then((success) => (
      dispatch(
        createDirectorySuccess(success)
      )
    )).catch((error) => (
      dispatch(
        createDirectoryError(error)
      )
    ))
  )
);

const  CREATE_DIRECTORY_SUCCESS = 'create_directory_success';
const createDirectorySuccess = function(success) {
  return {
    type:CREATE_DIRECTORY_SUCCESS,
    success: success
  }
}

exports.CREATE_DIRECTORY_SUCCESS = CREATE_DIRECTORY_SUCCESS;
exports.createDirectorySuccess = createDirectorySuccess;

const  CREATE_DIRECTORY_ERROR = 'create_directory_error';
const createDirectoryError = function(error) {
  return {
    type:CREATE_DIRECTORY_ERROR,
    error:error
  }
}

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










const renameDirectory = (source, dirPath, name) => (
  (dispatch) => (
    fetch(utility.makeURL(`/core/components/eureka/media/sources/${source}`,{
      path:dirPath,
      name:name
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
);

const  RENAME_DIRECTORY_SUCCESS = 'rename_directory_success';
const renameDirectorySuccess = function(success) {
  return {
    type:RENAME_DIRECTORY_SUCCESS,
    success: success
  }
}



const  RENAME_DIRECTORY_ERROR = 'rename_directory_error';
const renameDirectoryError = function(error) {
  return {
    type:RENAME_DIRECTORY_ERROR,
    error:error
  }
}

exports.RENAME_DIRECTORY_SUCCESS = RENAME_DIRECTORY_SUCCESS;
exports.renameDirectorySuccess = renameDirectorySuccess;

exports.RENAME_DIRECTORY_ERROR = RENAME_DIRECTORY_ERROR;
exports.renameDirectoryError = renameDirectoryError;

exports.renameDirectory = renameDirectory;















const renameItem = (source, filePath, name) => (
  (dispatch) => (
    fetch(utility.makeURL(`/core/components/eureka/media/sources/${source}`,{
      path:filePath,
      name:name
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
    )).then((response) => {
      if(!response) {
        var error = new Error(`unable to create ${filePath} for media source ${source}`);
        error.response = false;
        throw error;
      }
      console.log('response',response);
      return response;
    }).then((response) => (
      dispatch(
        renameItemSuccess(response)
      )
    )).catch((error) => (
      dispatch(
        renameItemError(error)
      )
    ))
  )
);

const  RENAME_ITEM_SUCCESS = 'rename_item_success';
const renameItemSuccess = function(contents) {
  console.log('renameItemSuccess', contents);
  return {
    type:RENAME_ITEM_SUCCESS,
    contents: contents
  }
}



const  RENAME_ITEM_ERROR = 'rename_item_error';
const renameItemError = function(error) {
  return {
    type:RENAME_ITEM_ERROR,
    error:error
  }
}

exports.RENAME_ITEM_SUCCESS = RENAME_ITEM_SUCCESS;
exports.renameItemSuccess = renameItemSuccess;

exports.RENAME_ITEM_ERROR = RENAME_ITEM_ERROR;
exports.renameItemError = renameItemError;

exports.renameItem = renameItem;
