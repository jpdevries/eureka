import React, { Component, PropTypes } from 'react';
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

import {formatMessage} from 'react-intl';

const path = require('path');

const pathParse = require('path-parse');



import store from './model/store';
import actions from './model/actions';
import utility from './utility/utility';

import { FormattedMessage, FormattedPlural, FormattedNumber, FormattedRelative, defineMessages } from 'react-intl';
import definedMessages from './i18n/definedMessages';

const CREATE_DIRECTORY = 'create_directory';
const RENAME_ITEM = 'rename_item';



class Eureka extends Component {
  /*static propTypes = {
    intl: PropTypes.object.isRequired,
  }*/

  constructor(props) {
    super(props);
    this.state = {
      modalOpen:false,
      currentModal:undefined,
      renamingItem:undefined
    };
    this.decoratedActions = props.decoratedActions ? Object.assign({}, actions, props.decoratedActions) : actions;
  }
  componentDidMount() {
    const props = this.props;
    const decoratedActions = this.decoratedActions;
    store.dispatch(decoratedActions.fetchMediaSources()).then(() => { // hit the server and get the media sources
      store.dispatch(decoratedActions.updateSourceTree(this.props.source.sources[0].id)).then((content) => { // then hit server for the directory tree of the first (default) media source
        const props = this.props;

        store.dispatch(decoratedActions.updateContent({ // updates the "current directory" of the view right away
          cd: props.content.cd
        }));
        store.dispatch(decoratedActions.fetchDirectoryContents(props.source.currentSource, { // asyncronously fetches the directory contents from the API
          path: props.content.cd
        }));

        if(props.view.intervals.fetchDirectoryContents !== undefined && props.view.intervals.fetchDirectoryContents > 0) {
          setInterval(() => { // every so often hit the server and update the displayed contents of the current directory
            const state = store.getState();
            const props = this.props;

            store.dispatch(decoratedActions.updateContent({ // updates the "current directory" of the view right away
              cd: props.content.cd
            }));
            store.dispatch(decoratedActions.fetchDirectoryContents(props.source.currentSource, { // asyncronously fetches the directory contents from the API
              path: props.content.cd
            }));

          }, props.view.intervals.fetchDirectoryContents);
        }

        if(props.view.intervals.updateSourceTree !== undefined && props.view.intervals.updateSourceTree > 0) { // hit the server and get the (top-level-ish) directory tree of the current source
          setInterval(() => {
            store.dispatch(decoratedActions.updateSourceTree(props.source.currentSource));
          }, props.view.intervals.updateSourceTree);
        }
      });
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
    console.log('onCreateDirectory');
    this.setState({
      modalOpen:true,
      currentModal:CREATE_DIRECTORY
    })
  }

  onModalCancel(event) {
    event.preventDefault();
    console.log('onModalCancel');
    this.setState({
      modalOpen:false,
      currentModal:undefined
    });
  }

  onModalSubmit(createDirectory) {
    const decoratedActions = this.decoratedActions;
    const props = this.props;
    event.preventDefault();
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
        }));
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

    store.dispatch(decoratedActions.renameItem(this.props.source.currentSource, item.path, newName)).then((results) => {
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
      renamingItem:item,
      modalOpen:true,
      currentModal:RENAME_ITEM
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

    const dropArea = (props.config.allowUploads) ? <DropArea {...props} /> : undefined;

    const pathbrowser = (props.view.sourceTreeOpen && !utility.serverSideRendering) ? (
      <div id="eureka__pathbrowser" className="eureka__pathbrowser">
        <MediaSourceSelector {...props} />
        <FileTree {...props} />
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
    const formDiv = (
      <div aria-hidden={state.modalOpen} className="eureka__browse-content">
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
                {uploadForm}
              {viewChooser}
            </div>
          </div>
          <div className="eureka__table-wrapper">
            <EurekaTable {...props} onRenameItem={this.onRenameItem.bind(this)} onSubmit={this.onRenameItemModalSubmit.bind(this)} />
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
        {formDiv}
        {pathBar}
        {chooseBar}
        {modal}
      </div>
    );
  }
}

export default Eureka;
