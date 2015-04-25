# Eureka

WIP. Flexible Media Browser Component.

> With `eureka.js` your users will be saying "I found it!" in no time.  
&emsp;&emsp;&mdash; JP DeVries

![](http://cl.ly/image/3X3p1m041M3f/Screen%20Shot%202015-03-28%20at%202.02.22%20AM.png)

### Usage
The Eureka Media Browser is built [HTML-first](http://markup.tips/html-ftw) using [Markup.tips](http://markup.tips). This means `eureka.js` assumes you've populated the `DOM` with `HTML` markup manually. If you haven't, no worries. `muckboot.eureka.js` can do that for you. Let's say you start off with an empty div:

```html
<div class="eureka" id="redactor-media-browser_0"></div>
```

_Note the `.eureka` class and the use of a unique identifer. The unique identier is important because `eureka.js` will use it a lot when referencing the `DOM`._

```js
var $muckboot = new MuckBoot({ // paint the DOM
    id:'redactor-media-browser_0',
    showDropArea:true // show html5dragndrop zone
});
```

Now that `muckboot.eureka.js` has done the prep-work `eureka.js` is ready for instantiation.

```js
var $eureka = new Eureka({ // init the Eureka component
    uid:'redactor-media-browser_0', // REQUIRED: id of our div
    locale:'en-US', // i18n
    mediaSource:0, // zero-based numeric index of current media source (will override localStorage)
    currentDirectory:undefined, // (will override localStorage)
    fileUploadURL:undefined, // endpoint to send files to
    directoryRequestURL:'fakepi/listdirectory.php',
    listSourceRequestURL:'fakepi/listsource.php',
    listSourcesRequestURL:'fakepi/listsources.php',
    debug:false, // will not trace debugging info to console.log
    confirmBeforeDelete:true, // when enabled confirms before deleting items
    headers: [{
        'Powered-By': 'Eureka by Markup.tips' // additional headers for XHR requests
    }]
});
```

Now that `eureka.js` has been instantiated it's up to your user to find or upload the content they seek.

### Keyboard Shortcuts
| Shortcut        | Command              |
| --------------- |:-------------:       |
| Toggle Sidebar      | ctrl ;           |
| Change View      | ctrl alt (1-4)      |
| Change Media Source | ctrl (1-9)       |
| Delete Item | backspace                |
| Expand Item | spacebar                 |
| Choose Item | return                   |
| Rename Item | ctrl r                   |
| Filter Items | ctrl f                  |


