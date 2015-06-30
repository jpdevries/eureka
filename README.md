# Eureka

WIP. Flexible Media Browser Component. [Try the demo](http://markup.tips/eureka).  
As seen in [Redactor 2.0](https://www.modmore.com/extras/redactor) by modmore. Contributions&nbsp;welcomed.

> With `eureka.js` your users will be saying "I found it!" in no time.  
&emsp;&emsp;&mdash; [@mrktps](https://twitter.com/mrktps)

### Discuss
Join the conversation in our public Gitter chat room.

[![Join the chat at https://gitter.im/jpdevries/eureka](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/jpdevries/eureka?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

### Features
 - Browse multiple media sources for images
 - Drag and Drop Upload Support
 - Flexible Layout
 - Responsive Design
 - Lightweight
   - no external dependencies (not even jQuery)
   - `eureka.min.js`&emsp;65kb minified
   - `eureka.min.css` 40kb minified
 - Accessible
   - supports mobile and touch devices
   - supports `.no-js`
   - ARIA Keyboard Support
   - please log *any* a11y issues [here](https://github.com/jpdevries/eureka/issues)

### Tech Specs
 - Built [HTML-first](http://markup.tips/htmlftw) and powered by [Markup.tips](http://markup.tips)
 - ES5/6 JavaScript authored in [TypeScript](http://www.typescriptlang.org)
 - Extensible theme authored in Object Oriented [Sass](http://sass-lang.com)
 - Automation & Build powered by [Grunt](http://gruntjs.com)

### Preview
![](http://j4p.us/image/2p280e3h3C1z/Screen%20Shot%202015-04-25%20at%2011.24.36%20PM.png)
Eureka draws a flexible view and allows users to browse, upload, and choose media items from any number of different media&nbsp;sources.

### Usage

`eureka.js` needs you to load at least one `JavaScript` file and one `CSS` stylesheet before getting started.
```html
<!-- CSS layout and base styles -->
<link rel="stylesheet" href="assets/css/eureka.min.css">
<!-- if the DOM isn't already populated you'll need your muckboot(s) -->
<script src="assets/js/muckboot.eureka.min.js"></script>
<!-- component source (Eureka Class) -->
<script src="assets/js/eureka.min.js"></script>
```

The Eureka Media Browser is built [HTML-first](http://markup.tips/html-ftw) using [Markup.tips](http://markup.tips). This means `eureka.js` assumes you've populated the `DOM` with `HTML` markup manually. If you haven't, no worries. `muckboot.eureka.js` can do that for you. Let's say you start off with an empty div:

```html
<div class="eureka" id="media-browser_0"></div>
```

_Note the `.eureka` class and the use of a unique identifer. The unique identier is important because `eureka.js` will use it a lot when referencing the `DOM`._

```js
var $muckboot = new MuckBoot({ // paint the DOM
    id:'media-browser_0',
    upload:true // if set to false will not add uploading related elements to the DOM
});
```

Now that `muckboot.eureka.js` has done the prep-work Eureka is ready for instantiation.

```js
var $eureka = new Eureka({ // init the Eureka component
    // REQUIRED SETTINGS
    uid:'media-browser_0', // id of our div
    // if useWebWorkers is true these must be absolute paths or relative to the webserver root
    directoryRequestURL:'fakepi/listdirectory.php', // lists contents of a directory. along with headers Object, sends  's' and 'dir' parameters for media source and current directory
    listSourceRequestURL:'fakepi/listsource.php', // list navigation tree of a given media sources. along with headers Object, sends 's' paramater for media source to list
    listSourcesRequestURL:'fakepi/listsources.php', // fetches a list of all media sources
    
    // OPTIONAL SETTINGS
    directoryChildrenRequestURL:'fakepi/listdirectorychildren.php', // fetches a list of direct children directories of the given directory. If ommited diretoryRequestURL will be used and all non-directory results will be ignored
    useWebWorkers:true, // whether or not to use a worker thread when making XHR Requests
    touch:Modernizr.touch, // or use your own feature detection
    fileUploadURL:undefined, // endpoint to send files to, removes upload components from UI if not set
    navTreeHidden:false, // initially hides the sidebar
    useLocalStorage:true, // whether or not to try and use localStorage to save state data
    displayFullTreePaths:false, // when enabled displays full paths in the tree
    allowRename:true, // disabling removes rename button from contextual menus
    allowDelete:true, // disabling removes delete button from contextual menus
    confirmBeforeDelete:true, // when enabled confirms before deleting items
    storagePrefix:'eureka_', // prepended to localStorage keys
    locale:'en-US', // i18n
    mediaSource:0, // zero-based numeric index of current media source (will override localStorage)
    currentDirectory:'/', // (will override localStorage)
    debug:false, // when enabled traces debugging info to console.log
    headers: [{
        'Powered-By': 'Eureka by Markup.tips' // additional headers for XHR requests
    }]
});
```

Eureka has been instantiated it's up to your user to find or upload the content they&nbsp;seek.

### API
The endpoints you'll need to supply Eureka with are documented in [the Wiki](https://github.com/jpdevries/eureka/wiki/API-Docs).

### Events
`eureka.js` likes to let you know when things happen.

| Event                                      | Note              |
| ------------                               |:--------------    |
| `EurekaModel.EurekaFoundIt`                | Dispatched when a media item is&nbsp;chosen |
| `EurekaModel.EurekaFileRename`             | Dispatched when a media item is&nbsp;renamed |
| `EurekaModel.EurekaUnlink`                 | Dispatched when a media item is&nbsp;deleted |
| `EurekaModel.EurekaDirectoryCreated`       | Dispatched when a new directory is&nbsp;created |
| `EurekaModel.EurekaDirectoryOpened`        | Dispatched when a directory is&nbsp;opened |
| `EurekaModel.EurekaDirectoryChanged`       | Dispatched when the current directory is&nbsp;changed |
| `EurekaModel.EurekaMediaSourceChange`      | Dispatched when the current media source is&nbsp;changed |
| `EurekaModel.EurekaMediaSourcesListChange` | Dispatched when the list of available sources is&nbsp;updated |
| `EurekaModel.EurekaViewChange`             | Dispatched when the view mode is&nbsp;changed |



##### Listening to Events
The `EurekaFoundIt` is dispatched from the DOM element itself. This means that if you create a new Eureka Browser named "foo" like&nbsp;so:
```html
<div class="eureka" id="foo"></div>
<script>
var $muckboot = new MuckBoot({id:'foo'});
var $eureka = new Eureka({uid:'foo'}); // ...
</script>
```

You can listen to when things happen like so:
```js
var el = document.getElementById('foo');
el.addEventListener(EurekaModel.EurekaFoundIt,function(e){
  var data = e.detail;
  var src = data.src; // probably what you are interesting in
  var filename = data.filename; // also good to know
  var filesize = data.filesize;
  var timestamp = data.timestap;
});
```

Isn't that neat?

##### Event Data
Events attach relevent data to the `detail` property of the `Event` itself. `eureka.js` is still in rapid development and events and their corresponding data are not yet fully documented, so log it to the console and see what you get for now. It'll be our own little&nbsp;surprise.

### Browser Support
Eureka targets modern HTML5 browsers and uses the latest draft of the flexible box model spec.
 - Chrome
 - Safari
 - Firefox
 - IE 11,10
   - Basic IE 9 support is available via some external shivs. See [Supporting IE9](https://github.com/jpdevries/eureka/wiki/Supporting-IE9).
 - Sparta
 - ~~Opera~~
  - flexbox layout is totally broken. Not sure why. See [#10](https://github.com/jpdevries/eureka/issues/10).
 - iOS Latest
 - Android Latest

### Keyboard Shortcuts
In addition to the below shortcuts, Eureka supports standard tab-to-focus usability shortcuts.

| Shortcut        | Command              |
| --------------- |:-------------:       |
| Toggle Sidebar      | ctrl ;           |
| Change View      | ctrl alt (1-4)      |
| Change Media Source | alt (1-9)        |
| Delete Item | backspace                |
| Expand Item | spacebar                 |
| Choose Item | return                   |
| Create Directory | ctrl n              |
| Upload Files | ctrl u                  |
| Rename Item | ctrl r                   |
| Filter Items | ctrl f                  |

### Contribution Guidelines
There's [lots to do](https://github.com/jpdevries/eureka/issues). Feel free to discuss or [open an issue](https://github.com/jpdevries/eureka/issues/) before submitting pull requests. Once you've checked out the project you'll want to get up and running with the Grunt&nbsp;workflow:
```bash
cd eureka/_build/
npm install #install node modules
grunt build #build source files
```

To watch files for changes simply run the `grunt`&nbsp;task:
```bash
cd eureka/_build/
grunt #watch for changes
```

You may test with either `examples/index.php` or `examples/muck.php`. HTML-first features are written and tested in `examples/index.php` while `muck.php` is a naked DOM populdated by&nbsp;`muckboot.eureka.js`.
