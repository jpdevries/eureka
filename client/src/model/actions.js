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

const DESELECT_ALL = 'deselect_all';
const deselectAll = function() {
  return {
    type:DESELECT_ALL
  }
}



const INVERT_SELECTION = 'invert_selection';
const invertSelection = function() {
  return {
    type: INVERT_SELECTION
  }
}

const UPDATE_SOURCE = 'update_source';
const updateSource = function(source) {
  return {
    type:UPDATE_SOURCE,
    source:source,
  }
}


const ADD_MEDIA_ITEM_TO_CHOSEN_ITEMS = 'add_media_item_to_chosen_items';
const addMediaItemToChosenItems = function(item, inverted = false) {
  return {
    type: ADD_MEDIA_ITEM_TO_CHOSEN_ITEMS,
    item: item,
    inverted: inverted
  }
}

const REMOVE_MEDIA_ITEM_FROM_CHOSEN_ITEMS = 'remove_media_item_from_chosen_items';
const removeMediaItemFromChosenItems = function(item, inverted = false) {
  return {
    type: REMOVE_MEDIA_ITEM_FROM_CHOSEN_ITEMS,
    item: item,
    inverted: inverted
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
  //console.log('updateConfig', config);
  return {
    type:UPDATE_CONFIG,
    config:config,
  }
}










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











const updateSourceTree = (source, customHeaders = {}) => (
  (dispatch) => (
    fetch(`/assets/components/eureka/media/sources/${source}`, {
      method: 'GET',
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

const fetchDirectoryContents = (source, params, customHeaders = {}) => (
  (dispatch) => (
    fetch(utility.makeURL(`/assets/components/eureka/media/sources/${source}`, params), {
      method: 'GET',
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

const fetchMediaSources = (customHeaders = {}) => (
  (dispatch) => (
    fetch('/assets/components/eureka/media/sources', {
      method: 'GET',
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
const deleteMediaItemSuccess = function(source, path) {
  //console.log('DELETE_MEDIA_ITEM_SUCCESS', source, path);
  return {
    type:DELETE_MEDIA_ITEM_SUCCESS,
    source: source,
    path: path
  }
}

exports.DELETE_MEDIA_ITEM_SUCCESS = DELETE_MEDIA_ITEM_SUCCESS;
exports.deleteMediaItemSuccess = deleteMediaItemSuccess;

exports.UPDATE_CONFIG = UPDATE_CONFIG;
exports.updateConfig = updateConfig;

const DELETE_MEDIA_ITEM_ERROR = 'delete_media_item_error';
const deleteMediaItemError = function(error) {
  //console.log('deleteMediaItemError', error);
  return {
    type:DELETE_MEDIA_ITEM_ERROR,
    error:error
  }
}

const deleteMediaItem = (source, path, customHeaders = {}) => (
  (dispatch) => (
    fetch(utility.makeURL(`/assets/components/eureka/media/sources/${source}`, {
      path: path
    }), {
      method: 'DELETE',
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
      if(contents === false) throw new Error(`Unable to delete directory ${path}`)
      return contents;
    }).then((contents) => (
      dispatch(
        deleteMediaItemSuccess(source, path)
      )
    )).catch((error) => (
      dispatch(
        deleteMediaItemError(error)
      )
    ))
  )
);




const DELETE_MEDIA_ITEMS_SUCCESS = 'delete_media_items_success';
const deleteMediaItemsSuccess = function(contents, formData) {
  //console.log('DELETE_MEDIA_ITEM_SUCCESS', source, path);
  return {
    type:DELETE_MEDIA_ITEMS_SUCCESS,
    contents: contents,
    formData: formData
  }
}

exports.DELETE_MEDIA_ITEMS_SUCCESS = DELETE_MEDIA_ITEMS_SUCCESS;
exports.deleteMediaItemsSuccess = deleteMediaItemsSuccess;



const DELETE_MEDIA_ITEMS_ERROR = 'delete_media_items_error';
const deleteMediaItemsError = function(source, path) {
  //console.log('DELETE_MEDIA_ITEM_SUCCESS', source, path);
  return {
    type:DELETE_MEDIA_ITEMS_ERROR,
    source: source,
    path: path
  }
}

exports.DELETE_MEDIA_ITEMS_ERROR = DELETE_MEDIA_ITEMS_ERROR;
exports.deleteMediaItemsError = deleteMediaItemsError;


const deleteMediaItems = (source, formData, customHeaders = {}) => {
  console.log('deleteMediaItems');
  for(var pair of formData.entries()) {
     console.log(pair[0]+ ', '+ pair[1]);
  }
  return (dispatch) => (
    fetch(`/assets/components/eureka/media/sources/${source}`, {
      method: 'DELETE',
      body: formData,
      headers: Object.assign({}, {
        'Accept': 'application/json',
        //'Content-Type': 'multipart/form-data'
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
      //if(contents === false) throw new Error(`Unable to delete directory ${path}`)
      return contents;
    }).then((contents) => (
      dispatch(
        deleteMediaItemsSuccess(contents, formData)
      )
    )).catch((error) => (
      dispatch(
        deleteMediaItemsError(error)
      )
    ))
  )
}

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


const NOTIFICATION = 'notification';
const notify = function(message, notificationType, learnMore, dismissAfter, sticky = true, archived = false) {
  return {
    type: NOTIFICATION,
    message: message,
    id: new Date().getTime(),
    archived: archived,
    notificationType: notificationType,
    learnMore: learnMore,
    dismissAfter: dismissAfter,
    sticky: sticky
  }
}

exports.NOTIFICATION = NOTIFICATION;
exports.notify = notify;

const NOTIFICATION_DELETED = 'notification_dismissed';
const deleteNotification = function(id) {
  return {
    type: NOTIFICATION_DELETED,
    id: id
  }
}

exports.NOTIFICATION_DELETED = NOTIFICATION_DELETED;
exports.deleteNotification = deleteNotification;



const NOTIFICATION_ARCHIVED = 'notification_archived';
const archiveNotification = function(id) {
  return {
    type: NOTIFICATION_ARCHIVED,
    id: id
  }
}

exports.NOTIFICATION_ARCHIVED = NOTIFICATION_ARCHIVED;
exports.archiveNotification = archiveNotification;



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


const uploadFiles = (source, directory, formData, customHeaders = {}) => (
  (dispatch) => (
    fetch(utility.makeURL(`/assets/components/eureka/media/sources/${source}`, {
      path: directory
    }), {
      method: 'POST',
      body: formData,
      headers: Object.assign({}, {
        //'Accept': 'application/json',
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
        uploadFilesSuccess(contents)
      )
    )).catch((error) => (
      dispatch(
        uploadFilesError(error)
      )
    ))
  )
);


const createDirectory = (source, dir, customHeaders = {}) => (
  (dispatch) => (
    fetch(utility.makeURL(`/assets/components/eureka/media/sources/${source}`,{
      path:dir
    }), {
      method: 'PUT',
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










const renameDirectory = (source, dirPath, name, customHeaders = {}) => (
  (dispatch) => (
    fetch(utility.makeURL(`/assets/components/eureka/media/sources/${source}`,{
      path:dirPath,
      name:name
    }), {
      method: 'PUT',
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















const renameItem = (source, filePath, name, customHeaders = {}) => (
  (dispatch) => (
    fetch(utility.makeURL(`/assets/components/eureka/media/sources/${source}`,{
      path:filePath,
      name:name
    }), {
      method: 'PUT',
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
    )).then((response) => {
      if(!response) {
        var error = new Error(`unable to create ${filePath} for media source ${source}`);
        error.response = false;
        throw error;
      }
      //console.log('response',response);
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
  //console.log('renameItemSuccess', contents);
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

exports.addMediaItemToChosenItems = addMediaItemToChosenItems;
exports.ADD_MEDIA_ITEM_TO_CHOSEN_ITEMS = ADD_MEDIA_ITEM_TO_CHOSEN_ITEMS;

exports.removeMediaItemFromChosenItems = removeMediaItemFromChosenItems;
exports.REMOVE_MEDIA_ITEM_FROM_CHOSEN_ITEMS = REMOVE_MEDIA_ITEM_FROM_CHOSEN_ITEMS;

exports.invertSelection = invertSelection;
exports.INVERT_SELECTION = INVERT_SELECTION;

exports.deselectAll = deselectAll;
exports.DESELECT_ALL = DESELECT_ALL;
