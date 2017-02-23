import React from 'react';

import filesize from 'filesize';

const MediaRow = (props) => {
  const ariaLabel = `${props.item.filename} displays at ${props.item.dimensions.join('x')}, weighs ${filesize(props.item.fileSize, {round: 0})}, and was edited on ${new Date(props.item.editedOn).toLocaleString(props.view.locale,{ weekday:'long', year: 'numeric', month: 'long', day: '2-digit', timeZoneName: 'long' })}`;
  return (
    <tr aria-label={ariaLabel} tabIndex="0" onFocus={props.onFocus.bind(this)} contextMenu={`context_menu__tbody-${props.index}`}>
      <td title={ariaLabel} className="eureka__td-media" onDoubleClick={(event) => {
          console.log(event, props.item);
      }}>
        <img src={props.item.absoluteURL}  alt="" /> 
      </td>
      <td contentEditable="true" onBlur={(event) => {
          console.log('blur', event);
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

