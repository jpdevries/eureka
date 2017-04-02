import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import path from 'path';

import { createStore } from 'redux';

import { connect } from 'react-redux';
import { Provider } from 'react-redux';

import Eureka from './Eureka';

const actions = require('./model/actions'),
store = require('./model/store');

import { IntlProvider, addLocaleData } from 'react-intl';

import { FormattedMessage, FormattedPlural, FormattedNumber, FormattedRelative, injectIntl } from 'react-intl';

import utility from './utility/utility';

import en from 'react-intl/locale-data/en';
//import localeData from './../i18n/locales/en.json';
import localeData from './model/i18n.js';
//import dutchData from './../i18n/locales/nl.json';
//console.log('en',en);
//console.log('localeData',localeData);
addLocaleData([...en]);

const defaultLang = 'en';

class EurekaMediaBrowser extends Component {
  constructor(props) {
    super(props);

    //console.log(props.lang);

    //console.log('A');
    //console.log(navigator.languages, navigator.languages[0], navigator.language, navigator.userLanguage);

    const language = this.getLanguage(props);

    //console.log('B', language);

    const languageWithoutRegionCode = language.toLowerCase().split(/[_-]+/)[0];

    //console.log('bolo', languageWithoutRegionCode);
    store.dispatch(actions.updateConfig(props));

    const i18nEdpoint = (() => {
      try {
        return props.endpoints.i18n
      } catch(e) {
        return path.join(store.getState().config.assetsBasePath, './js/i18n/locales/');
      }
    })();


    const shouldFetch = (() => {
      console.log('shouldFetch', props.lang);
      if(utility.serverSideRendering) return false;
      try {
        return (!props.lang || languageWithoutRegionCode == 'en' || this.state.i18n[props.lang] !== undefined || this.state.i18n[languageWithoutRegionCode] !== undefined) ? false : true;
      } catch(err) {
        return (props.lang !== 'en') ? true : false;
      }
    })();


    if(shouldFetch) fetch(`${i18nEdpoint}${languageWithoutRegionCode}.json`).then((response) => {
      response.json().then((json) => {
        const state = this.state;
        this.setState({
          i18n: json
        })
      });
    });

    store.subscribe(() => {
      const state = store.getState();
      //console.log('state.i18n!!!', state.i18n);
      console.log(state);
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
  getLanguage(props) {
    try {
      return props.lang ? props.lang : document.documentElement.lang || ((navigator.languages && navigator.languages[0]) || navigator.language || navigator.userLanguage)
    } catch(e) {
      return 'en-US';
    }
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
    const state = this.state;

    //console.log('state', state);

    const language = this.getLanguage(props);
    const languageWithoutRegionCode = language.toLowerCase().split(/[_-]+/)[0];
    console.log('languageWithoutRegionCode',languageWithoutRegionCode);
    const messages = (() => {
      if(utility.serverSideRendering) return props.messages;

      if(languageWithoutRegionCode == 'en') {
        return localeData[languageWithoutRegionCode] || localeData[language] || localeData.en;
      } else {
        const fetchedLexiconData = (() => {
          try {
            return this.state.i18n;
          } catch (e) {
            return localeData;
          }

        })();
        return fetchedLexiconData || localeData;
        //return fetchedLexiconData[languageWithoutRegionCode] || fetchedLexiconData[language] || localeData[languageWithoutRegionCode] || localeData[language] || localeData.en;
      }
    })();

    //console.log('messages',messages);

    const lang = (() => {
      //console.log(props);
      //return 'nl';
      try {
        return this.state.i18n ? props.lang : EurekaMediaBrowser.defaultProps.lang; // the component is en-US unless/until the lexicons have async loaded
      } catch (e) {
        return EurekaMediaBrowser.defaultProps.lang;
      }
    })();

    return (
      <Provider store={store}>
        <IntlProvider {...props} locale={language} messages={messages}>
          <this.EurekaController {...props} lang={lang}  />
        </IntlProvider>
      </Provider>
    );
  }
}

EurekaMediaBrowser.defaultProps = {
  i18n: 'assets/js/i18n/locales/',
  lang: 'en-US'
};

export default EurekaMediaBrowser;
