import React from 'react';

import store from '../model/store';
import actions from '../model/actions';


const MediaDirectorySelector = (props) => {
  const optgroups = props.directory.map((source, index) => { // todo: rename props.directory to something that makes more sense (or combine it with the sources reducer?)
    const opts = source.directories.sort((a,b) => {
      if(a.cd === b.cd) return 0;
      return (a.cd > b.cd) ? 1 : -1;
    }).map((directory, index) => (
      <option key={index} value={`${source.id}__${directory.cd}`}>{directory.cd}</option>
    ));
    return (
      <optgroup key={index} label={source.name} data-source={source.id === undefined ? index : source.id}>
        <option value="/" checked={props.content.cd == "/" && props.source.currentSource == source.id}>./</option>
        {opts}
      </optgroup>
    );
  });

  return (
    <div className="eureka__media-directory-selector">
      <label htmlFor="eureka__media-browser_0__browsing">Browse Directory:</label>&ensp;
      <form action="#">
        <select value={`${props.source.currentSource}__${props.content.cd}`} name="eureka__media-browser_0__browsing" id="eureka__media-browser_0__browsing" onChange={(event) => {            
            const [cs,cd] = event.target.value.split('__');
            
            store.dispatch(actions.updateContent({ // updates the "current directory" of the view right away
              cd: cd
            }));
            store.dispatch(actions.fetchDirectoryContents(cs, { // asyncronously fetches the directory contents from the API
              dir:cd
            }));
          }}>
          {optgroups}
        </select>
      </form>
    </div>
  );
}

export default MediaDirectorySelector;

