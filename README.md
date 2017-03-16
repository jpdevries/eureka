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
# open http://localhost:3001 # Node server
```

The testing server hosts the `sources` and `client/build` directories along with a REST API to `GET`, `POST`, `PUT`, `DELETE` media items.

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
# open http://localhost:3000 # development server
```

The development server, like any other React app created with `create-react-app`, will automatically inject changes as you save changes to your source files.

## 🗄 REST API
See the [REST API wiki page](https://github.com/jpdevries/eureka/wiki/REST-API).

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
    headers={{
        'Powered-By': 'Eureka by Markup.tips'
    }}
    intervals={{
      searchBarPlaceholder: false,
      fetchDirectoryContents: 18000,
      updateSourceTree: false
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
| `mediaSource` | `undefined`      |    The default initial media source id to use |
| `currentDirectory` | `"/"`      |    The default initial directory to use |
| `headers` | `{'Powered-By': 'Eureka by Markup.tips'}`      |    Additional request headers sent with XHR requests |
| `intervals` | `{searchBarPlaceholder: false,fetchDirectoryContents: 18000,updateSourceTree: false}`      |    Intervals for whether or not and how often to update the  |
| `enlargeFocusedRows` | `false`      |    Whether or not to enlarge thumbnails of focused rows |
| `mode` | `"table"`      |    Initial view mode (table, thumb, grid, list) |
| `sort` | `"name"`      |    Initial column to sort media items on |
| `allowFullscreen` | `true`      |    Whether or not the interface should offer a fullscreen button |
| `emphasisFocusedMediaItem` | `true`      |    Whether or not to emphasis selected media items (defaults to boldening the filename, only applies to table and list view modes) |



For server side rendering via Node:

WIP

```js
import React from 'react';
import ReactDOM from 'react-dom';

import EurekaMediaBrowser from 'EurekaMediaBrowser';


```

## 🎨 Theming
| Variable        | Description  |
| ------------- | -----|
| `--active` | Color used to highlight activated components such as the drop area |
| `--border-width` | Generic border width for panels, components, inputs |
| `--border-style` | Generic border style for panels, components, inputs |
| `--border-color` | Generic border color for panels, components, inputs |
| `--button-bg` | Background color of button elements |
| `--button-color` | Color of button text |
| `--color` | Default text color |
| `--dangerous` | Color to use for warnings and errors |
| `--light-bg` | Generic light background color, used for panels |
| `--link-color` | Default anchor text color |
| `--panel-border-color` | Border color of panel components |
| `--subtle` | Subtle color, used for media source tree |
| `--very-subtle` | Very subtle color, used for drop zone area |
| `--very-subtle-icon-opacity` | Opacity for very subtle icons |


## Themes
### Black on White
![](http://j4p.us/091n1d1z3y1F/Screen%20Shot%202017-03-16%20at%203.33.14%20AM.png)

### White on Black
![](http://j4p.us/3O163v400P30/Screen%20Shot%202017-03-16%20at%203.33.45%20AM.png)
