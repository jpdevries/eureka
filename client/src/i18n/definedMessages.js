import { defineMessages } from 'react-intl';

export default defineMessages({
  directory: {
      id: 'directory.create',
      defaultMessage: 'Create a Directory'
  },
  createNewDirectoryIn: {
    id: 'directory.createNewIn',
    defaultMessage: 'Create a new Directory in {cd}'
  },
  choose: {
    id: 'choose',
    defaultMessage: 'Choose'
  },
  cancel: {
    id: 'cancel',
    defaultMessage: 'Cancel'
  },
  mediaSourceTree: {
    id: 'mediaSourceTree',
    defaultMessage: 'Media Source Panel'
  },
  deleteAreYouSureMessage: {
    id: 'deleteAreYouSureMessage',
    defaultMessage: 'Are you sure you want to permanently delete {filename}?'
  },
  masonryLayoutMessage: {
    id: 'masonryLayoutMessage',
    defaultMessage: 'Masonry Layout'
  },
  close: {
    id: 'close',
    defaultMessage: 'Close'
  },
  open: {
    id: 'open',
    defaultMessage: 'Open'
  },
  rename: {
    id: 'rename',
    defaultMessage: 'Rename'
  },
  welcomeToEureka: {
    id: 'welcomeToEureka',
    defaultMessage: 'Welcome to Eureka. You found it.'
  },
  delete: {
    id: 'delete',
    defaultMessage: 'Delete'
  },
  in: {
    id: 'in',
    defaultMessage: 'in'
  },
  createFile: {
    id: 'file.create',
    defaultMessage: 'Create File'
  },
  contentsOfBy: {
    id: 'contents.ofby',
    defaultMessage: 'contents of {cd} by filename, filesize, dimensions or even modification date'
  },
  filterContentsOfBy: {
    id: 'contents.filterBy',
    defaultMessage: 'Filter contents of {cd} by filename, filesize, dimensions or even modification date'
  },
  quickCreateFile: {
    id: 'file.quickCreate',
    defaultMessage: 'Quick Create Files'
  },
  cannotRename: {
    id: 'rename.cannot',
    defaultMessage: 'Cannot rename {filename} to the same name'
  },
  expand: {
    id: 'expand',
    defaultMessage: 'Expand'
  },
  chooseItem: {
    id: 'choose.item',
    defaultMessage: 'Choose {filename}'
  },
  renameItem: {
    id: 'rename.item',
    defaultMessage: 'Rename {filename}'
  },
  deleteDirectory: {
    id: 'directory.delete',
    defaultMessage: 'Delete Directory'
  },
  fetchingContents: {
    id: 'contents.fetchingContents',
    defaultMessage: 'Hold tight while we fetch {cd}'
  },
  deleteItem: {
    id: 'delete.item',
    defaultMessage: 'Delete {filename}'
  },
  deletedItem: {
    id: 'deleted.item',
    defaultMessage: 'Deleted {filename}'
  },
  download: {
    id: 'download',
    defaultMessage: 'Download'
  },
  downloadItem: {
    id: 'download.item',
    defaultMessage: 'Download {filename}'
  },
  expandItem: {
    id: 'expand.item',
    defaultMessage: 'Expand {filename}'
  },
  refreshDirectory: {
    id: 'directory.refresh',
    defaultMessage: 'Refresh Directory'
  },
  uploadFiles: {
    id: 'upload.files',
    defaultMessage: 'Upload Files'
  },
  uploadFileTo: {
    id: 'upload.filesTo',
    defaultMessage: 'Upload File to {cd}'
  },
  createFileInMessage: {
    id: 'upload.createFileIn',
    defaultMessage: 'Create File in {cd}'
  },
  closeMediaBrowser: {
      id: 'close.mediaBrowser',
      defaultMessage: 'Close Media Browser'
  },
  performContextualActions: {
    id: 'context.performActions',
    defaultMessage: 'Perform Actions such as Expand or Choose on {filename}'
  },
  choose: {
    id: 'choose',
    defaultMessage: 'Choose'
  },
  chmodDirectory: {
    id: 'directory.chmod',
    defaultMessage: 'chmod Directory'
  },
  item: {
    id: 'item',
    defaultMessage: 'item'
  },
  tabularLayoutDescription: {
    id: 'layout.tabular',
    defaultMessage: 'Tabular Layout displays image thumbnails along with Name, Description, File Size and Edited On columns'
  },
  thumbnailLayoutDescription: {
    id: 'layout.thumbnail',
    defaultMessage: 'Thumbnail layout displays a grid of medium sized thumbnails'
  },
  gridLayoutDescription: {
    id: 'layout.grid',
    defaultMessage: 'Grid View displays images a grid of large images'
  },
  listLayoutDescription: {
    id: 'layout.list',
    defaultMessage: 'List Layout displays Name, Description, File Size and Edited On columns'
  },
  openFileInNewTab: {
    id: 'file.openInNewTab',
    defaultMessage: 'Open {filename} in a new tab'
  },
  mediaItem: {
    id: 'mediaItem',
    defaultMessage: 'media item'
  },
  toggle: {
    id: 'toggle',
    defaultMessage: 'Toggle'
  },
  pluralItem: {
    id: 'pluralItem',
    defaultMessage: 'a media item',
    value: 1, // we don't support choosing (or selecting) multiple media items (yet)
    one: 'a media item',
    other: 'media items'
  },
  pluralChoose: {
    id: 'pluralChoose',
    defaultMessage: 'item',
    one: 'item',
    other: 'items',
    few: 'items',
    many: 'items',
    zero: ''
  },
  copyListofSelectedFiles: {
    id: 'copyListofSelectedFiles',
    defaultMessage: 'Copy list of selected files'
  },
  mediaSourceTreeMessage: {
    id: 'media.sourceTree',
    defaultMessage: 'Media Source Panel'
  },
  dragFilesUploading: {
    id: 'upload.dragFilesUploading',
    defaultMessage: 'Uploading files…',
    values: {
      cd: './'
    }
  },
  dragFilesToBeUploadedTo: {
    id: 'upload.dragFilestoUpload',
    defaultMessage: 'Drag files here to be uploaded to {cd}',
    values: {
      cd: './'
    }
  }
});
