import React from 'react';

import store from '../model/store';
import actions from '../model/actions';

function ChooseRadio(props) {
  const invert = (props.view.chooseMultiple) ? (
    <label htmlFor="eureka__invert_selection">&emsp;<input checked={props.view.selectionInverted} onChange={(event) => {
      store.dispatch(actions.updateView({
        selectionInverted: event.target.checked
      }))
    }} type="checkbox" id={`${props.storagePrefix}invert_selection`} name="eureka__invert_selection" />&ensp;Invert<span className="visually-hidden"> Selection</span>&emsp;</label>
  ) : undefined,
  maybeSpace = (props.view.chooseMultiple) ? undefined : (<span>&emsp;</span>);
  return (
    <div className="eureka__choose-radio">
      <fieldset>
        <div className="eureka__fieldset">
          <legend>Choose Items:&ensp;</legend>

          <input onChange={(event) => {
            store.dispatch(actions.updateView({
              chooseMultiple: false
            }))
          }} checked={!props.view.chooseMultiple} type="radio" name={`${props.storagePrefix}__choose_items`} id={`${props.storagePrefix}__choose_item`} />
          <label htmlFor={`${props.storagePrefix}__choose_item`}>&ensp;Single&emsp;</label>

          <input onChange={(event) => {
            store.dispatch(actions.updateView({
              chooseMultiple: true
            }))
          }} checked={props.view.chooseMultiple} type="radio" name={`${props.storagePrefix}__choose_items`} id={`${props.storagePrefix}__choose_items`} />
          <label htmlFor={`${props.storagePrefix}__choose_items`}>&ensp;Multiple{maybeSpace}</label>
        </div>
      </fieldset>
      {invert}
    </div>
  );
}

export default ChooseRadio;
