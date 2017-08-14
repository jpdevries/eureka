import React, { Component } from 'react';

import path from 'path';

import classNames from 'classnames';

import Icon from './Icon';

import { FormattedMessage } from 'react-intl';

class ModalCreateDirectoryForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createDirectory:''
    };
  }

  componentDidMount() {
    this.refs.input.focus(); // simulate HTML5 autofocus
  }

  render() {
    const state = this.state;
    const props = this.props;

    let disable = !state.createDirectory;
    let directoryExists = false;

    let label = `Create a new directory in ${path.join('/', props.content.cd)}`;
    let labelIcon = undefined;

    if(!disable) {
      disable = (() => {
        for(let i = 0; i < props.fetched.lastDirectoriesFetched.length; i++) {
          const folderName = props.fetched.lastDirectoriesFetched[i];
          //console.log(folderName, state.createDirectory, folderName === state.createDirectory);
          if(folderName === state.createDirectory) {

            label = `${('&ensp;')}Directory ${path.join('/', props.content.cd, folderName)} already exists`;
            labelIcon = (<Icon {...props} icon="exclamation-triangle" />);
            directoryExists = true;
            return true;
          }
        }
        return disable;
      })();
    }



    return (
      <form onSubmit={(event) => {
          event.preventDefault();
          props.onSubmit(this.state.createDirectory);
      }}>
        <label htmlFor="eureka__modal-panel__directory" aria-live="polite" className={classNames({
            dangerous: directoryExists
          })}>{labelIcon}{label}</label>
        <input ref="input" type="text" id="eureka__modal-panel__directory" name="eureka__modal-panel__directory" placeholder="untitled folder" autoComplete="off" value={state.createDirectory} onChange={(event) => {
            this.setState({
              createDirectory:event.target.value
            })
          }} />
        <div className="flex-bar">
          <button className="growable" type="reset" onBlur={(event) => {
              if(state.createDirectory) return;
              this.refs.input.focus();
            }} onClick={props.onCancel}><FormattedMessage id="cancel" defaultMessage="Cancel" /> <span className="visually-hidden"> <FormattedMessage id="directory.cancelCreating" defaultMessage={'creating directory {cd}'} value={{
              cd: state.createDirectory
            }} values={{
              state: state
            }} /></span></button>
          <button className="growable" type="submit" onBlur={(event) => {
              this.refs.input.focus();
            }} disabled={disable}><FormattedMessage id="create" defaultMessage="Create" /> <span className="visually-hidden"> <FormattedMessage id="directory" defaultMessage="directory" /> {state.createDirectory}</span></button>
        </div>
      </form>
    );
  }


}


export default ModalCreateDirectoryForm;
