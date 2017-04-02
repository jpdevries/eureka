import React from 'react';

import store from '../model/store';
import actions from '../model/actions';

import { FormattedMessage } from 'react-intl';

const MediaSourceSelector = (props) => {
  const decoratedActions = (props.decoratedActions) ? Object.assign({}, actions, props.decoratedActions) : actions;
  console.log('MediaSourceSelector',decoratedActions);
  const options = props.source.sources.map((source, index) => (
    <option key={index} value={source.id === undefined ? index : source.id}>{source.name}</option>
  ));

  return (
    <div className="eureka__media-source-selector">
      <h2>
        <label htmlFor="media-source-selector__select"><span className="visually-hidden"><FormattedMessage id="choose" defaultMessage="Choose" /> <FormattedMessage id="grammar.a" defaultMessage="a" /> </span><FormattedMessage id="media.source" defaultMessage="Media Source" /></label>
      </h2>
      <select value={props.source.currentSource} id="media-source-selector__select" onChange={(event) => {
        props.dispatch(decoratedActions.updateSource(
          (event.target.value)
        ));
        props.dispatch(decoratedActions.updateSourceTree(
          (event.target.value)
        ));
        }}>
        {options}
      </select>



    </div>
  );
}

export default MediaSourceSelector;
