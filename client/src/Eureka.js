import React, { Component } from 'react';
import MediaSourceSelector from './components/MediaSourceSelector';
import MediaDirectorySelector from './components/MediaDirectorySelector';
import TreeBar from './components/TreeBar';
import TreeToggle from './components/TreeToggle';
import ChooseBar from './components/ChooseBar';
import SearchBar from './components/SearchBar';
import ViewChooser from './components/ViewChooser';
import EurekaTable from './components/EurekaTable';
import FileTree from './components/FileTree';
import UploadForm from './components/UploadForm';
import PathBar from './components/PathBar';
import DropArea from './components/DropArea';
import Modal from './components/Modal';
import ModalCreateDirectoryForm from './components/ModalCreateDirectoryForm';
import ModalRenameItemForm from './components/ModalRenameItemForm';
import SortContents from './components/SortContents';
import Icon from './components/Icon';
import Notification from './components/Notification';

import Mousetrap from 'mousetrap';

import {formatMessage} from 'react-intl';

const path = require('path');

const pathParse = require('path-parse');

const classNames = require('classnames');

import store from './model/store';
import actions from './model/actions';
import utility from './utility/utility';

import { FormattedMessage, FormattedPlural, FormattedNumber, FormattedRelative, defineMessages } from 'react-intl';
import definedMessages from './i18n/definedMessages';

const CREATE_DIRECTORY = 'create_directory';
const RENAME_ITEM = 'rename_item';



//Notification.propTypes = { initialCount: React.PropTypes.number };
//Notification.defaultProps = { initialCount: 0 };

/*
class Notification extends Component {

  constructor(props) {
    super(props);
    this.setState = {
      hidden: false
    };
  }

  componentDidMount() {
    console.log('Notifcation did mount', this.state)
    setTimeout((event) => {
      console.log('do it', this.state);
      this.setState({
        hidden: true
      })
    }, 3000);
  }

  render() {
    console.log('state', this.state);
    const hidden = (() => {
      try {
        console.log(this.state);
        return this.state.hidden
      } catch (e) {
        return true
      }
    })();
    console.log('hidden', hidden);
    return (
      <div className="eureka__notification-wrapper" aria-live="polite" aria-hidden={hidden}>
        <p aria-live="polite">Something happened</p>
      </div>
    );
  }
}
*/

class Eureka extends Component {
  /*static propTypes = {
    intl: PropTypes.object.isRequired,
  }*/

  constructor(props) {
    super(props);

    this.state = {
      modalOpen:false,
      currentModal:undefined,
      renamingItem:undefined,
      notifications: []
    };

    this.decoratedActions = props.decoratedActions ? Object.assign({}, actions, props.decoratedActions) : actions;
  }

  componentWillUnmount() {
    this.removeKeyboardListeners();
  }

  /*notificationsTick = () => {

    console.log('notificationsTick!');
    try {
      this.setState({
        notifications: this.state.notifications.shift()
      })
    } catch(e) {}
  }*/

  handleKeyboardFilter = (event) => {
    console.log('handleKeyboardFilter', event);
    const root = this.getEurekaRoot();
    try {
      root.querySelector('input[name="eureka__filter"]').focus();
    } catch (e) { }
  }

  handleKeyboardSortAscending = (event) => {
    event.preventDefault();
    store.dispatch(actions.updateView({
      sort: {
        dir: utility.ASCENDING
      }
    }))
  }

  handleNotificationDismissed = (id) => {
    //console.log(`notification ${id} dismiessed`)
    store.dispatch(actions.archiveNotification(id))
  }

  handleKeyboardSortDescending = (event) => {
    event.preventDefault();
    store.dispatch(actions.updateView({
      sort: {
        dir: utility.DESCENDING
      }
    }))
  }

  handleKeyboardSortName = (event) => {
    store.dispatch(actions.updateView({
      sort: {
        by: 'filename'
      }
    }))
  }

  handleKeyboardSortDimensions = (event) => {
    store.dispatch(actions.updateView({
      sort: {
        by: 'dimensions'
      }
    }))
  }

