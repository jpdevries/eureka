/* do not touch this file. see _build/*.js */
(function() {
  if (!HTMLElement.prototype.querySelectorAll) {
    throw new Error('rootedQuerySelectorAll: This polyfill can only be used with browsers that support querySelectorAll');
  }

  // A temporary element to query against for elements not currently in the DOM
  // We'll also use this element to test for :scope support
  var container = document.createElement('div');

  // Check if the browser supports :scope
  try {
    // Browser supports :scope, do nothing
    container.querySelectorAll(':scope *');
  }
  catch (e) {
    // Match usage of scope
    var scopeRE = /^\s*:scope/gi;

    // Overrides
    function overrideNodeMethod(prototype, methodName) {
      // Store the old method for use later
      var oldMethod = prototype[methodName];

      // Override the method
      prototype[methodName] = function(query) {
        var nodeList,
            gaveId = false,
            gaveContainer = false;

        if (query.match(scopeRE)) {
          // Remove :scope
          query = query.replace(scopeRE, '');

          if (!this.parentNode) {
            // Add to temporary container
            container.appendChild(this);
            gaveContainer = true;
          }

          var parentNode = this.parentNode;

          if (!this.id) {
            // Give temporary ID
            this.id = 'rootedQuerySelector_id_'+(new Date()).getTime();
            gaveId = true;
          }

          // Find elements against parent node
          nodeList = oldMethod.call(parentNode, '#'+this.id+' '+query);

          // Reset the ID
          if (gaveId) {
            this.id = '';
          }

          // Remove from temporary container
          if (gaveContainer) {
            container.removeChild(this);
          }

          return nodeList;
        }
        else {
          // No immediate child selector used
          return oldMethod.call(this, query);
        }
      };
    }

    // Browser doesn't support :scope, add polyfill
    overrideNodeMethod(HTMLElement.prototype, 'querySelector');
    overrideNodeMethod(HTMLElement.prototype, 'querySelectorAll');
  }
}());
/*jslint unparam: true, browser: true, devel: true */
var html5Upload = (function(){
    'use strict';

    var module = {},
        noop = function () { },
        console = window.console || { log: noop },
        supportsFileApi;

    // Upload manager constructor:
    function UploadManager(options) {
        var self = this;
        self.dropContainer = options.dropContainer;
        self.inputField = options.inputField;
        self.uploadsQueue = [];
        self.activeUploads = 0;
        self.data = options.data;
        self.key = options.key;
        self.maxSimultaneousUploads = options.maxSimultaneousUploads || -1;
        self.onFileAdded = options.onFileAdded || noop;
        self.uploadUrl = options.uploadUrl;
        self.onFileAddedProxy = function (upload) {
            console.log('Event: onFileAdded, file: ' + upload.fileName);
            self.onFileAdded(upload);
        };

        self.initialize();
    }

    // FileUpload proxy class:
    function FileUpload(file) {
        var self = this;

        self.file = file;
        self.fileName = file.name;
        self.fileSize = file.size;
        self.uploadSize = file.size;
        self.uploadedBytes = 0;
        self.eventHandlers = {};
        self.events = {
            onProgress: function (fileSize, uploadedBytes) {
                var progress = uploadedBytes / fileSize * 100;
                console.log('Event: upload onProgress, progress = ' + progress + ', fileSize = ' + fileSize + ', uploadedBytes = ' + uploadedBytes);
                (self.eventHandlers.onProgress || noop)(progress, fileSize, uploadedBytes);
            },
            onStart: function () {
                console.log('Event: upload onStart');
                (self.eventHandlers.onStart || noop)();
            },
            onCompleted: function (data) {
                console.log('Event: upload onCompleted, data = ' + data);
                file = null;
                (self.eventHandlers.onCompleted || noop)(data);
            }
        };
    }

    FileUpload.prototype = {
        on: function (eventHandlers) {
            this.eventHandlers = eventHandlers;
        }
    };

    UploadManager.prototype = {

        initialize: function () {
            console.log('Initializing upload manager');
            var manager = this,
                dropContainer = manager.dropContainer,
                inputField = manager.inputField,
                cancelEvent = function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                },
                dragOverOnClass = function(e){
                    cancelEvent(e);
                    dropContainer.classList.add('drag-over');
                },
                dragOverOffClass = function(e){
                    cancelEvent(e);
                    dropContainer.classList.remove('drag-over');
                };

            if (dropContainer) {
                /*
                 * Original code
                manager.on(dropContainer, 'dragover', cancelEvent);
                manager.on(dropContainer, 'dragenter', cancelEvent);
                manager.on(dropContainer, 'drop', function (e) {
                    cancelEvent(e);
                    manager.processFiles(e.dataTransfer.files);
                });
                */
                
                manager.on(dropContainer, 'dragenter', dragOverOnClass);
                manager.on(dropContainer, 'dragover', dragOverOnClass);
                manager.on(dropContainer, 'dragleave', dragOverOffClass);
                manager.on(dropContainer, 'drop', function (e) {
                    cancelEvent(e);
                    dragOverOffClass(e);
                    manager.processFiles(e.dataTransfer.files);
                });
            }

            if (inputField) {
                manager.on(inputField, 'change', function () {
                    manager.processFiles(this.files);
                });
            }
        },

        processFiles: function (files) {
            console.log('Processing files: ' + files.length);
            var manager = this,
                len = files.length,
                file,
                upload,
                i;

            for (i = 0; i < len; i += 1) {
                file = files[i];
                if (file.size === 0) {
                    alert('Files with files size zero cannot be uploaded or multiple file uploads are not supported by your browser');
                    break;
                }

                upload = new FileUpload(file);
                manager.uploadFile(upload);
            }
        },

        uploadFile: function (upload) {
            var manager = this;

            manager.onFileAdded(upload);

            // Queue upload if maximum simultaneous uploads reached:
            if (manager.activeUploads === manager.maxSimultaneousUploads) {
                console.log('Queue upload: ' + upload.fileName);
                manager.uploadsQueue.push(upload);
                return;
            }

            manager.ajaxUpload(upload);
        },

        ajaxUpload: function (upload) {
            var manager = this,
                xhr,
                formData,
                fileName,
                file = upload.file,
                prop,
                data = manager.data,
                key = manager.key || 'file';

            console.log('Beging upload: ' + upload.fileName);
            manager.activeUploads += 1;

            xhr = new window.XMLHttpRequest();
            formData = new window.FormData();
            fileName = file.name;

            xhr.open('POST', manager.uploadUrl);

            // Triggered when upload starts:
            xhr.upload.onloadstart = function () {
                // File size is not reported during start!
                console.log('Upload started: ' + fileName);
                upload.events.onStart();
            };

            // Triggered many times during upload:
            xhr.upload.onprogress = function (event) {
                if (!event.lengthComputable) {
                    return;
                }

                // Update file size because it might be bigger than reported by the fileSize:
                upload.events.onProgress(event.total, event.loaded);
            };

            // Triggered when upload is completed:
            xhr.onload = function (event) {
                console.log('Upload completed: ' + fileName);

                // Reduce number of active uploads:
                manager.activeUploads -= 1;

                upload.events.onCompleted(event.target.responseText);

                // Check if there are any uploads left in a queue:
                if (manager.uploadsQueue.length) {
                    manager.ajaxUpload(manager.uploadsQueue.shift());
                }
            };

            // Triggered when upload fails:
            xhr.onerror = function () {
                console.log('Upload failed: ', upload.fileName);
            };

            // Append additional data if provided:
            if (data) {
                for (prop in data) {
                    if (data.hasOwnProperty(prop)) {
                        console.log('Adding data: ' + prop + ' = ' + data[prop]);
                        formData.append(prop, data[prop]);
                    }
                }
            }

            // Append file data:
            formData.append(key, file);

            // Initiate upload:
            xhr.send(formData);
        },

        // Event handlers:
        on: function (element, eventName, handler) {
            if (!element) {
                return;
            }
            if (element.addEventListener) {
                element.addEventListener(eventName, handler, false);
            } else if (element.attachEvent) {
                element.attachEvent('on' + eventName, handler);
            } else {
                element['on' + eventName] = handler;
            }
        }
    };

    module.fileApiSupported = function () {
        if (typeof supportsFileApi !== 'boolean') {
            var input = document.createElement("input");
            input.setAttribute("type", "file");
            supportsFileApi = !!input.files;
        }

        return supportsFileApi;
    };

    module.initialize = function (options) {
        return new UploadManager(options);
    };

    return module;
}());
(function () {
    if (!HTMLElement.prototype.querySelectorAll) {
        throw new Error('rootedQuerySelectorAll: This polyfill can only be used with browsers that support querySelectorAll');
    }
    // A temporary element to query against for elements not currently in the DOM
    // We'll also use this element to test for :scope support
    var container = document.createElement('div');
    // Check if the browser supports :scope
    try {
        // Browser supports :scope, do nothing
        container.querySelectorAll(':scope *');
    }
    catch (e) {
        // Match usage of scope
        var scopeRE = /^\s*:scope/gi;
        // Overrides
        function overrideNodeMethod(prototype, methodName) {
            // Store the old method for use later
            var oldMethod = prototype[methodName];
            // Override the method
            prototype[methodName] = function (query) {
                var nodeList, gaveId = false, gaveContainer = false;
                if (query.match(scopeRE)) {
                    // Remove :scope
                    query = query.replace(scopeRE, '');
                    if (!this.parentNode) {
                        // Add to temporary container
                        container.appendChild(this);
                        gaveContainer = true;
                    }
                    var parentNode = this.parentNode;
                    if (!this.id) {
                        // Give temporary ID
                        this.id = 'rootedQuerySelector_id_' + (new Date()).getTime();
                        gaveId = true;
                    }
                    // Find elements against parent node
                    nodeList = oldMethod.call(parentNode, '#' + this.id + ' ' + query);
                    // Reset the ID
                    if (gaveId) {
                        this.id = '';
                    }
                    // Remove from temporary container
                    if (gaveContainer) {
                        container.removeChild(this);
                    }
                    return nodeList;
                }
                else {
                    // No immediate child selector used
                    return oldMethod.call(this, query);
                }
            };
        }
        // Browser doesn't support :scope, add polyfill
        overrideNodeMethod(HTMLElement.prototype, 'querySelector');
        overrideNodeMethod(HTMLElement.prototype, 'querySelectorAll');
    }
}());
var matches = function (el, selector) {
    return (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector).call(el, selector);
};
var getClosest = function (element, selector) {
    for (; element && element !== document; element = element.parentNode) {
        if (matches(element, selector)) {
            return element;
        }
    }
    return false;
};
var getParents = function (element, selector) {
    var parents = [];
    for (; element && element !== document; element = element.parentNode) {
        if (!selector || (selector && matches(element, selector))) {
            parents.push(element);
        }
    }
    if (parents.length) {
        return parents;
    }
    return null;
};
// attach the .equals method to Array's prototype to call it on any array http://stackoverflow.com/a/14853974/4671250
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;
    // compare lengths - can save a lot of time 
    if (this.length != array.length)
        return false;
    for (var i = 0, l = this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;
        }
        else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
};
/* http://stackoverflow.com/a/18078705/4671250 */
var AJAX = (function () {
    function AJAX() {
        this.x = new XMLHttpRequest();
    }
    //send(method:any, url:string, data:any, callback:any, sync:boolean = true, headers = []) {
    AJAX.prototype.send = function (method, url, data, callback, sync, headers) {
        if (sync === void 0) { sync = true; }
        if (headers === void 0) { headers = []; }
        var that = this;
        this.x.open(method, url, sync);
        this.x.onreadystatechange = function () {
            if (that.x.readyState == 4) {
                callback(this.responseText);
            }
        };
        if (method == 'POST') {
            this.x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        }
        if (headers !== undefined && headers !== null && headers.length !== undefined && headers.length) {
            for (var i = 0; i < headers.length; i++) {
                var obj = headers[i];
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        this.x.setRequestHeader(key, obj[key]);
                    }
                }
            }
        }
        this.x.send(data);
    };
    //get(url:string, data:any, callback:any, sync:boolean = true, headers = []) {
    AJAX.prototype.get = function (url, data, callback, sync, headers) {
        if (sync === void 0) { sync = true; }
        if (headers === void 0) { headers = []; }
        var query = [];
        for (var key in data) {
            query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
        }
        this.send('GET', url + ((url.indexOf('?') > 0) ? '&' : '?') + query.join('&'), null, callback, sync, headers);
    };
    AJAX.prototype.post = function (url, data, callback, sync) {
        if (sync === void 0) { sync = true; }
        var query = [];
        for (var key in data) {
            query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
        }
        //    send(method:any, url:string, data:any, callback:any, sync:boolean = true, headers = []) {
        this.send('POST', url, query.join('&'), callback, sync, (data.headers !== undefined ? data.headers : null));
    };
    AJAX.prototype.setHeaders = function (headers) {
        var that = this;
        for (var i = 0; i < headers.length; i++) {
            var obj = headers[i];
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    this.x.setRequestHeader(key, obj[key]);
                }
            }
        }
    };
    return AJAX;
})();
/// <reference path="DefinitelyTyped/modernizr.d.ts" />
/// <reference path="./plugins.ts" />
/// <reference path="./ajax.ts" />
var _EUREKA = {
    src: (function () {
        var scripts = document.getElementsByTagName("script"), src = scripts[scripts.length - 1].src;
        return src;
    })()
};
var Eureka = (function () {
    function Eureka(opts) {
        this.opts = opts;
        var that = this;
        this._model = new EurekaModel(opts); // give the model the data
        this._view = new EurekaView(); // keep the view stupid
        this._controller = new EurekaController({
            model: this._model,
            view: this._view
        });
        // set references to the controller respectively
        this._model.setController(this._controller);
        this._view.setController(this._controller);
        this._view.init();
        this._view.paint();
        this._controller.init();
        this.fetch(true, false, true);
        this._view.getElement().addEventListener('EurekaFilesUploaded', function (e) {
            that._model.setCurrentDirectory(that._model.getCurrentDirectory(), true, true, true); // trigger a repaint
        });
    }
    Eureka.prototype.fetch = function (dispatch, setLocalStorage, dispatchIdenticalValues) {
        if (dispatch === void 0) { dispatch = true; }
        if (setLocalStorage === void 0) { setLocalStorage = true; }
        if (dispatchIdenticalValues === void 0) { dispatchIdenticalValues = true; }
        var _shouldFetchDirectory = (this._model.getCurrentMediaSource() !== undefined && this._model.getCurrentMediaSource() !== '') ? true : false; // this._model.getCurrentMediaSource() !== '/' &&
        _shouldFetchDirectory = true;
        if (this._model.getDebug())
            console.log('fetch ', dispatch, setLocalStorage, dispatchIdenticalValues);
        if (this._model.getDebug())
            console.log('_shouldFetchDirectory ' + _shouldFetchDirectory);
        //setCurrentMediaSource(currentMediaSource:string, dispatch:boolean = true, setLocalStorage:boolean = true, clearDirectory:boolean = true, dispatchIdenticalValues:boolean = false)
        this._model.setCurrentMediaSource(this._model.getCurrentMediaSource(), dispatch, setLocalStorage, false, dispatchIdenticalValues);
        if (_shouldFetchDirectory) {
            this._model.setCurrentDirectory(this._model.getCurrentDirectory(), dispatch, setLocalStorage, dispatchIdenticalValues);
        }
    };
    Eureka.prototype.getElement = function () {
        return this._view.getElement();
    };
    return Eureka;
})();
var EurekaMediaSource = (function () {
    function EurekaMediaSource(opts) {
        this.opts = opts;
        this._id = '';
        this._title = '';
        if (opts.id !== undefined)
            this._id = opts.id;
        if (opts.title !== undefined)
            this._title = opts.title;
    }
    EurekaMediaSource.prototype.getID = function () {
        return this._id;
    };
    EurekaMediaSource.prototype.setID = function (id) {
        this._id = id;
    };
    EurekaMediaSource.prototype.getTitle = function () {
        return this._title;
    };
    EurekaMediaSource.prototype.setTitle = function (title) {
        this._title = title;
    };
    EurekaMediaSource.prototype.toString = function () {
        return this.getID();
    };
    return EurekaMediaSource;
})();
var EurekaModel = (function () {
    function EurekaModel(opts) {
        this._uid = 'media-browser_0';
        this._storagePrefix = 'eureka_';
        this._sources = [];
        this._navTreeHidden = false;
        this._useLocalStorage = true;
        this._currentDirectory = undefined;
        this._currentView = 'view-a';
        this._locale = 'en-US';
        this._selected = '';
        this._editable = true;
        this._headers = [];
        this._debug = false;
        this._confirmBeforeDelete = true;
        this._displayFullTreePaths = false;
        this._allowRename = true;
        this._allowDelete = true;
        this._touch = false;
        this._prependOptGroupsWithRootOption = true;
        this._showDimensionsColumn = true;
        this._webWorkersPath = '';
        this._directoryRequestURL = '';
        this._directoryChildrenRequestURL = '';
        this._listSourceRequestURL = '';
        this._listSourcesRequestURL = '';
        this._useWebWorkers = false;
        this._sortMediaSources = false;
        this._fullscreenTarget = '.eureka-wrapper';
        this._mediaSourcesListInit = false;
        this._mediaSourceInit = false;
        this.getXHRHeaders = function () {
            return this._headers;
        };
        if (opts.uid !== undefined)
            this._uid = opts.uid;
        if (opts.storagePrefix !== undefined)
            this._storagePrefix = opts.storagePrefix;
        if (opts.locale !== undefined)
            this._locale = opts.locale;
        if (opts.mediaSource !== undefined)
            this._mediaSource = opts.mediaSource;
        if (opts.currentDirectory !== undefined)
            this._currentDirectory = opts.currentDirectory;
        if (opts.headers !== undefined)
            this._headers = opts.headers;
        if (opts.navTreeHidden !== undefined)
            this._navTreeHidden = opts.navTreeHidden;
        if (opts.useLocalStorage !== undefined)
            this._useLocalStorage = opts.useLocalStorage;
        if (opts.currentView !== undefined)
            this._currentView = opts.currentView;
        if (opts.selected !== undefined)
            this._selected = opts.selected;
        if (opts.displayFullTreePaths !== undefined)
            this._displayFullTreePaths = opts.displayFullTreePaths;
        if (opts.allowRename !== undefined)
            this._allowRename = opts.allowRename;
        if (opts.allowDelete !== undefined)
            this._allowDelete = opts.allowDelete;
        if (opts.directoryRequestURL !== undefined)
            this._directoryRequestURL = opts.directoryRequestURL;
        this._directoryChildrenRequestURL = (opts.directoryChildrenRequestURL !== undefined) ? opts.directoryChildrenRequestURL : this._directoryRequestURL;
        if (opts.listSourceRequestURL !== undefined)
            this._listSourceRequestURL = opts.listSourceRequestURL;
        if (opts.listSourcesRequestURL !== undefined)
            this._listSourcesRequestURL = opts.listSourcesRequestURL;
        if (opts.fileUploadURL !== undefined)
            this._fileUploadURL = opts.fileUploadURL;
        if (opts.showDimensionsColumn !== undefined)
            this._showDimensionsColumn = opts.showDimensionsColumn;
        if (opts.useWebWorkers !== undefined)
            this._useWebWorkers = (window.Worker) ? opts.useWebWorkers : false;
        if (opts.sortMediaSources !== undefined)
            this._sortMediaSources = opts.sortMediaSources;
        if (opts.debug === true)
            this._debug = opts.debug;
        if (opts.confirmBeforeDelete !== undefined)
            this._confirmBeforeDelete = opts.confirmBeforeDelete;
        if (opts.touch === true)
            this._touch = true;
        this._webWorkersPath = (opts.webWorkersPath !== undefined) ? opts.webWorkersPath : _EUREKA.src.substring(0, _EUREKA.src.lastIndexOf('/')) + '/workers/';
        if (this._useLocalStorage) {
            if (this.getLocalStorage('currentMediaSource') && !opts.mediaSource)
                this._mediaSource = this.getLocalStorage('currentMediaSource');
            if (this.getLocalStorage('navTreeHidden') && !opts.navTreeHidden)
                this._navTreeHidden = (this.getLocalStorage('navTreeHidden') == 'true' ? true : false);
            if (this.getLocalStorage('currentDirectory') && !opts.currentDirectory)
                this._currentDirectory = this.getLocalStorage('currentDirectory');
            if (this.getLocalStorage('currentView') && !opts.currentView)
                this._currentView = this.getLocalStorage('currentView');
        }
    }
    Object.defineProperty(EurekaModel, "EurekaFoundIt", {
        get: function () { return "EurekaFoundIt"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EurekaModel, "EurekaFileRename", {
        get: function () { return "EurekaFileRename"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EurekaModel, "EurekaUnlink", {
        get: function () { return "EurekaUnlink"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EurekaModel, "EurekaDirectoryCreated", {
        get: function () { return "EurekaDirectoryCreated"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EurekaModel, "EurekaDirectoryOpened", {
        get: function () { return "EurekaDirectoryOpened"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EurekaModel, "EurekaDirectoryClosed", {
        get: function () { return "EurekaDirectoryClosed"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EurekaModel, "EurekaDirectoryChanged", {
        get: function () { return "EurekaDirectoryChanged"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EurekaModel, "EurekaMediaSourceInit", {
        get: function () { return "EurekaMediaSourceInit"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EurekaModel, "EurekaMediaSourceChange", {
        get: function () { return "EurekaMediaSourceChange"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EurekaModel, "EurekaMediaSourcesListInit", {
        get: function () { return "EurekaMediaSourcesListInit"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EurekaModel, "EurekaMediaSourcesListChange", {
        get: function () { return "EurekaMediaSourcesListChange"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EurekaModel, "EurekaViewChange", {
        get: function () { return "EurekaViewChange"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EurekaModel, "EurekaFilesUploaded", {
        get: function () { return "EurekaFilesUploaded"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EurekaModel, "EurekaCanceled", {
        get: function () { return "EurekaCanceled"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EurekaModel, "EurekaTreePainted", {
        get: function () { return "EurekaTreePainted"; },
        enumerable: true,
        configurable: true
    });
    EurekaModel.prototype.getUseWebWorkers = function () {
        return this._useWebWorkers;
    };
    EurekaModel.prototype.getwebWorkersPath = function () {
        return this._webWorkersPath;
    };
    EurekaModel.prototype.getShowDimensionsColumn = function () {
        return this._showDimensionsColumn;
    };
    EurekaModel.prototype.getLocalStorage = function (id) {
        id = this.getStoragePrefix() + id;
        if (localStorage.getItem(id) !== undefined && localStorage.getItem(id) !== 'undefined')
            return localStorage.getItem(id);
        return '';
    };
    EurekaModel.prototype.setLocalStorage = function (id, value) {
        id = this.getStoragePrefix() + id;
        localStorage.setItem(id, value);
    };
    EurekaModel.prototype.useLocalStorage = function () {
        return this._useLocalStorage;
    };
    EurekaModel.prototype.getAlertBeforeDelete = function () {
        return this._confirmBeforeDelete;
    };
    EurekaModel.prototype.getFileUploadURL = function () {
        return this._fileUploadURL;
    };
    EurekaModel.prototype.setFileUploadURL = function (val) {
        this._fileUploadURL = val;
    };
    EurekaModel.prototype.setAlertBeforeDelete = function (val) {
        this._confirmBeforeDelete = val;
    };
    EurekaModel.prototype.getDebug = function () {
        return this._debug;
    };
    EurekaModel.prototype.setDebug = function (debug) {
        this._debug = debug;
    };
    EurekaModel.prototype.getHeaders = function () {
        return this._headers;
    };
    EurekaModel.prototype.getUID = function () {
        return this._uid;
    };
    EurekaModel.prototype.getStoragePrefix = function () {
        return this._storagePrefix;
    };
    EurekaModel.prototype.getSources = function () {
        return this._sources;
    };
    EurekaModel.prototype.getEditable = function () {
        return this._editable;
    };
    EurekaModel.prototype.getDisplayFullTreePaths = function () {
        return this._displayFullTreePaths;
    };
    EurekaModel.prototype.getAllowRename = function () {
        return this._allowRename;
    };
    EurekaModel.prototype.getAllowDelete = function () {
        return this._allowDelete;
    };
    EurekaModel.prototype.getHTML5UploadData = function () {
        return {
            s: this.getCurrentMediaSource(),
            dir: this.getCurrentDirectory()
        };
    };
    EurekaModel.prototype.isTouch = function () {
        return this._touch;
    };
    EurekaModel.prototype.getMediaSourceDTOByID = function (id) {
        if (this.getDebug())
            console.log('getMediaSourceDTOByID: ' + id);
        var sources = this.getSources();
        for (var i = 0; i < sources.length; i++) {
            var source = sources[i];
            if (source.getID() == id) {
                return source;
            }
        }
        if (this.getDebug())
            console.log('no media source found with id: ' + id);
        return null;
    };
    EurekaModel.prototype.getController = function () {
        return this._controller;
    };
    EurekaModel.prototype.setController = function (controller) {
        this._controller = controller;
    };
    EurekaModel.prototype.getNavTreeHidden = function () {
        return this._navTreeHidden;
    };
    EurekaModel.prototype.setNavTreeHidden = function (navTreeHidden) {
        this._navTreeHidden = navTreeHidden;
        if (this._useLocalStorage)
            this.setLocalStorage('navTreeHidden', navTreeHidden);
    };
    EurekaModel.prototype.setCurrentMediaSource = function (currentMediaSource, dispatch, setLocalStorage, clearDirectory, dispatchIdenticalValues) {
        if (dispatch === void 0) { dispatch = true; }
        if (setLocalStorage === void 0) { setLocalStorage = true; }
        if (clearDirectory === void 0) { clearDirectory = true; }
        if (dispatchIdenticalValues === void 0) { dispatchIdenticalValues = false; }
        var that = this;
        if (this.getDebug())
            console.log('setCurrentMediaSource', currentMediaSource, dispatch, setLocalStorage, clearDirectory, dispatchIdenticalValues);
        if (this._mediaSource === currentMediaSource && !dispatchIdenticalValues)
            return;
        this._mediaSource = currentMediaSource;
        if (setLocalStorage && currentMediaSource !== undefined)
            this.setLocalStorage('currentMediaSource', currentMediaSource);
        if (dispatch === false)
            return;
        var currentMediaSourceDTO = this.getMediaSourceDTOByID(this._mediaSource);
        if (currentMediaSourceDTO) {
            (function () {
                var e = document.createEvent('CustomEvent');
                e.initCustomEvent(EurekaModel.EurekaMediaSourceChange, true, true, {
                    currentDirectory: that.getCurrentDirectory(),
                    currentMediaSource: currentMediaSourceDTO,
                    clearDirectory: clearDirectory,
                });
                that.getController().getView().getElement().dispatchEvent(e);
            })();
            if (!that._mediaSourceInit) {
                (function () {
                    var e = document.createEvent('CustomEvent');
                    e.initCustomEvent(EurekaModel.EurekaMediaSourceInit, true, true, {
                        currentDirectory: that.getCurrentDirectory(),
                        currentMediaSource: currentMediaSourceDTO
                    });
                    that.getController().getView().getElement().dispatchEvent(e);
                })();
            }
            this._mediaSourceInit = true;
        }
    };
    EurekaModel.prototype.getCurrentMediaSource = function () {
        return this._mediaSource;
    };
    EurekaModel.prototype.setCurrentDirectory = function (currentDirectory, dispatch, setLocalStorage, dispatchIdenticalValues) {
        if (dispatch === void 0) { dispatch = true; }
        if (setLocalStorage === void 0) { setLocalStorage = true; }
        if (dispatchIdenticalValues === void 0) { dispatchIdenticalValues = false; }
        if (this.getDebug())
            console.log('setCurrentDirectory: ' + currentDirectory, dispatch, setLocalStorage, dispatchIdenticalValues);
        if (setLocalStorage === undefined)
            setLocalStorage = this.useLocalStorage();
        //if(currentDirectory === undefined || currentDirectory === 'undefined') currentDirectory = '/';
        if (this._currentDirectory === currentDirectory && !dispatchIdenticalValues)
            return;
        this._currentDirectory = currentDirectory;
        if (setLocalStorage && currentDirectory)
            this.setLocalStorage('currentDirectory', currentDirectory);
        if (dispatch === false)
            return;
        var e = document.createEvent('CustomEvent');
        e.initCustomEvent(EurekaModel.EurekaDirectoryChanged, true, true, {
            currentDirectory: currentDirectory,
            currentMediaSource: this.getMediaSourceDTOByID(this._mediaSource)
        });
        this.getController().getView().getElement().dispatchEvent(e);
    };
    EurekaModel.prototype.getCurrentDirectory = function () {
        if (this.getDebug())
            console.log('getCurrentDirectory: ' + this._currentDirectory);
        return this._currentDirectory || '/';
    };
    EurekaModel.prototype.setCurrentView = function (currentView, dispatch) {
        if (dispatch === void 0) { dispatch = true; }
        if (this._currentView === currentView)
            return;
        this._currentView = currentView;
        if (this._useLocalStorage)
            this.setLocalStorage('currentView', currentView);
        if (dispatch === false)
            return;
        var e = document.createEvent('CustomEvent');
        e.initCustomEvent(EurekaModel.EurekaViewChange, true, true, {
            currentView: currentView
        });
        this.getController().getView().getElement().dispatchEvent(e);
    };
    EurekaModel.prototype.getCurrentView = function () {
        return this._currentView;
    };
    EurekaModel.prototype.getFullScreenTarget = function () {
        return this._fullscreenTarget;
    };
    EurekaModel.prototype.setLocale = function (locale) {
        this._locale = locale;
    };
    EurekaModel.prototype.getLocale = function () {
        return this._locale;
    };
    EurekaModel.prototype.getPrependOptGroupsWithRootOption = function () {
        return this._prependOptGroupsWithRootOption;
    };
    EurekaModel.prototype.getsortMediaSources = function () {
        return this._sortMediaSources;
    };
    EurekaModel.prototype.getMediaSourcesListInit = function () {
        return this._mediaSourcesListInit;
    };
    EurekaModel.prototype.setSources = function (sources, dispatch) {
        if (dispatch === void 0) { dispatch = true; }
        var that = this;
        if (this.getDebug())
            console.log('setSources' + dispatch);
        this._sources = sources;
        if (dispatch === false)
            return;
        (function () {
            var e = document.createEvent('CustomEvent');
            e.initCustomEvent(EurekaModel.EurekaMediaSourcesListChange, true, true, {
                sources: sources
            });
            that.getController().getView().getElement().dispatchEvent(e);
        })();
        (function () {
            if (!that.getMediaSourcesListInit()) {
                var e = document.createEvent('CustomEvent');
                e.initCustomEvent(EurekaModel.EurekaMediaSourcesListInit, true, true, {
                    sources: sources
                });
                that.getController().getView().getElement().dispatchEvent(e);
            }
        })();
    };
    EurekaModel.prototype.sortResultsById = function (results) {
        var a = [];
        for (var i = 0; i < results.length; i++) {
            var result = results[i];
            a[parseInt(result.id)] = result;
        }
        return a.filter(function (n) { return n != undefined; });
    };
    EurekaModel.prototype.setMediaSourcesData = function (data, dispatch, setLocalStorage, clearDirectory, dispatchIdenticalValues) {
        if (dispatch === void 0) { dispatch = true; }
        if (setLocalStorage === void 0) { setLocalStorage = true; }
        if (clearDirectory === void 0) { clearDirectory = false; }
        if (dispatchIdenticalValues === void 0) { dispatchIdenticalValues = false; }
        var that = this;
        if (that.getDebug())
            console.log('setMediaSourcesData data,dispatch,setLocalStorage,clearDirectory,dispatchIdenticalValues', data, dispatch, setLocalStorage, clearDirectory, dispatchIdenticalValues);
        var results = data.results;
        if (that.getsortMediaSources())
            results = that.sortResultsById(results);
        var sources = [];
        var current = that.getCurrentMediaSource();
        var currentExists = false;
        for (var i = 0; i < results.length; i++) {
            var result = results[i];
            var mediaSourceDTO = new EurekaMediaSource({
                id: result.id,
                title: result.name
            });
            sources.push(mediaSourceDTO);
            if (result.id == current)
                currentExists = true;
        }
        this.setSources(sources);
        //that.setCurrentMediaSource((!currentExists) ? results[0].id : current, dispatch, setLocalStorage, clearDirectory, dispatchIdenticalValues);
        //setCurrentMediaSource(currentMediaSource:string, dispatch:boolean = true, setLocalStorage:boolean = true, clearDirectory:boolean = true, dispatchIdenticalValues:boolean = false) {
        that.setCurrentMediaSource((!currentExists) ? results[0].id : current, true, true, false, true);
    };
    EurekaModel.prototype.renameFile = function (fileName, newFilename) {
        // Create the event
        var e = document.createEvent('CustomEvent');
        e.initCustomEvent('EurekaFileRename', true, true, {
            fileName: fileName,
            newFilename: newFilename,
            cs: this.getController().getModel().getCurrentMediaSource(),
            cd: this.getController().getModel().getCurrentDirectory(),
            path: this.getController().getModel().getCurrentDirectory() + fileName,
            newPath: this.getController().getModel().getCurrentDirectory() + newFilename
        });
        this.getController().getView().getElement().dispatchEvent(e);
    };
    EurekaModel.prototype.deleteFile = function (filename, tr) {
        var that = this;
        var e = document.createEvent('CustomEvent');
        e.initCustomEvent('EurekaUnlink', true, true, {
            filename: tr.getAttribute('data-filename'),
            timestamp: tr.getAttribute('data-timestamp'),
            src: tr.querySelector('.image img, .image .img').getAttribute('src'),
            dimensions: [tr.getAttribute('data-dimensions-w'), tr.getAttribute('data-dimensions-h')],
            filesize: parseInt(tr.getAttribute('data-filesize-bytes'))
        });
        that.getController().getView().getElement().dispatchEvent(e);
    };
    EurekaModel.prototype.setChoosenMediaItem = function (filename) {
        var that = this;
        var tr = getEurekaRowByFileName(filename); // #more reliable than tr.eureka__row.focused
        var img = tr.querySelector('.image img, .image .img');
        var e = document.createEvent('CustomEvent');
        e.initCustomEvent('EurekaFoundIt', true, true, {
            filename: filename,
            timestamp: tr.getAttribute('data-timestamp'),
            src: tr.getAttribute('data-src'),
            thumb: tr.getAttribute('data-thumb'),
            dimensions: [tr.getAttribute('data-dimensions-w'), tr.getAttribute('data-dimensions-h')],
            filesize: parseInt(tr.getAttribute('data-filesize-bytes'))
        });
        that.getController().getView().getElement().dispatchEvent(e);
        function getEurekaRowByFileName(filename) {
            var trs = that.getController().getView().getElement().querySelectorAll('tr.eureka__row');
            for (var i = 0; i < trs.length; i++) {
                var tr = trs[i];
                if (tr.getAttribute('data-filename') == filename)
                    return tr;
            }
            return null;
        }
    };
    EurekaModel.prototype.getSelected = function () {
        return this._selected;
    };
    EurekaModel.prototype.setSelected = function (filename) {
        this._selected = filename;
    };
    EurekaModel.prototype.getListDirectoryRequestURL = function () {
        return this._directoryRequestURL;
    };
    EurekaModel.prototype.getListDirectoryChildrenRequestURL = function () {
        return this._directoryChildrenRequestURL;
    };
    EurekaModel.prototype.setListDirectoryRequestURL = function (url) {
        this._directoryRequestURL = url;
    };
    EurekaModel.prototype.getListSourceRequestURL = function () {
        return this._listSourceRequestURL;
    };
    EurekaModel.prototype.setListSourceRequestURL = function (url) {
        this._listSourceRequestURL = url;
    };
    EurekaModel.prototype.getListSourcesRequestURL = function () {
        return this._listSourcesRequestURL;
    };
    EurekaModel.prototype.setListSourcesRequestURL = function (url) {
        this._listSourcesRequestURL = url;
    };
    return EurekaModel;
})(); // end class EurekaModel
var EurekaView = (function () {
    function EurekaView() {
    }
    EurekaView.prototype.getController = function () {
        return this._controller;
    };
    EurekaView.prototype.setController = function (controller) {
        this._controller = controller;
    };
    EurekaView.prototype.getElement = function () {
        return document.getElementById(this.getController().getModel().getUID());
    };
    EurekaView.prototype.assignFooterProceedListeners = function () {
        var that = this;
        that.getElement().parentNode.querySelector('footer.proceed button.cancel').addEventListener('click', function (e) {
            e.preventDefault();
            (function () {
                var e = document.createEvent('CustomEvent');
                e.initCustomEvent(EurekaModel.EurekaCanceled, true, true, {});
                that.getElement().dispatchEvent(e);
            })();
        });
        that.getElement().parentNode.querySelector('footer.proceed button.cta').addEventListener('click', function (e) {
            e.preventDefault();
            that.getController().getModel().setChoosenMediaItem(that.getController().getModel().getSelected());
        });
    };
    EurekaView.prototype.init = function () {
        var that = this;
        that._handleTreeNodeClicked = function (e) {
            if (that.getController().getModel().getDebug())
                console.log('handleTreeNodeClicked');
            e.preventDefault();
            e.stopPropagation();
            that.handleTreePathClicked(this);
        };
        that._handleTreeFolderClicked = function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (that.getController().getModel().getDebug())
                console.log('handleTreeFolderClicked');
            var _icon = this.querySelector('.fa');
            var _closing = _icon.classList.contains('fa-folder-open');
            var li = that.getClosest(this, 'li');
            var dataCD = this.nextSibling.getAttribute('data-cd') || '/';
            if (_closing) {
                _icon.classList.remove('fa-folder-open');
                _icon.classList.remove('icon-folder-open');
                _icon.classList.add('fa-folder', 'icon-folder');
                li.classList.remove('open');
                if (this.getAttribute('data-open-msg'))
                    this.querySelector('.audible').innerHTML = this.getAttribute('data-open-msg');
            }
            else {
                _icon.classList.remove('fa-folder');
                _icon.classList.remove('icon-folder');
                _icon.classList.add('fa-folder-open');
                _icon.classList.add('icon-folder-open');
                li.classList.add('open');
                if (this.getAttribute('data-close-msg'))
                    this.querySelector('.audible').innerHTML = this.getAttribute('data-close-msg');
            }
            (function () {
                var e = document.createEvent('CustomEvent');
                e.initCustomEvent((_closing) ? EurekaModel.EurekaDirectoryClosed : EurekaModel.EurekaDirectoryOpened, true, true, {
                    cd: that.getController().getModel().getCurrentDirectory(),
                    s: that.getController().getModel().getCurrentMediaSource(),
                    path: dataCD
                });
                that.getElement().dispatchEvent(e);
            })();
        };
        function assignShortcutListeners() {
            document.addEventListener('keydown', function (event) {
                if (that.getController().getModel().getDebug())
                    console.log(event);
                if (event.ctrlKey && event.which === 186) {
                    var e = document.createEvent('Event');
                    e.initEvent('click', true, true);
                    document.getElementById(that.getController().getModel().getUID() + '__pathbrowser_toggle').dispatchEvent(e);
                }
                if (event.altKey && event.ctrlKey && (event.which >= 48 && event.which <= 57)) {
                    try {
                        var btns = that.getElement().querySelectorAll('.view-btns > nav > a');
                        var btn = (btns[event.which - 48 - 1]);
                        if (btn) {
                            var e = document.createEvent('Event');
                            e.initEvent('click', true, true);
                            btn.dispatchEvent(e);
                        }
                    }
                    catch (e) { }
                }
                if (event.altKey && !event.ctrlKey && (event.which >= 49 && event.which <= 57)) {
                    function setSelectOptGroup(select, group) {
                        function getOptGroup() {
                            var optgroups = select.querySelectorAll('optgroup');
                            for (var i = 0; i < optgroups.length; i++) {
                                var optgroup = optgroups[i];
                                if (optgroup.getAttribute('data-source') == group)
                                    return optgroup;
                            }
                            return null;
                        }
                        var optGroup = getOptGroup();
                        if (optGroup) {
                            select.value = optGroup.querySelector('option').value;
                        }
                    }
                    function setSelectOption(select, value) {
                        try {
                            var options = select.querySelectorAll('option');
                            var option = options[value];
                            if (option) {
                                select.value = option.getAttribute('value');
                            }
                        }
                        catch (e) { }
                        /*function hasOption(val) {
                            var options = select.querySelectorAll('option');
                            for(var i = 0; i < options.length; i++) {
                                if(((<HTMLOptionElement>(options[i])).value) == val) return true;
                            }
                            return false;
                        }
                        if(hasOption((event.which - 49).toString())) {
                            select.value = value;
                        }*/
                    }
                    var msSelect = (document.getElementById(that.getController().getModel().getUID() + '__mediasource-select'));
                    setSelectOption(msSelect, (event.which - 49).toString());
                    setSelectOptGroup((document.getElementById(that.getController().getModel().getUID() + '__browsing').querySelector('select')), (event.which - 49).toString());
                    that.getController().getModel().setCurrentMediaSource(msSelect.value, true, true, true, false);
                }
                if (event.which === 8 && document.activeElement) {
                    var e = document.createEvent('Event');
                    e.initEvent('click', true, true);
                    try {
                        document.activeElement.nextSibling.querySelector('a.trash').dispatchEvent(e);
                    }
                    catch (e) { }
                }
                if (event.altKey && event.which === 32 && document.activeElement) {
                    try {
                        var e = document.createEvent('Event');
                        e.initEvent('click', true, true);
                        document.activeElement.nextSibling.querySelector('a.expand').dispatchEvent(e);
                    }
                    catch (e) { }
                }
                if (event.which === 13 && document.activeElement) {
                    try {
                        var e = document.createEvent('Event');
                        e.initEvent('click', true, true);
                        document.activeElement.nextSibling.querySelector('a.choose').dispatchEvent(e);
                    }
                    catch (e) { }
                }
                if (event.ctrlKey && event.which === 82) {
                    try {
                        var e = document.createEvent('Event');
                        e.initEvent('click', true, true);
                        document.activeElement.nextSibling.querySelector('a.rename').dispatchEvent(e);
                    }
                    catch (e) { }
                }
                if (event.ctrlKey && event.which === 78) {
                    try {
                        var e = document.createEvent('Event');
                        e.initEvent('click', true, true);
                        that.getElement().querySelector('.create-new').dispatchEvent(e);
                    }
                    catch (e) { }
                }
                if (event.ctrlKey && event.which === 85) {
                    try {
                        var e = document.createEvent('Event');
                        e.initEvent('click', true, true);
                        document.getElementById(that.getController().getModel().getUID() + '__upload-input').dispatchEvent(e);
                    }
                    catch (e) { }
                }
                if (event.ctrlKey && event.which === 70) {
                    try {
                        document.getElementById(that.getController().getModel().getUID() + '__filter-images').focus();
                    }
                    catch (e) { }
                }
            });
        }
        function showSidebar() {
            var tog = document.getElementById(that.getController().getModel().getUID() + '__pathbrowser_toggle');
            var el = document.getElementById(tog.getAttribute('data-toggle-target'));
            el.classList.remove('hidden');
            document.getElementById(that.getController().getModel().getUID()).classList.add('sidebar-open');
            //document.querySelectorAll('#media-browser_0 .browse-select')[0].classList.add('tablet-p-hidden');
            that.getElement().querySelector('.browse-select').classList.add('tablet-p-hidden');
            that.getController().getModel().setNavTreeHidden(false);
            var toggle = document.getElementById(that.getController().getModel().getUID() + '__pathbrowser_toggle').getElementsByTagName("i")[0];
            toggle.classList.remove('fa-toggle-right');
            toggle.classList.remove('icon-toggle-right');
            toggle.classList.add('fa-toggle-left');
            toggle.classList.add('icon-toggle-left');
            tog.title = tog.getAttribute('data-title-close');
        }
        function hideSidebar() {
            var tog = document.getElementById(that.getController().getModel().getUID() + '__pathbrowser_toggle');
            var el = document.getElementById(tog.getAttribute('data-toggle-target'));
            el.classList.add('hidden');
            document.getElementById(that.getController().getModel().getUID()).classList.remove('sidebar-open');
            //document.querySelectorAll('#media-browser_0 .browse-select')[0].classList.remove('tablet-p-hidden');
            that.getElement().querySelector('.browse-select').classList.remove('tablet-p-hidden');
            that.getController().getModel().setNavTreeHidden(true);
            var toggle = document.getElementById(that.getController().getModel().getUID() + '__pathbrowser_toggle').getElementsByTagName("i")[0];
            toggle.classList.add('fa-toggle-right');
            toggle.classList.add('icon-toggle-right');
            toggle.classList.remove('fa-toggle-left');
            toggle.classList.remove('icon-toggle-left');
            tog.title = tog.getAttribute('data-title-open');
        }
        document.getElementById(that.getController().getModel().getUID() + '__pathbrowser_toggle').addEventListener('click', function (e) {
            var el = document.getElementById(this.getAttribute('data-toggle-target'));
            e.preventDefault();
            if (el.classList.contains('hidden')) {
                showSidebar();
            }
            else {
                hideSidebar();
            }
        });
        this.assignViewButtonListeners();
        this.assignFooterProceedListeners();
        this.assignBrowsingSelectOptGroupListeners();
        this.assignSelectListeners();
        this.assignSortBtnListeners();
        this.assignFilterListeners();
        this.assignCreateNewDirectoryListener();
        this.assignUploadListeners();
        assignShortcutListeners();
        var e = document.createEvent('Event');
        e.initEvent('click', true, true);
        that.getElement().querySelector('.eureka__topbar-nav .view-btns a[data-view="' + that.getController().getModel().getCurrentView() + '"]').dispatchEvent(e);
        if (this.getController().getModel().getNavTreeHidden() === true) {
            hideSidebar();
        }
        // if a droptarget exists and a modern mouse enabled browser is being used
        var dropContainer = document.getElementById(that.getController().getModel().getUID()).querySelector('.dropzone') || null;
        if (html5Upload !== undefined && !(that.getController().getModel().isTouch()) && html5Upload.fileApiSupported() && dropContainer) {
            that._html5Upload = html5Upload.initialize({
                // URL that handles uploaded files
                uploadUrl: that.getController().getModel().getFileUploadURL(),
                // HTML element on which files should be dropped (optional)
                dropContainer: dropContainer,
                // HTML file input element that allows to select files (optional)
                inputField: document.getElementById(that.getController().getModel().getUID() + '__upload-input'),
                // Key for the file data (optional, default: 'file')
                key: 'File',
                data: that.getController().getModel().getHTML5UploadData(),
                // Additional data submitted with file (optional)
                //data: that.getController().getModel().getHeaders(), // NOTE: could also send additional data here
                // Maximum number of simultaneous uploads
                // Other uploads will be added to uploads queue (optional)
                maxSimultaneousUploads: 4,
                // Callback for each dropped or selected file
                // It receives one argument, add callbacks
                // by passing events map object: file.on({ ... })
                onFileAdded: function (file) {
                    function removeMessages() {
                        var rs = dropContainer.querySelector('.progress').querySelectorAll('h2,p');
                        for (var i = 0; i < rs.length; i++) {
                            rs[i].remove();
                        }
                    }
                    removeMessages();
                    // make a really unique identifer
                    var id = file.fileName.replace(/[!\"#$%&'\(\)\*\+,\.\/:;<=>\?\@\[\\\]\^`\{\|\}~]/g, '') + file.fileSize.toString().replace(/[!\"#$%&'\(\)\*\+,\.\/:;<=>\?\@\[\\\]\^`\{\|\}~]/g, '');
                    var bar = document.createElement('div');
                    bar.classList.add('bar');
                    bar.setAttribute('id', id);
                    bar.title = file.fileName + ' is preparing for upload.';
                    var pill = document.createElement('div');
                    pill.setAttribute('style', 'right:100%');
                    bar.appendChild(pill);
                    var dropzone = document.getElementById(that.getController().getModel().getUID()).querySelector('.dropzone');
                    dropzone.classList.remove('complete');
                    dropzone.classList.remove('error');
                    dropzone.classList.add('uploading');
                    dropzone.querySelector('.progress').appendChild(bar);
                    file.on({
                        // Called after received response from the server
                        onCompleted: function (response) {
                            function isJSON(data) {
                                try {
                                    JSON.parse(data);
                                    return true;
                                }
                                catch (e) { }
                                return false;
                            }
                            if (!isJSON(response)) {
                                dropzone.classList.add('error');
                            }
                            bar.setAttribute('title', file.fileName + ' has uploaded');
                            if (dropzone.querySelectorAll('.bar').length >= 2)
                                bar.remove();
                            if (dropzone.querySelectorAll('.bar').length < 2) {
                                setTimeout(function () {
                                    dropzone.querySelector('.progress').innerHTML = '';
                                    dropzone.classList.remove('uploading');
                                    dropzone.classList.add('complete');
                                    (function () {
                                        var div = dropzone.querySelector('.progress');
                                        var h2 = document.createElement('h2');
                                        var icon = document.createElement('i');
                                        icon.setAttribute('class', 'fa fa-check-circle-o icon icon-check-circle-o');
                                        h2.appendChild(icon);
                                        div.appendChild(h2);
                                        var span = document.createElement('span');
                                        span.setAttribute('title', 'files here...');
                                        span.innerHTML = 'Your files';
                                        var p = document.createElement('p');
                                        p.appendChild(span);
                                        p.innerHTML += ' have been successfully uploaded.';
                                        div.appendChild(p);
                                        if (dropzone.classList.contains('error')) {
                                            icon.setAttribute('class', 'fa fa-times-circle icon icon-times-circle');
                                            p.innerHTML = 'Oh no,<br>One or more files&nbsp;were not&nbsp;uploaded.';
                                        }
                                        var e = document.createEvent('CustomEvent');
                                        //that.getElement().dispatchEvent(e);
                                        e.initCustomEvent(EurekaModel.EurekaFilesUploaded, true, true, {});
                                        that.getElement().dispatchEvent(e);
                                        document.getElementById(that.getController().getModel().getUID() + '__upload-form').reset();
                                    })();
                                }, 640);
                            }
                        },
                        // Called during upload progress, first parameter
                        // is decimal value from 0 to 100.
                        onProgress: function (progress, fileSize, uploadedBytes) {
                            progress = Math.ceil(progress);
                            bar.setAttribute('title', file.fileName + ' is ' + progress + '% uploaded');
                            pill.setAttribute('style', 'right:' + (100 - progress).toString() + '%');
                        }
                    });
                }
            });
        }
        else {
            if (dropContainer)
                dropContainer.remove(); // remove the drop container because we can't use it
        }
        if (that.getController().getModel().getFileUploadURL() === undefined || that.getController().getModel().getFileUploadURL() == '') {
            try {
                that.getElement().querySelector('.pathbrowser footer form').remove();
            }
            catch (e) { }
            try {
                that.getElement().querySelector('.upload-form').remove();
            }
            catch (e) { }
            try {
                that.getElement().querySelector('.upload-perhaps').remove();
            }
            catch (e) { }
        }
        if (that.getController().getModel().getCurrentMediaSource() !== undefined && that.getController().getModel().getCurrentMediaSource() !== '/' && that.getController().getModel().getCurrentMediaSource() !== '') {
            that.recursivelyOpenTreeToCurrentDirectory();
        }
        that.getElement().addEventListener(EurekaModel.EurekaDirectoryChanged, function (e) {
            if (that.getController().getModel().getDebug())
                console.log(EurekaModel.EurekaDirectoryChanged);
            var currentDirectory = e.detail.currentDirectory;
            var currentMediaSource = that.getController().getModel().getCurrentMediaSource();
            var split = currentDirectory.split('/');
            split = split.filter(function (n) { return (n !== undefined && n != ""); });
            var levelup = document.getElementById(that.getController().getModel().getUID() + '__pathbrowser').querySelector('.level-up');
            if (split.length >= 1)
                levelup.classList.remove('hidden');
            else
                levelup.classList.add('hidden');
            (function () {
                try {
                    var el = that.getElement().querySelector('.pathbrowser .create-new');
                    el.setAttribute('title', 'Create a new directory in ' + that.sanitizeDisplayPath(currentDirectory));
                    el.querySelector('.audible').innerHTML = el.getAttribute('title');
                }
                catch (e) { }
            })();
            (function () {
                try {
                    var el = that.getElement().querySelector('.pathbrowser .upload-files');
                    el.setAttribute('title', 'Upload media to ' + that.sanitizeDisplayPath(currentDirectory));
                    el.querySelector('.audible').innerHTML = el.getAttribute('title');
                }
                catch (e) { }
            })();
            that.setBrowseSelectValue();
            that.setMediaSourceSelectValue();
            try {
                (that._html5Upload).data = that.getController().getModel().getHTML5UploadData();
            }
            catch (e) { }
            try {
                that.getElement().querySelector('.oh-no code').innerHTML = currentDirectory;
            }
            catch (e) { }
        });
        that.getElement().addEventListener(EurekaModel.EurekaMediaSourceChange, function (e) {
            var mediaSourceTitle = that.getElement().querySelector('.eureka__topbar-nav .mediasource-title');
            if (e.detail.currentMediaSource) {
                var prepend = mediaSourceTitle.getAttribute('data-prepend') || '';
                mediaSourceTitle.innerHTML = prepend + e.detail.currentMediaSource.getTitle();
            }
            that.setBrowseSelectValue();
            that.setMediaSourceSelectValue();
            try {
                (that._html5Upload).data = that.getController().getModel().getHTML5UploadData();
            }
            catch (e) { }
        });
        if (!that.getController().getModel().getShowDimensionsColumn()) {
            try {
                that.getElement().querySelector('.eureka-table th.dimensions').remove();
            }
            catch (e) { }
        }
    };
    EurekaView.prototype.setMediaSourceSelectValue = function () {
        var that = this;
        if (that.getController().getModel().getDebug())
            console.log('setMediaSourceSelectValue');
        var currentDirectory = that.getController().getModel().getCurrentDirectory();
        var currentMediaSource = that.getController().getModel().getCurrentMediaSource();
        var select = document.getElementById(that.getController().getModel().getUID() + '__mediasource-select');
        if (select.value !== currentMediaSource) {
            select.value = currentMediaSource;
        }
    };
    EurekaView.prototype.setBrowseSelectValue = function () {
        var that = this;
        if (that.getController().getModel().getDebug())
            console.log('setBrowseSelectValue');
        var currentDirectory = that.getController().getModel().getCurrentDirectory();
        var currentMediaSource = that.getController().getModel().getCurrentMediaSource();
        var select = document.getElementById(that.getController().getModel().getUID() + '__browsing').querySelector('select');
        var optgroups = select.querySelectorAll('optgroup');
        var optgroup = getOptGroup(optgroups);
        if (optgroup) {
            var opt = searchForValue(optgroup);
            if (opt && select.value !== opt.getAttribute('value')) {
                select.value = opt.getAttribute('value');
            }
        }
        function getOptGroup(optgroups) {
            for (var i = 0; i < optgroups.length; i++) {
                var optgroup = optgroups[i];
                if (optgroup.getAttribute('data-source') == currentMediaSource) {
                    return optgroup;
                }
            }
            return null;
        }
        function searchForValue(optgroup) {
            function splitFilter(path) {
                if (!path)
                    return '';
                var split = path.split('/');
                split = split.filter(function (n) { return (n !== undefined && n != ""); });
                return split;
            }
            var opts = optgroup.querySelectorAll('option');
            for (var i = 0; i < opts.length; i++) {
                var opt = (opts[i]);
                var path = opt.getAttribute('data-cd');
                if (splitFilter(path).toString() == splitFilter(currentDirectory).toString()) {
                    return opt;
                }
            }
        }
    };
    EurekaView.prototype.recursivelyOpenTreeToCurrentDirectory = function () {
        var that = this;
        var pathbrowser = document.getElementById(that.getController().getModel().getUID() + '__pathbrowser');
        var paths = pathbrowser.querySelectorAll('a.path');
        if (that.getController().getModel().getDebug())
            console.log('recursivelyOpenTreeToCurrentDirectory', paths);
        for (var i = 0; i < paths.length; i++) {
            var path = paths[i];
            if (that.getController().getModel().getDebug())
                console.log(path.getAttribute('data-cd').split('/').filter(Boolean).toString(), that.getController().getModel().getCurrentDirectory().split('/').filter(Boolean).toString());
            if (path.getAttribute('data-cd').split('/').filter(Boolean).toString() == that.getController().getModel().getCurrentDirectory().split('/').filter(Boolean).toString()) {
                (function () {
                    path.parentNode.classList.add('active');
                    path.parentNode.classList.add('open');
                    var parents = getParents(path, 'ul');
                    function openFolder(folder) {
                        folder.classList.remove('fa-folder');
                        folder.classList.remove('icon-folder');
                        folder.classList.add('fa-folder-open');
                        folder.classList.add('icon-folder-open');
                        try {
                            folder.querySelector('.audible').innerHTML = folder.getAttribute('data-close-msg');
                        }
                        catch (e) { }
                    }
                    if (parents.length > 1) {
                        for (var i = 0; i < parents.length; i++) {
                            var li = parents[i].parentNode;
                            li.classList.add('open');
                            openFolder((li.querySelector('.folder > i')));
                        }
                    }
                })();
            }
        }
    };
    EurekaView.prototype.assignUploadListeners = function () {
        var that = this;
        var upload_files = that.getElement().querySelector('.pathbrowser .upload-files');
        if (upload_files) {
            upload_files.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                (function () {
                    //var e = document.createEvent('Event');
                    //e.initEvent('click', true, true);
                    var e = new MouseEvent('click', {
                        'view': window,
                        'bubbles': true,
                        'cancelable': true
                    });
                    document.getElementById(that.getController().getModel().getUID() + '__upload-input').dispatchEvent(e);
                })();
            });
        }
        var upload_perhaps = that.getElement().querySelector('.upload-perhaps a');
        if (upload_perhaps) {
            upload_perhaps.addEventListener('click', function (e) {
                e.preventDefault();
                var e = document.createEvent('Event');
                e.initEvent('click', true, true);
                try {
                    upload_files.dispatchEvent(e);
                }
                catch (e) { }
            });
        }
    };
    EurekaView.prototype.assignBrowsingSelectOptGroupListeners = function () {
        var that = this;
        if (that.getController().getModel().getDebug())
            console.log('assignBrowsingSelectOptGroupListeners');
        var select = document.getElementById(that.getController().getModel().getUID() + '__browsing').querySelector('select');
        select.addEventListener('change', function (e) {
            var option = that.getSelectedOption(this);
            var optgroup = that.getClosest(option, 'optgroup');
            var source = optgroup.getAttribute('data-source');
            that.getController().getModel().setCurrentMediaSource(source);
            that.getController().getModel().setCurrentDirectory(option.getAttribute('data-cd'), true, that.getController().getModel().useLocalStorage());
            // fetch current media source's directories
            var ajax = new AJAX();
            ajax.get(that.getController().getModel().getListSourceRequestURL(), { s: that.getController().getModel().getCurrentMediaSource() }, function (data) {
            }, true, that.getController().getModel().getXHRHeaders());
        });
    };
    EurekaView.prototype.assignCreateNewDirectoryListener = function () {
        var that = this;
        try {
            that.getElement().querySelector('.create-new').addEventListener('click', function (e) {
                var li = document.createElement('li');
                var folder = document.createElement('a');
                folder.classList.add('folder');
                folder.innerHTML = '&nbsp;<i class="fa icon fa-folder icon-folder"></i>';
                var path = document.createElement('a');
                path.classList.add('path');
                path.setAttribute('title', 'Browse this directory');
                path.setAttribute('data-cd', '');
                path.setAttribute('contenteditable', 'true');
                path.innerHTML = 'new folder';
                li.appendChild(folder);
                li.appendChild(path);
                li.appendChild(document.createElement('ul'));
                setTimeout(function () {
                    path.focus();
                    try {
                        path.select();
                    }
                    catch (e) { }
                }, 240);
                var ul = (that.getElement().querySelector('.pathbrowser .tree li.active > ul') || that.getElement().querySelector('.pathbrowser .tree > ul'));
                ul.classList.add('open');
                (ul.parentNode).classList.add('open');
                try {
                    (ul.previousSibling).previousSibling.querySelector('.fa').setAttribute('class', 'fa icon fa-folder-open icon-folder-open');
                }
                catch (e) { }
                path.addEventListener('focus', function (e) {
                    this.addEventListener('keydown', handleKeyDown, false);
                }, false);
                path.addEventListener('blur', function (e) {
                    this.removeEventListener('keydown', handleKeyDown, false);
                }, false);
                function handleKeyDown(e) {
                    //var code = getCodeToFocus(this);
                    //var tr = that.getClosest(this, '.contextual').previousSibling;
                    if (e.keyCode === 13) {
                        e.preventDefault();
                        e.stopPropagation();
                        this.blur();
                        this.setAttribute('contenteditable', 'false');
                        that.getElement().querySelector('button.create-new').focus();
                        var foldername = this.innerHTML;
                        var e = document.createEvent('CustomEvent');
                        //that.getElement().dispatchEvent(e);
                        e.initCustomEvent('EurekaDirectoryCreated', true, true, {
                            newdirectory: foldername,
                            cd: that.getController().getModel().getCurrentDirectory(),
                            s: that.getController().getModel().getCurrentMediaSource(),
                            path: that.getController().getModel().getCurrentDirectory() + foldername
                        });
                        that.getElement().dispatchEvent(e);
                    }
                }
                ul.appendChild(li);
            });
        }
        catch (e) { }
    };
    EurekaView.prototype.assignViewButtonListeners = function () {
        var that = this;
        var model = this.getController().getModel();
        function setCurrent(el) {
            var anchors = document.querySelectorAll(".eureka__topbar-nav .view-btns a[data-view]:not(.view-f-btn)");
            for (var i = 0; i < anchors.length; i++) {
                var anchor = anchors[i];
                anchor.classList.remove('current');
            }
            el.classList.add('current');
        }
        var anchors = document.querySelectorAll(".eureka__topbar-nav .view-btns a[data-view]:not(.view-f-btn)");
        for (var i = 0; i < anchors.length; i++) {
            var current = anchors[i];
            current.addEventListener('click', function (e) {
                e.preventDefault();
                var that = this;
                var _v = this.getAttribute('data-view');
                var classes = ['view-a', 'view-b', 'view-c', 'view-d', 'view-e'];
                for (var _i = 0; _i < classes.length; _i++) {
                    var c = classes[_i];
                    document.getElementById(that.getAttribute('data-view-target')).classList.remove(c);
                }
                document.getElementById(that.getAttribute('data-view-target')).classList.add(_v);
                setCurrent(that);
                model.setCurrentView(_v);
            }, true);
        }
        var fullscreenBtn = document.querySelector(".eureka__topbar-nav .view-btns .view-f-btn");
        if (fullscreenBtn)
            fullscreenBtn.addEventListener('click', function (e) {
                e.preventDefault();
                if (that.isFullScreen()) {
                    that.runPrefixMethod(document, "CancelFullScreen");
                    fullscreenBtn.querySelector('i').classList.remove('fa-compress');
                    fullscreenBtn.querySelector('i').classList.remove('icon-compress');
                }
                else {
                    //setCurrent(this);
                    that.requestFullScreen();
                    fullscreenBtn.querySelector('i').classList.add('fa-compress');
                    fullscreenBtn.querySelector('i').classList.add('icon-compress');
                }
            });
    };
    EurekaView.prototype.isFullScreen = function () {
        return this.runPrefixMethod(document, "FullScreen") || this.runPrefixMethod(document, "IsFullScreen");
    };
    EurekaView.prototype.requestFullScreen = function () {
        this.runPrefixMethod(document.querySelector(this.getController().getModel().getFullScreenTarget()), "RequestFullScreen");
    };
    EurekaView.prototype.runPrefixMethod = function (obj, method) {
        var pfx = ["webkit", "moz", "ms", "o", ""];
        var p = 0, m, t;
        while (p < pfx.length && !obj[m]) {
            m = method;
            if (pfx[p] == "") {
                m = m.substr(0, 1).toLowerCase() + m.substr(1);
            }
            m = pfx[p] + m;
            t = typeof obj[m];
            if (t != "undefined") {
                pfx = [pfx[p]];
                return (t == "function" ? obj[m]() : obj[m]);
            }
            p++;
        }
    };
    EurekaView.prototype.assignARIAKeyListeners = function () {
        var that = this;
        // ARIA focus support for non-contextual rows
        (function () {
            function setFocused(el) {
                var rows = document.querySelectorAll(".eureka-table tbody > tr:not(.contextual)");
                for (var i = 0; i < rows.length; i++) {
                    var current = rows[i];
                    if (el !== current && current.classList.contains("focused"))
                        current.classList.remove('focused');
                }
                el.classList.add('focused');
                var _cta = that.getProceedFooter().querySelector('button.cta');
                _cta.removeAttribute('disabled');
                _cta.classList.remove('muted');
                _cta.classList.add('go');
                that.getController().getModel().setSelected(el.getAttribute('data-filename'));
            }
            function handleBlur(el) {
                var contextual = document.getElementById('eureka_contextual__' + el.getAttribute('data-safe-filename'));
                contextual.focus();
                //that.getProceedFooter().querySelector('button.cta').classList.add('muted');
                var _cta = that.getProceedFooter().querySelector('button.cta');
                _cta.classList.remove('go');
                //_cta.setAttribute('disabled','disabled');
                _cta.classList.add('muted');
            }
            var rows = document.querySelectorAll(".eureka-table tbody > tr:not(.contextual)");
            for (var i = 0; i < rows.length; i++) {
                var current = rows[i];
                current.addEventListener('click', function (e) {
                    e.preventDefault();
                    //var _as = document.querySelectorAll(".eureka-table tbody > tr:not(.contextual)");
                    setFocused(this);
                }, false);
                current.addEventListener('focus', function (e) {
                    e.preventDefault();
                    //var _as = document.querySelectorAll(".eureka-table tbody > tr:not(.contextual)");
                    setFocused(this);
                }, false);
                current.addEventListener('blur', function (e) {
                    handleBlur(this);
                }, false);
            }
        }());
    };
    EurekaView.prototype.assignSortBtnListeners = function () {
        var that = this;
        var sortBtns = that.getElement().querySelectorAll('.eureka-table th .fa-sort');
        for (var i = 0; i < sortBtns.length; i++) {
            var sortBtn = sortBtns[i];
            function handleSortBtnClicked(e) {
                e.preventDefault();
                e.stopPropagation();
                // toggle between 0 and 1
                this.setAttribute('data-sort-asc', Math.abs(parseInt(this.getAttribute('data-sort-asc')) - 1).toString());
                var sortby = this.getAttribute('data-sortby');
                var sortASC = (this.getAttribute('data-sort-asc') == "1") ? true : false;
                var rows = [];
                var rs = document.querySelectorAll('.eureka-table tbody > tr:not(.contextual)');
                for (var i = 0; i < rs.length; i++) {
                    rows.push(rs[i]);
                }
                switch (sortby) {
                    case 'dimensions':
                        rows.sort(function (a, b) {
                            return (parseInt(a.getAttribute('data-dimensions-w')) * parseInt(a.getAttribute('data-dimensions-h'))) - (parseInt(b.getAttribute('data-dimensions-w')) * parseInt(b.getAttribute('data-dimensions-h')));
                        });
                        break;
                    case 'filesize':
                        rows.sort(function (a, b) {
                            return parseInt(a.getAttribute('data-filesize-bytes')) - parseInt(b.getAttribute('data-filesize-bytes'));
                        });
                        break;
                    case 'editedon':
                        rows.sort(function (a, b) {
                            return parseInt(a.getAttribute('data-timestamp')) - parseInt(b.getAttribute('data-timestamp'));
                        });
                        break;
                    default:
                        rows.sort(function (a, b) {
                            if (a.getAttribute('data-filename') > b.getAttribute('data-filename'))
                                return 1;
                            if (a.getAttribute('data-filename') < b.getAttribute('data-filename'))
                                return -1;
                            return 0;
                        });
                        break;
                }
                if (!sortASC) {
                    rows.reverse();
                }
                var s = '';
                for (var _i = 0; _i < rows.length; _i++) {
                    var row = rows[_i];
                    s += row.outerHTML;
                }
                that.getElement().querySelector('.eureka-table tbody').innerHTML = s;
            }
            sortBtn.removeEventListener('click', handleSortBtnClicked, true); // assignSortBtnListeners should only be called once but this is another layer of protection
            sortBtn.addEventListener('click', handleSortBtnClicked, true);
        }
    };
    EurekaView.prototype.assignFilterListeners = function () {
        var that = this;
        function unFilterView() {
            var rows = document.querySelectorAll(".eureka-table tbody > tr:not(.contextual)");
            for (var i = 0; i < rows.length; i++) {
                var row = rows[i];
                row.classList.remove('hidden');
            }
            document.getElementById(that.getController().getModel().getUID()).querySelector('.eureka-table > table > tbody').classList.remove('filtered');
        }
        function filterView(value) {
            var rows = that.getElement().querySelectorAll(".eureka-table tbody > tr:not(.contextual)");
            for (var i = 0; i < rows.length; i++) {
                var row = rows[i];
                var show = false;
                var tokens = [row.getAttribute('data-filename')];
                if (row.getAttribute('data-tokens'))
                    tokens = tokens.concat(row.getAttribute('data-tokens').split('||'));
                (function () {
                    for (var _i = 0; _i < tokens.length; _i++) {
                        var token = tokens[_i];
                        if (value.length && (token == value || token.indexOf(value) > -1)) {
                            show = true;
                            break;
                        }
                    }
                })();
                if (!show) {
                    row.classList.add('hidden');
                    row.classList.remove('visible');
                }
                else {
                    row.classList.add('visible');
                    row.classList.remove('hidden');
                }
                document.getElementById(that.getController().getModel().getUID()).querySelector('.eureka-table > table > tbody').classList.add('filtered');
            }
        }
        var input = document.getElementById(that.getController().getModel().getUID() + '__filter-images');
        input.addEventListener("input", function (e) {
            if (this.value) {
                filterView(this.value);
            }
            else {
                unFilterView();
            }
        }, false);
    };
    EurekaView.prototype.sanitizeDisplayPath = function (path) {
        var split = path.split('/');
        split = split.filter(function (n) { return (n !== undefined && n != ""); });
        return split.join('/');
    };
    EurekaView.prototype.getProceedFooter = function () {
        return this.getElement().parentNode.querySelector('footer.proceed');
    };
    EurekaView.prototype.handleTreePathClicked = function (el) {
        var that = this;
        if (that.getController().getModel().getDebug())
            console.log('handleTreePathClicked: ' + (el.getAttribute('data-cd') || '/'));
        that.getController().getModel().setCurrentDirectory((el.getAttribute('data-cd') || '/'), true, undefined);
        function deactivatePaths() {
            var pathBrowser = document.getElementById(that.getController().getModel().getUID() + '__pathbrowser');
            var paths = pathBrowser.querySelectorAll("nav.tree a.path");
            for (var i = 0; i < paths.length; i++) {
                var path = paths[i];
                var li = that.getClosest(path, 'li');
                li.classList.remove('active');
            }
        }
        /*var source = that.getController().getModel().getCurrentMediaSource();
        var ajax = new AJAX();
        ajax.get(
            that.getController().getModel().getListDirectoryRequestURL(),
            { s: source, dir: el.getAttribute('data-cd') || '/' },
            function (data) {
                data = JSON.parse(data);
                if(that.getController().getModel().getDebug()) console.log(data);
                that.paintJSON(data);
            },
            true,
            that.getController().getModel().getXHRHeaders()
        );*/
        /*
        ajax.get(that.getController().getModel().getListDirectoryRequestURL(), { s: source, dir: el.getAttribute('data-cd') }, function (data) {
            that.paintJSON(data);
        });
        */
        var li = that.getClosest(el, 'li');
        deactivatePaths();
        li.classList.add('active');
    };
    EurekaView.prototype.assignTreeListeners = function () {
        var that = this;
        if (that.getController().getModel().getDebug())
            console.log('assignTreeListeners');
        var pathBrowser = document.getElementById(that.getController().getModel().getUID() + '__pathbrowser');
        var paths = pathBrowser.querySelectorAll("nav.tree a.path");
        for (var i = 0; i < paths.length; i++) {
            var path = paths[i];
            path.addEventListener('click', that._handleTreeNodeClicked, false);
        }
        this.assignTreeFolderListeners();
    };
    EurekaView.prototype.assignTreeFolderListeners = function () {
        var that = this;
        if (that.getController().getModel().getDebug())
            console.log('assignTreeFolderListeners');
        var pathBrowser = document.getElementById(that.getController().getModel().getUID() + '__pathbrowser');
        var folders = pathBrowser.querySelectorAll("nav.tree a.folder");
        for (var i = 0; i < folders.length; i++) {
            var folder = folders[i];
            folder.addEventListener('click', that._handleTreeFolderClicked, false);
        }
    };
    EurekaView.prototype.assignSelectListeners = function () {
        var that = this;
        var mediaSourceSelect = that.getElement().querySelector('#' + that.getController().getModel().getUID() + '__mediasource-select');
        mediaSourceSelect.addEventListener('change', function () {
            that.getController().getModel().setCurrentMediaSource(this.value, true, that.getController().getModel().useLocalStorage());
            that.getController().getModel().setCurrentDirectory('/', false, that.getController().getModel().useLocalStorage());
            var ajax = new AJAX();
            ajax.get(that.getController().getModel().getListSourceRequestURL(), { s: that.getController().getModel().getCurrentMediaSource() }, function (data) {
            }, true, that.getController().getModel().getXHRHeaders());
        });
        var levelUp = (that.getElement().querySelector('.level-up'));
        levelUp.addEventListener('click', function (e) {
            e.preventDefault();
            var currentDirectory = that.getController().getModel().getCurrentDirectory();
            var split = currentDirectory.split('/');
            split = split.filter(function (n) { return (n !== undefined && n != ""); });
            if (split && split.length) {
                var destDirectory = '/';
                if (split.length > 1) {
                    split.pop();
                    destDirectory = split.join('/');
                }
                that.getController().getModel().setCurrentDirectory(destDirectory, true, true, false);
            }
        });
    };
    EurekaView.prototype.emptyTree = function () {
        var that = this;
        var pathBrowser = document.getElementById(that.getController().getModel().getUID() + '__pathbrowser');
        (function () {
            var paths = pathBrowser.querySelectorAll("nav.tree a.path");
            for (var i = 0; i < paths.length; i++) {
                var path = paths[i]; // #janky typescript doesn't seem to support <HTMLElement>.remove();
                path.removeEventListener('click', that._handleTreeNodeClicked, false);
                path.remove();
            }
        })();
        (function () {
            var folders = pathBrowser.querySelectorAll("nav.tree a.folder");
            for (var i = 0; i < folders.length; i++) {
                var folder = folders[i]; // #janky typescript doesn't seem to support <HTMLElement>.remove();
                folder.removeEventListener('click', that._handleTreeFolderClicked, false);
                folder.remove();
            }
        })();
    };
    EurekaView.prototype.assignDraggableListeners = function () {
        var kindaDraggables = document.querySelectorAll('*[sorta-draggable="true"]');
        for (var i = 0; i < kindaDraggables.length; i++) {
            var kindaDraggable = kindaDraggables[i];
            kindaDraggable.addEventListener('blur', function (e) {
                this.parentNode.draggable = false;
            });
            kindaDraggable.addEventListener('focus', function (e) {
                this.parentNode.draggable = false;
            });
        }
    };
    EurekaView.prototype.assignChooseClickListeners = function () {
        var that = this;
        if (that.getController().getModel().getDebug())
            console.log('assignChooseClickListeners');
        var rows = that.getElement().querySelectorAll('tr.eureka__row');
        for (var i = 0; i < rows.length; i++) {
            function addDblClickListener(tr) {
                tr.querySelector('div.image').addEventListener('dblclick', function (e) {
                    var image = this;
                    (function () {
                        var e = (document.createEvent('CustomEvent'));
                        e.initCustomEvent('EurekaFoundIt', true, true, {
                            filename: tr.getAttribute('data-filename'),
                            timestamp: tr.getAttribute('data-timestamp'),
                            src: tr.getAttribute('data-src'),
                            thumb: tr.getAttribute('data-thumb'),
                            dimensions: [tr.getAttribute('data-dimensions-w'), tr.getAttribute('data-dimensions-h')],
                            filesize: parseInt(tr.getAttribute('data-filesize-bytes'))
                        });
                        that.getController().getView().getElement().dispatchEvent(e);
                    })();
                });
            }
            addDblClickListener((rows[i]));
        }
    };
    EurekaView.prototype.paint = function () {
        this.assignARIAKeyListeners();
        this.assignContextualClickListeners();
        this.assignDraggableListeners();
        this.assignChooseClickListeners();
        this.assignSortBtnListeners();
        //this.assignContextualRowListeners();
    };
    EurekaView.prototype.createTreeNode = function (path) {
        var that = this;
        path = path.split('/').filter(Boolean).join('/') + '/';
        var li = document.createElement('li');
        var folder = document.createElement('a');
        folder.innerHTML = '&nbsp;';
        folder.setAttribute('href', 'javascript:;');
        folder.classList.add('folder');
        folder.setAttribute('data-open-msg', 'Expand ' + path + ' ');
        folder.setAttribute('data-close-msg', 'Collapse ' + path + ' ');
        var folderOpenIcon = document.createElement('i');
        folderOpenIcon.classList.add('fa');
        folderOpenIcon.classList.add('icon');
        folderOpenIcon.classList.add('fa-folder');
        folderOpenIcon.classList.add('icon-folder');
        folder.appendChild(folderOpenIcon);
        (function () {
            var audible = document.createElement('span');
            audible.classList.add('audible');
            audible.innerHTML = folder.getAttribute('data-open-msg');
            folder.appendChild(audible);
        })();
        var a = document.createElement('a');
        a.classList.add('path');
        a.setAttribute('href', 'javascript:;');
        a.setAttribute('title', 'Browse ' + path);
        var split = path.split('/');
        split = split.filter(function (n) { return (n !== undefined && n != ""); });
        var displayPath = split.join('/');
        if (!that.getController().getModel().getDisplayFullTreePaths()) {
            displayPath = split[split.length - 1];
        }
        else {
            if (displayPath[displayPath.length - 1] == '/')
                displayPath = displayPath.substring(0, displayPath.length - 1);
        }
        a.setAttribute('data-cd', path);
        a.innerHTML = ' ' + displayPath;
        li.appendChild(folder);
        li.appendChild(a);
        var _ul = document.createElement("ul");
        li.appendChild(_ul);
        return li;
    };
    EurekaView.prototype.paintTree = function (data) {
        var that = this;
        if (that.getController().getModel().getDebug())
            console.log('paintTree', data);
        var tree = (that.getElement().querySelector('nav.tree'));
        var results = data.results;
        function printTreeNavResults(results, ul) {
            for (var i = 0; i < results.length; i++) {
                var result = results[i];
                var li = that.createTreeNode(result.path);
                var _ul = li.querySelector('ul');
                if (result.children !== undefined && result.children.length) {
                    printTreeNavResults(result.children, _ul);
                }
                ul.appendChild(li);
            }
        }
        tree.innerHTML = '';
        var ul = document.createElement('ul');
        tree.appendChild(ul);
        printTreeNavResults(results, ul);
        that.assignTreeListeners();
        that.recursivelyOpenTreeToCurrentDirectory();
        var e = document.createEvent('CustomEvent');
        e.initCustomEvent(EurekaModel.EurekaTreePainted, true, true, {
            data: data
        });
        that.getElement().dispatchEvent(e);
    };
    EurekaView.prototype.paintJSON = function (data) {
        var that = this;
        if (that.getController().getModel().getDebug())
            console.log('paintJSON', data);
        var model = this.getController().getModel();
        var cd = data.cd.charAt(data.cd.length - 1) == '/' ? data.cd : data.cd + '/';
        var results = data.results;
        var tbodyHTML = '';
        var directoriesToAdd = [];
        var fileAdded = false;
        that.getElement().classList.remove('nothing-found');
        for (var i = 0; i < results.length; i++) {
            var result = results[i];
            if (result.filename) {
                var filename = result.filename;
                var safeFileName = filename.replace(/[!\"#$%&'\(\)\*\+,\.\/:;<=>\?\@\[\\\]\^`\{\|\}~]/g, '');
                var src = result.src;
                var thumb = result.thumb;
                var filesize = result.filesize;
                var dimensions = result.dimensions;
                var editedon = (parseInt(result.editedon)) > 0 ? parseInt(result.editedon) : null;
                var tr = document.createElement("tr");
                tr.classList.add('eureka__row');
                //tr.setAttribute('contenteditable', true);
                tr.setAttribute('tabindex', "0");
                tr.setAttribute('data-tokens', '');
                tr.setAttribute('data-filename', filename);
                tr.setAttribute('data-safe-filename', safeFileName);
                tr.setAttribute('data-src', src);
                if (thumb)
                    tr.setAttribute('data-thumb', thumb);
                tr.setAttribute('data-dimensions-w', dimensions.split('x')[0]);
                tr.setAttribute('data-dimensions-h', dimensions.split('x')[1]);
                tr.setAttribute('data-filesize-bytes', filesize);
                tr.setAttribute('data-timestamp', (editedon) ? editedon.toString() : '0');
                var td = document.createElement("td");
                td.setAttribute('contenteditable', 'false');
                td.classList.add('eureka__row-image');
                var imgD = document.createElement('div');
                imgD.classList.add('image');
                var img = document.createElement('img');
                img.setAttribute('id', safeFileName + '__thumb');
                function addErrorListener(img, result, safeFileName) {
                    img.addEventListener('error', function () {
                        var a = result.filename.split('.');
                        var icon = 'file-o';
                        switch (a[a.length - 1].toLowerCase()) {
                            case 'css':
                                icon = 'css3';
                                break;
                            case 'csv':
                                icon = 'file-excel-o';
                                break;
                            case 'xls':
                                icon = 'file-excel-o';
                                break;
                            case 'numbers':
                                icon = 'file-excel-o';
                                break;
                            case 'css':
                                icon = 'file-excel-o';
                                break;
                            case 'mp3':
                                icon = 'file-sound-o';
                                break;
                            case 'wav':
                                icon = 'file-sound-o';
                                break;
                            case 'wma':
                                icon = 'file-sound-o';
                                break;
                            case 'aac':
                                icon = 'file-sound-o';
                                break;
                            case 'flac':
                                icon = 'file-sound-o';
                                break;
                            case 'ppt':
                                icon = 'file-powerpoint-o';
                                break;
                            case 'pot':
                                icon = 'file-powerpoint-o';
                                break;
                            case 'pps':
                                icon = 'file-powerpoint-o';
                                break;
                            case 'zip':
                                icon = 'file-zip-o';
                                break;
                            case 'gzip':
                                icon = 'file-zip-o';
                                break;
                            case 'tar':
                                icon = 'file-zip-o';
                                break;
                            case 'mp4':
                                icon = 'file-movie-o';
                                break;
                            case 'ogv':
                                icon = 'file-movie-o';
                                break;
                            case 'm4v':
                                icon = 'file-movie-o';
                                break;
                            case 'avi':
                                icon = 'file-movie-o';
                                break;
                            case 'jpg':
                            case 'jpeg':
                            case 'gif':
                            case 'tiff':
                            case 'png':
                            case 'bpg':
                            case 'img':
                            case 'webp':
                                icon = 'file-picture-o';
                                break;
                            case 'php':
                            case 'html':
                            case 'htm':
                            case 'md':
                                icon = 'file-code-o';
                                break;
                            case 'js':
                                icon = 'file-text-o';
                                break;
                            default:
                                icon = 'file-o';
                                break;
                        }
                        var div = (function () {
                            var div = document.createElement('div');
                            div.classList.add('icon-wrapper');
                            div.classList.add('img');
                            var i = document.createElement('i');
                            i.classList.add('fa');
                            i.classList.add('icon');
                            i.classList.add('fa-' + icon);
                            i.classList.add('icon-' + icon);
                            div.appendChild(i);
                            return div;
                        })();
                        try {
                            document.getElementById(safeFileName + '__thumb').outerHTML = div.outerHTML;
                        }
                        catch (e) { }
                    });
                }
                addErrorListener(img, result, safeFileName);
                //img.setAttribute('alt',filename); // after a11y testing this was determined to be unecessary - jp
                imgD.appendChild(img);
                img.setAttribute('src', (thumb) ? thumb : src);
                var code = document.createElement('code');
                code.setAttribute('contenteditable', 'true');
                code.setAttribute('tabindex', '-1');
                code.setAttribute('sorta-draggable', 'true');
                code.innerHTML = filename;
                td.appendChild(imgD);
                td.appendChild(code);
                function createCode(html) {
                    var tag = document.createElement('code');
                    tag.innerHTML = html;
                    return tag;
                }
                var tdDimensionCell = document.createElement('td');
                tdDimensionCell.classList.add('eureka__row-dimensions');
                tdDimensionCell.appendChild(createCode(dimensions || "n/a"));
                var tdFilesizeCell = document.createElement('td');
                tdFilesizeCell.classList.add('eureka__row-filesize');
                if (parseInt(filesize)) {
                    tdFilesizeCell.appendChild(createCode(that.formatFileSize(filesize)));
                }
                else {
                    tdFilesizeCell.appendChild(createCode('n/a'));
                }
                var tdEditedOnCell = document.createElement('td');
                tdEditedOnCell.classList.add('eureka__row-editedon');
                if (editedon) {
                    tdEditedOnCell.appendChild(createCode((new Date(editedon * 1000)).toLocaleDateString(model.getLocale(), {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                    })));
                }
                else {
                    tdEditedOnCell.appendChild(createCode('n/a'));
                }
                tr.appendChild(td);
                if (that.getController().getModel().getShowDimensionsColumn())
                    tr.appendChild(tdDimensionCell);
                tr.appendChild(tdFilesizeCell);
                tr.appendChild(tdEditedOnCell);
                tbodyHTML += tr.outerHTML;
                function createContextualRow() {
                    var tr = document.createElement('tr');
                    tr.classList.add('contextual');
                    tr.setAttribute('id', 'eureka_contextual__' + safeFileName);
                    //tr.setAttribute('tabindex','0');
                    var td = document.createElement('td');
                    td.setAttribute('colspan', '4');
                    function createFlexibleNav() {
                        var nav = document.createElement('nav');
                        nav.classList.add('flexible_row');
                        nav.classList.add('contextual__nav');
                        function createExpandBtn() {
                            var a = document.createElement('a');
                            a.classList.add('expand');
                            a.setAttribute('href', src);
                            a.setAttribute('title', 'Expand ' + filename);
                            a.setAttribute('target', '_blank');
                            a.setAttribute('tabindex', '0');
                            var fa = document.createElement('i');
                            fa.classList.add('fa');
                            fa.classList.add('icon');
                            fa.classList.add('fa-expand');
                            fa.classList.add('icon-expand');
                            a.appendChild(fa);
                            a.innerHTML += ' Expand';
                            return a;
                        }
                        function createChooseBtn() {
                            var a = document.createElement('a');
                            a.classList.add('choose');
                            a.setAttribute('title', 'Choose ' + filename);
                            a.setAttribute('target', '_blank');
                            a.setAttribute('tabindex', '0');
                            var fa = document.createElement('i');
                            fa.classList.add('fa');
                            fa.classList.add('icon');
                            fa.classList.add('fa-check-circle-o');
                            fa.classList.add('icon-check-circle-o');
                            a.appendChild(fa);
                            a.innerHTML += ' Choose';
                            return a;
                        }
                        function createRenameBtn() {
                            var a = document.createElement('a');
                            a.classList.add('rename');
                            a.setAttribute('title', 'Rename ' + filename);
                            a.setAttribute('target', '_blank');
                            a.setAttribute('tabindex', '0');
                            var fa = document.createElement('i');
                            fa.classList.add('fa');
                            fa.classList.add('icon');
                            fa.classList.add('fa-edit');
                            fa.classList.add('icon-edit');
                            a.appendChild(fa);
                            a.innerHTML += ' Rename';
                            return a;
                        }
                        function createTrashBtn() {
                            var a = document.createElement('a');
                            a.classList.add('dangerous');
                            a.classList.add('trash');
                            a.setAttribute('title', 'Delete ' + filename);
                            a.setAttribute('target', '_blank');
                            a.setAttribute('tabindex', '0');
                            var fa = document.createElement('i');
                            fa.classList.add('fa');
                            fa.classList.add('icon');
                            fa.classList.add('fa-trash');
                            fa.classList.add('icon-trash');
                            a.appendChild(fa);
                            a.innerHTML += ' Delete';
                            return a;
                        }
                        nav.appendChild(createExpandBtn());
                        nav.appendChild(createChooseBtn());
                        if (that.getController().getModel().getAllowRename() && document.execCommand)
                            nav.appendChild(createRenameBtn()); // should probably polyfill or just juse a standard text input instead #janky? #shame?
                        if (that.getController().getModel().getAllowDelete())
                            nav.appendChild(createTrashBtn());
                        //nav.appendChild(createFlexibleNavTagForm());
                        //nav.appendChild(createFlexibleNavShareForm());
                        function createFlexibleNavTagForm() {
                            var form = document.createElement('form');
                            form.classList.add('tag');
                            form.setAttribute('method', 'post');
                            form.setAttribute('action', '#');
                            var label = document.createElement('label');
                            label.setAttribute('title', 'Tagging this media item will make it easier to find');
                            var fa = document.createElement('i');
                            fa.classList.add('fa');
                            fa.classList.add('icon');
                            fa.classList.add('fa-tag');
                            fa.classList.add('icon-tag');
                            label.appendChild(fa);
                            label.innerHTML += ' Tag:';
                            var input = document.createElement('input');
                            input.setAttribute('type', 'text');
                            input.setAttribute('placeholder', 'Tag this media item');
                            input.setAttribute('tabindex', '-1');
                            form.appendChild(label);
                            form.appendChild(input);
                            return form;
                        }
                        function createFlexibleNavShareForm() {
                            var form = document.createElement('form');
                            form.classList.add('share');
                            form.setAttribute('action', '#');
                            form.setAttribute('title', "Share " + filename + " with other");
                            form.appendChild(createMediaSourceInput());
                            form.appendChild(createMediaItemInput());
                            var button = document.createElement('button');
                            button.classList.add('nued');
                            button.setAttribute('type', 'submit');
                            button.setAttribute('tabindex', '0');
                            var fa = document.createElement('i');
                            fa.classList.add('fa');
                            fa.classList.add('icon');
                            fa.classList.add('fa-share-square-o');
                            fa.classList.add('icon-share-square-o');
                            button.appendChild(fa);
                            button.innerHTML += ' Share';
                            form.appendChild(button);
                            function createMediaSourceInput() {
                                var input = document.createElement('input');
                                input.setAttribute('type', 'hidden');
                                input.setAttribute('name', 'mediasource');
                                input.setAttribute('value', '0');
                                return input;
                            }
                            function createMediaItemInput() {
                                var input = document.createElement('input');
                                input.setAttribute('type', 'hidden');
                                input.setAttribute('name', 'mediaitem');
                                input.setAttribute('value', filename);
                                return input;
                            }
                            return form;
                        }
                        return nav;
                    }
                    td.appendChild(createFlexibleNav());
                    tr.appendChild(td);
                    return tr;
                }
                tbodyHTML += createContextualRow().outerHTML;
                fileAdded = true;
            }
            else {
                //console.log(cd);
                //console.log(result.directory);
                //that.asyncronouslyAddDirectory(cd,result.directory);
                directoriesToAdd.push({ cd: cd, directory: result.directory });
            }
        }
        if (!fileAdded)
            that.getElement().classList.add('nothing-found');
        (function () {
            for (var i = 0; i < directoriesToAdd.length; i++) {
                var d = (directoriesToAdd[i]);
                that.asyncronouslyAddDirectory(d.cd, d.directory);
            }
            if (directoriesToAdd.length) {
                //console.log('directoriesToAdd.length: ' + directoriesToAdd.length);
                that.assignTreeListeners();
            }
        })();
        var thead = (document.querySelector('#' + this.getController().getModel().getUID() + ' .eureka-table > table > thead'));
        document.querySelector('#' + this.getController().getModel().getUID() + ' .eureka-table').innerHTML = '<table>' + thead.outerHTML + '<tbody>' + tbodyHTML + '</tbody>' + '</table>';
        // bolden the correct tree item
        try {
            this.getElement().querySelector('nav.tree li.active').classList.remove('active');
        }
        catch (e) {
        }
        try {
            (function () {
                var el = that.getElement().querySelector('nav.tree li > a[data-cd="' + data.cd + '"]').parentNode;
                el.classList.add('active');
                el.classList.add('open');
                var folder = el.querySelector('.folder .fa-folder');
                folder.classList.add('fa-folder-open');
                folder.classList.add('icon-folder-open');
                folder.classList.remove('fa-folder');
            })();
        }
        catch (e) {
        }
        try {
            this.getElement().querySelector('.pathbrowser__topbar > select').value = data.cs;
        }
        catch (e) {
        }
        this.paint();
    };
    EurekaView.prototype.asyncronouslyAddDirectory = function (cd, directory) {
        var that = this;
        if (that.getController().getModel().getDebug())
            console.log('asyncronouslyAddDirectory');
        var pathBrowser = document.getElementById(that.getController().getModel().getUID() + '__pathbrowser');
        var paths = pathBrowser.querySelectorAll('.tree .path');
        var cds = cd.split('/').filter(Boolean);
        var p = cd + directory + '/';
        var psa = p.split('/').filter(Boolean);
        for (var i = 0; i < paths.length; i++) {
            var path = (paths[i]);
            if (path.getAttribute('data-cd').split('/').filter(Boolean).equals(psa)) {
                if (that.getController().getModel().getDebug())
                    console.log(p + ' alread exists');
                return;
            }
        }
        for (var i = 0; i < paths.length; i++) {
            var path = (paths[i]);
            var pcd = path.getAttribute('data-cd');
            if (cds.equals(pcd.split('/').filter(Boolean))) {
                (function (_path) {
                    var ul = _path.nextSibling;
                    var paths = ul.querySelectorAll(':scope > li > .path');
                    var inserted = false;
                    for (var i = 0; i < paths.length; i++) {
                        var path = paths[i];
                        var _d = (function (path) {
                            var a = path.getAttribute('data-cd').split('/').filter(Boolean);
                            return a[a.length - 1];
                        })(path);
                        var s = [directory, _d];
                        s.sort();
                        if (s[0] == directory) {
                            ul.insertBefore(that.createTreeNode(p), path.parentNode);
                            inserted = true;
                            break;
                        }
                    }
                    if (!inserted) {
                        ul.appendChild(that.createTreeNode(p));
                        inserted = true;
                    }
                })(path);
            }
        }
        (function () {
            var browsingSelect = document.getElementById(that.getController().getModel().getUID() + '__browsing');
            var mediaSource = that.getController().getModel().getCurrentMediaSource();
            //console.log('setting optGrp');
            //console.log('currentMediaSource: ' + that.getController().getModel().getCurrentMediaSource());
            var optsGrp = (function () {
                var os = browsingSelect.querySelectorAll('optgroup');
                for (var i = 0; i < os.length; i++) {
                    var o = os[i];
                    if (o.getAttribute('data-source') == mediaSource)
                        return o;
                }
                return null;
            })();
            if (!optsGrp)
                return;
            var _iH = p.split('/').filter(Boolean).join('/');
            var opts = optsGrp.querySelectorAll('option');
            for (var i = 0; i < opts.length; i++) {
                var opt = opts[i];
                if (opt.innerHTML == _iH)
                    return; // it already exists
            }
            var newOpt = document.createElement('option');
            newOpt.setAttribute('value', JSON.stringify({ cs: that.getController().getModel().getCurrentMediaSource(), cd: _iH }));
            newOpt.setAttribute('data-cd', _iH + '/');
            newOpt.innerHTML = _iH;
            var inserted = false;
            for (var i = 0; i < opts.length; i++) {
                var opt = opts[i];
                //console.log(opt.innerHTML);
                var a = [opt.innerHTML, _iH];
                a.sort();
                if (_iH == a[0]) {
                    optsGrp.insertBefore(newOpt, opt);
                    inserted = true;
                    break;
                }
            }
            if (!inserted)
                optsGrp.appendChild(newOpt);
        })();
        (function () {
            var e = document.createEvent('CustomEvent');
            var data = that.getTreeData();
            e.initCustomEvent(EurekaModel.EurekaTreePainted, true, true, {
                data: data
            });
            that.getElement().dispatchEvent(e);
        })();
    };
    EurekaView.prototype.getTreeData = function () {
        var that = this;
        if (that.getController().getModel().getDebug())
            console.log('getTreeData');
        var data = {
            cs: parseInt(that.getController().getModel().getCurrentMediaSource()),
            title: that.getController().getModel().getMediaSourceDTOByID(that.getController().getModel().getCurrentMediaSource()).getTitle(),
            results: new Array()
        };
        //{"cs":1,"title":"Filesystem","results":[{"path":"assets"},{"path":"connect"},{"path":"manage"}]}
        var pathBrowser = document.getElementById(that.getController().getModel().getUID() + '__pathbrowser');
        var navTree = (pathBrowser.querySelector('nav.tree'));
        var tops = navTree.querySelectorAll(':scope > ul > li');
        for (var i = 0; i < tops.length; i++) {
            var top = tops[i];
            var dir = {
                path: top.querySelector(':scope > a.path').getAttribute('data-cd'),
                children: new Array()
            };
            recursivelyAddChildrenToDir(dir, top.querySelectorAll(':scope > ul > li'));
            data.results.push(dir);
        }
        return data;
        function recursivelyAddChildrenToDir(dir, lis) {
            for (var i = 0; i < lis.length; i++) {
                var li = (lis[i]);
                var child = {
                    path: li.querySelector(':scope > a.path').getAttribute('data-cd'),
                    children: new Array()
                };
                recursivelyAddChildrenToDir(child, li.querySelectorAll(':scope > ul > li'));
                dir.children.push(child);
            }
        }
    };
    EurekaView.prototype.assignContextualClickListeners = function () {
        var that = this;
        that.assignContexualCodeFocusListeners();
        assignChooseListeners();
        assignRenameListeners();
        assignDeleteListeners();
        function assignChooseListeners() {
            var anchors = that.getElement().querySelectorAll('tr.contextual a.choose');
            for (var i = 0; i < anchors.length; i++) {
                var anchor = anchors[i];
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    handleChooseClicked(this);
                }, false);
                anchor.addEventListener('focus', function (e) {
                    that.getElement().parentNode.querySelector('footer.proceed .cta').classList.add('go');
                    that.getElement().parentNode.querySelector('footer.proceed .cta').disabled = false;
                    that.getElement().parentNode.querySelector('footer.proceed .cta').removeAttribute('disabled');
                }, false);
                anchor.addEventListener('blur', function (e) {
                    that.getElement().parentNode.querySelector('footer.proceed .cta').classList.remove('go');
                    //that.getElement().parentNode.querySelector('footer.proceed .cta').disabled = true;
                    //that.getElement().parentNode.querySelector('footer.proceed .cta').setAttribute('disabled','disabled');
                }, false);
            }
            function handleChooseClicked(anchor) {
                var contextual = that.getClosest(anchor, 'tr');
                var mediaRow = contextual.previousSibling;
                that.getController().getModel().setChoosenMediaItem(mediaRow.getAttribute('data-filename'));
            }
        }
        function assignDeleteListeners() {
            var anchors = document.querySelectorAll('tr.contextual a.trash');
            for (var i = 0; i < anchors.length; i++) {
                var anchor = anchors[i];
                anchor.addEventListener('click', function (e) {
                    handleTrashClicked(this);
                }, false);
                anchor.addEventListener('focus', function (e) {
                    this.addEventListener('keydown', handleTrashKeyDown, false);
                }, false);
                anchor.removeEventListener('blur', function (e) {
                    this.removeEventListener('keydown', handleTrashKeyDown, false);
                }, false);
            }
            function handleTrashClicked(anchor) {
                var contextual = that.getClosest(anchor, 'tr');
                var mediaRow = contextual.previousSibling;
                var nextRow = contextual.nextSibling;
                // give them a way out
                if (that.getController().getModel().getAlertBeforeDelete() && !window.confirm('Are you sure you want to delete ' + mediaRow.getAttribute('data-filename') + '?')) {
                    return false;
                }
                // proceed
                that.getController().getModel().deleteFile(mediaRow.getAttribute('data-filename'), mediaRow);
                function remove(el) {
                    try {
                        el.remove();
                    }
                    catch (e) {
                        el.parentNode.removeChild(el); // IE 10 doesn't support HTMLElement.remove()
                    }
                }
                remove(mediaRow);
                remove(contextual);
                try {
                    nextRow.focus();
                }
                catch (e) { }
            }
            function handleTrashKeyDown(e) {
                if (e.keyCode === 13) {
                    handleTrashClicked(this);
                }
            }
        }
        function assignRenameListeners() {
            var anchors = document.querySelectorAll('tr.contextual a.rename');
            for (var i = 0; i < anchors.length; i++) {
                var anchor = anchors[i];
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    var code = getCodeToFocus(this);
                    selectCode(code);
                }, false);
                anchor.addEventListener('focus', function (e) {
                    this.addEventListener('keydown', handleAnchorKeyDown, false);
                }, false);
                anchor.addEventListener('blur', function (e) {
                    this.removeEventListener('keydown', handleAnchorKeyDown, false);
                }, false);
            }
            function handleAnchorKeyDown(e) {
                var code = getCodeToFocus(this);
                var tr = that.getClosest(this, '.contextual').previousSibling;
                if (e.keyCode === 13) {
                    e.preventDefault();
                    e.stopPropagation();
                    selectCode(code);
                }
            }
            function selectCode(code) {
                code.focus();
                try {
                    code.select(); // if you think about it contenteditable nodes should probably be selectable...
                }
                catch (e) { }
                // consider selecting also
            }
            function getCodeToFocus(anchor) {
                var tr = that.getClosest(anchor, 'tr');
                var mediaRow = tr.previousSibling;
                var code = mediaRow.querySelector('.eureka__row-image code[contenteditable="true"]');
                return code;
            }
        }
    };
    EurekaView.prototype.assignContexualCodeFocusListeners = function () {
        var that = this;
        var codes = this.getElement().querySelectorAll('tr.eureka__row .eureka__row-image code[contenteditable="true"]');
        for (var i = 0; i < codes.length; i++) {
            var code = codes[i];
            code.addEventListener('focus', function () {
                this.addEventListener('keydown', handleCodeKeyPress, false);
            }, false);
            function handleCodeKeyPress(e) {
                if (e.keyCode === 13) {
                    e.preventDefault();
                    var tr = this.parentNode.parentNode; // #janky? :/
                    var contextual = tr.nextSibling;
                    var filename = tr.getAttribute('data-filename');
                    code.contentEditable = 'false';
                    var newFilename = this.innerHTML;
                    that.getController().getModel().renameFile(filename, newFilename);
                    var next = contextual.querySelector('nav > a.rename');
                    next.focus();
                    window.getSelection().collapse(next, 0);
                    return false;
                }
                return true;
            }
        }
    };
    // ensure the optgroups are always sorted in order of their respective media source ids
    EurekaView.prototype.sortBrowseSelectOptGroupsByMediaSourceId = function (select) {
        if (select === undefined)
            select = document.getElementById(this.getController().getModel().getUID() + '__browsing').querySelector('select');
        var os = [];
        var optgrps = select.querySelectorAll('optgroup');
        for (var i = 0; i < optgrps.length; i++) {
            os.push(optgrps[i]);
        }
        var optgroups = os.sort(function (a, b) {
            return parseInt(a.getAttribute('data-source')) - parseInt(b.getAttribute('data-source'));
        });
        select.innerHTML = '';
        for (var _i = 0; _i < optgroups.length; _i++) {
            var optgroup = optgroups[_i];
            select.appendChild(optgroup);
        }
    };
    EurekaView.prototype.updateMediaSourceListings = function (data) {
        var that = this;
        if (that.getController().getModel().getDebug())
            console.log('updateMediaSourceListings: ', data);
        var id = data.cs;
        var source = this.getController().getModel().getMediaSourceDTOByID(id);
        function updateTreeSelect() {
            if (that.getController().getModel().getDebug())
                console.log('updateTreeSelect');
            var select = document.getElementById(that.getController().getModel().getUID() + '__mediasource-select');
            var option = null;
            try {
                option = select.querySelector('option[value="' + id + '"]');
            }
            catch (e) { }
            if (!option) {
                option = document.createElement('option');
                option.setAttribute('value', id);
                option.innerHTML = data.title;
                select.appendChild(option);
            }
        }
        function updateTopBarSelect() {
            if (that.getController().getModel().getDebug())
                console.log('updateTopBarSelect');
            var select = document.getElementById(that.getController().getModel().getUID() + '__browsing').querySelector('select');
            if (that.getController().getModel().getDebug())
                console.log(select);
            var optgroup = null;
            try {
                optgroup = select.querySelector('optgroup[data-source="' + id + '"]');
            }
            catch (e) { }
            if (!optgroup) {
                optgroup = document.createElement('optgroup');
                optgroup.setAttribute('label', data.title);
                optgroup.setAttribute('data-source', id);
            }
            var results = data.results;
            if (that.getController().getModel().getPrependOptGroupsWithRootOption())
                results.unshift({ "path": "/" });
            var options = [];
            printOptGroupOptions(results);
            optgroup.innerHTML = '';
            function printOptGroupOptions(results) {
                function serialize(obj) {
                    var str = [];
                    for (var p in obj) {
                        if (obj.hasOwnProperty(p)) {
                            str.push((p) + "=" + (obj[p]));
                        }
                    }
                    return str.join("&");
                }
                for (var i = 0; i < results.length; i++) {
                    var result = results[i];
                    var option = document.createElement('option');
                    option.innerHTML = (that.sanitizeDisplayPath(result.path)) ? that.sanitizeDisplayPath(result.path) : result.path;
                    option.setAttribute('value', JSON.stringify({ cs: data.cs, cd: that.sanitizeDisplayPath(result.path) }));
                    option.setAttribute('data-cd', result.path);
                    options.push(option);
                    if (result.children && result.children.length)
                        printOptGroupOptions(result.children);
                }
            }
            for (var _i = 0; _i < options.length; _i++) {
                var option = options[_i];
                optgroup.appendChild(option);
            }
            select.appendChild(optgroup);
            that.sortBrowseSelectOptGroupsByMediaSourceId(select);
        }
        updateTreeSelect();
        updateTopBarSelect();
        that.setBrowseSelectValue();
        that.setMediaSourceSelectValue();
    };
    EurekaView.prototype.getSelectedOption = function (select) {
        var options = select.querySelectorAll('option');
        for (var i = 0; i < options.length; i++) {
            var option = options[i];
            if (option.selected)
                return option;
        }
    };
    EurekaView.prototype.formatFileSize = function (size) {
        var sizes = [' Bytes', ' KB', ' MB', ' GB', ' TB', ' PB', ' EB', ' ZB', ' YB'];
        for (var i = 1; i < sizes.length; i++) {
            if (size < Math.pow(1024, i))
                return (Math.round((size / Math.pow(1024, i - 1)) * 100) / 100) + sizes[i - 1];
        }
        return size.toString();
    };
    EurekaView.prototype.getClosest = function (elem, selector) {
        var firstChar = selector.charAt(0);
        // Get closest match
        for (; elem && elem !== document; elem = elem.parentNode) {
            // If selector is a class
            if (firstChar === '.') {
                if (elem.classList.contains(selector.substr(1))) {
                    return elem;
                }
            }
            // If selector is an ID
            if (firstChar === '#') {
                if (elem.id === selector.substr(1)) {
                    return elem;
                }
            }
            // If selector is a data attribute
            if (firstChar === '[') {
                if (elem.hasAttribute(selector.substr(1, selector.length - 2))) {
                    return elem;
                }
            }
            // If selector is a tag
            if (elem.tagName.toLowerCase() === selector) {
                return elem;
            }
        }
        return null;
    };
    return EurekaView;
})(); // end class EurekaView
var EurekaController = (function () {
    function EurekaController(opts) {
        this.opts = opts;
        this._model = opts.model;
        this._view = opts.view;
    }
    EurekaController.prototype.getModel = function () {
        return this._model;
    };
    EurekaController.prototype.getView = function () {
        return this._view;
    };
    EurekaController.prototype.init = function () {
        var that = this;
        var eureka = that.getView().getElement(); // we found it!
        if (that.getModel().getDebug())
            console.log('init');
        that.getView().getElement().addEventListener(EurekaModel.EurekaTreePainted, function (e) {
            var d = e.detail.data;
            if (that.getModel().getDebug())
                console.log('EurekaTreePainted!!!', e, d);
            if (that.getModel().useLocalStorage())
                that.getModel().setLocalStorage(d.cs.toString() + '_mediaSourceData', JSON.stringify(d));
        });
        if (that.getModel().useLocalStorage()) {
            (function () {
                var mediaSourcesData = that.getModel().getLocalStorage('mediaSourcesData');
                if (that.getModel().getDebug())
                    console.log('using local storage setMediaSourcesData', 'mediaSourcesData: ', mediaSourcesData);
                if (mediaSourcesData) {
                    // data,dispatch,setLocalStorage,clearDirectory,dispatchIdenticalValues
                    that.getModel().setMediaSourcesData(JSON.parse(mediaSourcesData), true, false, false, true);
                }
            })();
            (function () {
                var mediaSourceData = that.getModel().getLocalStorage(that.getModel().getCurrentMediaSource() + '_mediaSourceData');
                if (mediaSourceData) {
                    if (that.getModel().getDebug())
                        console.log('using local storage paintTree', 'mediaSourceData: ', mediaSourceData);
                    that.getView().paintTree(JSON.parse(mediaSourceData));
                    that.getView().recursivelyOpenTreeToCurrentDirectory();
                }
            })();
            (function () {
                var directoryData = that.getModel().getLocalStorage('lastDirectoryPainted');
                if (that.getModel().getDebug())
                    console.log('using local storage paintJSON', 'directoryData: ', directoryData);
                if (directoryData) {
                    var dd = JSON.parse(directoryData);
                    that.getModel().setCurrentDirectory(dd.cd, false, false, false);
                    that.getView().paintJSON(dd);
                    that.getView().recursivelyOpenTreeToCurrentDirectory();
                }
            })();
        }
        // listen for when certain things happen (currently the DOM element itself dispatches the events)
        eureka.addEventListener(EurekaModel.EurekaViewChange, function (e) {
            //that.getModel().setCurrentView(e.currentView, false);
        });
        eureka.addEventListener(EurekaModel.EurekaDirectoryChanged, function (e) {
            if (!that.getModel().getCurrentMediaSource())
                return;
            if (that.getModel().getDebug())
                console.log(EurekaModel.EurekaDirectoryChanged, ' requesting data from ', that.getModel().getListDirectoryRequestURL());
            function handleJSONData(d) {
                if (that.getModel().useLocalStorage())
                    that.getModel().setLocalStorage('lastDirectoryPainted', JSON.stringify(d));
                if (that.getModel().getDebug())
                    console.log(d);
                that.getView().paintJSON(d);
            }
            if (that.getModel().getUseWebWorkers()) {
                (function () {
                    var worker = new Worker(that.getModel().getwebWorkersPath() + 'listdirectory.js');
                    worker.addEventListener('message', function (e) {
                        handleJSONData(e.data);
                    }, false);
                    worker.postMessage({
                        listDirectoryRequestURL: that.getModel().getListDirectoryRequestURL(),
                        currentMediaSource: that.getModel().getCurrentMediaSource(),
                        currentDirectory: e.detail.currentDirectory || '/',
                        headers: that.getModel().getXHRHeaders()
                    });
                })();
            }
            else {
                var ajax = new AJAX();
                ajax.get(that.getModel().getListDirectoryRequestURL(), { s: that.getModel().getCurrentMediaSource(), dir: e.detail.currentDirectory || '/' }, function (data) {
                    handleJSONData(JSON.parse(data));
                }, true, that.getModel().getXHRHeaders());
            }
        });
        eureka.addEventListener(EurekaModel.EurekaDirectoryOpened, function (e) {
            if (that.getModel().getDebug())
                console.log(EurekaModel.EurekaDirectoryOpened);
            var path = e.detail.path.charAt(e.detail.path.length - 1) == '/' ? e.detail.path : e.detail.path + '/';
            function handleJSONData(d) {
                if (that.getModel().getDebug())
                    console.log(d);
                var results = d.results;
                for (var i = 0; i < results.length; i++) {
                    var result = results[i];
                    if (result.directory) {
                        that.getView().asyncronouslyAddDirectory(path, result.directory);
                    }
                }
                if (results.length)
                    that.getView().assignTreeListeners();
            }
            if (that.getModel().getUseWebWorkers()) {
                (function () {
                    var worker = new Worker(that.getModel().getwebWorkersPath() + 'listdirectory.js');
                    worker.addEventListener('message', function (e) {
                        handleJSONData(e.data);
                    }, false);
                    worker.postMessage({
                        listDirectoryRequestURL: that.getModel().getListDirectoryChildrenRequestURL(),
                        currentMediaSource: that.getModel().getCurrentMediaSource(),
                        currentDirectory: e.detail.path || '/',
                        headers: that.getModel().getXHRHeaders()
                    });
                })();
            }
            else {
                var ajax = new AJAX();
                ajax.get(that.getModel().getListDirectoryChildrenRequestURL(), { s: that.getModel().getCurrentMediaSource(), dir: e.detail.path || '/' }, function (data) {
                    handleJSONData(JSON.parse(data));
                }, true, that.getModel().getXHRHeaders());
            }
        });
        eureka.addEventListener(EurekaModel.EurekaMediaSourceChange, function (e) {
            if (that.getModel().getDebug())
                console.log(EurekaModel.EurekaMediaSourceChange);
            function handleJSONData(d) {
                if (that.getModel().getDebug())
                    console.log('EurekaMediaSourceChange handleJSONData: ', d, e);
                if (d.cs && that.getModel().useLocalStorage())
                    that.getModel().setLocalStorage(d.cs + '_mediaSourceData', JSON.stringify(d));
                that.getView().paintTree(d);
                if (e.detail.clearDirectory == true) {
                    if (that.getModel().getDebug())
                        console.log('clearing directory');
                    that.getModel().setCurrentDirectory('', true, false); // clear the current directory and trigger a repaint
                }
            }
            if (that.getModel().getUseWebWorkers()) {
                (function () {
                    var worker = new Worker(that.getModel().getwebWorkersPath() + 'listsource.js');
                    worker.addEventListener('message', function (e) {
                        handleJSONData(e.data);
                    }, false);
                    worker.postMessage({
                        listSourceRequestURL: that.getModel().getListSourceRequestURL(),
                        currentMediaSource: that.getModel().getCurrentMediaSource(),
                        headers: that.getModel().getXHRHeaders()
                    });
                })();
            }
            else {
                var ajax = new AJAX();
                ajax.get(that.getModel().getListSourceRequestURL(), { s: e.detail.currentMediaSource }, function (data) {
                    handleJSONData(JSON.parse(data));
                }, true, that.getModel().getXHRHeaders());
            }
        });
        eureka.addEventListener(EurekaModel.EurekaMediaSourceInit, function (e) {
            if (that.getModel().getDebug())
                console.log('EurekaMediaSourceInit: !!!!', e);
            if (!that.getModel().useLocalStorage()) {
                that.getModel().setCurrentDirectory(that.getModel().getCurrentDirectory(), true, false, true);
            }
        });
        eureka.addEventListener(EurekaModel.EurekaMediaSourcesListChange, function (e) {
            if (that.getModel().getDebug())
                console.log('MediaSourcesListChange: ');
            var sources = e.detail.sources;
            for (var i = 0; i < sources.length; i++) {
                var source = new EurekaMediaSource(sources[i].opts);
                var id = source.getID();
                //var title = source.getTitle();
                requestMediaListings(source);
                function requestMediaListings(source) {
                    if (that.getModel().getDebug())
                        console.log('requestMediaListings');
                    var id = source.getID();
                    function handleJSONData(d) {
                        if (that.getModel().getDebug())
                            console.log(d);
                        that.getView().updateMediaSourceListings(d);
                    }
                    if (that.getModel().getUseWebWorkers()) {
                        (function () {
                            var worker = new Worker(that.getModel().getwebWorkersPath() + 'listsource.js');
                            worker.addEventListener('message', function (e) {
                                handleJSONData(e.data);
                            }, false);
                            worker.postMessage({
                                listSourceRequestURL: that.getModel().getListSourceRequestURL(),
                                currentMediaSource: id,
                                headers: that.getModel().getXHRHeaders()
                            });
                        })();
                    }
                    else {
                        var ajax = new AJAX();
                        ajax.get(that.getModel().getListSourceRequestURL(), { s: id }, function (data) {
                            data = JSON.parse(data);
                            handleJSONData(data);
                        }, true, that.getModel().getXHRHeaders());
                    }
                }
            }
        });
        if (that.getModel().getDebug())
            console.log('MediaSourcesListChange listener added');
        (function () {
            if (that.getModel().getDebug())
                console.log('requesting sources: ');
            function handleJSONData(d) {
                if (that.getModel().getDebug())
                    console.log(d);
                if (that.getModel().useLocalStorage())
                    that.getModel().setLocalStorage('mediaSourcesData', JSON.stringify(d));
                that.getModel().setMediaSourcesData(d);
            }
            if (that.getModel().getUseWebWorkers()) {
                (function () {
                    var worker = new Worker(that.getModel().getwebWorkersPath() + 'listsources.js');
                    worker.addEventListener('message', function (e) {
                        handleJSONData(e.data);
                    }, false);
                    worker.postMessage({
                        listSourcesRequestURL: that.getModel().getListSourcesRequestURL(),
                        headers: that.getModel().getXHRHeaders()
                    });
                })();
            }
            else {
                var ajax = new AJAX();
                ajax.get(that.getModel().getListSourcesRequestURL(), {}, function (data) {
                    data = JSON.parse(data);
                    handleJSONData(data);
                }, true, that.getModel().getXHRHeaders());
            }
        })();
    };
    return EurekaController;
})(); // end class EurekaController
