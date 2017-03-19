import React, { Component } from 'react';

import store from '../model/store';
import actions from '../model/actions';

import Icon from './Icon';

class FileTreeSpan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editable:false
    };
  }

  render() {
    const state = this.state;
    const props = this.props;
    const item = props.item;

    return (
      <span ref={(span) => (this.span = span)} contentEditable={state.editable} onClick={(event) => {
          event.preventDefault();
          //event.stopPropagation();
          store.dispatch(actions.updateContent({ // updates the "current directory" of the view right away
            cd: item.cd
          }));
          store.dispatch(actions.fetchDirectoryContents(props.source.currentSource, { // asyncronously fetches the directory contents from the API
            dir:item.cd
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

  function listTree(tree) {
    return tree.map((item, index) => (
      (item.children || true) ? // still deciding if we need this disabled for now
      <details key={index}>
        <summary contextMenu={`context_menu__${item.cd.replace(/^[^a-z]+|[^\w:.-]+/gi, "")}`} className={(props.content.cd === item.cd) ? 'active' : undefined}>
          <Icon icon="folder" />
          <Icon icon="folder-open" />
          <FileTreeSpan {...props} item={item} index={index} key={index} />

          <menu hidden="true" type="context" id={`context_menu__${item.cd.replace(/^[^a-z]+|[^\w:.-]+/gi, "")}`}>
              <menuitem label="Create Directory Here" onClick={(event) => {
                  
                }}></menuitem>
              <menuitem label="Chmod Directory"></menuitem>
              <menuitem label="Rename"></menuitem>
              <menuitem label="Refresh Directory"></menuitem>
              <hr />
              <menuitem label="Upload Files"></menuitem>
              <menuitem label="Create Files"></menuitem>
              <menuitem label="Quick Create Files"></menuitem>
              <menuitem label="Delete Directory" onClick={(event) => {
                  store.dispatch(actions.deleteMediaItem(props.source.currentSource, item.cd))
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

  const contentList = listTree(props.tree);

  return (
    <nav className="eureka__tree">
      {contentList}
    </nav>
  );
}

export default FileTree;