  handleKeyboardSortFileSize = (event) => {
    store.dispatch(actions.updateView({
      sort: {
        by: 'fileSize'
      }
    }))
  }

  handleKeyboardSortEditedOn = (event) => {
    store.dispatch(actions.updateView({
      sort: {
        by: 'editedOn'
      }
    }))
  }

  assignKeyboardListeners() {
    Mousetrap.bind(['ctrl+;'], this.toggleSourceTreeOpen);
    Mousetrap.bind(['ctrl+alt+1', 'ctrl+alt+2', 'ctrl+alt+3', 'ctrl+alt+4'], this.handleKeyboardChangeView);
    Mousetrap.bind(['alt+0', 'alt+1', 'alt+2', 'alt+3', 'alt+4', 'alt+5', 'alt+6', 'alt+7', 'alt+8', 'alt+9'], this.handleKeyboardChangeSource);
    Mousetrap.bind(['ctrl+u'], this.handleKeyboardUpload);
    Mousetrap.bind(['ctrl+n'], this.handleKeyboardCreateDirectory);
    Mousetrap.bind(['ctrl+f'], this.handleKeyboardFilter);
    Mousetrap.bind(['alt+up'], this.handleKeyboardSortAscending);
    Mousetrap.bind(['alt+down'], this.handleKeyboardSortDescending);

    Mousetrap.bind(['alt+n'], this.handleKeyboardSortName);
    Mousetrap.bind(['alt+d'], this.handleKeyboardSortDimensions);
    Mousetrap.bind(['alt+f'], this.handleKeyboardSortFileSize);
    Mousetrap.bind(['alt+e'], this.handleKeyboardSortEditedOn);


    if(this.props.config.handlers && this.props.config.handlers.createFile) Mousetrap.bind(['ctrl+shift+n'], this.handleKeyboardCreateFile);
  }

  removeKeyboardListeners() {
    Mousetrap.unbind(['ctrl+;'], this.toggleSourceTreeOpen);
    Mousetrap.unbind(['ctrl+alt+1', 'ctrl+alt+2', 'ctrl+alt+3', 'ctrl+alt+4'], this.handleKeyboardChangeView);
    Mousetrap.unbind(['alt+0', 'alt+1', 'alt+2', 'alt+3', 'alt+4', 'alt+5', 'alt+6', 'alt+7', 'alt+8', 'alt+9'], this.handleKeyboardChangeSource);
    Mousetrap.unbind(['ctrl+u'], this.handleKeyboardUpload);
    Mousetrap.unbind(['ctrl+n'], this.handleKeyboardCreateDirectory);
    Mousetrap.unbind(['ctrl+f'], this.handleKeyboardFilter);
    Mousetrap.unbind(['alt+up'], this.handleKeyboardSortAscending);
    Mousetrap.unbind(['alt+down'], this.handleKeyboardSortDescending);

    Mousetrap.unbind(['alt+n'], this.handleKeyboardSortName);
    Mousetrap.unbind(['alt+d'], this.handleKeyboardSortDimensions);
    Mousetrap.unbind(['alt+f'], this.handleKeyboardSortFileSize);
    Mousetrap.unbind(['alt+e'], this.handleKeyboardSortEditedOn);

    if(this.props.config.handlers && this.props.config.handlers.createFile) Mousetrap.unbind(['ctrl+shift+n'], this.handleKeyboardCreateFile);
  }

  toggleSourceTreeOpen = (event) => {
    store.dispatch(this.decoratedActions.updateView({
      sourceTreeOpen: !this.props.view.sourceTreeOpen
    }));
  }

  handleKeyboardCreateDirectory = (event) => {
    //console.log('handleKeyboardCreateDirectory', event);
    this.onCreateDirectory();
  }

  handleKeyboardCreateFile = (event) => {
    //console.log('handleKeyboardCreateFile', event);
    try {
      const createFileHander = this.props.config.handlers.createFile(this.props.source.currentSource, this.props.content.cd);
      if(createFileHander.onClick) createFileHander.onClick(this.props.source.currentSource, this.props.content.cd);
      else window.open(createFileHander.href);
    } catch(e) { }
  }

