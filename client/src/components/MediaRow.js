import React from 'react';

import filesize from 'filesize';

import ContextMenu from './ContextMenu';

const Entities = require('html-entities').AllHtmlEntities;

const MediaRow = (props) => {

  const entities = new Entities();
  const item = props.item;
  const index = props.index;

  const ariaLabel = `${props.item.filename} displays at ${props.item.dimensions.join('x')}, weighs ${filesize(props.item.fileSize, {round: 0})}, and was edited on ${new Date(props.item.editedOn).toLocaleString(props.view.locale,{ weekday:'long', year: 'numeric', month: 'long', day: '2-digit', timeZoneName: 'long' })}`;

  function shouldHide(item) {

    try {
      //console.log('shouldHide',props.view.focusedMediaItem.absolutePath,item.absolutePath,props.view.focusedMediaItem.absolutePath !== item.absolutePath);
      return props.view.focusedMediaItem.absolutePath !== item.absolutePath
    } catch(e) {
      //console.log('shouldHide',true);
      return true;
    }
  }

  const contentEditable = false;

  return (
    <tr aria-label={ariaLabel} role="row" tabIndex="0" onFocus={props.onFocus.bind(this)} contextMenu={`context_menu__tbody-${props.index}`}>
      <td title={ariaLabel} className="eureka__td-media" onDoubleClick={(event) => {
          console.log(event, props.item);
      }}>
        <img src={props.item.absoluteURL}  alt="" />
      </td>
      <td contentEditable={contentEditable} onBlur={(event) => {
          try {
            if(!entities.decode(event.target.innerHTML).trim()) {
              event.target.innerHTML = props.item.filename;
              //alert('file name cannot be empty'); // i mostly hate alerts
              throw new Error('file name cannot be empty');
            }

            console.log(event.target.innerHTML, event.target.innerHTML.trim());
            console.log('test', entities.decode('&lt;&nbsp;&gt;&quot;&apos;&amp;&copy;&reg;&#8710;'));
            console.log('props.item!', props.item);
            props.onRenameItemModalSubmit(entities.decode(event.target.innerHTML.trim()), props.item);
          } catch (e) {
            console.log(e);
          }
        }}
        onKeyUp={(event) => {
           console.log('onKeyUp', event);
         }}
         onKeyDown={(event) => {
            console.log('onKeyDown', event, event.keyCode);
            if(event.keyCode === 13) {
              event.preventDefault();
              event.target.blur();
            }
         }}
         onPaste={(event) => {
            console.log('onPaste', event);
         }}
         onCopy={(event) => {
            console.log('onCopy', event);
         }}
         onCut={(event) => {
            console.log('onCut', event);
         }}
         >
        {props.item.filename}
      </td>
      <ContextMenu className="eureka__context-row" {...props} item={item}  hidden={shouldHide(item)} key={`cm__${index}`} />
      <td>
        {`${props.item.dimensions[0]}x${props.item.dimensions[1]}`}
      </td>
      <td>
        {filesize(props.item.fileSize)}
      </td>
      <td title={new Date(props.item.editedOn).toLocaleString(props.view.locale,{ weekday:'long', year: 'numeric', month: 'long', day: '2-digit', timeZoneName: 'long' })}>
      {new Date(props.item.editedOn).toLocaleString(props.view.locale,{ year: '2-digit', month: '2-digit', day: '2-digit' })}
      </td>
    </tr>
  );
}

export default MediaRow;
