import React, { Component } from 'react';

class Modal extends Component {
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
    const props = this.props,
    state = this.state;
    
    return (
      <div className="eureka__modal">
        <div className="eureka__modal-panel">
          <h2>
            {props.title}
          </h2>
          <form>
            <label htmlFor="eureka__modal-panel__directory">Create a new directory in {props.content.cd}</label>
            <input ref="input" type="text" id="eureka__modal-panel__directory" name="eureka__modal-panel__directory" placeholder="untitled folder" value={state.createDirectory} onChange={(event) => {
                this.setState({
                  createDirectory:event.target.value
                })
              }} />
            <div className="flex-bar">
              <button onClick={props.onCancel}>Cancel <span className="visually-hidden"> creating directory {state.createDirectory}</span></button>
              <button disabled={!state.createDirectory} onClick={props.onSubmit}>Create <span className="visually-hidden"> directory {state.createDirectory}</span></button>
            </div>
          </form>
        </div>
        <div role="button" tabIndex="0" 
   aria-pressed="false" className="eureka__modal-scrim" onClick={props.onCancel}>
          <span className="visually-hidden">Close {props.title} Modal Window</span>
        </div>
      </div>
    );
  }
}

export default Modal;