  getEurekaRoot() {
    try {
      return event.target.closest('.eureka-root');
    } catch(e) {
      return document.querySelector('.eureka-root');
    }
  }

  handleKeyboardUpload = (event) => {
    //console.log('handleKeyboardUpload', event);
    const root = this.getEurekaRoot();

    try {
      root.querySelector('.eureka__drop-area-zone').click();
    } catch (e) {
      root.querySelector('input[name="eureka__uploadFiles"]').click();
    }
  }

  handleKeyboardChangeSource = (event) => {
    //console.log('handleKeyboardChangeSource', event);
    const props = this.props,
    state = store.getState(),
    decoratedActions = this.decoratedActions,
    sources = state.source.sources;

    let matchedSource;
    sources.map((source) => {
      if(`Digit${source.id}`.toLowerCase() == event.code.toLowerCase()) matchedSource = source;
    });
    if(matchedSource) {
      props.dispatch(decoratedActions.updateSource(
        matchedSource.id
      ));
      props.dispatch(decoratedActions.updateSourceTree(
        matchedSource.id,
        props.config.headers
      ));
    }
  }

  handleKeyboardChangeView = (event) => {
    //console.log('handleKeyboardChangeView', event);
    switch(event.key) {
      case '1':
      store.dispatch(this.decoratedActions.updateView({
        mode: 'table'
      }));
      break;

      case '2':
      store.dispatch(this.decoratedActions.updateView({
        mode: 'thumb'
      }));
      break;

      case '3':
      store.dispatch(this.decoratedActions.updateView({
        mode: 'grid'
      }));
      break;

      case '4':
      store.dispatch(this.decoratedActions.updateView({
        mode: 'list'
      }));
      break;
    }
  }

  componentDidMount() {
    const props = this.props,
    decoratedActions = this.decoratedActions;

    this.assignKeyboardListeners();

    store.dispatch(decoratedActions.fetchMediaSources(props.config.headers)).then(() => { // hit the server and get the media sources
      store.dispatch(decoratedActions.updateSourceTree(this.props.source.sources[0].id), props.config.headers).then((content) => { // then hit server for the directory tree of the first (default) media source
        const props = this.props;

        store.dispatch(decoratedActions.updateContent({ // updates the "current directory" of the view right away
          cd: props.content.cd
        }));
        store.dispatch(decoratedActions.fetchDirectoryContents(props.source.currentSource, { // asyncronously fetches the directory contents from the API
          path: props.content.cd
        }, props.config.headers));

        if(props.view.intervals.fetchDirectoryContents !== undefined && props.view.intervals.fetchDirectoryContents > 0) {
          setInterval(() => { // every so often hit the server and update the displayed contents of the current directory
            const state = store.getState();
            const props = this.props;

            store.dispatch(decoratedActions.updateContent({ // updates the "current directory" of the view right away
              cd: props.content.cd
            }));
            store.dispatch(decoratedActions.fetchDirectoryContents(props.source.currentSource, { // asyncronously fetches the directory contents from the API
              path: props.content.cd
            }, props.config.headers));

          }, props.view.intervals.fetchDirectoryContents);
        }

        if(props.view.intervals.updateSourceTree !== undefined && props.view.intervals.updateSourceTree > 0) { // hit the server and get the (top-level-ish) directory tree of the current source
          setInterval(() => {
            store.dispatch(decoratedActions.updateSourceTree(props.source.currentSource, props.config.headers));
          }, props.view.intervals.updateSourceTree);
        }
      });

      if(props.config.alwaysWelcome || (props.config.welcome && localStorage.getItem(`${props.storagePrefix}welcome`) !== 'false')) {
        setTimeout(() => {
          store.dispatch(actions.notify('Welcome to Eureka. You found it.', undefined, props.config.learnMore, 26000));
          localStorage.setItem(`${props.storagePrefix}welcome`, 'false');
        }, 2400);
      }

    });

    document.body.addEventListener('keyup', (event) => {
      const key = event.keyCode || event.charCode || 0;
      //console.log(key);
      switch(key) {
        case 27: // Escape
        this.setState({
          modalOpen:false,
          currentModal:undefined
        });
        break;
      }
    });
  }

