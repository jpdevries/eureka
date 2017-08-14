import React from 'react';

import store from '../model/store';
import actions from '../model/actions';

function ChooseRadio(props) {
  const invert = (props.view.chooseMultiple && props.config.allowInvertSelection) ? (
    <label htmlFor="eureka__invert_selection">&emsp;<input checked={props.view.selectionInverted} onChange={(event) => {
      store.dispatch(actions.updateView({
        selectionInverted: event.target.checked
      }))
    }} type="checkbox" id={`${props.storagePrefix}invert_selection`} name="eureka__invert_selection" />&ensp;Invert<span className="visually-hidden"> Selection</span>&emsp;</label>
  ) : <span>&emsp;</span>,
  maybeSpace = (props.view.chooseMultiple) ? undefined : (<span>&emsp;</span>);
  return (
    <div className="eureka__choose-radio">
      <div>
        <div role="radiogroup" className="eureka__fieldset">
          <legend id="eureka__choose-radio-legend">Choose Items:&ensp;</legend>

          <input aria-labelledby="eureka__choose-radio-legend" onChange={(event) => {
            store.dispatch(actions.updateView({
              chooseMultiple: false
            }))
          }} checked={!props.view.chooseMultiple} type="radio" name={`${props.storagePrefix}__choose_items`} id={`${props.storagePrefix}__choose_item`} />
          <label htmlFor={`${props.storagePrefix}__choose_item`}>&ensp;Single&emsp;</label>

          <input aria-labelledby="eureka__choose-radio-legend" onChange={(event) => {
            store.dispatch(actions.updateView({
              chooseMultiple: true
            }))
          }} checked={props.view.chooseMultiple} type="radio" name={`${props.storagePrefix}__choose_items`} id={`${props.storagePrefix}__choose_items`} />
          <label htmlFor={`${props.storagePrefix}__choose_items`}>&ensp;Multiple{maybeSpace}</label>
        </div>
      </div>
      {invert}
    </div>
  );
}

export default ChooseRadio;
