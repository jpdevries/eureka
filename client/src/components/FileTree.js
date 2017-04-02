import React, { Component } from 'react';

import store from '../model/store';
import actions from '../model/actions';

import Icon from './Icon';

import definedMessages from '../i18n/definedMessages';

class FileTreeSpan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editable:false
    };
    this.decoratedActions = props.decoratedActions ? Object.assign({}, actions, props.decoratedActions) : actions;
  }

  render() {
    const state = this.state,
    props = this.props,
    item = props.item;

    const decoratedActions = this.decoratedActions;

    return (
      <span ref={(span) => (this.span = span)} contentEditable={state.editable} onClick={(event) => {
          event.preventDefault();
          //event.stopPropagation();
          store.dispatch(decoratedActions.updateContent({ // updates the "current directory" of the view right away
            cd: item.cd
          }));
          store.dispatch(decoratedActions.fetchDirectoryContents(props.source.currentSource, { // asyncronously fetches the directory contents from the API
            path:item.cd
          }));
        }}
        onDoubleClick={(event) => {
          this.setState({
            editable:!state.editable
          });
          if(!state.editable) this.span.focus();
          else this.span.blur();
          //if(!state.editable)
        }}
        onKeyDown={(event) => {
           console.log('onKeyDown', event, event.keyCode,event.keyCode === 13);
           if(event.keyCode === 13) {
             event.preventDefault();
             event.stopPropagation();
             event.target.blur();
           }
        }}
      >
        {item.name}
      </span>
    );
  }
}

const FileTree = (props) => {

  const decoratedActions = props.decoratedActions ? Object.assign({}, actions, props.decoratedActions) : actions;

  const formatMessage = props.intl.formatMessage,
  chmodDirectoryMessage = formatMessage(definedMessages.chmodDirectory),
  renameMessage = formatMessage(definedMessages.rename),
  refreshDirectoryMessage = formatMessage(definedMessages.refreshDirectory),
  uploadFilesMessage = formatMessage(definedMessages.uploadFiles),
  createFileMessage = formatMessage(definedMessages.createFile),
  quickCreateFileMessage = formatMessage(definedMessages.quickCreateFile),
  deleteDirectoryMessage = formatMessage(definedMessages.deleteDirectory);

  function listTree(tree) {
    function shouldBeOpen(item) {
      console.log('shouldBeOpen', props.content.cd, item.cd, props.content.cd.indexOf(item.cd));
      try {
        return (item.cd == './' || props.content.cd.indexOf(item.cd) === 0) ? true : undefined;
      } catch (e) {
        return undefined;
      }

    }

    return tree.map((item, index) => (
      (item.children || true) ? // still deciding if we need this disabled for now
      <details onToggle={(event) => {
          console.log('TOGGLE!!!', item);
          console.log(event.target.hasAttribute('open'));
        }} key={index} open={shouldBeOpen(item)}>
        <summary contextMenu={`context_menu__${item.cd.replace(/^[^a-z]+|[^\w:.-]+/gi, "")}`} className={(props.content.cd === item.cd) ? 'active' : undefined}>
          <Icon {...props} icon="folder" />
          <Icon {...props} icon="folder-open" />
          <FileTreeSpan {...props} item={item} index={index} key={index} />

          <menu hidden="true" type="context" id={`context_menu__${item.cd.replace(/^[^a-z]+|[^\w:.-]+/gi, "")}`}>
              <menuitem label="Create Directory Here" onClick={(event) => {

                }}></menuitem>
              <menuitem label={chmodDirectoryMessage}></menuitem>
              <menuitem label={renameMessage}></menuitem>
              <menuitem label={refreshDirectoryMessage}></menuitem>
              <hr />
              <menuitem label={uploadFilesMessage}></menuitem>
              <menuitem label={createFileMessage}></menuitem>
              <menuitem label={quickCreateFileMessage}></menuitem>
              <menuitem label={deleteDirectoryMessage} onClick={(event) => {
                  store.dispatch(decoratedActions.deleteMediaItem(props.source.currentSource, item.cd))
                }}></menuitem>
          </menu>

        </summary>
        <div>
          {item.children ? listTree(item.children) : undefined}
        </div>
      </details>
      :
      <span key={index}>{item.name}</span>
    ));
  }

  const contentList = listTree([{
    cd: './',
    name: './',
    children: props.tree
  }]);

  return (
    <nav className="eureka__tree">
      {contentList}
    </nav>
  );
}

export default FileTree;
