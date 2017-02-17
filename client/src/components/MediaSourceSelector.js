import React from 'react';

import store from '../model/store';
import actions from '../model/actions';

const MediaSourceSelector = (props) => {
  const options = props.source.sources.map((source, index) => (
    <option key={index} value={source.id === undefined ? index : source.id}>{source.name}</option>
  ));
  
  return (
    <div className="eureka__media-source-selector">
      <h2>
        <label htmlFor="media-source-selector__select"><span className="visually-hidden">Choose a </span>Media Source</label>
      </h2>
      <select value={props.source.currentSource} id="media-source-selector__select" onChange={(event) => {
        props.dispatch(actions.updateSource(
          (event.target.value)
        ));
        props.dispatch(actions.updateSourceTree(
          (event.target.value)
        ));
        }}>
        {options}
      </select>
      
      
      
    </div>
  );
}

export default MediaSourceSelector;

