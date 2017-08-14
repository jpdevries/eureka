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
import ModalCropItemForm from './components/ModalCropItemForm';
import ModalRenameItemForm from './components/ModalRenameItemForm';
import SortContents from './components/SortContents';
import Icon from './components/Icon';
import Notification from './components/Notification';
import ChooseRadio from './components/ChooseRadio';

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
const CROP_ITEM = 'crop_item';



//Notification.propTypes = { initialCount: React.PropTypes.number };
//Notification.defaultProps = { initialCount: 0 };


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
      notifications: [],
      stickyNotifications: true
    };

    this.decoratedActions = props.decoratedActions ? Object.assign({}, actions, props.decoratedActions) : actions;
    console.log('this.decoratedActions', this.decoratedActions);
  }

  componentWillUnmount() {
    this.removeKeyboardListeners();
  }

  componentWillUpdate(nextProps, nextState) {
    try {
      //console.log('nextProps.notifications', nextProps.notifications);
      const unarchivedNotifications = nextProps.notifications.filter((notification) => (
        !notification.archived
      ));
      //console.log('unarchivedNotifications', unarchivedNotifications);
      //console.log('nextProps.notifications[0].sticky', unarchivedNotifications[0].sticky);
      //console.log('does it', this.state.stickyNotifications === unarchivedNotifications[0].sticky, this.state.stickyNotifications, unarchivedNotifications[0].sticky);
      if(this.state.stickyNotifications === unarchivedNotifications[0].sticky) return;

      this.setState({
        stickyNotifications: unarchivedNotifications[0].sticky
      })
    } catch(e) { }
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
    //console.log('handleKeyboardFilter', event);
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

  handleKeyboardChooseSingle = (event) => {
    store.dispatch(actions.updateView({
      chooseMultiple: false
    }))
  }

  handleKeyboardChooseMultiple = (event) => {
    store.dispatch(actions.updateView({
      chooseMultiple: true
    }))
  }

  handleKeyboardToggleInvertSelection = (event) => {
    if(!this.props.view.chooseMultiple) return;
    store.dispatch(actions.updateView({
      selectionInverted: !this.props.view.selectionInverted
    }))
  }

  handleKeyboardDeselect = (event) => {
    console.log('handleKeyboardDeselect');

    store.dispatch(actions.deselectAll());
  }

  /*handleKeyboardDeselect = (event) => {
    console.log('handleKeyboardDeselect');
    const toUncheck = this.getEurekaRoot().querySelectorAll('.eureka__td-media input[type="checkbox"]:checked');
    console.log('toUncheck', toUncheck);
    for(let i = 0; i < toUncheck.length; i++) {
      toUncheck[i].click();
    }

    store.dispatch(actions.updateContent({
      chosenMediaItems: [],
      chosenMediaItemsInverted: []
    }));
  }*/

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

    Mousetrap.bind(['alt+s'], this.handleKeyboardChooseSingle);
    Mousetrap.bind(['alt+m'], this.handleKeyboardChooseMultiple);
    Mousetrap.bind(['alt+i'], this.handleKeyboardToggleInvertSelection);
    Mousetrap.bind(['alt+z'], this.handleKeyboardDeselect);


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

    Mousetrap.unbind(['alt+s'], this.handleKeyboardChooseSingle);
    Mousetrap.unbind(['alt+m'], this.handleKeyboardChooseMultiple);
    Mousetrap.unbind(['alt+i'], this.handleKeyboardToggleInvertSelection);
    Mousetrap.unbind(['alt+z'], this.handleKeyboardDeselect);

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
    decoratedActions = this.decoratedActions,
    { formatMessage, formatPlural } = props.intl;

    console.log('decoratedActions', decoratedActions);

    this.assignKeyboardListeners();

    store.dispatch(decoratedActions.fetchMediaSources(props.config.headers)).then(() => { // hit the server and get the media sources
      //console.log('got media sources fetching source tree for', this.props.source.sources[0].id);
      store.dispatch(decoratedActions.updateSourceTree(this.props.source.currentSource || this.props.source.sources[0].id), props.config.headers).then((content) => { // then hit server for the directory tree of the first (default) media source
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
            console.log('updating source tree');
            store.dispatch(decoratedActions.updateSourceTree(props.source.currentSource, props.config.headers));
          }, props.view.intervals.updateSourceTree);
        }
      });



      if(props.config.alwaysWelcome || (props.config.welcome && localStorage.getItem(`${props.storagePrefix}welcome`) !== 'false')) {
        const wecomeToEurekaMessage = formatMessage(definedMessages.welcomeToEureka);
        setTimeout(() => {
          //message, notificationType, learnMore, dismissAfter, sticky = true
          store.dispatch(actions.notify(wecomeToEurekaMessage, undefined, props.config.learnMore, false, false));
          localStorage.setItem(`${props.storagePrefix}welcome`, 'false');
        }, 420);
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
    store.dispatch(actions.updateView({
      isCropping: false
    }));
    try {
      event.preventDefault();
    } catch(e) {}
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
    const props = this.props;
    console.log('onRenameItemModalSubmit!!!', newName, item);
    //console.log(item);
    const decoratedActions = this.decoratedActions;
    const dir = (() => {
      try { // this is weird webpack isn't including the parse method with the Node path module
        return path.parse(item.path || item.cd).dir;
      } catch(e) {
        //console.log('oh crap', item.path);
        console.log(e);
        return pathParse(item.path || item.cd).dir;
      }
    })();

    const renameItem = (item.filename) ? decoratedActions.renameItem : decoratedActions.renameDirectory;

    store.dispatch(renameItem(this.props.source.currentSource, item.path || item.cd, newName, this.props.config.headers)).then((results) => {
      if(!item.filename) {
        console.log(dir);
        /*store.dispatch(decoratedActions.updateContent({contents:results.contents.filter((file) => (
          file.filename
        ))}));*/
        /*store.dispatch(decoratedActions.updateSourceTree(this.props.source.currentSource, this.props.config.headers)).then((content) => {
          console.log(content);
        })*/
        /*store.dispatch(decoratedActions.updateContent({ // updates the "current directory" of the view right away
          cd: item.cd
        }));*/
        console.log('fetching, ' + dir);
        store.dispatch(decoratedActions.fetchDirectoryContents(props.source.currentSource, { // asyncronously fetches the directory contents from the API
          path:dir
        }, props.config.headers)).then(() => {
          console.log('all done', props.content.cd, item, newName);
          if(props.content.cd === item.cd) {
            console.log('they equal', path.join(dir, newName));
            store.dispatch(decoratedActions.updateContent({
              cd: path.join(dir, newName)
            }));

            store.dispatch(decoratedActions.fetchDirectoryContents(props.source.currentSource, { // asyncronously fetches the directory contents from the API
              path: path.join(dir, newName)
            }, props.config.headers));

            store.dispatch(decoratedActions.updateSourceTree(props.source.currentSource, props.config.headers));

            /*if(results.contents !== undefined) store.dispatch(decoratedActions.updateContent({contents:results.contents.filter((file) => (
              file.filename
            ))}));*/

          }
        });
      } else {
        console.log('updating contents with result contents');
        if(results.contents !== undefined) store.dispatch(decoratedActions.updateContent({contents:results.contents.filter((file) => (
          file.filename
        ))}));
      }

      this.setState({
        renamingItem:undefined,
        modalOpen:false,
        currentModal:undefined
      });
    });
  }

  onCropItemModalSubmit(item) {
    console.log('onCropItemModalSubmit', item);
  }

  onRenameItem(item) {
    console.log('onRenameItem', item);
    this.setState({
      renamingItem: item,
      modalOpen: true,
      currentModal: RENAME_ITEM
    });
  }

  onCropItem(item) {
    this.setState({
      renamingItem: item,
      modalOpen: true,
      currentModal: CROP_ITEM
    });
  }

  render() {
    const props = this.props,
    state = this.state,
    modalOpen = false,
    { formatMessage, formatDate } = this.props.intl,
    createDirectoryMessage = formatMessage(definedMessages.directory),
    renameItemMessage = formatMessage(definedMessages.renameItem, {
      item:(state.renamingItem) ? ` ${state.renamingItem.filename}` : ''
    }),
    cropItemMessage = formatMessage(definedMessages.cropItem, {
      item: ` `
    }),
    croppingItemMessage = formatMessage(definedMessages.croppingItem, {
      item: (() => {
        try {
          return props.view.focusedMediaItem.filename
        } catch (e) {
          return undefined
        }
      })()
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

          case CROP_ITEM:
          return (
            <Modal className="eureka__greedy eureka__crop-modal" showSpinner={props.view.isCropping} onCancel={this.onModalCancel.bind(this)} onSubmit={this.onCropItemModalSubmit.bind(this)} title={croppingItemMessage} {...props}>
              <ModalCropItemForm  {...props} item={props.view.focusedMediaItem} />
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

    const dropArea = (props.config.allowUploads && props.config.doDragNDrop) ? <DropArea {...props}  /> : undefined;

    const pathbrowser = (!utility.serverSideRendering) ? (
      <div hidden={!props.view.sourceTreeOpen} aria-hidden={!props.view.sourceTreeOpen} id="eureka__pathbrowser" className="eureka__pathbrowser">
        <MediaSourceSelector {...props} />
        <FileTree {...props} onCreateDirectory={this.onCreateDirectory.bind(this)} onRenameItem={this.onRenameItem.bind(this)} />
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
    const chooseMultipleClass = (props.view.chooseMultiple) ? ' eureka__choose-multiple' : '';
    const searchBar = (!utility.serverSideRendering) ? <SearchBar {...props} /> : undefined;
    const serverSideClass = (utility.serverSideRendering) ? ' eureka__server-side' : '';
    const chooseRadio = (props.config.allowChooseMultiple && !utility.serverSideRendering) ? <ChooseRadio config={props.config} view={props.view} content={props.content} storagePrefix={props.storagePrefix} /> : undefined;
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
              {chooseRadio}
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
            <EurekaTable view={props.view} {...props} decoratedActions={props.decoratedActions} source={props.source} content={props.content} config={props.config} onCropItem={this.onCropItem.bind(this)} onRenameItem={this.onRenameItem.bind(this)} onSubmit={this.onRenameItemModalSubmit.bind(this)} />
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
      <div onPaste={(event) => {
        if (event.clipboardData) {
          var items = event.clipboardData.items;
			    if (!items || event.target.matches('input') || event.target.matches('textarea')) return;

          //access data directly
    			for (var i = 0; i < items.length; i++) {
    				if (items[i].type.indexOf("image") !== -1) {
    					//image
    					const blob = items[i].getAsFile();

              const formData = new FormData();
              const decoratedActions = props.decoratedActions ? Object.assign({}, actions, props.decoratedActions) : actions;
              formData.append('eureka__uploadFiles', blob, `paste-image.${new Date().getTime()}.png`);
              store.dispatch(decoratedActions.uploadFiles(props.source.currentSource, props.content.cd, formData, props.config.headers));
    				}
    			}

        }


      }} lang={props.lang || undefined} className={`eureka eureka__view-mode__${props.view.mode}${chooseMultipleClass}${enlargeFocusedRows}${serverSideClass}`}>
        <div className={classNames({
          "eureka__sticky-bar": this.state.stickyNotifications
        })} aria-live="assertive" aria-relevant="additions" aria-atomic="true" onClick={(event) => {
          event.currentTarget.querySelector('button').click()
        }}>{notification}</div>
        {formDiv}
        {pathBar}
        {chooseBar}
        {modal}
      </div>
    );
  }
}



export default Eureka;
