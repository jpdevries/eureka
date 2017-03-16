import React from 'react';

import filesize from 'filesize';

import ContextMenu from './ContextMenu';

const Entities = require('html-entities').AllHtmlEntities;

import utility from './../utility/utility';

import path from 'path';

var pathParse = require('path-parse');

import classNames from 'classnames';
import Icon from './Icon';

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

  const media = (function(ext){ // consider abstracting this to its own module
    //console.log(pathParse(props.item.filename).ext,'props.item',props.item);

    switch(ext.toLowerCase()) {
      case '.jpg':
      case '.jpeg':
      case '.gif':
      case '.png':
      case '.png8':
      case '.png24':
      case '.svg':
      case '.bmp':
      case '.tiff':
      return (<img src={props.item.absoluteURL}  alt="" />);
      break;

      case '.mp4':
      case '.mov':
      return (
        <video width="320" height="240" controls={props.view.mode !== 'list'}>
          <source src={props.item.absoluteURL} type="video/mp4" />
        Your browser does not support the video tag.
        </video>
      );
      break;

      case '.ogv':
      return (
        <video width="320" height="240"  controls={props.view.mode !== 'list'}>
          <source src={props.item.absoluteURL} type="video/ogg" />
        Your browser does not support the video tag.
        </video>
      );
      break;

      case '.webm':
      case '.wbm':
      return (
        <video width="320" height="240"  controls={props.view.mode !== 'list'}>
          <source src={props.item.absoluteURL} type="video/webm" />
        Your browser does not support the video tag.
        </video>
      );
      break;

      case '.pdf':
      return (
        <embed src={props.item.absoluteURL} width="320" height="240" />
      );
      break;

      case '.ogg':
      return (
        <audio controls>
          <source src={props.item.absoluteURL} type="audio/ogg" />
          Your browser does not support the audio tag.
        </audio>
      );
      break;

      case '.mp3':
      return (
        <audio controls>
          <source src={props.item.absoluteURL} type="audio/mpeg" />
          Your browser does not support the audio tag.
        </audio>
      );
      break;

      case '.wav':
      return (
        <audio controls>
          <source src={props.item.absoluteURL} type="audio/wav" />
          Your browser does not support the audio tag.
        </audio>
      );
      break;

      case '.flac':
      return (
        <audio controls>
          <source src={props.item.absoluteURL} type="audio/flac" />
          Your browser does not support the audio tag.
        </audio>
      );
      break;

      default:
      const icon = utility.getIconByExtension(pathParse(props.item.filename).ext);
      return (<p><Icon icon={icon} />&ensp;{props.item.absoluteURL}</p>);
    }
  })(pathParse(props.item.filename).ext);

  classNames();

  const className = (props.config.emphasisFocusedMediaItem && props.item == props.view.focusedMediaItem) ? {'eureka__focused-media-item':true} : {};

  return (

    <tr className={classNames(className)} id={utility.cssSafe(props.item.filename)} aria-label={ariaLabel} role="row" tabIndex="0" onFocus={props.onFocus.bind(this)} contextMenu={`context_menu__tbody-${props.index}`}>
      <td title={ariaLabel} className="eureka__td-media" onDoubleClick={(event) => {
          console.log(event, props.item);
      }}>
        {media}
      </td>
      <td className="eureka__td-filename" contentEditable={contentEditable} onBlur={(event) => {
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
        {utility.wordBreaksEvery(props.item.filename)}
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
