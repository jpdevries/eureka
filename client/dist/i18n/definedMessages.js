'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineMessages;

var _reactIntl = require('react-intl');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

exports.default = (0, _reactIntl.defineMessages)((_defineMessages = {
  directory: {
    'id': 'directory.create',
    'defaultMessage': 'Create a Directory'
  },
  createNewDirectoryIn: {
    'id': 'directory.createNewIn',
    'defaultMessage': 'Create a new Directory in {cd}'
  },
  directoryCancelCreating: {
    'id': 'directory.cancelCreating',
    'defaultMessage': 'Cancel creating directory {cd}'
  },
  choose: {
    'id': 'choose',
    'defaultMessage': 'Choose'
  },
  reset: {
    'id': 'reset',
    'defaultMessage': 'Reset'
  },
  rememberThis: {
    'id': 'rememberAspectRatio',
    'defaultMessage': 'Remember Ratio'
  },
  crop: {
    'id': 'crop',
    'defaultMessage': 'Crop'
  },
  cropItem: {
    'id': 'cropItem',
    'defaultMessage': 'Crop {item}'
  },
  cropAs: {
    'id': 'cropAs',
    'defaultMessage': 'Crop as'
  },
  cropAsItem: {
    'id': 'cropAsItem',
    'defaultMessage': 'Crop as {item}'
  },
  saveAsItem: {
    'id': 'saveAsItem',
    'defaultMessage': 'Save as {item}'
  },
  croppingItem: {
    'id': 'croppingItem',
    'defaultMessage': 'Cropping {item}'
  },
  cancel: {
    'id': 'cancel',
    'defaultMessage': 'Cancel'
  },
  mediaSourceTree: {
    'id': 'mediaSourceTree',
    'defaultMessage': 'Media Source Panel'
  },
  pastImageFromClipboardMessage: {
    'id': 'pastImageFromClipboardMessage',
    'defaultMessage': 'Paste images from the clipboard to upload'
  },
  pastImageFromClipboardToMessage: {
    'id': 'pastImageFromClipboardToMessage',
    'defaultMessage': 'Paste images from the clipboard to upload to ${cd} of source ${cs}'
  },
  deleteAreYouSureMessage: {
    'id': 'deleteAreYouSureMessage',
    'defaultMessage': 'Are you sure you want to permanently delete {filename}?'
  },
  cropAreYouSureMessage: {
    'id': 'cropAreYouSureMessage',
    'defaultMessage': 'Are you sure you want to reset your crop?'
  },
  masonryLayoutMessage: {
    'id': 'masonryLayoutMessage',
    'defaultMessage': 'Masonry Layout'
  },
  close: {
    'id': 'close',
    'defaultMessage': 'Close'
  },
  open: {
    'id': 'open',
    'defaultMessage': 'Open'
  },
  rename: {
    'id': 'rename',
    'defaultMessage': 'Rename'
  },
  welcomeToEureka: {
    'id': 'welcomeToEureka',
    'defaultMessage': 'Welcome to Eureka. You found it.'
  },
  delete: {
    'id': 'delete',
    'defaultMessage': 'Delete'
  },
  in: {
    'id': 'in',
    'defaultMessage': 'in'
  },
  createFile: {
    'id': 'file.create',
    'defaultMessage': 'Create File'
  },
  contentsOfBy: {
    'id': 'contents.ofby',
    'defaultMessage': 'contents of {cd} by filename, filesize, dimensions or even modification date'
  },
  filterContentsOfBy: {
    'id': 'contents.filterBy',
    'defaultMessage': 'Filter contents of {cd} by filename, filesize, dimensions or even modification date'
  },
  quickCreateFile: {
    'id': 'file.quickCreate',
    'defaultMessage': 'Quick Create Files'
  },
  cannotRename: {
    'id': 'rename.cannot',
    'defaultMessage': 'Cannot rename {filename} to the same name'
  },
  expand: {
    'id': 'expand',
    'defaultMessage': 'Expand'
  },
  chooseItem: {
    'id': 'choose.item',
    'defaultMessage': 'Choose {filename}'
  },
  renameItem: {
    'id': 'rename.item',
    'defaultMessage': 'Rename {filename}'
  },
  deleteDirectory: {
    'id': 'directory.delete',
    'defaultMessage': 'Delete Directory'
  },
  fetchingContents: {
    'id': 'contents.fetchingContents',
    'defaultMessage': 'Hold tight while we fetch {cd}'
  },
  deleteItem: {
    'id': 'delete.item',
    'defaultMessage': 'Delete {filename}'
  },
  deletedItem: {
    'id': 'deleted.item',
    'defaultMessage': 'Deleted {filename}'
  },
  download: {
    'id': 'download',
    'defaultMessage': 'Download'
  },
  downloadItem: {
    'id': 'download.item',
    'defaultMessage': 'Download {filename}'
  },
  expandItem: {
    'id': 'expand.item',
    'defaultMessage': 'Expand {filename}'
  },
  refreshDirectory: {
    'id': 'directory.refresh',
    'defaultMessage': 'Refresh Directory'
  },
  uploadFiles: {
    'id': 'upload.files',
    'defaultMessage': 'Upload Files'
  },
  uploadFileTo: {
    'id': 'upload.filesTo',
    'defaultMessage': 'Upload File to {cd}'
  },
  createFileInMessage: {
    'id': 'upload.createFileIn',
    'defaultMessage': 'Create File in {cd}'
  },
  closeMediaBrowser: {
    'id': 'close.mediaBrowser',
    'defaultMessage': 'Close Media Browser'
  },
  performContextualActions: {
    'id': 'context.performActions',
    'defaultMessage': 'Perform Actions such as Expand or Choose on {filename}'
  }
}, _defineProperty(_defineMessages, 'choose', {
  'id': 'choose',
  'defaultMessage': 'Choose'
}), _defineProperty(_defineMessages, 'chmodDirectory', {
  'id': 'directory.chmod',
  'defaultMessage': 'chmod Directory'
}), _defineProperty(_defineMessages, 'item', {
  'id': 'item',
  'defaultMessage': 'item'
}), _defineProperty(_defineMessages, 'tabularLayoutDescription', {
  'id': 'layout.tabular',
  'defaultMessage': 'Tabular Layout displays image thumbnails along with Name, Description, File Size and Edited On columns'
}), _defineProperty(_defineMessages, 'thumbnailLayoutDescription', {
  'id': 'layout.thumbnail',
  'defaultMessage': 'Thumbnail layout displays a grid of medium sized thumbnails'
}), _defineProperty(_defineMessages, 'gridLayoutDescription', {
  'id': 'layout.grid',
  'defaultMessage': 'Grid View displays images a grid of large images'
}), _defineProperty(_defineMessages, 'listLayoutDescription', {
  'id': 'layout.list',
  'defaultMessage': 'List Layout displays Name, Description, File Size and Edited On columns'
}), _defineProperty(_defineMessages, 'openFileInNewTab', {
  'id': 'file.openInNewTab',
  'defaultMessage': 'Open {filename} in a new tab'
}), _defineProperty(_defineMessages, 'mediaItem', {
  'id': 'mediaItem',
  'defaultMessage': 'media item'
}), _defineProperty(_defineMessages, 'toggle', {
  'id': 'toggle',
  'defaultMessage': 'Toggle'
}), _defineProperty(_defineMessages, 'pluralItem', {
  'id': 'pluralItem',
  'defaultMessage': 'a media item'
}), _defineProperty(_defineMessages, 'pluralChoose', {
  'id': 'pluralChoose',
  'defaultMessage': 'item'
}), _defineProperty(_defineMessages, 'copyListofSelectedFiles', {
  'id': 'copyListofSelectedFiles',
  'defaultMessage': 'Copy list of selected files'
}), _defineProperty(_defineMessages, 'mediaSourceTreeMessage', {
  'id': 'media.sourceTree',
  'defaultMessage': 'Media Source Panel'
}), _defineProperty(_defineMessages, 'dragFilesUploading', {
  'id': 'upload.dragFilesUploading',
  'defaultMessage': 'Uploading files\u2026'
}), _defineProperty(_defineMessages, 'dragFilesToBeUploadedTo', {
  'id': 'upload.dragFilestoUpload',
  'defaultMessage': 'Drag files here to be uploaded to {cd}'
}), _defineProperty(_defineMessages, 'dragMode', {
  'id': 'dragMode',
  'defaultMessage': 'Drag Mode'
}), _defineProperty(_defineMessages, 'cropMove', {
  'id': 'crop.move',
  'defaultMessage': 'Move'
}), _defineProperty(_defineMessages, 'cropShowGuides', {
  'id': 'crop.showGuides',
  'defaultMessage': 'Show Guides'
}), _defineProperty(_defineMessages, 'cropHideGuides', {
  'id': 'crop.hideGuides',
  'defaultMessage': 'Hide Guides'
}), _defineProperty(_defineMessages, 'cropToggleGuides', {
  'id': 'crop.toggleGuides',
  'defaultMessage': 'Toggle Guides'
}), _defineProperty(_defineMessages, 'cropZoomIn', {
  'id': 'crop.zoomIn',
  'defaultMessage': 'Zoom In'
}), _defineProperty(_defineMessages, 'cropZoomOut', {
  'id': 'crop.cropZoomOut',
  'defaultMessage': 'Zoom Out'
}), _defineProperty(_defineMessages, 'cropMoveLeft', {
  'id': 'crop.moveLeft',
  'defaultMessage': 'Move Left'
}), _defineProperty(_defineMessages, 'cropMoveRight', {
  'id': 'crop.moveRight',
  'defaultMessage': 'Move Right'
}), _defineProperty(_defineMessages, 'cropMoveUp', {
  'id': 'crop.moveUp',
  'defaultMessage': 'Move Up'
}), _defineProperty(_defineMessages, 'cropMoveDown', {
  'id': 'crop.moveDown',
  'defaultMessage': 'Move Down'
}), _defineProperty(_defineMessages, 'cropDownload', {
  'id': 'crop.download',
  'defaultMessage': 'Download Cropped Image'
}), _defineProperty(_defineMessages, 'cropUploadImage', {
  'id': 'crop.uploadImage',
  'defaultMessage': 'Upload Image to Crop'
}), _defineProperty(_defineMessages, 'upload', {
  'id': 'crop.upload',
  'defaultMessage': 'Upload'
}), _defineProperty(_defineMessages, 'cropBoundingBox', {
  'id': 'crop.boundingBox',
  'defaultMessage': 'Bounding Box (px)'
}), _defineProperty(_defineMessages, 'cropX', {
  'id': 'crop.X',
  'defaultMessage': 'X'
}), _defineProperty(_defineMessages, 'cropY', {
  'id': 'crop.Y',
  'defaultMessage': 'Y'
}), _defineProperty(_defineMessages, 'cropWidth', {
  'id': 'crop.width',
  'defaultMessage': 'Width'
}), _defineProperty(_defineMessages, 'cropHeight', {
  'id': 'crop.height',
  'defaultMessage': 'Height'
}), _defineProperty(_defineMessages, 'cropAspectRatio', {
  'id': 'crop.aspectRatio',
  'defaultMessage': 'Aspect Ratio'
}), _defineProperty(_defineMessages, 'cropFree', {
  'id': 'crop.free',
  'defaultMessage': 'Free'
}), _defineProperty(_defineMessages, 'cropScaleRotate', {
  'id': 'crop.scaleRotate',
  'defaultMessage': 'Scale & Rotate'
}), _defineProperty(_defineMessages, 'cropRotate', {
  'id': 'crop.rotate',
  'defaultMessage': 'Rotate'
}), _defineProperty(_defineMessages, 'cropScale', {
  'id': 'crop.scale',
  'defaultMessage': 'Scale'
}), _defineMessages));