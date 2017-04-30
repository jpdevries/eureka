import React from 'react';
import ReactDOM from 'react-dom';

import EurekaMediaBrowser from './EurekaMediaBrowser';

import lazyLoadScript from 'lazyload-script';

import ReactIntl, {ReactIntlLocaleData, addLocaleData} from 'react-intl';

const language = document.documentElement.lang || ((navigator.languages && navigator.languages[0]) || navigator.language || navigator.userLanguage);
const languageWithoutRegionCode = language.toLowerCase().split(/[_-]+/)[0];
const languageKey = languageWithoutRegionCode.toLowerCase();

if(languageKey != 'en') {
  Promise.all([
    lazyLoadScript(`https://unpkg.com/react-intl@latest/locale-data/${languageKey}.js`, `react-intl-${languageKey.toLowerCase()}.js`)
  ]).then((data) => {
    console.log('window.ReactIntlLocaleData[languageKey]',window.ReactIntlLocaleData[languageKey]);
    addLocaleData(window.ReactIntlLocaleData[languageKey]);
  }).then(() => (
    render()
  ));
} else {
  render();
}


function render() {
  ReactDOM.render(
    <EurekaMediaBrowser
      basePath="/assets/components/eureka/"
      allowUploads={true}
      doDragNDrop={true}
      lang={languageKey}
      useLocalStorage={true}
      allowRename={true}
      allowDelete={true}
      allowInvertSelection={true}
      confirmBeforeDelete={false}
      alwaysWelcome={true}
      allowFullscreen={true}
      enlargeFocusedRows={false}
      emphasisFocusedMediaItem={true}
      storagePrefix={'eureka__'}
      lang="en-US"
      callbacks={{
        choose: function(item) {
          alert(JSON.stringify(item))
          console.log(item);
        }
      }}
      handlers={{
        createFile: function(source, directory) {
          return {
            href: `javascript:alert("create a file in ${directory} of media source ${source}")`,
            target: '_blank',
            onClick: function(source, directory) {
              console.log('onClick', source, directory);
            }
          }
        }
      }}
      endpoints={{
        i18n: './assets/js/i18n/locales/'
      }}
      headers={{
        foo: 'bar'
      }}
      intervals={{
        searchBarPlaceholder: 60000,
        fetchDirectoryContents: 12000
      }}
    />,
    document.getElementById('root')
  );
}
