import React, { PureComponent } from 'react';
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

class EurekaMediaBrowser extends PureComponent {
  constructor(props) {
    super(props);

    //console.log(props.lang);

    //console.log('A');
    //console.log(navigator.languages, navigator.languages[0], navigator.language, navigator.userLanguage);

    const language = this.getLanguage(props);

    //console.log('B', language);

    const languageWithoutRegionCode = language.toLowerCase().split(/[_-]+/)[0];

    let config = Object.assign({}, props, {});


    if(props.storagePrefix !== 'eureka__' || true) { // they are using a non-default localStorage prefix
      const config = Object.assign({}, {
        currentDirectory:(() => {
          try {
            return localStorage.getItem(`${props.storagePrefix}currentDirectory`) || undefined
          } catch(e) { return undefined }
        })(),
        mode:(() => {
          try {
            return localStorage.getItem(`${props.storagePrefix}mode`) || undefined
          } catch(e) { return undefined }
        })(),
        sort:(() => {
          try {
            return localStorage.getItem(`${props.storagePrefix}sort`) || undefined
          } catch(e) { return undefined }
        })(),
        /*source:(() => {
          try {
            return JSON.parse(localStorage.getItem(`${props.storagePrefix}source`)) || undefined
          } catch(e) { return undefined }
        })(),*/
        treeHidden:(() => {
          try {
            return !(JSON.parse(localStorage.getItem(`${props.storagePrefix}view`)).sourceTreeOpen)
          } catch(e) { return undefined }
        })()
      }, props);


      const localSources = (() => {
        try {
          return JSON.parse(localStorage.getItem(`${props.storagePrefix}source`)) || undefined
        } catch(e) { return undefined }
      })();

      const localContent = (() => {
        try {
          return JSON.parse(localStorage.getItem(`${props.storagePrefix}content`)) || undefined
        } catch(e) { return undefined }
      })();

      if(localSources) {
        if(localSources.sources !== undefined) store.dispatch(actions.fetchMediaSourcesSuccess(localSources.sources));
        if(localSources.currentSource !== undefined) store.dispatch(actions.updateSource(localSources.currentSource.toString()));
      }

      if(localContent) {
        store.dispatch(actions.updateContent(localContent));
      }

      /*console.log(
        config,
        localStorage.getItem(`${props.storagePrefix}currentDirectory`),
        localStorage.getItem(`${props.storagePrefix}mode`),
        localStorage.getItem(`${props.storagePrefix}sort`),
        localStorage.getItem(`${props.storagePrefix}source`),
        localStorage.getItem(`${props.storagePrefix}treeHidden`)
      );*/
    }


    //console.log('bolo', languageWithoutRegionCode);
    store.dispatch(actions.updateConfig(config));



    const i18nEdpoint = (() => {
      try {
        return props.endpoints.i18n
      } catch(e) {
        return path.join(store.getState().config.assetsBasePath, './js/i18n/locales/');
      }
    })();


    const shouldFetch = (() => {
      //console.log('shouldFetch', props.lang);
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
      //console.log(state);

      // whenever the state changes we store pieces of the state locally so that next time Eureka fires up it can render the user interface without delay
      if(state.config.useLocalStorage) {
        try {
          localStorage.setItem(`${state.config.storagePrefix}currentDirectory`, state.content.cd);
          localStorage.setItem(`${state.config.storagePrefix}directory`, JSON.stringify(state.directory));
          localStorage.setItem(`${state.config.storagePrefix}currentSource`, state.source.currentSource);
          localStorage.setItem(`${state.config.storagePrefix}source`, JSON.stringify(state.source));
          //localStorage.setItem(`${state.config.storagePrefix}mode`, state.view.mode);
          //localStorage.setItem(`${state.config.storagePrefix}sort`, state.view.sort);
          //localStorage.setItem(`${state.config.storagePrefix}treeHidden`, !state.view.sourceTreeOpen);
          localStorage.setItem(`${state.config.storagePrefix}content`, JSON.stringify(state.content));
          localStorage.setItem(`${state.config.storagePrefix}tree`, JSON.stringify(state.tree));
          //console.log('state.view', JSON.stringify(state.view));
          localStorage.setItem(`${state.config.storagePrefix}view`, JSON.stringify(state.view));
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

    const language = this.getLanguage(props);
    const languageWithoutRegionCode = language.toLowerCase().split(/[_-]+/)[0];
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
