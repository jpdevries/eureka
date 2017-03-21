import React from 'react';

import store from '../model/store';
import actions from '../model/actions';

import Icon from './Icon';

const ViewChooser = (props) => {
  
  return (
    <form className="eureka__layout-chooser">
      <fieldset>
        <legend>Choose a Layout Mode</legend>
        
        <div className="eureka__icon-radio-btns">
          <div>
            <input type="radio" id="eureka__view-table" name="eureka__view" onChange={(event) => (
              store.dispatch(actions.updateView({
                mode: event.target.value
              }))
              )} checked={props.view.mode === 'table'} value="table" />&emsp;
            <label htmlFor="eureka__view-table" title="Tabular Layout displays image thumbnails along with Name, Description, File Size and Edited On columns">
              <Icon icon="th-list" />
              <span className="visually-hidden">Table Layout</span>
            </label>
          </div>
          
          <div>
            <input type="radio" id="eureka__view-thumb" name="eureka__view" onChange={(event) => (
              store.dispatch(actions.updateView({
                mode: event.target.value
              }))
              )} checked={props.view.mode === 'thumb'} value="thumb" />&emsp;
            <label htmlFor="eureka__view-thumb" title="Thumbnail layout displays a grid of medium sized thumbnails">
              <Icon icon="th-large" />
              <span className="visually-hidden">Thumbnail Layout</span>
            </label>
          </div>
          
          <div>
            <input type="radio" id="eureka__view-grid" name="eureka__view" onChange={(event) => (
              store.dispatch(actions.updateView({
                mode: event.target.value
              }))
              )} checked={props.view.mode === 'grid'} value="grid" />&emsp;
            <label htmlFor="eureka__view-grid" title="Grid View displays images a grid of large images">
              <Icon icon="square" />
              <span className="visually-hidden">Grid View</span>
            </label>
          </div>
          
          <div>
            <input type="radio" id="eureka__view-list" name="eureka__view" onChange={(event) => (
              store.dispatch(actions.updateView({
                mode: event.target.value
              }))
              )} checked={props.view.mode === 'list'} value="list" />&emsp;
            <label htmlFor="eureka__view-list" title="List Layout displays Name, Description, File Size and Edited On columns">
              <Icon icon="list" />
              <span className="visually-hidden">List Layout</span>
            </label>
          </div>
        </div>
        
      </fieldset>
    </form>
  );
}

export default ViewChooser;

