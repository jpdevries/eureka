/* do not touch this file. see _build/*.js */
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
/* do not touch this file. see _build/*.js */
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
var AJAX = (function () {
    function AJAX() {
        this.x = new XMLHttpRequest();
    }
    AJAX.prototype.send = function (url, callback, method, data, sync, headers) {
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
        if (headers !== undefined) {
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
    AJAX.prototype.get = function (url, data, callback, sync) {
        if (sync === void 0) { sync = true; }
        var query = [];
        for (var key in data) {
            query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
        }
        this.send(url + '?' + query.join('&'), callback, 'GET', null, sync, data.headers !== undefined ? data.headers : null);
    };
    AJAX.prototype.post = function (url, data, callback, sync) {
        if (sync === void 0) { sync = true; }
        var query = [];
        for (var key in data) {
            query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
        }
        this.send(url, callback, 'POST', query.join('&'), sync);
    };
    return AJAX;
})();
var Eureka = (function () {
    function Eureka(opts) {
        this.opts = opts;
        this._model = new EurekaModel(opts);
        this._view = new EurekaView();
        this._controller = new EurekaController({
            model: this._model,
            view: this._view
        });
        this._model.setController(this._controller);
        this._view.setController(this._controller);
        this._view.init();
        this._view.paint();
        this._controller.init();
        if (this._model.getCurrentDirectory() !== undefined || this._model.getCurrentMediaSource() !== undefined) {
            this.fetch();
        }
    }
    Eureka.prototype.fetch = function () {
        if (this._model.getDebug())
            console.log('fetch');
        this._model.setCurrentDirectory(this._model.getCurrentDirectory());
        this._model.setCurrentMediaSource(this._model.getCurrentMediaSource());
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
        this._sources = [];
        this._navTreeHidden = false;
        this._useLocalStorage = true;
        this._currentDirectory = './';
        this._currentView = 'view-a';
        this._locale = 'en-US';
        this._selected = '';
        this._editable = true;
        this._headers = [];
        this._debug = false;
        this._confirmBeforeDelete = true;
        this._directoryRequestURL = '';
        this._listSourceRequestURL = '';
        this._listSourcesRequestURL = '';
        this.getXHRHeaders = function () {
            return this._headers;
        };
        if (opts.uid !== undefined)
            this._uid = opts.uid;
        if (opts.editable !== undefined)
            this._editable = opts.editable;
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
        if (opts.directoryRequestURL !== undefined)
            this._directoryRequestURL = opts.directoryRequestURL;
        if (opts.listSourceRequestURL !== undefined)
            this._listSourceRequestURL = opts.listSourceRequestURL;
        if (opts.listSourcesRequestURL !== undefined)
            this._listSourcesRequestURL = opts.listSourcesRequestURL;
        if (opts.fileUploadURL !== undefined)
            this._fileUploadURL = opts.fileUploadURL;
        if (opts.debug === true)
            this._debug = opts.debug;
        if (opts.confirmBeforeDelete !== undefined)
            this._confirmBeforeDelete = opts.confirmBeforeDelete;
        if (this._useLocalStorage) {
            if (this.getLocalStorage('currentMediaSource'))
                this._mediaSource = this.getLocalStorage('currentMediaSource');
            if (this.getLocalStorage('navTreeHidden'))
                this._navTreeHidden = (this.getLocalStorage('navTreeHidden') == 'true' ? true : false);
            if (this.getLocalStorage('currentDirectory'))
                this._currentDirectory = this.getLocalStorage('currentDirectory');
            if (this.getLocalStorage('currentView'))
                this._currentView = this.getLocalStorage('currentView');
        }
    }
    Object.defineProperty(EurekaModel, "EurekaFoundIt", {
        get: function () {
            return "EurekaFoundIt";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EurekaModel, "EurekaFileRename", {
        get: function () {
            return "EurekaFileRename";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EurekaModel, "EurekaUnlink", {
        get: function () {
            return "EurekaUnlink";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EurekaModel, "EurekaDirectoryCreated", {
        get: function () {
            return "EurekaDirectoryCreated";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EurekaModel, "EurekaDirectoryOpened", {
        get: function () {
            return "EurekaDirectoryOpened";
        },
        enumerable: true,
        configurable: true
    });
    EurekaModel.prototype.getLocalStorage = function (id) {
        if (localStorage.getItem(id) !== undefined && localStorage.getItem(id) !== 'undefined')
            return localStorage.getItem(id);
        return false;
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
    EurekaModel.prototype.getSources = function () {
        return this._sources;
    };
    EurekaModel.prototype.getEditable = function () {
        return this._editable;
    };
    EurekaModel.prototype.getMediaSourceDTOByID = function (id) {
        var sources = this.getSources();
        for (var i = 0; i < sources.length; i++) {
            var source = sources[i];
            if (source.getID() == id) {
                return source;
            }
        }
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
            localStorage.setItem('navTreeHidden', navTreeHidden);
    };
    EurekaModel.prototype.setCurrentMediaSource = function (currentMediaSource, dispatch) {
        if (dispatch === void 0) { dispatch = true; }
        if (this.getDebug())
            console.log('setCurrentMediaSource');
        this._mediaSource = currentMediaSource;
        if (this._useLocalStorage)
            localStorage.setItem('currentMediaSource', currentMediaSource);
        if (dispatch === false)
            return;
        var e = document.createEvent('CustomEvent');
        e.initCustomEvent('eurekaMediaSourceChange', true, true, {
            currentMediaSource: currentMediaSource
        });
        this.getController().getView().getElement().dispatchEvent(e);
    };
    EurekaModel.prototype.getCurrentMediaSource = function () {
        return this._mediaSource;
    };
    EurekaModel.prototype.setCurrentDirectory = function (currentDirectory, dispatch) {
        if (dispatch === void 0) { dispatch = true; }
        if (currentDirectory === undefined || currentDirectory === 'undefined')
            currentDirectory = '';
        this._currentDirectory = currentDirectory;
        if (this._useLocalStorage)
            localStorage.setItem('currentDirectory', currentDirectory);
        if (dispatch === false)
            return;
        if (this.getDebug())
            console.log('setCurrentDirectory');
        var e = document.createEvent('CustomEvent');
        e.initCustomEvent('eurekaCurrentDirectoryChange', true, true, {
            currentDirectory: currentDirectory
        });
        this.getController().getView().getElement().dispatchEvent(e);
    };
    EurekaModel.prototype.getCurrentDirectory = function () {
        return this._currentDirectory;
    };
    EurekaModel.prototype.setCurrentView = function (currentView, dispatch) {
        if (dispatch === void 0) { dispatch = true; }
        this._currentView = currentView;
        if (this._useLocalStorage)
            localStorage.setItem('currentView', currentView);
        if (dispatch === false)
            return;
        var e = document.createEvent('CustomEvent');
        e.initCustomEvent('eurekaViewChange', true, true, {
            currentView: currentView
        });
        this.getController().getView().getElement().dispatchEvent(e);
    };
    EurekaModel.prototype.getCurrentView = function () {
        return this._currentView;
    };
    EurekaModel.prototype.setLocale = function (locale) {
        this._locale = locale;
    };
    EurekaModel.prototype.getLocale = function () {
        return this._locale;
    };
    EurekaModel.prototype.setSources = function (sources, dispatch) {
        if (dispatch === void 0) { dispatch = true; }
        if (this.getDebug())
            console.log('setSources' + dispatch);
        this._sources = sources;
        if (dispatch === false)
            return;
        var e = document.createEvent('CustomEvent');
        e.initCustomEvent('MediaSourcesListChange', true, true, {
            data: sources
        });
        if (this.getDebug())
            console.log('setSources');
        this.getController().getView().getElement().dispatchEvent(e);
    };
    EurekaModel.prototype.setMediaSourcesData = function (data) {
        if (this.getDebug())
            console.log('setMediaSourcesData');
        data = JSON.parse(data);
        var results = data.results;
        var sources = [];
        for (var i = 0; i < results.length; i++) {
            var result = results[i];
            var mediaSourceDTO = new EurekaMediaSource({
                id: result.id,
                title: result.name
            });
            sources.push(mediaSourceDTO);
        }
        this.setSources(sources);
    };
    EurekaModel.prototype.renameFile = function (fileName, newFilename) {
        var e = document.createEvent('CustomEvent');
        e.initCustomEvent('EurekaFileRename', true, true, {
            fileName: fileName,
            newFilename: newFilename,
            cd: this.getController().getModel().getCurrentMediaSource(),
            cs: this.getController().getModel().getCurrentDirectory(),
            path: this.getController().getModel().getCurrentDirectory() + fileName,
            newPath: this.getController().getModel().getCurrentDirectory() + newFilename
        });
        this.getController().getView().getElement().dispatchEvent(e);
    };
    EurekaModel.prototype.deleteFile = function (filename, tr) {
        var that = this;
        var e = document.createEvent('CustomEvent');
        e.initCustomEvent('EurekaUnlink', true, true, {
            data: {
                filename: tr.getAttribute('data-filename'),
                timestamp: tr.getAttribute('data-timestamp'),
                src: tr.querySelector('.image img').getAttribute('src'),
                dimensions: [tr.getAttribute('data-dimensions-w'), tr.getAttribute('data-dimensions-h')],
                filesize: parseInt(tr.getAttribute('data-filesize-bytes'))
            }
        });
        that.getController().getView().getElement().dispatchEvent(e);
    };
    EurekaModel.prototype.setChoosenMediaItem = function (filename) {
        var that = this;
        var tr = getEurekaRowByFileName(filename);
        var e = document.createEvent('CustomEvent');
        e.initCustomEvent('EurekaFoundIt', true, true, {
            data: {
                filename: filename,
                timestamp: tr.getAttribute('data-timestamp'),
                src: tr.querySelector('.image img').getAttribute('src'),
                dimensions: [tr.getAttribute('data-dimensions-w'), tr.getAttribute('data-dimensions-h')],
                filesize: parseInt(tr.getAttribute('data-filesize-bytes'))
            }
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
})();
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
        that.getElement().parentNode.querySelector('footer.proceed button.cta').addEventListener('click', function (e) {
            e.preventDefault();
            that.getController().getModel().setChoosenMediaItem(that.getController().getModel().getSelected());
        });
    };
    EurekaView.prototype.init = function () {
        var that = this;
        function assignShortcutListeners() {
            document.addEventListener('keydown', function (event) {
                console.log(event);
                if (event.ctrlKey && event.which === 186) {
                    var e = document.createEvent('Event');
                    e.initEvent('click', true, true);
                    console.log(that.getController().getModel().getUID() + '__pathbrowser_toggle');
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
                    catch (e) {
                    }
                }
                if (event.altKey && !event.ctrlKey && (event.which >= 48 && event.which <= 57)) {
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
                            console.log(optGroup);
                            select.value = optGroup.querySelector('option').value;
                        }
                    }
                    function setSelectOption(select, value) {
                        function hasOption(val) {
                            var options = select.querySelectorAll('option');
                            for (var i = 0; i < options.length; i++) {
                                if (((options[i]).value) == val)
                                    return true;
                            }
                            return false;
                        }
                        if (hasOption((event.which - 48).toString())) {
                            select.value = value;
                        }
                    }
                    setSelectOption((document.getElementById(that.getController().getModel().getUID() + '__mediasource-select')), (event.which - 48).toString());
                    setSelectOptGroup((document.getElementById(that.getController().getModel().getUID() + '__browsing')), (event.which - 48).toString());
                }
                if (event.which === 8 && document.activeElement) {
                    var e = document.createEvent('Event');
                    e.initEvent('click', true, true);
                    try {
                        document.activeElement.nextSibling.querySelector('a.trash').dispatchEvent(e);
                    }
                    catch (e) {
                    }
                }
                if (event.altKey && event.which === 32 && document.activeElement) {
                    try {
                        var e = document.createEvent('Event');
                        e.initEvent('click', true, true);
                        document.activeElement.nextSibling.querySelector('a.expand').dispatchEvent(e);
                    }
                    catch (e) {
                    }
                }
                if (event.which === 13 && document.activeElement) {
                    try {
                        var e = document.createEvent('Event');
                        e.initEvent('click', true, true);
                        document.activeElement.nextSibling.querySelector('a.choose').dispatchEvent(e);
                    }
                    catch (e) {
                    }
                }
                if (event.ctrlKey && event.which === 82) {
                    try {
                        var e = document.createEvent('Event');
                        e.initEvent('click', true, true);
                        document.activeElement.nextSibling.querySelector('a.rename').dispatchEvent(e);
                    }
                    catch (e) {
                    }
                }
                if (event.ctrlKey && event.which === 78) {
                    try {
                        var e = document.createEvent('Event');
                        e.initEvent('click', true, true);
                        that.getElement().querySelector('.create-new').dispatchEvent(e);
                    }
                    catch (e) {
                    }
                }
                if (event.ctrlKey && event.which === 85) {
                    try {
                        var e = document.createEvent('Event');
                        e.initEvent('click', true, true);
                        document.getElementById(that.getController().getModel().getUID() + '__upload-input').dispatchEvent(e);
                    }
                    catch (e) {
                    }
                }
                if (event.ctrlKey && event.which === 70) {
                    try {
                        document.getElementById(that.getController().getModel().getUID() + '__filter-images').focus();
                    }
                    catch (e) {
                    }
                }
            });
        }
        function showSidebar() {
            var tog = document.getElementById(that.getController().getModel().getUID() + '__pathbrowser_toggle');
            var el = document.getElementById(tog.getAttribute('data-toggle-target'));
            el.classList.remove('hidden');
            document.getElementById(that.getController().getModel().getUID()).classList.add('sidebar-open');
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
        this.assignMediaBrowserOptGroupListeners();
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
        var dropContainer = document.getElementById(that.getController().getModel().getUID()).querySelector('.dropzone') || null;
        if (html5Upload !== undefined && !Modernizr.touch && html5Upload.fileApiSupported() && dropContainer) {
            html5Upload.initialize({
                uploadUrl: that.getController().getModel().getFileUploadURL(),
                dropContainer: dropContainer,
                inputField: document.getElementById(that.getController().getModel().getUID() + '__upload-input'),
                key: 'File',
                data: that.getController().getModel().getHeaders(),
                maxSimultaneousUploads: 4,
                onFileAdded: function (file) {
                    function removeMessages() {
                        var rs = dropContainer.querySelector('.progress').querySelectorAll('h2,p');
                        for (var i = 0; i < rs.length; i++) {
                            rs[i].remove();
                        }
                    }
                    removeMessages();
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
                    dropzone.classList.add('uploading');
                    dropzone.querySelector('.progress').appendChild(bar);
                    file.on({
                        onCompleted: function (response) {
                            bar.setAttribute('title', file.fileName + ' has uploaded');
                            if (dropzone.querySelectorAll('.bar').length >= 2)
                                bar.remove();
                            if (dropzone.querySelectorAll('.bar').length < 2) {
                                setInterval(function () {
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
                                        p.innerHTML += ' have been successfully uploaded.<br><a href="#">Upload&nbsp;more.</a>';
                                        div.appendChild(p);
                                    })();
                                }, 640);
                            }
                        },
                        onProgress: function (progress, fileSize, uploadedBytes) {
                            bar.setAttribute('title', file.fileName + 'is ' + progress + '% uploaded');
                            pill.setAttribute('style', 'right:' + (100 - progress).toString() + '%');
                        }
                    });
                }
            });
        }
        else {
            if (dropContainer)
                dropContainer.remove();
        }
        if (that.getController().getModel().getFileUploadURL() === undefined || that.getController().getModel().getFileUploadURL() == '') {
            try {
                that.getElement().querySelector('.pathbrowser footer').remove();
            }
            catch (e) {
            }
            try {
                that.getElement().querySelector('.upload-form').remove();
            }
            catch (e) {
            }
        }
    };
    EurekaView.prototype.assignUploadListeners = function () {
        var that = this;
        that.getElement().querySelector('.pathbrowser .upload-files').addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            (function () {
                var e = document.createEvent('Event');
                e.initEvent('click', true, true);
                document.getElementById(that.getController().getModel().getUID() + '__upload-input').dispatchEvent(e);
            })();
        });
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
            that.getController().getModel().setCurrentMediaSource(source, false);
            that.getController().getModel().setCurrentDirectory(option.getAttribute('value'));
        });
    };
    EurekaView.prototype.assignCreateNewDirectoryListener = function () {
        var that = this;
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
                catch (e) {
                }
            }, 240);
            var ul = (that.getElement().querySelector('.pathbrowser .tree li.active > ul') || that.getElement().querySelector('.pathbrowser .tree > ul'));
            ul.classList.add('open');
            (ul.parentNode).classList.add('open');
            try {
                (ul.previousSibling).previousSibling.querySelector('.fa').setAttribute('class', 'fa icon fa-folder-open icon-folder-open');
            }
            catch (e) {
            }
            path.addEventListener('focus', function (e) {
                this.addEventListener('keydown', handleKeyDown, false);
            }, false);
            path.addEventListener('blur', function (e) {
                this.removeEventListener('keydown', handleKeyDown, false);
            }, false);
            function handleKeyDown(e) {
                if (e.keyCode === 13) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log(this);
                    console.log(this.previousSibling);
                    this.blur();
                    this.setAttribute('contenteditable', 'false');
                    that.getElement().querySelector('button.create-new').focus();
                    var foldername = this.innerHTML;
                    var e = document.createEvent('CustomEvent');
                    e.initCustomEvent('EurekaDirectoryCreated', true, true, {
                        data: {
                            newdirectory: foldername,
                            cd: that.getController().getModel().getCurrentDirectory(),
                            s: that.getController().getModel().getCurrentMediaSource(),
                            path: that.getController().getModel().getCurrentDirectory() + foldername
                        }
                    });
                    that.getElement().dispatchEvent(e);
                }
            }
            ul.appendChild(li);
        });
    };
    EurekaView.prototype.assignViewButtonListeners = function () {
        var model = this.getController().getModel();
        function setCurrent(el) {
            var anchors = document.querySelectorAll(".eureka__topbar-nav .view-btns a[data-view]");
            for (var i = 0; i < anchors.length; i++) {
                var anchor = anchors[i];
                anchor.classList.remove('current');
            }
            el.classList.add('current');
        }
        var anchors = document.querySelectorAll(".eureka__topbar-nav .view-btns a[data-view]");
        for (var i = 0; i < anchors.length; i++) {
            var current = anchors[i];
            current.addEventListener('click', function (e) {
                e.preventDefault();
                var that = this;
                var _v = this.getAttribute('data-view');
                var classes = ['view-a', 'view-b', 'view-c', 'view-d'];
                for (var _i = 0; _i < classes.length; _i++) {
                    var c = classes[_i];
                    document.getElementById(that.getAttribute('data-view-target')).classList.remove(c);
                }
                document.getElementById(that.getAttribute('data-view-target')).classList.add(_v);
                setCurrent(that);
                model.setCurrentView(_v);
            }, true);
        }
    };
    EurekaView.prototype.assignARIAKeyListeners = function () {
        var that = this;
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
                var _cta = that.getProceedFooter().querySelector('button.cta');
                _cta.classList.remove('go');
                _cta.setAttribute('disabled');
                _cta.classList.add('muted');
            }
            var rows = document.querySelectorAll(".eureka-table tbody > tr:not(.contextual)");
            for (var i = 0; i < rows.length; i++) {
                var current = rows[i];
                current.addEventListener('focus', function (e) {
                    e.preventDefault();
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
        var sortBtns = document.querySelectorAll('.eureka-table th .fa-sort');
        for (var i = 0; i < sortBtns.length; i++) {
            var sortBtn = sortBtns[i];
            function handleSortBtnClicked(e) {
                e.preventDefault();
                e.stopPropagation();
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
            sortBtn.removeEventListener('click', handleSortBtnClicked, true);
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
    EurekaView.prototype.populateTree = function (data) {
        var s = '';
        function PrintResults(results, ul) {
            for (var i = 0; i < results.length; i++) {
                var result = results[i];
                var split = result.path.split('/');
                split = split.filter(function (n) {
                    return (n !== undefined && n != "");
                });
                var displayPath = split.join('/');
                var li = document.createElement('li');
                var folder = document.createElement('a');
                folder.classList.add('folder');
                var fa = document.createElement('i');
                fa.classList.add('fa');
                fa.classList.add('icon');
                fa.classList.add('fa-folder');
                fa.classList.add('icon-folder');
                fa.classList.add('folder');
                folder.appendChild(fa);
                folder.innerHTML += '&nbsp;';
                var path = document.createElement('a');
                path.innerHTML = displayPath;
                path.setAttribute('title', 'Browse ' + result.path);
                path.setAttribute('data-cd', result.path);
                path.classList.add('path');
                li.appendChild(folder);
                li.appendChild(path);
                var _ul = document.createElement("ul");
                li.appendChild(_ul);
                if (result.children !== undefined && result.children.length) {
                    PrintResults(result.children, _ul);
                    li.appendChild(_ul);
                }
                ul.appendChild(li);
            }
        }
        data = JSON.parse(data);
        var results = data.results;
        var _ul = document.querySelector('#' + this.getController().getModel().getUID() + '__pathbrowser nav.tree > ul');
        this.emptyTree();
        _ul.innerHTML = '';
        PrintResults(results, _ul);
        this.assignTreeListeners();
    };
    EurekaView.prototype.getProceedFooter = function () {
        return this.getElement().parentNode.querySelector('footer.proceed');
    };
    EurekaView.prototype.handleTreePathClicked = function (el) {
        var that = this;
        function deactivatePaths() {
            var paths = document.querySelectorAll("nav.tree a.path");
            for (var i = 0; i < paths.length; i++) {
                var path = paths[i];
                var li = that.getClosest(path, 'li');
                li.classList.remove('active');
            }
        }
        var source = that.getController().getModel().getCurrentMediaSource();
        var ajax = new AJAX();
        ajax.get(that.getController().getModel().getListDirectoryRequestURL(), { s: source, dir: el.getAttribute('data-cd'), headers: that.getController().getModel().getXHRHeaders() }, function (data) {
            that.paintJSON(data);
        });
        var li = that.getClosest(el, 'li');
        deactivatePaths();
        li.classList.add('active');
    };
    EurekaView.prototype.assignTreeListeners = function () {
        var that = this;
        var paths = document.querySelectorAll("nav.tree a.path");
        for (var i = 0; i < paths.length; i++) {
            var path = paths[i];
            path.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                that.handleTreePathClicked(this);
            });
        }
        this.assignTreeFolderListeners();
    };
    EurekaView.prototype.assignMediaBrowserOptGroupListeners = function () {
        var that = this;
        if (that.getController().getModel().getDebug())
            console.log('assignMediaBrowserOptGroupListeners');
        var select = that.getElement().querySelector('#' + that.getController().getModel().getUID() + '__browsing select');
        select.addEventListener('change', function () {
            var selected = that.getSelectedOption(select);
            that.getController().getModel().setCurrentMediaSource(that.getClosest(selected, 'optgroup').getAttribute('data-source'));
            var ajax = new AJAX();
            ajax.get(that.getController().getModel().getListSourceRequestURL(), { s: that.getController().getModel().getCurrentMediaSource(), headers: that.getController().getModel().getXHRHeaders() }, function (data) {
                that.getController().getView().populateTree(data);
            });
        });
    };
    EurekaView.prototype.assignTreeFolderListeners = function () {
        var that = this;
        var folders = document.querySelectorAll("nav.tree a.folder");
        for (var i = 0; i < folders.length; i++) {
            var folder = folders[i];
            folder.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                var _icon = this.querySelector('.fa');
                var _closing = _icon.classList.contains('fa-folder-open');
                var li = that.getClosest(this, 'li');
                var dataCD = this.nextSibling.getAttribute('data-cd');
                if (_closing) {
                    _icon.classList.remove('fa-folder-open');
                    _icon.classList.remove('icon-folder-open');
                    _icon.classList.add('fa-folder');
                    _icon.classList.add('icon-folder');
                    li.classList.remove('open');
                }
                else {
                    _icon.classList.remove('fa-folder');
                    _icon.classList.remove('icon-folder');
                    _icon.classList.add('fa-folder-open');
                    _icon.classList.add('icon-folder-open');
                    li.classList.add('open');
                    var e = document.createEvent('CustomEvent');
                    (e).initCustomEvent(EurekaModel.EurekaDirectoryOpened, true, true, {
                        data: {
                            cd: that.getController().getModel().getCurrentDirectory(),
                            s: that.getController().getModel().getCurrentMediaSource(),
                            path: dataCD
                        }
                    });
                    that.getElement().dispatchEvent(e);
                }
            });
        }
    };
    EurekaView.prototype.assignSelectListeners = function () {
        var that = this;
        var mediaSourceSelect = that.getElement().querySelector('#' + that.getController().getModel().getUID() + '__mediasource-select');
        mediaSourceSelect.addEventListener('change', function () {
            that.getController().getModel().setCurrentMediaSource(this.value);
            that.getController().getModel().setCurrentDirectory(this.value, false);
            var ajax = new AJAX();
            ajax.get(that.getController().getModel().getListSourceRequestURL(), { s: that.getController().getModel().getCurrentMediaSource(), headers: that.getController().getModel().getXHRHeaders() }, function (data) {
                that.getController().getView().populateTree(data);
            });
        });
    };
    EurekaView.prototype.emptyTree = function () {
        var paths = document.querySelectorAll("nav.tree a.path");
        for (var i = 0; i < paths.length; i++) {
            var path = paths[i];
            path.removeEventListener('click');
            path.remove();
        }
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
    EurekaView.prototype.paint = function () {
        this.assignARIAKeyListeners();
        this.assignContextualClickListeners();
        this.assignDraggableListeners();
    };
    EurekaView.prototype.paintTree = function (data) {
        data = JSON.parse(data);
        var tree = (this.getElement().querySelector('nav.tree'));
        var results = data.results;
        function printTreeNavResults(results, ul) {
            for (var i = 0; i < results.length; i++) {
                var result = results[i];
                var li = document.createElement('li');
                var folder = document.createElement('a');
                folder.innerHTML = '&nbsp;';
                folder.classList.add('folder');
                var folderOpenIcon = document.createElement('i');
                folderOpenIcon.classList.add('fa');
                folderOpenIcon.classList.add('icon');
                folderOpenIcon.classList.add('fa-folder');
                folderOpenIcon.classList.add('icon-folder');
                folder.appendChild(folderOpenIcon);
                var path = document.createElement('a');
                path.classList.add('path');
                path.setAttribute('href', '#');
                path.setAttribute('title', 'Browse ' + result.path);
                path.setAttribute('data-cd', result.path);
                path.innerHTML = ' ' + result.path;
                li.appendChild(folder);
                li.appendChild(path);
                var _ul = document.createElement("ul");
                li.appendChild(_ul);
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
        this.assignTreeListeners();
    };
    EurekaView.prototype.paintJSON = function (data) {
        var that = this;
        if (that.getController().getModel().getDebug())
            console.log('paintJSON');
        data = JSON.parse(data);
        var model = this.getController().getModel();
        model.setCurrentMediaSource(data.cs, false);
        model.setCurrentDirectory(data.cd, false);
        var results = data.results;
        var tbodyHTML = '';
        for (var i = 0; i < results.length; i++) {
            var result = results[i];
            var filename = result.filename;
            var safeFileName = filename.replace(/[!\"#$%&'\(\)\*\+,\.\/:;<=>\?\@\[\\\]\^`\{\|\}~]/g, '');
            var src = result.src;
            var filesize = result.filesize;
            var dimensions = result.dimensions;
            var editedon = parseInt(result.editedon);
            var tr = document.createElement("tr");
            tr.classList.add('eureka__row');
            tr.setAttribute('tabindex', "0");
            tr.setAttribute('data-tokens', '');
            tr.setAttribute('data-filename', filename);
            tr.setAttribute('data-safe-filename', safeFileName);
            tr.setAttribute('data-dimensions-w', dimensions.split('x')[0]);
            tr.setAttribute('data-dimensions-h', dimensions.split('x')[1]);
            tr.setAttribute('data-filesize-bytes', filesize);
            tr.setAttribute('data-timestamp', editedon.toString());
            var td = document.createElement("td");
            td.setAttribute('contenteditable', 'false');
            td.classList.add('eureka__row-image');
            var imgD = document.createElement('div');
            imgD.classList.add('image');
            var img = document.createElement('img');
            img.setAttribute('src', src);
            imgD.appendChild(img);
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
            tdDimensionCell.appendChild(createCode(dimensions));
            var tdFilesizeCell = document.createElement('td');
            tdFilesizeCell.classList.add('eureka__row-filesize');
            tdFilesizeCell.appendChild(createCode(that.formatFileSize(filesize)));
            var tdEditedOnCell = document.createElement('td');
            tdEditedOnCell.classList.add('eureka__row-editedon');
            tdEditedOnCell.appendChild(createCode((new Date(editedon * 1000)).toLocaleDateString(model.getLocale(), {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            })));
            tr.appendChild(td);
            tr.appendChild(tdDimensionCell);
            tr.appendChild(tdFilesizeCell);
            tr.appendChild(tdEditedOnCell);
            tbodyHTML += tr.outerHTML;
            function createContextualRow() {
                var tr = document.createElement('tr');
                tr.classList.add('contextual');
                tr.setAttribute('id', 'eureka_contextual__' + safeFileName);
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
                        a.setAttribute('href', src);
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
                    if (that.getController().getModel().getEditable() && document.execCommand)
                        nav.appendChild(createRenameBtn());
                    if (that.getController().getModel().getEditable())
                        nav.appendChild(createTrashBtn());
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
        }
        document.querySelector('#' + this.getController().getModel().getUID() + ' .eureka-table > table > tbody').innerHTML = tbodyHTML;
        try {
            this.getElement().querySelector('nav.tree li.active').classList.remove('active');
        }
        catch (e) {
        }
        try {
            this.getElement().querySelector('nav.tree li > a[data-cd="' + data.cd + '"]').parentNode.classList.add('active');
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
                if (that.getController().getModel().getAlertBeforeDelete() && !window.confirm('Are you sure you want to delete ' + mediaRow.getAttribute('data-filename') + '?')) {
                    return false;
                }
                that.getController().getModel().deleteFile(mediaRow.getAttribute('data-filename'), mediaRow);
                function remove(el) {
                    try {
                        el.remove();
                    }
                    catch (e) {
                        el.parentNode.removeChild(el);
                    }
                }
                remove(mediaRow);
                remove(contextual);
                try {
                    nextRow.focus();
                }
                catch (e) {
                }
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
                    code.select();
                }
                catch (e) {
                }
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
                    var tr = this.parentNode.parentNode;
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
        if (that.getController().getModel().getDebug()) {
            console.log('updateMediaSourceListings: ');
            console.log(data);
        }
        data = JSON.parse(data);
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
            catch (e) {
            }
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
            catch (e) {
            }
            if (!optgroup) {
                optgroup = document.createElement('optgroup');
                optgroup.setAttribute('label', data.title);
                optgroup.setAttribute('data-source', id);
            }
            var results = data.results;
            var options = [];
            printOptGroupOptions(results);
            optgroup.innerHTML = '';
            function printOptGroupOptions(results) {
                for (var i = 0; i < results.length; i++) {
                    var result = results[i];
                    var option = document.createElement('option');
                    option.innerHTML = result.path;
                    option.setAttribute('value', result.path);
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
        for (; elem && elem !== document; elem = elem.parentNode) {
            if (firstChar === '.') {
                if (elem.classList.contains(selector.substr(1))) {
                    return elem;
                }
            }
            if (firstChar === '#') {
                if (elem.id === selector.substr(1)) {
                    return elem;
                }
            }
            if (firstChar === '[') {
                if (elem.hasAttribute(selector.substr(1, selector.length - 2))) {
                    return elem;
                }
            }
            if (elem.tagName.toLowerCase() === selector) {
                return elem;
            }
        }
        return null;
    };
    return EurekaView;
})();
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
        var eureka = that.getView().getElement();
        eureka.addEventListener('eurekaViewChange', function (e) {
        });
        eureka.addEventListener('eurekaCurrentDirectoryChange', function (e) {
            if (that.getModel().getDebug())
                console.log('eurekaCurrentDirectoryChange');
            var ajax = new AJAX();
            ajax.get(that.getModel().getListDirectoryRequestURL(), { s: that.getModel().getCurrentMediaSource(), dir: e.currentDirectory, headers: that.getModel().getXHRHeaders() }, function (data) {
                if (that.getModel().getDebug())
                    console.log(data);
                that.getView().paintJSON(data);
            });
        });
        eureka.addEventListener('eurekaMediaSourceChange', function (e) {
            if (that.getModel().getDebug())
                console.log('eurekaMediaSourceChange');
            var ajax = new AJAX();
            ajax.get(that.getModel().getListSourceRequestURL(), { s: e.currentMediaSource, headers: that.getModel().getXHRHeaders() }, function (data) {
                if (that.getModel().getDebug())
                    console.log(data);
                that.getView().paintTree(data);
                that.getModel().setCurrentDirectory('');
            });
        });
        eureka.addEventListener('MediaSourcesListChange', function (e) {
            if (that.getModel().getDebug())
                console.log('MediaSourcesListChange: ');
            var sources = e.detail.data;
            if (that.getModel().getDebug())
                console.log(e);
            for (var i = 0; i < sources.length; i++) {
                var source = new EurekaMediaSource(sources[i].opts);
                var id = source.getID();
                function requestMediaListings(source) {
                    if (that.getModel().getDebug())
                        console.log('requestMediaListings');
                    var id = source.getID();
                    var ajax = new AJAX();
                    ajax.get(that.getModel().getListSourceRequestURL(), { s: id, headers: that.getModel().getXHRHeaders() }, function (data) {
                        if (that.getModel().getDebug())
                            console.log(data);
                        that.getView().updateMediaSourceListings(data);
                    });
                }
                requestMediaListings(source);
            }
        });
        if (that.getModel().getDebug())
            console.log('MediaSourcesListChange listener added');
        (function () {
            if (that.getModel().getDebug())
                console.log('MediaSourcesListChange: ');
            var ajax = new AJAX();
            ajax.get(that.getModel().getListSourcesRequestURL(), { headers: that.getModel().getXHRHeaders() }, function (data) {
                if (that.getModel().getDebug())
                    console.log(data);
                that.getModel().setMediaSourcesData(data);
            });
        })();
    };
    return EurekaController;
})();
//# sourceMappingURL=eureka.js.map