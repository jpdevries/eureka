import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { createStore } from 'redux';

import { connect } from 'react-redux';
import { Provider } from 'react-redux';

import Eureka from './Eureka';

const actions = require('./model/actions'),
store = require('./model/store');

import { injectIntl, FormattedMessage, FormattedPlural, FormattedNumber, FormattedRelative, defineMessages } from 'react-intl';

class EurekaMediaBrowser extends Component {
  constructor(props) {
    super(props);

    store.dispatch(actions.updateConfig(props));

    store.subscribe(() => {
      const state = store.getState();
      /*try {
        const siteName = title.dataset.siteName,
        title = document.querySelector('head > title'),
        ct = (`${state.content.cd} of ${state.source.sources[state.source.currentSource].name} media source`);
        title.innerHTML = `${ct} | ${siteName}`;
      } catch (e) {}*/

      if(state.config.useLocalStorage) {
        try {
          localStorage.setItem(`${state.config.storagePrefix}currentDirectory`, state.content.cd);
          localStorage.setItem(`${state.config.storagePrefix}source`, JSON.stringify(state.source));
          localStorage.setItem(`${state.config.storagePrefix}mode`, state.view.mode);
          localStorage.setItem(`${state.config.storagePrefix}sort`, state.view.sort);
          localStorage.setItem(`${state.config.storagePrefix}treeHidden`, !state.view.sourceTreeOpen);
        } catch (e) { }
      }

    });
  }
  componentWillMount() {
    this.EurekaController = connect(function(state, props) { // todo list
        return {
          content: state.content,
          view: state.view,
          tree: state.tree,
          source: state.source,
          directory: state.directory,
          fetched: state.fetched,
          config: state.config
        }
    })(injectIntl(Eureka)); // shoot it up with some i18n
  }
  render() {
    const props = this.props;

    return (<Provider store={store}>
        <this.EurekaController {...props} />
    </Provider>);
  }
}

// i18n FTW
export default injectIntl(EurekaMediaBrowser);
