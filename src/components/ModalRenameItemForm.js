import React, { Component } from 'react';

import path from 'path';

import classNames from 'classnames';

import Icon from './Icon';

class ModalRenameItemForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newName:undefined
    };
  }

  componentDidMount() {
    this.refs.input.focus(); // simulate HTML5 autofocus
  }

  render() {
    const state = this.state,
    props = this.props,
    Entities = require('html-entities').AllHtmlEntities,
    entities = new Entities();

    let disable = false,
    sameName = false,
    label = `Rename item`,
    labelIcon = undefined;

    if(state.newName === props.item.filename) {
      disable = true;
      sameName = true;
      label = `${entities.decode('&ensp;')}Cannot rename ${props.item.filename} to the same name`;
      labelIcon = (<Icon icon="exclamation-triangle" />);
    }

    /*if(!disable) {
      disable = (() => {
        for(let i = 0; i < props.fetched.lastDirectoriesFetched.length; i++) {
          const folderName = props.fetched.lastDirectoriesFetched[i];
          console.log(folderName, state.createDirectory, folderName === state.createDirectory);
          if(folderName === state.createDirectory) {
            const Entities = require('html-entities').AllHtmlEntities;

            const entities = new Entities();

            label = `${entities.decode('&ensp;')}Directory ${path.join('/', props.content.cd, folderName)} already exists`;
            labelIcon = (<Icon icon="exclamation-triangle" />);
            directoryExists = true;
            return true;
          }
        }
        return disable;
      })();
    }*/



    return (
      <form onSubmit={(event) => {
        event.preventDefault();
        props.onSubmit(state.newName, props.item);
      }}>
        <label htmlFor="eureka__modal-panel__directory" aria-live="polite" className={classNames({
            dangerous: sameName
          })}>{labelIcon}{label}</label>
        <input ref="input" type="text" id="eureka__modal-panel__directory" name="eureka__modal-panel__directory" placeholder={`foo${path.extname(props.item.filename)}`} autoComplete="off" value={state.newName} onChange={(event) => {
            this.setState({
              newName:event.target.value
            })
          }} />
        <div className="flex-bar">
          <button type="reset" onBlur={(event) => {
              if(state.newName) return;
              this.refs.input.focus();
            }} onClick={props.onCancel}>Cancel <span className="visually-hidden"> remaning item {props.item.filename}</span></button>
          <button type="submit" onBlur={(event) => {
              this.refs.input.focus();
            }} disabled={disable}>Rename <span className="visually-hidden"> item {props.item.filename} to {state.newName}</span></button>
        </div>
      </form>
    );
  }


}


export default ModalRenameItemForm;
