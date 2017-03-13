import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { createStore } from 'redux';

import { connect } from 'react-redux';
import { Provider } from 'react-redux';

import Eureka from './Eureka';

const actions = require('./model/actions'),
store = require('./model/store');

class EurekaMediaBrowser extends Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    this.EurekaController = connect(function(state, props) { // todo list
        return {
          content: state.content,
          view: state.view,
          tree: state.tree,
          source: state.source,
          directory: state.directory,
          fetched: state.fetched
        }
    })(Eureka);
  }
  render() {
    return (<Provider store={store}>
        <this.EurekaController />
    </Provider>);
  }
}



// store.subscribe(() => {
//   console.log(store.getState());
// });

export default EurekaMediaBrowser;
