import React from 'react';

import store from '../model/store';
import actions from '../model/actions';

import utility from '../utility/utility';

import { FormattedMessage } from 'react-intl';

const MediaDirectorySelector = (props) => {

  const decoratedActions = props.decoratedActions ? Object.assign({}, actions, props.decoratedActions) : actions;

  const optgroups = props.directory.map((source, index) => { // todo: rename props.directory to something that makes more sense (or combine it with the sources reducer?)
    const opts = source.directories.sort((a,b) => {
      if(a.cd === b.cd) return 0;
      return (a.cd > b.cd) ? 1 : -1;
    }).map((directory, index) => {
      console.log(props.source.currentSource.id == source.id && props.content.cd == directory.cd, props.source.currentSource.id, source.id, props.content.cd, directory.cd);
      return <option key={index} value={`${source.id}||${directory.cd}`} checked={props.source.currentSource.id == source.id && props.content.cd == directory.cd}>{directory.cd}</option>;
    });
    return (
      <optgroup key={index} label={source.name} data-source={source.id === undefined ? index : source.id}>
        <option value={`${source.id}||/`} checked={props.content.cd == "/" && props.source.currentSource == source.id}>./</option>
        {opts}
      </optgroup>
    );
  });

  const hiddenInput = <input type="hidden" name={`${props.config.storagePrefix !== undefined ? props.config.storagePrefix : 'eureka__' }mediaSourceId`} name={`${props.config.storagePrefix !== undefined ? props.config.storagePrefix : 'eureka__' }mediaSourceId`} value={props.config.uid} />
  const submit = (utility.serverSideRendering) ? <button type="submit"><FormattedMessage id="directory.set" defaultMessage="Set Directory" /></button> : undefined;
  const select = (
    <select aria-live="polite" value={`${props.source.currentSource}||${props.content.cd}`} name="eureka__media-browser_0__browsing" id="eureka__media-browser_0__browsing" onChange={(event) => {
        const [cs, cd] = utility.parseMediaSourceOutOfCombinedPath(event.target.value, '||'); // option values are like 0||assets/img/redwoods where 0 is the media source id and assets/img/redwoods is the directory
        console.log('YOLO',cs,cd);
        store.dispatch(decoratedActions.updateSource(cs))
        store.dispatch(decoratedActions.updateContent({ // updates the "current directory" of the view right away
          cd: cd
        }));
        store.dispatch(decoratedActions.fetchDirectoryContents(cs, { // asyncronously fetches the directory contents from the API
          path: cd
        }));
      }}>
      {optgroups}
    </select>
  );
  const hiddenUploadDirectoryInput = <input type="hidden" name={`${props.config.storagePrefix !== undefined ? props.config.storagePrefix : 'eureka__' }upload-dir`} value={props.content.cd} />
  const form = (utility.serverSideRendering) ? (
    <div>
      {hiddenInput}
      {hiddenUploadDirectoryInput}
      {select}
      {submit}
    </div>
  ) : (
    <form action="#">
      {hiddenInput}
      {select}
      {submit}
    </form>
  ) ;

  return (
    <div className="eureka__media-directory-selector">
      <label htmlFor="eureka__media-browser_0__browsing"><FormattedMessage id="directory.browse" defaultMessage="Browse Directory" />:</label>&ensp;
      {form}
    </div>
  );
}

export default MediaDirectorySelector;
