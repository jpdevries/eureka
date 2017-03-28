import React from 'react';
import ReactDOM from 'react-dom';

import { IntlProvider, addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';

// Our translated strings


import { FormattedMessage, FormattedPlural, FormattedNumber, FormattedRelative } from 'react-intl';

addLocaleData([...en]);

import EurekaMediaBrowser from './EurekaMediaBrowser';

const language = (navigator.languages && navigator.languages[0]) || navigator.language || navigator.userLanguage;
const languageWithoutRegionCode = language.toLowerCase().split(/[_-]+/)[0];
const messages = localeData[languageWithoutRegionCode] || localeData[language] || localeData.en;



import localeData from './../i18n/locales/data.json';

ReactDOM.render(
  <IntlProvider locale={language} messages={messages}>
    <EurekaMediaBrowser
      basePath="/core/components/eureka/"
      allowUploads={true}
      treeHidden={false}
      useLocalStorage={true}
      allowRename={true}
      allowDelete={true}
      mode="table"
      confirmBeforeDelete={true}
      enlargeFocusedRows={false}
      currentDirectory="assets/img/hawaii"
      allowFullscreen={true}
      emphasisFocusedMediaItem={true}
    />
  </IntlProvider>,
  document.getElementById('root')
);