  onCreateDirectory() {
    //console.log('onCreateDirectory');
    this.setState({
      modalOpen:true,
      currentModal:CREATE_DIRECTORY
    })
  }

  onModalCancel(event) {
    event.preventDefault();
    //console.log('onModalCancel');
    this.setState({
      modalOpen:false,
      currentModal:undefined
    });
  }

  onModalSubmit(createDirectory) {
    const decoratedActions = this.decoratedActions;
    const props = this.props;
    //event.preventDefault();
    //console.log('onModalSubmit',createDirectory);

    switch(this.state.currentModal) {
      case CREATE_DIRECTORY:
      console.log(store.getState().content.cd, path.join(store.getState().content.cd, 'foo'));
      store.dispatch(decoratedActions.createDirectory(store.getState().source.currentSource, path.join(store.getState().content.cd, createDirectory))).then(() => {
        this.setState({
          modalOpen:false,
          currentModal:undefined
        });
      }).then(() => {
        store.dispatch(decoratedActions.fetchDirectoryContents(props.source.currentSource, { // asyncronously fetches the directory contents from the API
          path:store.getState().content.cd
        }, props.config.headers));
      });
      break;

      case RENAME_ITEM:
      console.log()
      break;
    }
  }

  onRenameItemModalSubmit(newName, item) {
    //console.log('onRenameItemModalSubmit!!!', newName, item);
    //console.log(item.path);
    const decoratedActions = this.decoratedActions;
    const dir = (() => {
      try { // this is bullshit webpack isn't including the parse method with the Node path module
        return path.parse(item.path).dir;
      } catch(e) {
        //console.log('oh crap', item.path);
        console.log(e);
        return pathParse(item.path).dir;
      }
    })();

    store.dispatch(decoratedActions.renameItem(this.props.source.currentSource, item.path, newName, this.props.config.headers)).then((results) => {
      //console.log('results!!!', results);
      store.dispatch(decoratedActions.updateContent({contents:results.contents.filter((file) => (
        file.filename
      ))}));
      this.setState({
        renamingItem:undefined,
        modalOpen:false,
        currentModal:undefined
      });
    });
  }

  onRenameItem(item) {
    //console.log('onRenameItem', item);
    this.setState({
      renamingItem: item,
      modalOpen: true,
      currentModal: RENAME_ITEM
    });
  }

