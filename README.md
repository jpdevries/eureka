# Eureka 🌲

Flexible Media Browser Component. [Try the demo](http://jpdevries.github.io/eureka/examples/).  
As seen in [Redactor 2.0](https://www.modmore.com/extras/redactor) by modmore. Contributions&nbsp;welcomed.

> With `eureka.js` your users will be saying "I found it!" in no time.  
&emsp;&emsp;&mdash; [@mrktps](https://twitter.com/mrktps)

## 💬 Discuss
Join the conversation in our public Gitter chat room.

[![Join the chat at https://gitter.im/jpdevries/eureka](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/jpdevries/eureka?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## Powered By 🚀
 - Progressively Enhanced from HTML components
 - All&ndash;new Virtual DOM powered by React/Redux
 - Node Server Side Rendering
 - Node testing server

## Features 😃
 - Configurable Rest API endpoints
 - Browse multiple media sources for images
 - Drag and Drop Upload Support
 - Flexible Layout
 - Responsive Design
 - Configurable Styles via CSS Variables
 - Accessible
   - supports mobile and touch devices
   - supports `.no-js` via server side rendering
   - ARIA & Keyboard Support

## 🌐 Browser Support
The server side rendering and HTML&ndash;first design patterns begin progressively enhancing a universally supported HTML layer. So basic features are supported in any browser. JavaScript support begins at IE9. Desired CSS layout requires Flexbox and is further enhanced with Grid Layout.

## ♿️ Accessibility Proclaimer
Eureka strives for WCAG Level AA success criteria in all scenarios with some accessibility preference features leaning towards Level AAA. Please [log *any* a11y issues here](https://github.com/jpdevries/eureka/issues).

## ✅ Getting Started
We're going to use `yarn` so make sure that is installed.

```bash
npm install yarn -g
```

To fire up a testing server run the following:

```bash
git clone -b release-2.0 git://github.com/jpdevries/eureka.git
cd eureka
yarn prestart # install and build
yarn fetchsources # do once, fetches media source data
yarn server # start the server
open http://localhost:3001 # Node server
```

The testing server serves the `sources` and `client/build` directories along with a REST API to `GET`, `POST`, `PUT`, `DELETE` media items.

![](http://j4p.us/22241J1A3N06/Screen%20Shot%202017-03-13%20at%2012.56.51%20AM.png)

## ⚒ Development
The Eureka component is created with `create-react-app` and found in the `client` directory. There you can run React tests, build the React component, and start the development server.

Firstly, you'll need the testing server running for the REST API:
```bash
cd eureka
yarn server
```

Now, in another terminal tab:

```bash
cd client
yarn build
yarn test
yarn start
open http://localhost:3000 # development server
```

The development server, like any other React app created with `create-react-app`, will automatically inject changes as you save changes to your source files.

## 🗄 Rest API

To do:
 - Configurable base URL, ie: `core/components/eureka`
 - sync forms (form data endpoints rather than URL params)

Retrieve a list of media sources  
`GET` `/media/sources`

```json
[
  {"name":"filesystem", "id":0},
  {"name":"s3", "id":1}
]
```

Retrieve a list of top&ndash;level directories of a given media source  
`GET` `/media/sources/:source`

```json
[
  {"name":"assets","cd":"assets"},
  {"name":"foo","cd":"foo"}
]
```




Retrieve a list of media items and subdirectories of a given directory of a given media source  
`GET` `/media/sources/:source?dir=assets%2Fimg`

```json
[  
   {  
      "filename":"DSC02469.jpg",
      "directory":"assets/img/",
      "absolutePath":"/sources/filesystem/assets/img/DSC02469.jpg",
      "absoluteURL":"/sources/filesystem/assets/img/DSC02469.jpg",
      "editedOn":"2017-02-16T04:44:07.000Z",
      "dimensions":[  
         163,
         42
      ],
      "fileSize":36335
   },
   {  
      "foldername":"hawaii",
      "directory":"assets/img/hawaii",
      "absolutePath":"/sources/filesystem/assets/img/hawaii",
      "absoluteURL":"/sources/filesystem/assets/img/hawaii",
      "editedOn":"2017-03-12T23:22:59.000Z"
   },
   {  
      "foldername":"redwoods",
      "directory":"assets/img/redwoods",
      "absolutePath":"/sources/filesystem/assets/img/redwoods",
      "absoluteURL":"/sources/filesystem/assets/img/redwoods",
      "editedOn":"2017-02-20T08:46:06.000Z"
   }
]
```

#### Delete a given media item of a given media source  
`DELETE` `/media/sources/:source?absolutePath=assets%2Fimg%2Fturtle.jpg`
```json
true
```

#### Upload files to a given directory of a given media source  
`POST` `/media/sources/:source?dir=assets%2Fimg`

Send files as FormData of body of request. The response will contain a fresh list of subdirectories and media items of `dir` once othe items have been uploaded

```json
[  
   {  
      "filename":"Love_What_You_Do_print_04_web.jpg",
      "directory":"assets/img",
      "absolutePath":"/sources/filesystem/assets/img/Love_What_You_Do_print_04_web.jpg",
      "absoluteURL":"/sources/filesystem/assets/img/Love_What_You_Do_print_04_web.jpg",
      "editedOn":"2017-03-13T15:02:55.000Z",
      "dimensions":[  
         252,
         120
      ],
      "fileSize":870377
   },
   {  
      "filename":"digital_thumb.png",
      "directory":"assets/img",
      "absolutePath":"/sources/filesystem/assets/img/digital_thumb.png",
      "absoluteURL":"/sources/filesystem/assets/img/digital_thumb.png",
      "editedOn":"2017-03-13T15:02:55.000Z",
      "dimensions":[  
         84,
         94
      ],
      "fileSize":26122
   },
   {  
      "filename":"digital_thumb_landscape.png",
      "directory":"assets/img",
      "absolutePath":"/sources/filesystem/assets/img/digital_thumb_landscape.png",
      "absoluteURL":"/sources/filesystem/assets/img/digital_thumb_landscape.png",
      "editedOn":"2017-03-13T15:02:55.000Z",
      "dimensions":[  
         232,
         54
      ],
      "fileSize":32052
   },
   {  
      "foldername":"hawaii",
      "directory":"assets/img/hawaii",
      "absolutePath":"/sources/filesystem/assets/img/hawaii",
      "absoluteURL":"/sources/filesystem/assets/img/hawaii"
   },
   {  
      "foldername":"redwoods",
      "directory":"assets/img/redwoods",
      "absolutePath":"/sources/filesystem/assets/img/redwoods",
      "absoluteURL":"/sources/filesystem/assets/img/redwoods"
   }
]

```


#### Rename a given media item of a given media source  
`PUT` `/media/sources/:source?path=assets%2Fimg%2turtle.jpg&name=sea.jpg`

Return a fresh listing of the entire directory.

```json
[  
   {  
      "filename":"DSC02525.jpg",
      "directory":"/sources/filesystem/assets/img/hawaii",
      "absolutePath":"/sources/filesystem/assets/img/hawaii/DSC02525.jpg",
      "absoluteURL":"/sources/filesystem/assets/img/hawaii/DSC02525.jpg",
      "editedOn":"2017-02-16T04:44:09.000Z",
      "dimensions":[  
         282,
         162
      ],
      "fileSize":41545
   },
   {  
      "filename":"sea.jpg",
      "directory":"/sources/filesystem/assets/img/hawaii",
      "absolutePath":"/sources/filesystem/assets/img/hawaii/sea.jpg",
      "absoluteURL":"/sources/filesystem/assets/img/hawaii/sea.jpg",
      "editedOn":"2017-02-16T04:44:09.000Z",
      "dimensions":[  
         192,
         107
      ],
      "fileSize":34178
   }
]
```

Rename a given directory of a given media source  
`PUT` `/media/sources/:source?path=assets%2Fimg&name=images`



## 🛠 Usage

**HTML**
```html
<div id="eureka-root">
</div>
<script src="assets/js/vendor/eureka/eureka.2.0.0.min.js"></script>
```

**JS**
```js
import React from 'react';
import ReactDOM from 'react-dom';

import EurekaMediaBrowser from 'EurekaMediaBrowser';

ReactDOM.render(
  <EurekaMediaBrowser />,
  document.getElementById('eureka-root')
);
```

Configure the `EurekaMediaBrowser` via the optional attributes found in the default configuration&nbsp;below:
```xml
  <EurekaMediaBrowser
    basePath="/"
    allowUploads={true}
    treeHidden={true}
    useLocalStorage={true}
    storagePrefix="eureka__"
    allowRename={true}
    allowDelete={true}
    confirmBeforeDelete={false}
    locale="en-US"
    mediaSource="0"
    currentDirectory="/"
    headers: {{
        'Powered-By': 'Eureka by Markup.tips'
    }}
  />
```


| Option        | Default           | Description  |
| ------------- |:-------------:| -----|
| `basePath`      | `"/"` | Prepended to URLs for XHR requests to the Rest API.<br>Set to the absolute path of your Rest API. |
| `allowUploads`      | `true`      |   Whether or not to allow uploading of media items |
| `treeHidden` | `true`      |    Whether or not the Media Source tree "sidebar" should be initially closed |
| `useLocalStorage` | `true`      |    Whether or not to use the JavaScript `localStorage` API to remember session data such as the last visited directory and view mode preference |
| `storagePrefix` | `"eureka__"`      |    Prepended to `localStorage` keys |
| `allowRename` | `true`      |    Whether or not to offer users the ability to rename directories and media items |
| `allowDelete` | `true`      |    Whether or not to offer users the ability to delete directories and media items |
| `confirmBeforeDelete` | `false`      |    Whether or not to confirm intent before users delete directories and media items |
| `locale` | `"en-US"`      |    The localization to use. See Lexicons. |
| `mediaSource` | `"0"`      |    The default initial media source id to use |
| `currentDirectory` | `"/"`      |    The default initial directory to use |
| `headers` | `{'Powered-By': 'Eureka by Markup.tips'}`      |    Additional request headers sent with XHR requests |

For server side rendering via Node:

WIP

```js
import React from 'react';
import ReactDOM from 'react-dom';

import EurekaMediaBrowser from './EurekaMediaBrowser';


```
