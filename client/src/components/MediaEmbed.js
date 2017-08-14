import React from 'react';

import { FormattedMessage, FormattedPlural, FormattedNumber, FormattedRelative, defineMessages } from 'react-intl';
import definedMessages from '../i18n/definedMessages';

import utility from './../utility/utility';

import Icon from './Icon';

const pathParse = require('path-parse');

export default function MediaEmbed(props) {
  const src = props.item.absolutePreviewURL || props.item.absoluteURL,
  alt = props.item.alt || '',
  ext = pathParse(props.item.absoluteURL.split('?')[0]).ext,
  onMediaClick = props.onMediaClick || undefined;

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
    return (<img src={src}  alt={alt} onClick={onMediaClick} />);
    break;

    case '.mp4':
    case '.mov':
    return (
      <video key={src} width="320" height="240" controls={props.view.mode !== 'list'}>
        <source src={src} type="video/mp4" />
        <FormattedMessage id="support.noVideo" defaultMessage="Your browser does not support HTML5 Video." />
      </video>
    );
    break;

    case '.ogv':
    return (
      <video key={src} width="320" height="240"  controls={props.view.mode !== 'list'}>
        <source src={src} type="video/ogg" />
        <FormattedMessage id="support.noVideo" defaultMessage="Your browser does not support HTML5 Video." />
      </video>
    );
    break;

    case '.webm':
    case '.wbm':
    return (
      <video key={src} width="320" height="240"  controls={props.view.mode !== 'list'}>
        <source src={src} type="video/webm" />
        <FormattedMessage id="support.noVideo" defaultMessage="Your browser does not support HTML5 Video." />
      </video>
    );
    break;

    case '.pdf':
    return (
      <embed key={src} src={src} width="320" height="240" />
    );
    break;

    case '.ogg':
    return (
      <audio key={src} controls>
        <source src={src} type="audio/ogg" />
        <FormattedMessage id="support.noAudio" defaultMessage="Your browser does not support HTML5 Audio." />
      </audio>
    );
    break;

    case '.mp3':
    return (
      <audio key={src} controls>
        <source src={src} type="audio/mpeg" />
        <FormattedMessage id="support.noAudio" defaultMessage="Your browser does not support HTML5 Audio." />
      </audio>
    );
    break;

    case '.wav':
    return (
      <audio key={src} controls>
        <source src={src} type="audio/wav" />
        <FormattedMessage id="support.noAudio" defaultMessage="Your browser does not support HTML5 Audio." />
      </audio>
    );
    break;

    case '.flac':
    return (
      <audio key={src} controls>
        <source src={src} type="audio/flac" />
        <FormattedMessage id="support.noAudio" defaultMessage="Your browser does not support HTML5 Audio." />
      </audio>
    );
    break;

    default:
    const icon = utility.getIconByExtension(pathParse(props.item.filename).ext);
    return (<p onClick={onMediaClick}><Icon {...props} icon={icon} />&ensp;{props.item.absoluteURL}</p>);
  }
}

module.exports = MediaEmbed;