  render() {
    const props = this.props,
    state = this.state,
    modalOpen = false,
    { formatMessage, formatDate } = this.props.intl,
    createDirectoryMessage = formatMessage(definedMessages.directory),
    renameItemMessage = formatMessage(definedMessages.rename, {
      item:(state.renamingItem) ? ` ${state.renamingItem.filename}` : ''
    });

    //console.log('state.notifications', state.notifications);

    const modal = (() => {
      if(state.modalOpen) {
        switch(state.currentModal) {
          case CREATE_DIRECTORY:
          return (
            <Modal onCancel={this.onModalCancel.bind(this)} onSubmit={this.onModalSubmit.bind(this)} title={createDirectoryMessage} {...props}>
              <ModalCreateDirectoryForm {...props} />
            </Modal>
          );
          break;

          case RENAME_ITEM:
          return (
            <Modal onCancel={this.onModalCancel.bind(this)} onSubmit={this.onRenameItemModalSubmit.bind(this)} title={renameItemMessage} {...props}>
              <ModalRenameItemForm {...props} item={state.renamingItem} />
            </Modal>
          );
          break;

          default:
          return undefined;
          break;
        }
      }
      //(state.modalOpen) ? <Modal onCancel={this.onModalCancel.bind(this)} onSubmit={this.onModalSubmit.bind(this)} title="Create Directory" {...props}><ModalCreateDirectoryForm {...props} /></Modal> : undefined
    })();

    const dropArea = (props.config.allowUploads && props.config.doDragNDrop) ? <DropArea {...props} /> : undefined;

    const pathbrowser = (!utility.serverSideRendering) ? (
      <div hidden={!props.view.sourceTreeOpen} aria-hidden={!props.view.sourceTreeOpen} id="eureka__pathbrowser" className="eureka__pathbrowser">
        <MediaSourceSelector {...props} />
        <FileTree {...props} onCreateDirectory={this.onCreateDirectory.bind(this)} />
        {dropArea}
        <TreeBar onCreateDirectory={this.onCreateDirectory.bind(this)} {...props} />
      </div>
    ) : undefined;

    const mediaDirectorySelector = (!props.view.sourceTreeOpen) ? (
      <MediaDirectorySelector {...props} />
    ) : undefined;

    const uploadForm = (!props.view.sourceTreeOpen && props.config.allowUploads) ? (
      <UploadForm {...props} />
    ) : undefined;

    const pathBar = (props.view.focusedMediaItem) ? (
      <PathBar {...props} />
    ) : undefined;

    const unarchivedNotifications = (this.props.notifications) ? this.props.notifications.filter((notification) => (
      !notification.archived
    )) : [];

    const notificationMessage = (
      () => {
        try {
          return (
            unarchivedNotifications[0]
          )
        } catch(e) {
          return undefined;
        }
      }
    )();

    console.log('notificationMessage', notificationMessage)
    const notification = (notificationMessage) ? <Notification key={notificationMessage.id} onDismiss={this.handleNotificationDismissed} {...notificationMessage} {...props}  /> : undefined;

    const shouldDisplayChooseBar = (() => {
      try {
        if(props.config.callbacks.choose) return true;
      } catch(e) { return false }
    })();

    const treeToggle = (!utility.serverSideRendering) ? <TreeToggle {...props} /> : undefined;
    const viewChooser = (!utility.serverSideRendering) ? <ViewChooser {...props} /> : undefined;
    const chooseBar = (shouldDisplayChooseBar) ? <ChooseBar ariaHidden={state.modalOpen} {...props} /> : undefined;
    const enlargeFocusedRows = (props.view.enlargeFocusedRows) ? ' eureka__enlarge-focused-rows' : '';
    const searchBar = (!utility.serverSideRendering) ? <SearchBar {...props} /> : undefined;
    const serverSideClass = (utility.serverSideRendering) ? ' eureka__server-side' : '';
    const sortContentsSelector = (!utility.serverSideRendering) ? (
      <SortContents {...props} sort={props.view.sort} />
    ) : undefined;
    const formDiv = (
      <div aria-hidden={state.modalOpen} className={classNames({
        "eureka__browse-content": true,
        "eureka__uploading": props.view.isUploading
      })}>
        {pathbrowser}
        <div className="eureka__stage">
          <div className="eureka__stage__filter-view">
            <header>
              <h2>
                <span className="visually-hidden"><FormattedMessage id="media.browse" defaultMessage="Browse" /> </span><FormattedMessage id="media.contents" defaultMessage="Media Content" />
              </h2>
              {searchBar}
            </header>
            <div role="menubar" className="eureka__tree-toggle">
              {treeToggle}
                {mediaDirectorySelector}
                {sortContentsSelector}
                {uploadForm}
              {viewChooser}
            </div>
          </div>
          <div className="eureka__table-wrapper">
            <EurekaTable view={props.view} {...props} decoratedActions={props.decoratedActions} source={props.source} content={props.content} config={props.config} onRenameItem={this.onRenameItem.bind(this)} onSubmit={this.onRenameItemModalSubmit.bind(this)} />
          </div>
        </div>
      </div>
    );

    return (utility.serverSideRendering) ? (
      <form lang={props.lang || undefined} method="POST" action={props.config.basePath} encType="multipart/form-data" className={`eureka eureka__view-mode__${props.view.mode}${enlargeFocusedRows}${serverSideClass}`}>
        {formDiv}
        {pathBar}
        {chooseBar}
        {modal}
      </form>
    ) : (
      <div role="widget" lang={props.lang || undefined} className={`eureka eureka__view-mode__${props.view.mode}${enlargeFocusedRows}${serverSideClass}`}>
        <div className="eureka__sticky-bar" aria-live="polite" aria-atomic="true">{notification}</div>
        {formDiv}
        {pathBar}
        {chooseBar}
        {modal}
      </div>
    );
  }
}

export default Eureka;
