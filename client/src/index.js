import React from 'react';
import ReactDOM from 'react-dom';

import EurekaMediaBrowser from './EurekaMediaBrowser';



ReactDOM.render(
  <EurekaMediaBrowser
    basePath="/core/components/eureka/"
    allowUploads={true}
    storagePrefix="eureka-debug__"
    treeHidden={true}
    useLocalStorage={true}
    allowRename={true}
    allowDelete={true}
    mode="table"
    confirmBeforeDelete={true}
    enlargeFocusedRows={false}
    currentDirectory="assets/img/hawaii"
    allowFullscreen={true}
    emphasisFocusedMediaItem={true}
  />,
  document.getElementById('root')
);
