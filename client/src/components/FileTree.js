import React from 'react';

import store from '../model/store';
import actions from '../model/actions';

const FileTree = (props) => {
  
  function listTree(tree) {
    return tree.map((item, index) => (
      (item.children || true) ? // still deciding if we need this disabled for now
      <details>
        <summary contextMenu={`context_menu__${item.cd.replace(/^[^a-z]+|[^\w:.-]+/gi, "")}`} className={(props.content.cd === item.cd) ? 'active' : undefined}>
          <svg aria-hidden="true" className="icon icon-folder">
            <use xlinkHref={`assets/img/icons.svg#icon-folder`}></use>
          </svg>
          <svg aria-hidden="true" className="icon icon-folder-open">
            <use xlinkHref={`assets/img/icons.svg#icon-folder-open`}></use>
          </svg>
          <span onClick={(event) => {
            event.preventDefault();
            //event.stopPropagation();
            store.dispatch(actions.updateContent({ // updates the "current directory" of the view right away
              cd: item.cd
            }));
            store.dispatch(actions.fetchDirectoryContents(props.source.currentSource, { // asyncronously fetches the directory contents from the API
              dir:item.cd
            }));
          }}>
            {item.name}
          </span>
        
          <menu hidden="true" type="context" id={`context_menu__${item.cd.replace(/^[^a-z]+|[^\w:.-]+/gi, "")}`}>
              <menuitem label="Create Directory Here" onClick={(event) => {
                  alert('YOLO!')
                }}></menuitem>
              <menuitem label="Chmod Directory"></menuitem>
              <menuitem label="Rename"></menuitem>
              <menuitem label="Refresh Directory"></menuitem>
              <hr />
              <menuitem label="Upload Files"></menuitem>
              <menuitem label="Create Files"></menuitem>
              <menuitem label="Quick Create Files"></menuitem>
              <menuitem label="Delete Directory"></menuitem>
          </menu>
        
        </summary>
        <div>
          {item.children ? listTree(item.children) : undefined}
        </div>
      </details>
      :
      <span>{item.name}</span>
    ));
  }
  
  const contentList = listTree(props.tree);
  
  return (
    <nav>
      {contentList}
    </nav>  
  );
}

export default FileTree;

