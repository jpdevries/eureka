(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("React"), require("ReactDOM"), require("Redux"), require("ReactRedux"));
	else if(typeof define === 'function' && define.amd)
		define(["React", "ReactDOM", "Redux", "ReactRedux"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("React"), require("ReactDOM"), require("Redux"), require("ReactRedux")) : factory(root["React"], root["ReactDOM"], root["Redux"], root["ReactRedux"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_5__, __WEBPACK_EXTERNAL_MODULE_6__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.EurekaMediaBrowser = undefined;

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(2);

	var _reactDom2 = _interopRequireDefault(_reactDom);

	var _path = __webpack_require__(3);

	var _path2 = _interopRequireDefault(_path);

	var _redux = __webpack_require__(5);

	var _reactRedux = __webpack_require__(6);

	var _Eureka = __webpack_require__(7);

	var _Eureka2 = _interopRequireDefault(_Eureka);

	var _reactIntl = __webpack_require__(23);

	var _utility = __webpack_require__(17);

	var _utility2 = _interopRequireDefault(_utility);

	var _en = __webpack_require__(95);

	var _en2 = _interopRequireDefault(_en);

	var _i18n = __webpack_require__(96);

	var _i18n2 = _interopRequireDefault(_i18n);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	var actions = __webpack_require__(19),
	    store = __webpack_require__(9);
	//import localeData from './../i18n/locales/en.json';

	//import dutchData from './../i18n/locales/nl.json';
	//console.log('en',en);
	//console.log('localeData',localeData);
	(0, _reactIntl.addLocaleData)([].concat(_toConsumableArray(_en2.default)));

	var defaultLang = 'en';

	var EurekaMediaBrowser = exports.EurekaMediaBrowser = function (_PureComponent) {
	  _inherits(EurekaMediaBrowser, _PureComponent);

	  function EurekaMediaBrowser(props) {
	    _classCallCheck(this, EurekaMediaBrowser);

	    //console.log(props.lang);

	    //console.log('A');
	    //console.log(navigator.languages, navigator.languages[0], navigator.language, navigator.userLanguage);

	    var _this = _possibleConstructorReturn(this, (EurekaMediaBrowser.__proto__ || Object.getPrototypeOf(EurekaMediaBrowser)).call(this, props));

	    var language = _this.getLanguage(props);

	    //console.log('B', language);

	    var languageWithoutRegionCode = language.toLowerCase().split(/[_-]+/)[0];

	    var config = Object.assign({}, props, {});

	    if (props.storagePrefix !== 'eureka__' || true) {
	      // they are using a non-default localStorage prefix
	      var _config = Object.assign({}, {
	        currentDirectory: function () {
	          try {
	            return localStorage.getItem(props.storagePrefix + 'currentDirectory') || undefined;
	          } catch (e) {
	            return undefined;
	          }
	        }(),
	        mode: function () {
	          try {
	            return localStorage.getItem(props.storagePrefix + 'mode') || undefined;
	          } catch (e) {
	            return undefined;
	          }
	        }(),
	        sort: function () {
	          try {
	            return localStorage.getItem(props.storagePrefix + 'sort') || undefined;
	          } catch (e) {
	            return undefined;
	          }
	        }(),
	        /*source:(() => {
	          try {
	            return JSON.parse(localStorage.getItem(`${props.storagePrefix}source`)) || undefined
	          } catch(e) { return undefined }
	        })(),*/
	        treeHidden: function () {
	          try {
	            return !JSON.parse(localStorage.getItem(props.storagePrefix + 'view')).sourceTreeOpen;
	          } catch (e) {
	            return undefined;
	          }
	        }()
	      }, props);

	      var localSources = function () {
	        try {
	          return JSON.parse(localStorage.getItem(props.storagePrefix + 'source')) || undefined;
	        } catch (e) {
	          return undefined;
	        }
	      }();

	      var localContent = function () {
	        try {
	          return JSON.parse(localStorage.getItem(props.storagePrefix + 'content')) || undefined;
	        } catch (e) {
	          return undefined;
	        }
	      }();

	      if (localSources) {
	        if (localSources.sources !== undefined) store.dispatch(actions.fetchMediaSourcesSuccess(localSources.sources));
	        if (localSources.currentSource !== undefined) store.dispatch(actions.updateSource(localSources.currentSource.toString()));
	      }

	      if (localContent) {
	        store.dispatch(actions.updateContent(localContent));
	      }

	      if (!_utility2.default.serverSideRendering) {
	        try {
	          window.addEventListener('touchstart', function () {
	            store.dispatch(actions.upateView({ isTouch: true }));
	          });
	        } catch (e) {}
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

	    var i18nEdpoint = function () {
	      try {
	        return props.endpoints.i18n;
	      } catch (e) {
	        return _path2.default.join(store.getState().config.assetsBasePath, './js/i18n/locales/');
	      }
	    }();

	    var shouldFetch = function () {
	      //console.log('shouldFetch', props.lang);
	      if (_utility2.default.serverSideRendering) return false;
	      try {
	        return !props.lang || languageWithoutRegionCode == 'en' || _this.state.i18n[props.lang] !== undefined || _this.state.i18n[languageWithoutRegionCode] !== undefined ? false : true;
	      } catch (err) {
	        return props.lang !== 'en' ? true : false;
	      }
	    }();

	    if (shouldFetch) fetch('' + i18nEdpoint + languageWithoutRegionCode + '.json').then(function (response) {
	      response.json().then(function (json) {
	        var state = _this.state;
	        _this.setState({
	          i18n: json
	        });
	      });
	    });

	    store.subscribe(function () {
	      var state = store.getState();
	      console.log(state);

	      // whenever the state changes we store pieces of the state locally so that next time Eureka fires up it can render the user interface without delay
	      if (state.config.useLocalStorage) {
	        try {
	          localStorage.setItem(state.config.storagePrefix + 'currentDirectory', state.content.cd);
	          localStorage.setItem(state.config.storagePrefix + 'directory', JSON.stringify(state.directory));
	          localStorage.setItem(state.config.storagePrefix + 'currentSource', state.source.currentSource);
	          localStorage.setItem(state.config.storagePrefix + 'source', JSON.stringify(state.source));
	          //localStorage.setItem(`${state.config.storagePrefix}mode`, state.view.mode);
	          //localStorage.setItem(`${state.config.storagePrefix}sort`, state.view.sort);
	          //localStorage.setItem(`${state.config.storagePrefix}treeHidden`, !state.view.sourceTreeOpen);
	          localStorage.setItem(state.config.storagePrefix + 'content', JSON.stringify(Object.assign({}, state.content, {
	            chosenMediaItemsInverted: undefined
	          })));
	          localStorage.setItem(state.config.storagePrefix + 'tree', JSON.stringify(state.tree));
	          //console.log('state.view', JSON.stringify(state.view));
	          localStorage.setItem(state.config.storagePrefix + 'view', JSON.stringify(Object.assign({}, state.view, {
	            selectionInverted: false
	          })));
	        } catch (e) {}
	      }
	    });
	    return _this;
	  }

	  _createClass(EurekaMediaBrowser, [{
	    key: 'getLanguage',
	    value: function getLanguage(props) {
	      try {
	        return props.lang ? props.lang : document.documentElement.lang || navigator.languages && navigator.languages[0] || navigator.language || navigator.userLanguage;
	      } catch (e) {
	        return 'en-US';
	      }
	    }
	  }, {
	    key: 'componentWillMount',
	    value: function componentWillMount() {

	      this.EurekaController = (0, _reactRedux.connect)(function (state, props) {
	        // todo list
	        return {
	          content: state.content,
	          view: state.view,
	          tree: state.tree,
	          source: state.source,
	          directory: state.directory,
	          fetched: state.fetched,
	          config: state.config,
	          notifications: state.notifications
	        };
	      })((0, _reactIntl.injectIntl)(_Eureka2.default)); // shoot it up with some i18n
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this2 = this;

	      var props = this.props;
	      var state = this.state;

	      var language = this.getLanguage(props);
	      var languageWithoutRegionCode = language.toLowerCase().split(/[_-]+/)[0];
	      var messages = function () {
	        if (_utility2.default.serverSideRendering) return props.messages;

	        if (languageWithoutRegionCode == 'en') {
	          return _i18n2.default[languageWithoutRegionCode] || _i18n2.default[language] || _i18n2.default.en;
	        } else {
	          var fetchedLexiconData = function () {
	            try {
	              return _this2.state.i18n;
	            } catch (e) {
	              return _i18n2.default;
	            }
	          }();
	          return fetchedLexiconData || _i18n2.default;
	          //return fetchedLexiconData[languageWithoutRegionCode] || fetchedLexiconData[language] || localeData[languageWithoutRegionCode] || localeData[language] || localeData.en;
	        }
	      }();

	      //console.log('messages',messages);

	      var lang = function () {
	        //console.log(props);
	        //return 'nl';
	        try {
	          return _this2.state.i18n ? props.lang : EurekaMediaBrowser.defaultProps.lang; // the component is en-US unless/until the lexicons have async loaded
	        } catch (e) {
	          return EurekaMediaBrowser.defaultProps.lang;
	        }
	      }();

	      return _react2.default.createElement(
	        _reactRedux.Provider,
	        { store: store },
	        _react2.default.createElement(
	          _reactIntl.IntlProvider,
	          _extends({}, props, { locale: language, messages: messages }),
	          _react2.default.createElement(this.EurekaController, _extends({}, props, { lang: lang }))
	        )
	      );
	    }
	  }]);

	  return EurekaMediaBrowser;
	}(_react.PureComponent);

	EurekaMediaBrowser.defaultProps = {
	  i18n: 'assets/js/i18n/locales/',
	  lang: 'en-US'
	};

	exports.default = EurekaMediaBrowser;

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	// resolves . and .. elements in a path array with directory names there
	// must be no slashes, empty elements, or device names (c:\) in the array
	// (so also no leading and trailing slashes - it does not distinguish
	// relative and absolute paths)
	function normalizeArray(parts, allowAboveRoot) {
	  // if the path tries to go above the root, `up` ends up > 0
	  var up = 0;
	  for (var i = parts.length - 1; i >= 0; i--) {
	    var last = parts[i];
	    if (last === '.') {
	      parts.splice(i, 1);
	    } else if (last === '..') {
	      parts.splice(i, 1);
	      up++;
	    } else if (up) {
	      parts.splice(i, 1);
	      up--;
	    }
	  }

	  // if the path is allowed to go above the root, restore leading ..s
	  if (allowAboveRoot) {
	    for (; up--; up) {
	      parts.unshift('..');
	    }
	  }

	  return parts;
	}

	// Split a filename into [root, dir, basename, ext], unix version
	// 'root' is just a slash, or nothing.
	var splitPathRe =
	    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
	var splitPath = function(filename) {
	  return splitPathRe.exec(filename).slice(1);
	};

	// path.resolve([from ...], to)
	// posix version
	exports.resolve = function() {
	  var resolvedPath = '',
	      resolvedAbsolute = false;

	  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
	    var path = (i >= 0) ? arguments[i] : process.cwd();

	    // Skip empty and invalid entries
	    if (typeof path !== 'string') {
	      throw new TypeError('Arguments to path.resolve must be strings');
	    } else if (!path) {
	      continue;
	    }

	    resolvedPath = path + '/' + resolvedPath;
	    resolvedAbsolute = path.charAt(0) === '/';
	  }

	  // At this point the path should be resolved to a full absolute path, but
	  // handle relative paths to be safe (might happen when process.cwd() fails)

	  // Normalize the path
	  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
	    return !!p;
	  }), !resolvedAbsolute).join('/');

	  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
	};

	// path.normalize(path)
	// posix version
	exports.normalize = function(path) {
	  var isAbsolute = exports.isAbsolute(path),
	      trailingSlash = substr(path, -1) === '/';

	  // Normalize the path
	  path = normalizeArray(filter(path.split('/'), function(p) {
	    return !!p;
	  }), !isAbsolute).join('/');

	  if (!path && !isAbsolute) {
	    path = '.';
	  }
	  if (path && trailingSlash) {
	    path += '/';
	  }

	  return (isAbsolute ? '/' : '') + path;
	};

	// posix version
	exports.isAbsolute = function(path) {
	  return path.charAt(0) === '/';
	};

	// posix version
	exports.join = function() {
	  var paths = Array.prototype.slice.call(arguments, 0);
	  return exports.normalize(filter(paths, function(p, index) {
	    if (typeof p !== 'string') {
	      throw new TypeError('Arguments to path.join must be strings');
	    }
	    return p;
	  }).join('/'));
	};


	// path.relative(from, to)
	// posix version
	exports.relative = function(from, to) {
	  from = exports.resolve(from).substr(1);
	  to = exports.resolve(to).substr(1);

	  function trim(arr) {
	    var start = 0;
	    for (; start < arr.length; start++) {
	      if (arr[start] !== '') break;
	    }

	    var end = arr.length - 1;
	    for (; end >= 0; end--) {
	      if (arr[end] !== '') break;
	    }

	    if (start > end) return [];
	    return arr.slice(start, end - start + 1);
	  }

	  var fromParts = trim(from.split('/'));
	  var toParts = trim(to.split('/'));

	  var length = Math.min(fromParts.length, toParts.length);
	  var samePartsLength = length;
	  for (var i = 0; i < length; i++) {
	    if (fromParts[i] !== toParts[i]) {
	      samePartsLength = i;
	      break;
	    }
	  }

	  var outputParts = [];
	  for (var i = samePartsLength; i < fromParts.length; i++) {
	    outputParts.push('..');
	  }

	  outputParts = outputParts.concat(toParts.slice(samePartsLength));

	  return outputParts.join('/');
	};

	exports.sep = '/';
	exports.delimiter = ':';

	exports.dirname = function(path) {
	  var result = splitPath(path),
	      root = result[0],
	      dir = result[1];

	  if (!root && !dir) {
	    // No dirname whatsoever
	    return '.';
	  }

	  if (dir) {
	    // It has a dirname, strip trailing slash
	    dir = dir.substr(0, dir.length - 1);
	  }

	  return root + dir;
	};


	exports.basename = function(path, ext) {
	  var f = splitPath(path)[2];
	  // TODO: make this comparison case-insensitive on windows?
	  if (ext && f.substr(-1 * ext.length) === ext) {
	    f = f.substr(0, f.length - ext.length);
	  }
	  return f;
	};


	exports.extname = function(path) {
	  return splitPath(path)[3];
	};

	function filter (xs, f) {
	    if (xs.filter) return xs.filter(f);
	    var res = [];
	    for (var i = 0; i < xs.length; i++) {
	        if (f(xs[i], i, xs)) res.push(xs[i]);
	    }
	    return res;
	}

	// String.prototype.substr - negative index don't work in IE8
	var substr = 'ab'.substr(-1) === 'b'
	    ? function (str, start, len) { return str.substr(start, len) }
	    : function (str, start, len) {
	        if (start < 0) start = str.length + start;
	        return str.substr(start, len);
	    }
	;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ },
/* 4 */
/***/ function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};

	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.

	var cachedSetTimeout;
	var cachedClearTimeout;

	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }


	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }



	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_5__;

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_6__;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _MediaSourceSelector = __webpack_require__(8);

	var _MediaSourceSelector2 = _interopRequireDefault(_MediaSourceSelector);

	var _MediaDirectorySelector = __webpack_require__(46);

	var _MediaDirectorySelector2 = _interopRequireDefault(_MediaDirectorySelector);

	var _TreeBar = __webpack_require__(47);

	var _TreeBar2 = _interopRequireDefault(_TreeBar);

	var _TreeToggle = __webpack_require__(50);

	var _TreeToggle2 = _interopRequireDefault(_TreeToggle);

	var _ChooseBar = __webpack_require__(51);

	var _ChooseBar2 = _interopRequireDefault(_ChooseBar);

	var _SearchBar = __webpack_require__(52);

	var _SearchBar2 = _interopRequireDefault(_SearchBar);

	var _ViewChooser = __webpack_require__(53);

	var _ViewChooser2 = _interopRequireDefault(_ViewChooser);

	var _EurekaTable = __webpack_require__(56);

	var _EurekaTable2 = _interopRequireDefault(_EurekaTable);

	var _FileTree = __webpack_require__(85);

	var _FileTree2 = _interopRequireDefault(_FileTree);

	var _UploadForm = __webpack_require__(86);

	var _UploadForm2 = _interopRequireDefault(_UploadForm);

	var _PathBar = __webpack_require__(87);

	var _PathBar2 = _interopRequireDefault(_PathBar);

	var _DropArea = __webpack_require__(88);

	var _DropArea2 = _interopRequireDefault(_DropArea);

	var _Modal = __webpack_require__(89);

	var _Modal2 = _interopRequireDefault(_Modal);

	var _ModalCreateDirectoryForm = __webpack_require__(90);

	var _ModalCreateDirectoryForm2 = _interopRequireDefault(_ModalCreateDirectoryForm);

	var _ModalRenameItemForm = __webpack_require__(91);

	var _ModalRenameItemForm2 = _interopRequireDefault(_ModalRenameItemForm);

	var _SortContents = __webpack_require__(92);

	var _SortContents2 = _interopRequireDefault(_SortContents);

	var _Icon = __webpack_require__(48);

	var _Icon2 = _interopRequireDefault(_Icon);

	var _Notification = __webpack_require__(93);

	var _Notification2 = _interopRequireDefault(_Notification);

	var _ChooseRadio = __webpack_require__(94);

	var _ChooseRadio2 = _interopRequireDefault(_ChooseRadio);

	var _mousetrap = __webpack_require__(61);

	var _mousetrap2 = _interopRequireDefault(_mousetrap);

	var _reactIntl = __webpack_require__(23);

	var _store = __webpack_require__(9);

	var _store2 = _interopRequireDefault(_store);

	var _actions = __webpack_require__(19);

	var _actions2 = _interopRequireDefault(_actions);

	var _utility = __webpack_require__(17);

	var _utility2 = _interopRequireDefault(_utility);

	var _definedMessages = __webpack_require__(49);

	var _definedMessages2 = _interopRequireDefault(_definedMessages);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var path = __webpack_require__(3);

	var pathParse = __webpack_require__(83);

	var classNames = __webpack_require__(54);

	var CREATE_DIRECTORY = 'create_directory';
	var RENAME_ITEM = 'rename_item';

	//Notification.propTypes = { initialCount: React.PropTypes.number };
	//Notification.defaultProps = { initialCount: 0 };


	var Eureka = function (_Component) {
	  _inherits(Eureka, _Component);

	  /*static propTypes = {
	    intl: PropTypes.object.isRequired,
	  }*/

	  function Eureka(props) {
	    _classCallCheck(this, Eureka);

	    var _this = _possibleConstructorReturn(this, (Eureka.__proto__ || Object.getPrototypeOf(Eureka)).call(this, props));

	    _initialiseProps.call(_this);

	    _this.state = {
	      modalOpen: false,
	      currentModal: undefined,
	      renamingItem: undefined,
	      notifications: [],
	      stickyNotifications: true
	    };

	    _this.decoratedActions = props.decoratedActions ? Object.assign({}, _actions2.default, props.decoratedActions) : _actions2.default;
	    return _this;
	  }

	  _createClass(Eureka, [{
	    key: 'componentWillUnmount',
	    value: function componentWillUnmount() {
	      this.removeKeyboardListeners();
	    }
	  }, {
	    key: 'componentWillUpdate',
	    value: function componentWillUpdate(nextProps, nextState) {
	      try {
	        //console.log('nextProps.notifications', nextProps.notifications);
	        var unarchivedNotifications = nextProps.notifications.filter(function (notification) {
	          return !notification.archived;
	        });
	        //console.log('unarchivedNotifications', unarchivedNotifications);
	        //console.log('nextProps.notifications[0].sticky', unarchivedNotifications[0].sticky);
	        //console.log('does it', this.state.stickyNotifications === unarchivedNotifications[0].sticky, this.state.stickyNotifications, unarchivedNotifications[0].sticky);
	        if (this.state.stickyNotifications === unarchivedNotifications[0].sticky) return;

	        this.setState({
	          stickyNotifications: unarchivedNotifications[0].sticky
	        });
	      } catch (e) {}
	    }

	    /*notificationsTick = () => {
	       console.log('notificationsTick!');
	      try {
	        this.setState({
	          notifications: this.state.notifications.shift()
	        })
	      } catch(e) {}
	    }*/

	  }, {
	    key: 'assignKeyboardListeners',


	    /*handleKeyboardDeselect = (event) => {
	      console.log('handleKeyboardDeselect');
	      const toUncheck = this.getEurekaRoot().querySelectorAll('.eureka__td-media input[type="checkbox"]:checked');
	      console.log('toUncheck', toUncheck);
	      for(let i = 0; i < toUncheck.length; i++) {
	        toUncheck[i].click();
	      }
	       store.dispatch(actions.updateContent({
	        chosenMediaItems: [],
	        chosenMediaItemsInverted: []
	      }));
	    }*/

	    value: function assignKeyboardListeners() {
	      _mousetrap2.default.bind(['ctrl+;'], this.toggleSourceTreeOpen);
	      _mousetrap2.default.bind(['ctrl+alt+1', 'ctrl+alt+2', 'ctrl+alt+3', 'ctrl+alt+4'], this.handleKeyboardChangeView);
	      _mousetrap2.default.bind(['alt+0', 'alt+1', 'alt+2', 'alt+3', 'alt+4', 'alt+5', 'alt+6', 'alt+7', 'alt+8', 'alt+9'], this.handleKeyboardChangeSource);
	      _mousetrap2.default.bind(['ctrl+u'], this.handleKeyboardUpload);
	      _mousetrap2.default.bind(['ctrl+n'], this.handleKeyboardCreateDirectory);
	      _mousetrap2.default.bind(['ctrl+f'], this.handleKeyboardFilter);
	      _mousetrap2.default.bind(['alt+up'], this.handleKeyboardSortAscending);
	      _mousetrap2.default.bind(['alt+down'], this.handleKeyboardSortDescending);

	      _mousetrap2.default.bind(['alt+n'], this.handleKeyboardSortName);
	      _mousetrap2.default.bind(['alt+d'], this.handleKeyboardSortDimensions);
	      _mousetrap2.default.bind(['alt+f'], this.handleKeyboardSortFileSize);
	      _mousetrap2.default.bind(['alt+e'], this.handleKeyboardSortEditedOn);

	      _mousetrap2.default.bind(['alt+s'], this.handleKeyboardChooseSingle);
	      _mousetrap2.default.bind(['alt+m'], this.handleKeyboardChooseMultiple);
	      _mousetrap2.default.bind(['alt+i'], this.handleKeyboardToggleInvertSelection);
	      _mousetrap2.default.bind(['alt+z'], this.handleKeyboardDeselect);

	      if (this.props.config.handlers && this.props.config.handlers.createFile) _mousetrap2.default.bind(['ctrl+shift+n'], this.handleKeyboardCreateFile);
	    }
	  }, {
	    key: 'removeKeyboardListeners',
	    value: function removeKeyboardListeners() {
	      _mousetrap2.default.unbind(['ctrl+;'], this.toggleSourceTreeOpen);
	      _mousetrap2.default.unbind(['ctrl+alt+1', 'ctrl+alt+2', 'ctrl+alt+3', 'ctrl+alt+4'], this.handleKeyboardChangeView);
	      _mousetrap2.default.unbind(['alt+0', 'alt+1', 'alt+2', 'alt+3', 'alt+4', 'alt+5', 'alt+6', 'alt+7', 'alt+8', 'alt+9'], this.handleKeyboardChangeSource);
	      _mousetrap2.default.unbind(['ctrl+u'], this.handleKeyboardUpload);
	      _mousetrap2.default.unbind(['ctrl+n'], this.handleKeyboardCreateDirectory);
	      _mousetrap2.default.unbind(['ctrl+f'], this.handleKeyboardFilter);
	      _mousetrap2.default.unbind(['alt+up'], this.handleKeyboardSortAscending);
	      _mousetrap2.default.unbind(['alt+down'], this.handleKeyboardSortDescending);

	      _mousetrap2.default.unbind(['alt+n'], this.handleKeyboardSortName);
	      _mousetrap2.default.unbind(['alt+d'], this.handleKeyboardSortDimensions);
	      _mousetrap2.default.unbind(['alt+f'], this.handleKeyboardSortFileSize);
	      _mousetrap2.default.unbind(['alt+e'], this.handleKeyboardSortEditedOn);

	      _mousetrap2.default.unbind(['alt+s'], this.handleKeyboardChooseSingle);
	      _mousetrap2.default.unbind(['alt+m'], this.handleKeyboardChooseMultiple);
	      _mousetrap2.default.unbind(['alt+i'], this.handleKeyboardToggleInvertSelection);
	      _mousetrap2.default.unbind(['alt+z'], this.handleKeyboardDeselect);

	      if (this.props.config.handlers && this.props.config.handlers.createFile) _mousetrap2.default.unbind(['ctrl+shift+n'], this.handleKeyboardCreateFile);
	    }
	  }, {
	    key: 'getEurekaRoot',
	    value: function getEurekaRoot() {
	      try {
	        return event.target.closest('.eureka-root');
	      } catch (e) {
	        return document.querySelector('.eureka-root');
	      }
	    }
	  }, {
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      var _this2 = this;

	      var props = this.props,
	          decoratedActions = this.decoratedActions,
	          _props$intl = props.intl,
	          formatMessage = _props$intl.formatMessage,
	          formatPlural = _props$intl.formatPlural;


	      this.assignKeyboardListeners();

	      _store2.default.dispatch(decoratedActions.fetchMediaSources(props.config.headers)).then(function () {
	        // hit the server and get the media sources
	        _store2.default.dispatch(decoratedActions.updateSourceTree(_this2.props.source.sources[0].id), props.config.headers).then(function (content) {
	          // then hit server for the directory tree of the first (default) media source
	          var props = _this2.props;

	          _store2.default.dispatch(decoratedActions.updateContent({ // updates the "current directory" of the view right away
	            cd: props.content.cd
	          }));
	          _store2.default.dispatch(decoratedActions.fetchDirectoryContents(props.source.currentSource, { // asyncronously fetches the directory contents from the API
	            path: props.content.cd
	          }, props.config.headers));

	          if (props.view.intervals.fetchDirectoryContents !== undefined && props.view.intervals.fetchDirectoryContents > 0) {
	            setInterval(function () {
	              // every so often hit the server and update the displayed contents of the current directory
	              var state = _store2.default.getState();
	              var props = _this2.props;

	              _store2.default.dispatch(decoratedActions.updateContent({ // updates the "current directory" of the view right away
	                cd: props.content.cd
	              }));
	              _store2.default.dispatch(decoratedActions.fetchDirectoryContents(props.source.currentSource, { // asyncronously fetches the directory contents from the API
	                path: props.content.cd
	              }, props.config.headers));
	            }, props.view.intervals.fetchDirectoryContents);
	          }

	          if (props.view.intervals.updateSourceTree !== undefined && props.view.intervals.updateSourceTree > 0) {
	            // hit the server and get the (top-level-ish) directory tree of the current source
	            setInterval(function () {
	              _store2.default.dispatch(decoratedActions.updateSourceTree(props.source.currentSource, props.config.headers));
	            }, props.view.intervals.updateSourceTree);
	          }
	        });

	        if (props.config.alwaysWelcome || props.config.welcome && localStorage.getItem(props.storagePrefix + 'welcome') !== 'false') {
	          (function () {
	            var wecomeToEurekaMessage = formatMessage(_definedMessages2.default.welcomeToEureka);
	            setTimeout(function () {
	              //message, notificationType, learnMore, dismissAfter, sticky = true
	              _store2.default.dispatch(_actions2.default.notify(wecomeToEurekaMessage, undefined, props.config.learnMore, false, false));
	              localStorage.setItem(props.storagePrefix + 'welcome', 'false');
	            }, 420);
	          })();
	        }
	      });

	      document.body.addEventListener('keyup', function (event) {
	        var key = event.keyCode || event.charCode || 0;
	        //console.log(key);
	        switch (key) {
	          case 27:
	            // Escape
	            _this2.setState({
	              modalOpen: false,
	              currentModal: undefined
	            });
	            break;
	        }
	      });
	    }
	  }, {
	    key: 'onCreateDirectory',
	    value: function onCreateDirectory() {
	      //console.log('onCreateDirectory');
	      this.setState({
	        modalOpen: true,
	        currentModal: CREATE_DIRECTORY
	      });
	    }
	  }, {
	    key: 'onModalCancel',
	    value: function onModalCancel(event) {
	      event.preventDefault();
	      //console.log('onModalCancel');
	      this.setState({
	        modalOpen: false,
	        currentModal: undefined
	      });
	    }
	  }, {
	    key: 'onModalSubmit',
	    value: function onModalSubmit(createDirectory) {
	      var _this3 = this;

	      var decoratedActions = this.decoratedActions;
	      var props = this.props;
	      //event.preventDefault();
	      //console.log('onModalSubmit',createDirectory);

	      switch (this.state.currentModal) {
	        case CREATE_DIRECTORY:
	          console.log(_store2.default.getState().content.cd, path.join(_store2.default.getState().content.cd, 'foo'));
	          _store2.default.dispatch(decoratedActions.createDirectory(_store2.default.getState().source.currentSource, path.join(_store2.default.getState().content.cd, createDirectory))).then(function () {
	            _this3.setState({
	              modalOpen: false,
	              currentModal: undefined
	            });
	          }).then(function () {
	            _store2.default.dispatch(decoratedActions.fetchDirectoryContents(props.source.currentSource, { // asyncronously fetches the directory contents from the API
	              path: _store2.default.getState().content.cd
	            }, props.config.headers));
	          });
	          break;

	        case RENAME_ITEM:
	          console.log();
	          break;
	      }
	    }
	  }, {
	    key: 'onRenameItemModalSubmit',
	    value: function onRenameItemModalSubmit(newName, item) {
	      var _this4 = this;

	      //console.log('onRenameItemModalSubmit!!!', newName, item);
	      //console.log(item.path);
	      var decoratedActions = this.decoratedActions;
	      var dir = function () {
	        try {
	          // this is bullshit webpack isn't including the parse method with the Node path module
	          return path.parse(item.path).dir;
	        } catch (e) {
	          //console.log('oh crap', item.path);
	          console.log(e);
	          return pathParse(item.path).dir;
	        }
	      }();

	      _store2.default.dispatch(decoratedActions.renameItem(this.props.source.currentSource, item.path, newName, this.props.config.headers)).then(function (results) {
	        _store2.default.dispatch(decoratedActions.updateContent({ contents: results.contents.filter(function (file) {
	            return file.filename;
	          }) }));
	        _this4.setState({
	          renamingItem: undefined,
	          modalOpen: false,
	          currentModal: undefined
	        });
	      });
	    }
	  }, {
	    key: 'onRenameItem',
	    value: function onRenameItem(item) {
	      //console.log('onRenameItem', item);
	      this.setState({
	        renamingItem: item,
	        modalOpen: true,
	        currentModal: RENAME_ITEM
	      });
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this5 = this;

	      var props = this.props,
	          state = this.state,
	          modalOpen = false,
	          _props$intl2 = this.props.intl,
	          formatMessage = _props$intl2.formatMessage,
	          formatDate = _props$intl2.formatDate,
	          createDirectoryMessage = formatMessage(_definedMessages2.default.directory),
	          renameItemMessage = formatMessage(_definedMessages2.default.rename, {
	        item: state.renamingItem ? ' ' + state.renamingItem.filename : ''
	      });

	      //console.log('state.notifications', state.notifications);

	      var modal = function () {
	        if (state.modalOpen) {
	          switch (state.currentModal) {
	            case CREATE_DIRECTORY:
	              return _react2.default.createElement(
	                _Modal2.default,
	                _extends({ onCancel: _this5.onModalCancel.bind(_this5), onSubmit: _this5.onModalSubmit.bind(_this5), title: createDirectoryMessage }, props),
	                _react2.default.createElement(_ModalCreateDirectoryForm2.default, props)
	              );
	              break;

	            case RENAME_ITEM:
	              return _react2.default.createElement(
	                _Modal2.default,
	                _extends({ onCancel: _this5.onModalCancel.bind(_this5), onSubmit: _this5.onRenameItemModalSubmit.bind(_this5), title: renameItemMessage }, props),
	                _react2.default.createElement(_ModalRenameItemForm2.default, _extends({}, props, { item: state.renamingItem }))
	              );
	              break;

	            default:
	              return undefined;
	              break;
	          }
	        }
	        //(state.modalOpen) ? <Modal onCancel={this.onModalCancel.bind(this)} onSubmit={this.onModalSubmit.bind(this)} title="Create Directory" {...props}><ModalCreateDirectoryForm {...props} /></Modal> : undefined
	      }();

	      var dropArea = props.config.allowUploads && props.config.doDragNDrop ? _react2.default.createElement(_DropArea2.default, props) : undefined;

	      var pathbrowser = !_utility2.default.serverSideRendering ? _react2.default.createElement(
	        'div',
	        { hidden: !props.view.sourceTreeOpen, 'aria-hidden': !props.view.sourceTreeOpen, id: 'eureka__pathbrowser', className: 'eureka__pathbrowser' },
	        _react2.default.createElement(_MediaSourceSelector2.default, props),
	        _react2.default.createElement(_FileTree2.default, _extends({}, props, { onCreateDirectory: this.onCreateDirectory.bind(this) })),
	        dropArea,
	        _react2.default.createElement(_TreeBar2.default, _extends({ onCreateDirectory: this.onCreateDirectory.bind(this) }, props))
	      ) : undefined;

	      var mediaDirectorySelector = !props.view.sourceTreeOpen ? _react2.default.createElement(_MediaDirectorySelector2.default, props) : undefined;

	      var uploadForm = !props.view.sourceTreeOpen && props.config.allowUploads ? _react2.default.createElement(_UploadForm2.default, props) : undefined;

	      var pathBar = props.view.focusedMediaItem ? _react2.default.createElement(_PathBar2.default, props) : undefined;

	      var unarchivedNotifications = this.props.notifications ? this.props.notifications.filter(function (notification) {
	        return !notification.archived;
	      }) : [];

	      var notificationMessage = function () {
	        try {
	          return unarchivedNotifications[0];
	        } catch (e) {
	          return undefined;
	        }
	      }();

	      var notification = notificationMessage ? _react2.default.createElement(_Notification2.default, _extends({ key: notificationMessage.id, onDismiss: this.handleNotificationDismissed }, notificationMessage, props)) : undefined;

	      var shouldDisplayChooseBar = function () {
	        try {
	          if (props.config.callbacks.choose) return true;
	        } catch (e) {
	          return false;
	        }
	      }();

	      var treeToggle = !_utility2.default.serverSideRendering ? _react2.default.createElement(_TreeToggle2.default, props) : undefined;
	      var viewChooser = !_utility2.default.serverSideRendering ? _react2.default.createElement(_ViewChooser2.default, props) : undefined;
	      var chooseBar = shouldDisplayChooseBar ? _react2.default.createElement(_ChooseBar2.default, _extends({ ariaHidden: state.modalOpen }, props)) : undefined;
	      var enlargeFocusedRows = props.view.enlargeFocusedRows ? ' eureka__enlarge-focused-rows' : '';
	      var chooseMultipleClass = props.view.chooseMultiple ? ' eureka__choose-multiple' : '';
	      var searchBar = !_utility2.default.serverSideRendering ? _react2.default.createElement(_SearchBar2.default, props) : undefined;
	      var serverSideClass = _utility2.default.serverSideRendering ? ' eureka__server-side' : '';
	      var chooseRadio = props.config.allowChooseMultiple && !_utility2.default.serverSideRendering ? _react2.default.createElement(_ChooseRadio2.default, { config: props.config, view: props.view, content: props.content, storagePrefix: props.storagePrefix }) : undefined;
	      var sortContentsSelector = !_utility2.default.serverSideRendering ? _react2.default.createElement(_SortContents2.default, _extends({}, props, { sort: props.view.sort })) : undefined;
	      var formDiv = _react2.default.createElement(
	        'div',
	        { 'aria-hidden': state.modalOpen, className: classNames({
	            "eureka__browse-content": true,
	            "eureka__uploading": props.view.isUploading
	          }) },
	        pathbrowser,
	        _react2.default.createElement(
	          'div',
	          { className: 'eureka__stage' },
	          _react2.default.createElement(
	            'div',
	            { className: 'eureka__stage__filter-view' },
	            _react2.default.createElement(
	              'header',
	              null,
	              _react2.default.createElement(
	                'h2',
	                null,
	                _react2.default.createElement(
	                  'span',
	                  { className: 'visually-hidden' },
	                  _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'media.browse', defaultMessage: 'Browse' }),
	                  ' '
	                ),
	                _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'media.contents', defaultMessage: 'Media Content' })
	              ),
	              chooseRadio,
	              searchBar
	            ),
	            _react2.default.createElement(
	              'div',
	              { role: 'menubar', className: 'eureka__tree-toggle' },
	              treeToggle,
	              mediaDirectorySelector,
	              sortContentsSelector,
	              uploadForm,
	              viewChooser
	            )
	          ),
	          _react2.default.createElement(
	            'div',
	            { className: 'eureka__table-wrapper' },
	            _react2.default.createElement(_EurekaTable2.default, _extends({ view: props.view }, props, { decoratedActions: props.decoratedActions, source: props.source, content: props.content, config: props.config, onRenameItem: this.onRenameItem.bind(this), onSubmit: this.onRenameItemModalSubmit.bind(this) }))
	          )
	        )
	      );

	      return _utility2.default.serverSideRendering ? _react2.default.createElement(
	        'form',
	        { lang: props.lang || undefined, method: 'POST', action: props.config.basePath, encType: 'multipart/form-data', className: 'eureka eureka__view-mode__' + props.view.mode + enlargeFocusedRows + serverSideClass },
	        formDiv,
	        pathBar,
	        chooseBar,
	        modal
	      ) : _react2.default.createElement(
	        'div',
	        { role: 'widget', lang: props.lang || undefined, className: 'eureka eureka__view-mode__' + props.view.mode + chooseMultipleClass + enlargeFocusedRows + serverSideClass },
	        _react2.default.createElement(
	          'div',
	          { className: classNames({
	              "eureka__sticky-bar": this.state.stickyNotifications
	            }), 'aria-live': 'assertive', 'aria-relevant': 'additions', 'aria-atomic': 'true', onClick: function onClick(event) {
	              event.currentTarget.querySelector('button').click();
	            } },
	          notification
	        ),
	        formDiv,
	        pathBar,
	        chooseBar,
	        modal
	      );
	    }
	  }]);

	  return Eureka;
	}(_react.Component);

	var _initialiseProps = function _initialiseProps() {
	  var _this6 = this;

	  this.handleKeyboardFilter = function (event) {
	    //console.log('handleKeyboardFilter', event);
	    var root = _this6.getEurekaRoot();
	    try {
	      root.querySelector('input[name="eureka__filter"]').focus();
	    } catch (e) {}
	  };

	  this.handleKeyboardSortAscending = function (event) {
	    event.preventDefault();
	    _store2.default.dispatch(_actions2.default.updateView({
	      sort: {
	        dir: _utility2.default.ASCENDING
	      }
	    }));
	  };

	  this.handleNotificationDismissed = function (id) {
	    //console.log(`notification ${id} dismiessed`)
	    _store2.default.dispatch(_actions2.default.archiveNotification(id));
	  };

	  this.handleKeyboardSortDescending = function (event) {
	    event.preventDefault();
	    _store2.default.dispatch(_actions2.default.updateView({
	      sort: {
	        dir: _utility2.default.DESCENDING
	      }
	    }));
	  };

	  this.handleKeyboardSortName = function (event) {
	    _store2.default.dispatch(_actions2.default.updateView({
	      sort: {
	        by: 'filename'
	      }
	    }));
	  };

	  this.handleKeyboardSortDimensions = function (event) {
	    _store2.default.dispatch(_actions2.default.updateView({
	      sort: {
	        by: 'dimensions'
	      }
	    }));
	  };

	  this.handleKeyboardSortFileSize = function (event) {
	    _store2.default.dispatch(_actions2.default.updateView({
	      sort: {
	        by: 'fileSize'
	      }
	    }));
	  };

	  this.handleKeyboardSortEditedOn = function (event) {
	    _store2.default.dispatch(_actions2.default.updateView({
	      sort: {
	        by: 'editedOn'
	      }
	    }));
	  };

	  this.handleKeyboardChooseSingle = function (event) {
	    _store2.default.dispatch(_actions2.default.updateView({
	      chooseMultiple: false
	    }));
	  };

	  this.handleKeyboardChooseMultiple = function (event) {
	    _store2.default.dispatch(_actions2.default.updateView({
	      chooseMultiple: true
	    }));
	  };

	  this.handleKeyboardToggleInvertSelection = function (event) {
	    if (!_this6.props.view.chooseMultiple) return;
	    _store2.default.dispatch(_actions2.default.updateView({
	      selectionInverted: !_this6.props.view.selectionInverted
	    }));
	  };

	  this.handleKeyboardDeselect = function (event) {
	    console.log('handleKeyboardDeselect');

	    _store2.default.dispatch(_actions2.default.deselectAll());
	  };

	  this.toggleSourceTreeOpen = function (event) {
	    _store2.default.dispatch(_this6.decoratedActions.updateView({
	      sourceTreeOpen: !_this6.props.view.sourceTreeOpen
	    }));
	  };

	  this.handleKeyboardCreateDirectory = function (event) {
	    //console.log('handleKeyboardCreateDirectory', event);
	    _this6.onCreateDirectory();
	  };

	  this.handleKeyboardCreateFile = function (event) {
	    //console.log('handleKeyboardCreateFile', event);
	    try {
	      var createFileHander = _this6.props.config.handlers.createFile(_this6.props.source.currentSource, _this6.props.content.cd);
	      if (createFileHander.onClick) createFileHander.onClick(_this6.props.source.currentSource, _this6.props.content.cd);else window.open(createFileHander.href);
	    } catch (e) {}
	  };

	  this.handleKeyboardUpload = function (event) {
	    //console.log('handleKeyboardUpload', event);
	    var root = _this6.getEurekaRoot();

	    try {
	      root.querySelector('.eureka__drop-area-zone').click();
	    } catch (e) {
	      root.querySelector('input[name="eureka__uploadFiles"]').click();
	    }
	  };

	  this.handleKeyboardChangeSource = function (event) {
	    //console.log('handleKeyboardChangeSource', event);
	    var props = _this6.props,
	        state = _store2.default.getState(),
	        decoratedActions = _this6.decoratedActions,
	        sources = state.source.sources;

	    var matchedSource = void 0;
	    sources.map(function (source) {
	      if (('Digit' + source.id).toLowerCase() == event.code.toLowerCase()) matchedSource = source;
	    });
	    if (matchedSource) {
	      props.dispatch(decoratedActions.updateSource(matchedSource.id));
	      props.dispatch(decoratedActions.updateSourceTree(matchedSource.id, props.config.headers));
	    }
	  };

	  this.handleKeyboardChangeView = function (event) {
	    //console.log('handleKeyboardChangeView', event);
	    switch (event.key) {
	      case '1':
	        _store2.default.dispatch(_this6.decoratedActions.updateView({
	          mode: 'table'
	        }));
	        break;

	      case '2':
	        _store2.default.dispatch(_this6.decoratedActions.updateView({
	          mode: 'thumb'
	        }));
	        break;

	      case '3':
	        _store2.default.dispatch(_this6.decoratedActions.updateView({
	          mode: 'grid'
	        }));
	        break;

	      case '4':
	        _store2.default.dispatch(_this6.decoratedActions.updateView({
	          mode: 'list'
	        }));
	        break;
	    }
	  };
	};

	exports.default = Eureka;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _store = __webpack_require__(9);

	var _store2 = _interopRequireDefault(_store);

	var _actions = __webpack_require__(19);

	var _actions2 = _interopRequireDefault(_actions);

	var _reactIntl = __webpack_require__(23);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var MediaSourceSelector = function MediaSourceSelector(props) {
	  var decoratedActions = props.decoratedActions ? Object.assign({}, _actions2.default, props.decoratedActions) : _actions2.default;
	  //console.log('MediaSourceSelector',decoratedActions);
	  var options = props.source.sources.map(function (source, index) {
	    return _react2.default.createElement(
	      'option',
	      { key: index, value: source.id === undefined ? index : source.id },
	      source.name
	    );
	  });

	  return (// future-role="complementary composite"
	    _react2.default.createElement(
	      'div',
	      { className: 'eureka__media-source-selector', role: 'complementary' },
	      _react2.default.createElement(
	        'h2',
	        null,
	        _react2.default.createElement(
	          'label',
	          { htmlFor: 'media-source-selector__select' },
	          _react2.default.createElement(
	            'span',
	            { className: 'visually-hidden' },
	            _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'choose', defaultMessage: 'Choose' }),
	            ' ',
	            _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'grammar.a', defaultMessage: 'a' }),
	            ' '
	          ),
	          _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'media.source', defaultMessage: 'Media Source' })
	        )
	      ),
	      _react2.default.createElement(
	        'select',
	        { value: props.source.currentSource, id: 'media-source-selector__select', onChange: function onChange(event) {
	            props.dispatch(decoratedActions.updateSource(event.target.value));
	            props.dispatch(decoratedActions.updateSourceTree(event.target.value, props.config.headers));
	          } },
	        options
	      )
	    )
	  );
	};

	exports.default = MediaSourceSelector;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var redux = __webpack_require__(5),
	    createStore = redux.createStore,
	    applyMiddleware = redux.applyMiddleware,
	    thunk = __webpack_require__(10).default,
	    reducers = __webpack_require__(11),
	    store = createStore(reducers.EurekaReducer, applyMiddleware(thunk));

	module.exports = store;

/***/ },
/* 10 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	function createThunkMiddleware(extraArgument) {
	  return function (_ref) {
	    var dispatch = _ref.dispatch,
	        getState = _ref.getState;
	    return function (next) {
	      return function (action) {
	        if (typeof action === 'function') {
	          return action(dispatch, getState, extraArgument);
	        }

	        return next(action);
	      };
	    };
	  };
	}

	var thunk = createThunkMiddleware();
	thunk.withExtraArgument = createThunkMiddleware;

	exports['default'] = thunk;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _reactAddonsUpdate = __webpack_require__(12);

	var _reactAddonsUpdate2 = _interopRequireDefault(_reactAddonsUpdate);

	var _utility = __webpack_require__(17);

	var _utility2 = _interopRequireDefault(_utility);

	var _filesize = __webpack_require__(18);

	var _filesize2 = _interopRequireDefault(_filesize);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	// ES6

	var actions = __webpack_require__(19),
	    combineReducers = __webpack_require__(5).combineReducers,
	    path = __webpack_require__(3);

	var pkg = __webpack_require__(22);

	var initialConfigState = {
	  basePath: '/',
	  allowChoose: true,
	  allowUploads: true,
	  allowDownload: true,
	  treeHidden: true,
	  useLocalStorage: true,
	  storagePrefix: "eureka__",
	  allowRename: true,
	  allowDelete: true,
	  confirmBeforeDelete: false,
	  locales: "en-US",
	  allowChooseMultiple: true,
	  allowInvertSelection: true,
	  mediaSource: "0",
	  currentDirectory: "/",
	  welcome: true,
	  alwaysWelcome: false,
	  learnMore: 'https://github.com/jpdevries/eureka',
	  uid: "0",
	  iconSVG: './img/icons.' + pkg.version + '.min.svg',
	  assetsBasePath: './assets/',
	  doDragNDrop: true,
	  emphasisFocusedMediaItem: true,
	  headers: { 'Powered-By': 'Eureka by Markup.tips' },
	  intervals: { searchBarPlaceholder: 60000, fetchDirectoryContents: 18000, updateSourceTree: false },
	  callbacks: {
	    close: undefined,
	    choose: undefined
	  },
	  handlers: {
	    createFile: undefined
	  }
	};

	var configReducer = function configReducer(state, action) {
	  state = state || initialConfigState;

	  switch (action.type) {
	    case actions.UPDATE_CONFIG:
	      //console.log('UPDATE_CONFIG!!', action.config);
	      return Object.assign({}, state, action.config);
	      break;
	  }

	  return state;
	};

	var selectionInverted = false;

	var initialContentState = Object.assign({}, {
	  cd: '/',
	  chosenMediaItems: [],
	  chosenMediaItemsInverted: [],
	  contents: [
	    /*{
	      filename:'foo.jpg',
	      directory:'assets/images',
	      path:'http://placehold.it/350x150',
	      absoluteURL:'http://placehold.it/350x150',
	      dimensions:[350,150],
	      fileSize:24800,
	      editedOn:1487107348619
	    },
	    {
	      filename:'bar.jpg',
	      directory:'assets/images',
	      path:'http://placehold.it/300x150',
	      absoluteURL:'http://placehold.it/350x150',
	      dimensions:[300,150],
	      fileSize:24800,
	      editedOn:1487107348619
	    }*/
	  ]
	}, function () {
	  try {
	    return Object.assign({}, JSON.parse(localStorage.getItem('eureka__content')), {
	      chosenMediaItems: []
	    });
	  } catch (e) {
	    return {};
	  }
	}());

	function getInvertedChosenItems() {
	  var contents = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
	  var chosenMediaItems = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
	  var selectionInverted = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

	  if (!selectionInverted) return chosenMediaItems;
	  return contents.filter(function (item) {
	    return !chosenMediaItems.includes(item);
	  });
	}

	var contentReducer = function contentReducer(state, action) {
	  state = state || initialContentState;
	  var newState = state;
	  //console.log('contentReducer', action.type);

	  var newChosenMediaItems = void 0;

	  var pair;

	  var _ret = function () {
	    switch (action.type) {
	      case actions.UPDATE_CONFIG:
	        //console.log('UPDATE_CONFIG!!!', state, action.config);
	        if (action.config.currentDirectory) return {
	            v: Object.assign({}, state, {
	              cd: action.config.currentDirectory
	            })
	          };

	        break;

	      case actions.UPDATE_VIEW:
	        //console.log('UPDATE_CONFIG!!!', state, action.config);
	        //console.log(' update view mo fo', selectionInverted, action.view.selectionInverted);
	        try {
	          if (selectionInverted !== action.view.selectionInverted || state.contents.chosenMediaItems.length !== state.contents.chosenMediaItemsInverted.length) {
	            newState = (0, _reactAddonsUpdate2.default)(state, { $merge: { chosenMediaItemsInverted: getInvertedChosenItems(state.contents, state.chosenMediaItems, action.view.selectionInverted) } });
	          }
	        } catch (e) {
	          console.log(e);
	        }

	        selectionInverted = action.view.selectionInverted;
	        return {
	          v: newState
	        };
	        break;

	      case actions.INVERT_SELECTION:
	        return {
	          v: newState
	        };
	        break;

	      case actions.ADD_MEDIA_ITEM_TO_CHOSEN_ITEMS:
	        if (state.chosenMediaItems.includes(action.item)) return {
	            v: newState
	          };
	        newChosenMediaItems = (0, _reactAddonsUpdate2.default)(newState.chosenMediaItems, { $push: [action.item] });
	        return {
	          v: (0, _reactAddonsUpdate2.default)(newState, { $merge: {
	              chosenMediaItems: newChosenMediaItems,
	              chosenMediaItemsInverted: getInvertedChosenItems(newState.contents, (0, _reactAddonsUpdate2.default)(newState.chosenMediaItems, { $push: [action.item] }), action.inverted)
	            } })
	        };
	        break;

	      case actions.REMOVE_MEDIA_ITEM_FROM_CHOSEN_ITEMS:
	        if (!state.chosenMediaItems.includes(action.item)) return {
	            v: newState
	          };

	        newChosenMediaItems = newState.chosenMediaItems.filter(function (item) {
	          return item !== action.item;
	        });

	        return {
	          v: (0, _reactAddonsUpdate2.default)(newState, { $merge: {
	              chosenMediaItems: newChosenMediaItems,
	              chosenMediaItemsInverted: getInvertedChosenItems(newState.contents, newChosenMediaItems, action.inverted)
	            } })
	        };
	        break;

	      case actions.DESELECT_ALL:
	        return {
	          v: (0, _reactAddonsUpdate2.default)(newState, { $merge: {
	              chosenMediaItems: [],
	              chosenMediaItemsInverted: []
	            } })
	        };
	        break;

	      case actions.UPDATE_CONTENT:
	        var content = processContentItems(action.content);
	        newState = Object.assign({}, state, content);
	        if (action.content.cd && action.content.cd !== state.cd) newState = Object.assign({}, newState, { // if updating the current directory clear the chosen media items
	          chosenMediaItems: [],
	          chosenMediaItemsInverted: []
	        });
	        if (action.content.chosenMediaItems && state.view !== undefined) {
	          newState = (0, _reactAddonsUpdate2.default)(state, { $merge: { chosenMediaItemsInverted: getInvertedChosenItems(state.contents, state.chosenMediaItems, state.view.selectionInverted) } });
	        }
	        return {
	          v: newState
	        };
	        break;

	      case actions.FETCH_DIRECTORY_CONTENTS_SUCCESS:
	        //console.log('FETCH_DIRECTORY_CONTENTS_SUCCESS', state, action.contents);
	        return {
	          v: Object.assign({}, newState, {
	            contents: processContentItems(action.contents.filter(function (file) {
	              return file.filename;
	            }))
	          })
	        };

	      case actions.DELETE_MEDIA_ITEMS_SUCCESS:
	        console.log(actions.DELETE_MEDIA_ITEMS_SUCCESS);
	        var formData = action.formData;
	        var _iteratorNormalCompletion = true;
	        var _didIteratorError = false;
	        var _iteratorError = undefined;

	        try {
	          for (var _iterator = formData.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	            pair = _step.value;

	            console.log(pair[0] + ', ' + pair[1]);
	          }
	        } catch (err) {
	          _didIteratorError = true;
	          _iteratorError = err;
	        } finally {
	          try {
	            if (!_iteratorNormalCompletion && _iterator.return) {
	              _iterator.return();
	            }
	          } finally {
	            if (_didIteratorError) {
	              throw _iteratorError;
	            }
	          }
	        }

	        var deletedFileNames = formData.getAll('delete_file[]');
	        //if(!Array.isArray(action.contents)) return state; // so the backed can just return res.json([true]) if it wants?
	        var newContents = processContentItems(action.contents.filter(function (file) {
	          return file.filename;
	        }));
	        newChosenMediaItems = newState.chosenMediaItems.filter(function (file) {
	          return !deletedFileNames.includes(file.filename);
	        });
	        var newChosenMediaItemsInverted = newState.chosenMediaItemsInverted.filter(function (file) {
	          return !deletedFileNames.includes(file.filename);
	        });
	        return {
	          v: Object.assign({}, newState, {
	            contents: newContents,
	            chosenMediaItems: newChosenMediaItems,
	            chosenMediaItemsInverted: newChosenMediaItemsInverted
	          })
	        };

	      case actions.UPLOAD_FILES_SUCCESS:
	        //if(!Array.isArray(action.contents)) return state; // so the backed can just return res.json([true]) if it wants?
	        return {
	          v: Object.assign({}, newState, {
	            contents: processContentItems(action.contents.filter(function (file) {
	              return file.filename;
	            }))
	          })
	        };

	      case actions.DELETE_MEDIA_ITEM_SUCCESS:
	        //console.log(actions.DELETE_MEDIA_ITEM_SUCCESS, action.source, action.path, state);


	        return {
	          v: Object.assign({}, newState, {
	            cd: state.cd === action.path ? path.join(state.cd, '..') : state.cd,
	            contents: state.contents.filter(function (file) {
	              return file.path !== action.path;
	            })
	          })
	        };
	        break;
	    }
	  }();

	  if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
	  return state;

	  function processContentItems(contents) {
	    try {
	      return contents.map(function (item) {
	        var editedOnDate = new Date(item.editedOn);
	        return Object.assign({}, item, {
	          localString: editedOnDate.toLocaleString(),
	          localStringVerbose: editedOnDate.toLocaleString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }),
	          fileSizeHumanReadable: (0, _filesize2.default)(item.fileSize, { round: 0 }),
	          editedOnTwoDigit: new Date(item.editedOn).toLocaleString(undefined, { year: '2-digit', month: '2-digit', day: '2-digit' }),
	          editedOnLongTimeZone: new Date(item.editedOn).toLocaleString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: '2-digit', timeZoneName: 'long' })
	        });
	      });
	    } catch (e) {
	      return contents;
	    }
	  }
	};

	var initialTreeReducer = function () {
	  try {
	    var lt = JSON.parse(localStorage.getItem('eureka__tree'));
	    return Array.isArray(lt) ? lt : [];
	  } catch (e) {
	    return [/*{
	             name:'assets',
	             cd:'assets',
	             children:[{
	               name:'img',
	               cd:'assets/img'
	             }]
	            },{
	             name:'uploads',
	             cd:'uploads'
	            }*/];
	  }
	}();

	var cd = '';
	var gotTreeDataFromServer = false;
	var treeReducer = function treeReducer(state, action) {
	  state = state || initialTreeReducer;

	  var _ret2 = function () {
	    switch (action.type) {
	      case actions.UPDATE_SOURCE_TREE_SUCCESS:
	        //console.log('UPDATE_SOURCE_TREE_SUCCESS');
	        var newState = gotTreeDataFromServer ? state.slice(0) : [];

	        var directoryInState = function directoryInState(directory) {
	          for (var i = 0; i < newState.length; i++) {
	            if (newState[i].cd === directory.cd) return true;
	          }

	          return false;
	        };

	        var directoryOnServer = function directoryOnServer(directory) {
	          for (var i = 0; i < contents.length; i++) {
	            if (contents[i].cd === directory.cd) return true;
	          }
	          return false;
	        };

	        var contents = action.contents.map(function (file) {
	          return Object.assign({}, file, {
	            children: file.children ? file.children : []
	          });
	        });

	        // loop through top level directories returned from server add any we don't already have
	        contents.map(function (directory) {
	          if (!directoryInState(directory)) {
	            newState.push(directory);
	          }
	        });

	        gotTreeDataFromServer = true;
	        // if any of the top-level directories in our local state are no longer on the store remove them
	        return {
	          v: newState.filter(function (directory) {
	            return directoryOnServer(directory);
	          })
	        };

	        break;

	      case actions.UPDATE_CONTENT:
	        if (action.content.cd) cd = action.content.cd;
	        break;

	      case actions.FETCH_DIRECTORY_CONTENTS_SUCCESS:
	        // loop over just the folders and create data objects for them
	        var foldersToAdd = action.contents.filter(function (file) {
	          return file.foldername;
	        }).map(function (file) {
	          return {
	            name: file.foldername,
	            cd: file.directory,
	            children: []
	          };
	        });

	        var addChildrenToCurrentFolder = function addChildrenToCurrentFolder(children) {
	          return children.map(function (child) {
	            return Object.assign({}, child, {
	              children: child.cd === cd ? _utility2.default.removeDuplicates([].concat(_toConsumableArray(child.children), _toConsumableArray(foldersToAdd)), 'name') : addChildrenToCurrentFolder(child.children)
	            });
	          });
	        };

	        return {
	          v: addChildrenToCurrentFolder(state)
	        };

	        /*return state.map((file) => (
	          Object.assign({}, file, {
	            children:(file.children && file.cd !== cd) ? addChildrenToCurrentFolder(file.children) : foldersToAdd
	          })
	        ));*/

	        break;

	      case actions.DELETE_MEDIA_ITEM_SUCCESS:
	        var stillSearching = true;

	        var recursivelyRemoveDirectory = function recursivelyRemoveDirectory(children) {
	          return children.map(function (child) {
	            if (child.cd === action.path) {
	              stillSearching = false;
	              return undefined;
	            }
	            return Object.assign({}, child, {
	              children: child.children && stillSearching ? recursivelyRemoveDirectory(child.children) : child.children
	            });
	          }).filter(Boolean);
	        };

	        return {
	          v: recursivelyRemoveDirectory(state)
	        };

	        break;

	    }
	  }();

	  if ((typeof _ret2 === 'undefined' ? 'undefined' : _typeof(_ret2)) === "object") return _ret2.v;
	  return state;
	};

	var initialViewState = Object.assign({}, {
	  focusedMediaItem: undefined,
	  filter: undefined,
	  //cd: '/',
	  mode: 'table',
	  sourceTreeOpen: false,
	  enlargeFocusedRows: false,
	  locale: "en-US",
	  chooseMultiple: false,
	  sort: {
	    by: 'filename',
	    dir: _utility2.default.ASCENDING
	  },
	  isTableScrolling: false,
	  selectionInverted: selectionInverted,
	  allowFullscreen: true,
	  isUploading: false,
	  isTouch: false,
	  fetchingContents: false,
	  intervals: {
	    searchBarPlaceholder: false,
	    fetchDirectoryContents: false,
	    updateSourceTree: false
	  }
	}, function () {
	  try {
	    var json = JSON.parse(localStorage.getItem('eureka__view'));
	    //console.log('json',json);
	    return Object.assign({}, json, {
	      isUploading: false,
	      isTableScrolling: false
	    });
	    /*return (
	      Object.assign({}, json, {
	        sourceTreeOpen: json.treeHidden == 'false' || undefined
	      })
	    );*/
	  } catch (e) {
	    return {};
	  }
	  /*return {
	    mode: localStorage.getItem('eureka__mode') || undefined,
	    sort: localStorage.getItem('eureka__sort') || undefined,
	    sourceTreeOpen: localStorage.getItem('eureka__treeHidden') == 'false' || undefined
	  }*/
	}());

	//console.log('initialViewState', initialViewState);

	var viewReducer = function viewReducer(state, action) {
	  state = state || initialViewState;

	  switch (action.type) {
	    case actions.FETCH_DIRECTORY_CONTENTS_SUCCESS:
	    case actions.FETCH_DIRECTORY_CONTENTS_ERROR:
	      return Object.assign({}, state, {
	        fetchingContents: false
	      });
	      break;

	    case actions.UPLOAD_FILES_SUCCESS:
	    case actions.UPLOAD_FILES_ERROR:
	      return Object.assign({}, state, {
	        isUploading: false
	      });
	      break;

	    case actions.UPDATE_VIEW:
	      return Object.assign({}, state, action.view);

	    case actions.UPDATE_CONTENT:
	      if (action.content.cd) {
	        return Object.assign({}, state, {
	          selectionInverted: false
	        });
	      }
	      return state;

	    case actions.UPDATE_CONFIG:
	      var o = {};
	      /*o = Object.assign({},o,{
	        sourceTreeOpen:action.config.treeHidden !== undefined ? !action.config.treeHidden : o.sourceTreeOpen || undefined
	      });*/
	      if (action.config.intervals) o = Object.assign({}, o, { intervals: action.config.intervals });
	      if (action.config.mode) o = Object.assign({}, o, { mode: action.config.mode });
	      if (action.config.sort) o = Object.assign({}, o, { sort: action.config.sort });
	      if (action.config.locale) o = Object.assign({}, o, { locale: action.config.locale });
	      if (action.config.enlargeFocusedRows !== undefined) o = Object.assign({}, o, { enlargeFocusedRows: action.config.enlargeFocusedRows });
	      if (action.config.treeHidden !== undefined) o = Object.assign({}, o, { sourceTreeOpen: !action.config.treeHidden });
	      if (action.config.allowFullscreen !== undefined) o = Object.assign({}, o, { allowFullscreen: action.config.allowFullscreen });

	      return Object.assign({}, state, o);

	    case actions.UPDATE_SOURCE_TREE_SUCCESS:
	      return Object.assign({}, state, {
	        cd: '/'
	      });

	    case actions.DELETE_MEDIA_ITEM_SUCCESS:
	      try {
	        if (state.focusedMediaItem.path === action.path) return Object.assign({}, state, {
	          focusedMediaItem: undefined
	        });
	      } catch (e) {}
	  }

	  return state;
	};

	var initialSourceState = Object.assign({}, {
	  currentSource: "0",
	  sources: [/*{
	            name: 'Filesystem',
	            id: 'fileystem'
	            },{
	            name: 'Amazon S3',
	            id: 's3'
	            }*/]
	}, function () {
	  try {
	    return JSON.parse(localStorage.getItem('eureka__source'));
	  } catch (e) {
	    return {};
	  }
	}());

	var sourceReducer = function sourceReducer(state, action) {
	  state = state || initialSourceState;
	  switch (action.type) {
	    case actions.FETCH_MEDIA_SOURCES_SUCCESS:
	      return Object.assign({}, state, {
	        sources: action.sources
	      });
	      break;

	    case actions.UPDATE_SOURCE:
	      return Object.assign({}, state, {
	        currentSource: action.source
	      });
	      break;
	  }

	  return state;
	};

	var initialDirectoryState = function () {
	  try {
	    var ld = JSON.parse('eureka__directory');
	    if (!Array.isArray(ld)) throw new Error('eureka__directory is not an Array');
	    return ld;
	  } catch (e) {
	    return [{
	      name: 'Filesystem',
	      id: 'fileystem',
	      directories: []
	    }];
	  }
	}();

	var cs = void 0;
	var directoryReducer = function directoryReducer(state, action) {
	  state = state || initialDirectoryState;

	  var foldersToAdd = [];

	  var _ret3 = function () {
	    switch (action.type) {
	      case actions.UPDATE_SOURCE:
	        cs = action.source;
	        break;

	      case actions.FETCH_MEDIA_SOURCES_SUCCESS:
	        if (cs === undefined) cs = action.sources[0].id;
	        return {
	          v: action.sources.map(function (source) {
	            return Object.assign({}, source, {
	              directories: []
	            });
	          })
	        };
	        break;

	      case actions.UPDATE_SOURCE_TREE_SUCCESS:
	        foldersToAdd = action.contents.map(function (file) {
	          return Object.assign({}, file, {
	            children: file.children ? file.children : []
	          });
	        });

	        var recursivelyCrawlChildren = function recursivelyCrawlChildren(file) {
	          try {
	            file.children.map(function (child) {
	              foldersToAdd.push({
	                name: child.name,
	                cd: child.cd,
	                children: child.children || []
	              });
	              if (child.children.length) recursivelyCrawlChildren(child);
	            });
	          } catch (e) {}
	        };

	        action.contents.map(function (file) {
	          recursivelyCrawlChildren(file);
	        });

	        foldersToAdd = _utility2.default.removeDuplicates([].concat(_toConsumableArray(foldersToAdd)), 'cd');

	        return {
	          v: state.map(function (source) {
	            return Object.assign({}, source, {
	              directories: source.id == cs ? _utility2.default.removeDuplicates([].concat(_toConsumableArray(source.directories), _toConsumableArray(foldersToAdd)), 'cd') : source.directories
	            });
	          })
	        };

	        break;

	      case actions.FETCH_DIRECTORY_CONTENTS_SUCCESS:
	        // loop over just the folders and create data objects for them
	        foldersToAdd = action.contents.filter(function (file) {
	          return file.foldername;
	        }).map(function (file) {
	          return {
	            name: file.foldername,
	            cd: file.directory
	          };
	        });

	        return {
	          v: state.map(function (source) {
	            return Object.assign({}, source, {
	              directories: source.id == cs ? _utility2.default.removeDuplicates([].concat(_toConsumableArray(source.directories), _toConsumableArray(foldersToAdd)), 'name') : source.directories
	            });
	          })
	        };

	        break;

	      case actions.UPDATE_SOURCE:

	        break;

	    }
	  }();

	  if ((typeof _ret3 === 'undefined' ? 'undefined' : _typeof(_ret3)) === "object") return _ret3.v;
	  return state;
	};

	var initialFetchedState = {
	  lastDirectoriesFetched: []
	};

	var fetchedReducer = function fetchedReducer(state, action) {
	  state = state || initialFetchedState;

	  switch (action.type) {
	    case actions.FETCH_DIRECTORY_CONTENTS_SUCCESS:
	      // loop over just the folders and create data objects for them
	      var namesOfFoldersToAdd = action.contents.filter(function (file) {
	        return file.foldername;
	      }).map(function (file) {
	        return file.foldername;
	      });

	      //console.log('namesOfFoldersToAdd',namesOfFoldersToAdd);

	      return Object.assign({}, state, {
	        lastDirectoriesFetched: namesOfFoldersToAdd
	      });

	      break;

	  }

	  return state;
	};

	var initialNotifcationsState = [];

	var notificationsReducer = function notificationsReducer(state, action) {
	  //console.log('notificationsReducer', action.type, actions.NOTIFICATION);
	  state = state || initialNotifcationsState;

	  var index = 0;
	  state.map(function (notification, i) {
	    if (notification.id == action.id) index = i;
	  });

	  switch (action.type) {
	    case actions.NOTIFICATION:
	      var newState = state;
	      //console.log('NOTIFICATION!!!!', action);

	      try {
	        newState = (0, _reactAddonsUpdate2.default)(state, _defineProperty({}, 0, { $apply: function $apply(notification) {
	            return (0, _reactAddonsUpdate2.default)(notification, { $merge: { dismissAfter: undefined, archived: true } });
	          } }));
	      } catch (e) {}

	      console.log('newState', newState);

	      return (0, _reactAddonsUpdate2.default)(newState, { $push: [Object.assign({}, action, {
	          type: action.notificationType
	        })] });
	      break;

	    case actions.NOTIFICATION_DELETED:
	      //console.log('NOTIFICATION_DELETED!!!!');
	      return state.filter(function (notification) {
	        return notification.id !== action.id;
	      });
	      break;

	    case actions.NOTIFICATION_ARCHIVED:
	      return (0, _reactAddonsUpdate2.default)(state, _defineProperty({}, index, { $apply: function $apply(notification) {
	          return (0, _reactAddonsUpdate2.default)(notification, { $merge: { archived: true } });
	        } }));
	      break;
	  }

	  return state;
	};

	var EurekaReducer = combineReducers({
	  content: contentReducer,
	  view: viewReducer,
	  tree: treeReducer,
	  source: sourceReducer,
	  directory: directoryReducer,
	  fetched: fetchedReducer,
	  config: configReducer,
	  notifications: notificationsReducer
	});

	exports.EurekaReducer = EurekaReducer;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(13);

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 */

	/* global hasOwnProperty:true */

	'use strict';

	var _prodInvariant = __webpack_require__(14),
	    _assign = __webpack_require__(15);

	var invariant = __webpack_require__(16);
	var hasOwnProperty = {}.hasOwnProperty;

	function shallowCopy(x) {
	  if (Array.isArray(x)) {
	    return x.concat();
	  } else if (x && typeof x === 'object') {
	    return _assign(new x.constructor(), x);
	  } else {
	    return x;
	  }
	}

	var COMMAND_PUSH = '$push';
	var COMMAND_UNSHIFT = '$unshift';
	var COMMAND_SPLICE = '$splice';
	var COMMAND_SET = '$set';
	var COMMAND_MERGE = '$merge';
	var COMMAND_APPLY = '$apply';

	var ALL_COMMANDS_LIST = [COMMAND_PUSH, COMMAND_UNSHIFT, COMMAND_SPLICE, COMMAND_SET, COMMAND_MERGE, COMMAND_APPLY];

	var ALL_COMMANDS_SET = {};

	ALL_COMMANDS_LIST.forEach(function (command) {
	  ALL_COMMANDS_SET[command] = true;
	});

	function invariantArrayCase(value, spec, command) {
	  !Array.isArray(value) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'update(): expected target of %s to be an array; got %s.', command, value) : _prodInvariant('1', command, value) : void 0;
	  var specValue = spec[command];
	  !Array.isArray(specValue) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'update(): expected spec of %s to be an array; got %s. Did you forget to wrap your parameter in an array?', command, specValue) : _prodInvariant('2', command, specValue) : void 0;
	}

	/**
	 * Returns a updated shallow copy of an object without mutating the original.
	 * See https://facebook.github.io/react/docs/update.html for details.
	 */
	function update(value, spec) {
	  !(typeof spec === 'object') ? process.env.NODE_ENV !== 'production' ? invariant(false, 'update(): You provided a key path to update() that did not contain one of %s. Did you forget to include {%s: ...}?', ALL_COMMANDS_LIST.join(', '), COMMAND_SET) : _prodInvariant('3', ALL_COMMANDS_LIST.join(', '), COMMAND_SET) : void 0;

	  if (hasOwnProperty.call(spec, COMMAND_SET)) {
	    !(Object.keys(spec).length === 1) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Cannot have more than one key in an object with %s', COMMAND_SET) : _prodInvariant('4', COMMAND_SET) : void 0;

	    return spec[COMMAND_SET];
	  }

	  var nextValue = shallowCopy(value);

	  if (hasOwnProperty.call(spec, COMMAND_MERGE)) {
	    var mergeObj = spec[COMMAND_MERGE];
	    !(mergeObj && typeof mergeObj === 'object') ? process.env.NODE_ENV !== 'production' ? invariant(false, 'update(): %s expects a spec of type \'object\'; got %s', COMMAND_MERGE, mergeObj) : _prodInvariant('5', COMMAND_MERGE, mergeObj) : void 0;
	    !(nextValue && typeof nextValue === 'object') ? process.env.NODE_ENV !== 'production' ? invariant(false, 'update(): %s expects a target of type \'object\'; got %s', COMMAND_MERGE, nextValue) : _prodInvariant('6', COMMAND_MERGE, nextValue) : void 0;
	    _assign(nextValue, spec[COMMAND_MERGE]);
	  }

	  if (hasOwnProperty.call(spec, COMMAND_PUSH)) {
	    invariantArrayCase(value, spec, COMMAND_PUSH);
	    spec[COMMAND_PUSH].forEach(function (item) {
	      nextValue.push(item);
	    });
	  }

	  if (hasOwnProperty.call(spec, COMMAND_UNSHIFT)) {
	    invariantArrayCase(value, spec, COMMAND_UNSHIFT);
	    spec[COMMAND_UNSHIFT].forEach(function (item) {
	      nextValue.unshift(item);
	    });
	  }

	  if (hasOwnProperty.call(spec, COMMAND_SPLICE)) {
	    !Array.isArray(value) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Expected %s target to be an array; got %s', COMMAND_SPLICE, value) : _prodInvariant('7', COMMAND_SPLICE, value) : void 0;
	    !Array.isArray(spec[COMMAND_SPLICE]) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'update(): expected spec of %s to be an array of arrays; got %s. Did you forget to wrap your parameters in an array?', COMMAND_SPLICE, spec[COMMAND_SPLICE]) : _prodInvariant('8', COMMAND_SPLICE, spec[COMMAND_SPLICE]) : void 0;
	    spec[COMMAND_SPLICE].forEach(function (args) {
	      !Array.isArray(args) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'update(): expected spec of %s to be an array of arrays; got %s. Did you forget to wrap your parameters in an array?', COMMAND_SPLICE, spec[COMMAND_SPLICE]) : _prodInvariant('8', COMMAND_SPLICE, spec[COMMAND_SPLICE]) : void 0;
	      nextValue.splice.apply(nextValue, args);
	    });
	  }

	  if (hasOwnProperty.call(spec, COMMAND_APPLY)) {
	    !(typeof spec[COMMAND_APPLY] === 'function') ? process.env.NODE_ENV !== 'production' ? invariant(false, 'update(): expected spec of %s to be a function; got %s.', COMMAND_APPLY, spec[COMMAND_APPLY]) : _prodInvariant('9', COMMAND_APPLY, spec[COMMAND_APPLY]) : void 0;
	    nextValue = spec[COMMAND_APPLY](nextValue);
	  }

	  for (var k in spec) {
	    if (!(ALL_COMMANDS_SET.hasOwnProperty(k) && ALL_COMMANDS_SET[k])) {
	      nextValue[k] = update(value[k], spec[k]);
	    }
	  }

	  return nextValue;
	}

	module.exports = update;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ },
/* 14 */
/***/ function(module, exports) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * 
	 */
	'use strict';

	/**
	 * WARNING: DO NOT manually require this module.
	 * This is a replacement for `invariant(...)` used by the error code system
	 * and will _only_ be required by the corresponding babel pass.
	 * It always throws.
	 */

	function reactProdInvariant(code) {
	  var argCount = arguments.length - 1;

	  var message = 'Minified React error #' + code + '; visit ' + 'http://facebook.github.io/react/docs/error-decoder.html?invariant=' + code;

	  for (var argIdx = 0; argIdx < argCount; argIdx++) {
	    message += '&args[]=' + encodeURIComponent(arguments[argIdx + 1]);
	  }

	  message += ' for the full message or use the non-minified dev environment' + ' for full errors and additional helpful warnings.';

	  var error = new Error(message);
	  error.name = 'Invariant Violation';
	  error.framesToPop = 1; // we don't care about reactProdInvariant's own frame

	  throw error;
	}

	module.exports = reactProdInvariant;

/***/ },
/* 15 */
/***/ function(module, exports) {

	/*
	object-assign
	(c) Sindre Sorhus
	@license MIT
	*/

	'use strict';
	/* eslint-disable no-unused-vars */
	var getOwnPropertySymbols = Object.getOwnPropertySymbols;
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	var propIsEnumerable = Object.prototype.propertyIsEnumerable;

	function toObject(val) {
		if (val === null || val === undefined) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}

		return Object(val);
	}

	function shouldUseNative() {
		try {
			if (!Object.assign) {
				return false;
			}

			// Detect buggy property enumeration order in older V8 versions.

			// https://bugs.chromium.org/p/v8/issues/detail?id=4118
			var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
			test1[5] = 'de';
			if (Object.getOwnPropertyNames(test1)[0] === '5') {
				return false;
			}

			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test2 = {};
			for (var i = 0; i < 10; i++) {
				test2['_' + String.fromCharCode(i)] = i;
			}
			var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
				return test2[n];
			});
			if (order2.join('') !== '0123456789') {
				return false;
			}

			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test3 = {};
			'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
				test3[letter] = letter;
			});
			if (Object.keys(Object.assign({}, test3)).join('') !==
					'abcdefghijklmnopqrst') {
				return false;
			}

			return true;
		} catch (err) {
			// We don't expect any of the above to throw, but better to be safe.
			return false;
		}
	}

	module.exports = shouldUseNative() ? Object.assign : function (target, source) {
		var from;
		var to = toObject(target);
		var symbols;

		for (var s = 1; s < arguments.length; s++) {
			from = Object(arguments[s]);

			for (var key in from) {
				if (hasOwnProperty.call(from, key)) {
					to[key] = from[key];
				}
			}

			if (getOwnPropertySymbols) {
				symbols = getOwnPropertySymbols(from);
				for (var i = 0; i < symbols.length; i++) {
					if (propIsEnumerable.call(from, symbols[i])) {
						to[symbols[i]] = from[symbols[i]];
					}
				}
			}
		}

		return to;
	};


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 */

	'use strict';

	/**
	 * Use invariant() to assert state which your program assumes to be true.
	 *
	 * Provide sprintf-style format (only %s is supported) and arguments
	 * to provide information about what broke and what you were
	 * expecting.
	 *
	 * The invariant message will be stripped in production, but the invariant
	 * will remain to ensure logic does not differ in production.
	 */

	var validateFormat = function validateFormat(format) {};

	if (process.env.NODE_ENV !== 'production') {
	  validateFormat = function validateFormat(format) {
	    if (format === undefined) {
	      throw new Error('invariant requires an error message argument');
	    }
	  };
	}

	function invariant(condition, format, a, b, c, d, e, f) {
	  validateFormat(format);

	  if (!condition) {
	    var error;
	    if (format === undefined) {
	      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
	    } else {
	      var args = [a, b, c, d, e, f];
	      var argIndex = 0;
	      error = new Error(format.replace(/%s/g, function () {
	        return args[argIndex++];
	      }));
	      error.name = 'Invariant Violation';
	    }

	    error.framesToPop = 1; // we don't care about invariant's own frame
	    throw error;
	  }
	}

	module.exports = invariant;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

	var ASCENDING = 'ascending';
	var DESCENDING = 'descending';

	function makeURL(str, params) {
	  //console.log('makeURL', str, params);
	  try {
	    var url = new URL(str, window.location.origin); // #janky note: probably need to variabilize baseUrl
	    Object.keys(params).forEach(function (key) {
	      return url.searchParams.append(key, params[key]);
	    });
	    return url;
	  } catch (e) {
	    var url;

	    var _ret = function () {
	      console.log(e);
	      url = str.indexOf('?') > -1 ? str.substr(0, str.indexOf('?')) + '?' : str + '?';

	      var ps = [];
	      Object.keys(params).forEach(function (key) {
	        return ps.push(key + '=' + params[key]);
	      });
	      url += ps.join('&');
	      return {
	        v: url
	      };
	    }();

	    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
	  }
	}

	var dblTouchTapMaxDelay = 300;
	var latestTouchTap = {
	  time: 0,
	  target: null
	};

	function isDblTouchTap(event) {
	  var touchTap = {
	    time: new Date().getTime(),
	    target: event.currentTarget
	  };
	  var isFastDblTouchTap = touchTap.target === latestTouchTap.target && touchTap.time - latestTouchTap.time < dblTouchTapMaxDelay;
	  latestTouchTap = touchTap;
	  return isFastDblTouchTap;
	}

	function removeDuplicates(myArr, prop) {
	  return myArr.filter(function (obj, pos, arr) {
	    return arr.map(function (mapObj) {
	      return mapObj[prop];
	    }).indexOf(obj[prop]) === pos;
	  });
	}

	function cssSafe(value) {
	  value = typeof value === 'string' ? value : '';
	  return value.replace(/[^a-z0-9]/g, function (s) {
	    var c = s.charCodeAt(0);
	    if (c == 32) return '-';
	    if (c >= 65 && c <= 90) return s.toLowerCase();
	    return '__' + ('000' + c.toString(16)).slice(-4);
	  });
	};

	function wordBreaksEvery(str) {
	  var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 8;

	  var ret = [];
	  var i;
	  var len;

	  for (i = 0, len = str.length; i < len; i += n) {
	    ret.push(str.substr(i, n));
	  }

	  return ret.map(function (value) {
	    return [value, _react2.default.createElement('wbr', null)];
	  });
	}

	function getIconByExtension(ext) {
	  switch (ext) {
	    case '.jpg':
	    case '.jpeg':
	    case '.gif':
	    case '.png':
	    case '.png8':
	    case '.png24':
	    case '.svg':
	    case '.bmp':
	    case '.tiff':
	      return "file-image-o";
	      break;

	    case ".pdf":
	      return "file-pdf-o";
	      break;

	    case ".zip":
	    case ".tar":
	      return "file-archive-o";
	      break;

	    case ".ppt":
	    case ".pot":
	    case ".pps":
	      return "file-powerpoint-o";
	      break;

	    case ".doc":
	    case ".dot":
	    case ".wbk":
	    case ".docx":
	    case ".docm":
	    case ".dotx":
	    case ".dotm":
	    case ".docb":
	      return "file-word-o";
	      break;

	    case ".xls":
	    case ".xlt":
	    case ".xlm":
	    case ".xlsx":
	    case ".xlsm":
	    case ".xltx":
	    case ".xltm":
	    case ".xlsb":
	    case ".xla":
	    case ".xlam":
	    case ".xll":
	    case ".xlw":
	      return "file-excel-o";
	      break;

	    case ".txt":
	    case ".rtf":
	      return "file-text-o";
	      break;

	    case ".js":
	    case ".json":
	    case ".html":
	    case ".htm":
	    case ".css":
	    case ".scss":
	      return "file-code-o";
	      break;

	    case '.mp3':
	    case '.wav':
	    case '.ogg':
	    case '.flac':
	      return "file-audio-o";
	      break;

	    case '.webm':
	    case '.wbm':
	    case '.mp4':
	    case '.mov':
	      return "file-video-o";
	      break;

	    default:
	      return "file-image-o";
	      break;
	  }
	}

	function parseMediaSourceOutOfCombinedPath(path) {
	  var delimeter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '||';

	  var _path$split = path.split(delimeter),
	      _path$split2 = _toArray(_path$split),
	      cs = _path$split2[0],
	      cd_ = _path$split2.slice(1),
	      cd = cd_.join('||');

	  return [cs, cd];
	}

	function contentSort(props, a, b) {
	  if (a[props.sort.by] === b[props.sort.by]) return 0;

	  var n = void 0;

	  //console.log('props.sort.by',props.sort.by,a,b);

	  switch (props.sort.by) {
	    case 'dimensions':
	      n = a.dimensions[0] * a.dimensions[1] > b.dimensions[0] * b.dimensions[1] ? 1 : -1;
	      break;

	    case 'editedOn':
	      n = new Date(a.editedOn).getTime() > new Date(b.editedOn).getTime() ? 1 : -1;
	      break;

	    default:
	      n = a[props.sort.by] > b[props.sort.by] ? 1 : -1;
	      break;
	  }

	  return props.sort.dir === ASCENDING ? n : 0 - n;
	}

	exports.contentSort = contentSort;

	exports.serverSideRendering = function () {
	  try {
	    return !(document !== undefined);
	  } catch (e) {
	    return true;
	  }
	}();

	/*function notify(message, options = {
	  //icon: 'http://localhost:3000/assets/img/src/png/trash-o.png'
	}) {
	  // Let's check if the browser supports notifications
	  if (!("Notification" in window)) {
	    //alert(message);
	  }

	  // Let's check whether notification permissions have already been granted
	  else if (Notification.permission === "granted") {
	    // If it's okay let's create a notification
	    var notification = new Notification(message, options);
	  }

	  // Otherwise, we need to ask the user for permission
	  else if (Notification.permission !== "denied") {
	    Notification.requestPermission(function (permission) {
	      // If the user accepts, let's create a notification
	      if (permission === "granted") {
	        var notification = new Notification(message, options);
	      } else {
	        alert(message);
	      }
	    });
	  }

	  // At last, if the user has denied notifications, and you
	  // want to be respectful there is no need to bother them any more.
	}*/

	function runPrefixMethod(obj, method) {
	  console.log('runPrefixMethod');
	  var pfx = ["webkit", "moz", "ms", "o", ""];
	  var p = 0,
	      m,
	      t;
	  while (p < pfx.length && !obj[m]) {
	    m = method;
	    if (pfx[p] == "") {
	      m = m.substr(0, 1).toLowerCase() + m.substr(1);
	    }
	    m = pfx[p] + m;
	    t = _typeof(obj[m]);
	    if (t != "undefined") {
	      pfx = [pfx[p]];
	      return t == "function" ? obj[m]() : obj[m];
	    }
	    p++;
	  }
	}

	exports.parseMediaSourceOutOfCombinedPath = parseMediaSourceOutOfCombinedPath;

	exports.getIconByExtension = getIconByExtension;

	exports.makeURL = makeURL;
	exports.removeDuplicates = removeDuplicates;

	exports.ASCENDING = ASCENDING;
	exports.DESCENDING = DESCENDING;

	exports.cssSafe = cssSafe;

	exports.isDblTouchTap = isDblTouchTap;

	exports.wordBreaksEvery = wordBreaksEvery;

	//exports.notify = notify;

	exports.runPrefixMethod = runPrefixMethod;

	exports.DANGEROUS = 'dangerous';

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {"use strict";

	/**
	 * filesize
	 *
	 * @copyright 2017 Jason Mulligan <jason.mulligan@avoidwork.com>
	 * @license BSD-3-Clause
	 * @version 3.5.4
	 */
	(function (global) {
		var b = /^(b|B)$/,
		    symbol = {
			iec: {
				bits: ["b", "Kib", "Mib", "Gib", "Tib", "Pib", "Eib", "Zib", "Yib"],
				bytes: ["B", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"]
			},
			jedec: {
				bits: ["b", "Kb", "Mb", "Gb", "Tb", "Pb", "Eb", "Zb", "Yb"],
				bytes: ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
			}
		},
		    fullform = {
			iec: ["", "kibi", "mebi", "gibi", "tebi", "pebi", "exbi", "zebi", "yobi"],
			jedec: ["", "kilo", "mega", "giga", "tera", "peta", "exa", "zetta", "yotta"]
		};

		/**
	  * filesize
	  *
	  * @method filesize
	  * @param  {Mixed}   arg        String, Int or Float to transform
	  * @param  {Object}  descriptor [Optional] Flags
	  * @return {String}             Readable file size String
	  */
		function filesize(arg) {
			var descriptor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

			var result = [],
			    val = 0,
			    e = void 0,
			    base = void 0,
			    bits = void 0,
			    ceil = void 0,
			    full = void 0,
			    fullforms = void 0,
			    neg = void 0,
			    num = void 0,
			    output = void 0,
			    round = void 0,
			    unix = void 0,
			    spacer = void 0,
			    standard = void 0,
			    symbols = void 0;

			if (isNaN(arg)) {
				throw new Error("Invalid arguments");
			}

			bits = descriptor.bits === true;
			unix = descriptor.unix === true;
			base = descriptor.base || 2;
			round = descriptor.round !== undefined ? descriptor.round : unix ? 1 : 2;
			spacer = descriptor.spacer !== undefined ? descriptor.spacer : unix ? "" : " ";
			symbols = descriptor.symbols || descriptor.suffixes || {};
			standard = base === 2 ? descriptor.standard || "jedec" : "jedec";
			output = descriptor.output || "string";
			full = descriptor.fullform === true;
			fullforms = descriptor.fullforms instanceof Array ? descriptor.fullforms : [];
			e = descriptor.exponent !== undefined ? descriptor.exponent : -1;
			num = Number(arg);
			neg = num < 0;
			ceil = base > 2 ? 1000 : 1024;

			// Flipping a negative number to determine the size
			if (neg) {
				num = -num;
			}

			// Zero is now a special case because bytes divide by 1
			if (num === 0) {
				e = 0;
				result[0] = 0;
				result[1] = unix ? "" : !bits ? "B" : "b";
			} else {
				// Determining the exponent
				if (e === -1 || isNaN(e)) {
					e = Math.floor(Math.log(num) / Math.log(ceil));

					if (e < 0) {
						e = 0;
					}
				}

				// Exceeding supported length, time to reduce & multiply
				if (e > 8) {
					e = 8;
				}

				val = num / (base === 2 ? Math.pow(2, e * 10) : Math.pow(1000, e));

				if (bits) {
					val = val * 8;

					if (val >= ceil && e < 8) {
						val = val / ceil;
						e++;
					}
				}

				result[0] = Number(val.toFixed(e > 0 ? round : 0));
				result[1] = base === 10 && e === 1 ? bits ? "kb" : "kB" : symbol[standard][bits ? "bits" : "bytes"][e];

				if (unix) {
					result[1] = standard === "jedec" ? result[1].charAt(0) : e > 0 ? result[1].replace(/B$/, "") : result[1];

					if (b.test(result[1])) {
						result[0] = Math.floor(result[0]);
						result[1] = "";
					}
				}
			}

			// Decorating a 'diff'
			if (neg) {
				result[0] = -result[0];
			}

			// Applying custom symbol
			result[1] = symbols[result[1]] || result[1];

			// Returning Array, Object, or String (default)
			if (output === "array") {
				return result;
			}

			if (output === "exponent") {
				return e;
			}

			if (output === "object") {
				return { value: result[0], suffix: result[1], symbol: result[1] };
			}

			if (full) {
				result[1] = fullforms[e] ? fullforms[e] : fullform[standard][e] + (bits ? "bit" : "byte") + (result[0] === 1 ? "" : "s");
			}

			return result.join(spacer);
		}

		// Partial application for functional programming
		filesize.partial = function (opt) {
			return function (arg) {
				return filesize(arg, opt);
			};
		};

		// CommonJS, AMD, script tag
		if (true) {
			module.exports = filesize;
		} else if (typeof define === "function" && define.amd) {
			define(function () {
				return filesize;
			});
		} else {
			global.filesize = filesize;
		}
	})(typeof window !== "undefined" ? window : global);

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _utility = __webpack_require__(17);

	var _utility2 = _interopRequireDefault(_utility);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	__webpack_require__(20);

	var ADD_ITEM_SUCCESS = 'add_item_success';
	var ADD_ITEM_ERROR = 'add_item_error';
	var addItemSuccess = function addItemSuccess(item) {
	  return {
	    type: ADD_ITEM_SUCCESS,
	    item: item
	  };
	};

	var addItemError = function addItemError(task) {
	  return {
	    type: ADD_ITEM_ERROR,
	    task: task
	  };
	};

	var UPDATE_VIEW = 'update_view';
	var updateView = function updateView(view) {
	  return {
	    type: UPDATE_VIEW,
	    view: view
	  };
	};

	var DESELECT_ALL = 'deselect_all';
	var deselectAll = function deselectAll() {
	  return {
	    type: DESELECT_ALL
	  };
	};

	var INVERT_SELECTION = 'invert_selection';
	var invertSelection = function invertSelection() {
	  return {
	    type: INVERT_SELECTION
	  };
	};

	var UPDATE_SOURCE = 'update_source';
	var updateSource = function updateSource(source) {
	  return {
	    type: UPDATE_SOURCE,
	    source: source
	  };
	};

	var ADD_MEDIA_ITEM_TO_CHOSEN_ITEMS = 'add_media_item_to_chosen_items';
	var addMediaItemToChosenItems = function addMediaItemToChosenItems(item) {
	  var inverted = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

	  return {
	    type: ADD_MEDIA_ITEM_TO_CHOSEN_ITEMS,
	    item: item,
	    inverted: inverted
	  };
	};

	var REMOVE_MEDIA_ITEM_FROM_CHOSEN_ITEMS = 'remove_media_item_from_chosen_items';
	var removeMediaItemFromChosenItems = function removeMediaItemFromChosenItems(item) {
	  var inverted = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

	  return {
	    type: REMOVE_MEDIA_ITEM_FROM_CHOSEN_ITEMS,
	    item: item,
	    inverted: inverted
	  };
	};

	var UPDATE_CONTENT = 'update_content';
	var updateContent = function updateContent(content) {
	  return {
	    type: UPDATE_CONTENT,
	    content: content
	  };
	};

	var UPDATE_CONFIG = 'update_config';
	var updateConfig = function updateConfig(config) {
	  //console.log('updateConfig', config);
	  return {
	    type: UPDATE_CONFIG,
	    config: config
	  };
	};

	var updateSourceTree = function updateSourceTree(source) {
	  var customHeaders = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	  return function (dispatch) {
	    return fetch('/assets/components/eureka/media/sources/' + source, {
	      method: 'GET',
	      headers: Object.assign({}, {
	        'Accept': 'application/json',
	        'Content-Type': 'application/json'
	      }, customHeaders)
	    }).then(function (response) {
	      if (response.state < 200 || response.state >= 300) {
	        var error = new Error(response.statusText);
	        error.response = response;
	        throw error;
	      }
	      return response;
	    }).then(function (response) {
	      return response.json();
	    }).then(function (contents) {
	      return dispatch(updateSourceTreeSuccess(contents));
	    }).catch(function (error) {
	      return dispatch(updateSourceTreeError(error));
	    });
	  };
	};

	var UPDATE_SOURCE_TREE_SUCCESS = 'update_source_tree_success';
	var UPDATE_SOURCE_TREE_ERROR = 'update_source_tree_error';
	var updateSourceTreeSuccess = function updateSourceTreeSuccess(contents) {
	  return {
	    type: UPDATE_SOURCE_TREE_SUCCESS,
	    contents: contents
	  };
	};

	var updateSourceTreeError = function updateSourceTreeError(error) {
	  //console.log('updateSourceTreeError',error);
	  return {
	    type: UPDATE_SOURCE_TREE_ERROR,
	    error: error
	  };
	};

	var fetchDirectoryContents = function fetchDirectoryContents(source, params) {
	  var customHeaders = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
	  return function (dispatch) {
	    return fetch(_utility2.default.makeURL('/assets/components/eureka/media/sources/' + source, params), {
	      method: 'GET',
	      headers: Object.assign({}, {
	        'Accept': 'application/json',
	        'Content-Type': 'application/json'
	      }, customHeaders)
	    }).then(function (response) {
	      if (response.state < 200 || response.state >= 300) {
	        var error = new Error(response.statusText);
	        error.response = response;
	        throw error;
	      }
	      return response;
	    }).then(function (response) {
	      return response.json();
	    }).then(function (contents) {
	      return dispatch(fetchDirectoryContentsSuccess(contents));
	    }).catch(function (error) {
	      return dispatch(fetchDirectoryContentsError(error));
	    });
	  };
	};

	var FETCH_DIRECTORY_CONTENTS_SUCCESS = 'fetch_directory_contents_success';
	var FETCH_DIRECTORY_CONTENTS_ERROR = 'fetch_directory_contents_error';

	var fetchDirectoryContentsSuccess = function fetchDirectoryContentsSuccess(contents) {
	  return {
	    type: FETCH_DIRECTORY_CONTENTS_SUCCESS,
	    contents: contents
	  };
	};

	exports.fetchDirectoryContentsSuccess = fetchDirectoryContentsSuccess;

	var fetchDirectoryContentsError = function fetchDirectoryContentsError(error) {
	  return {
	    type: FETCH_DIRECTORY_CONTENTS_ERROR,
	    error: error
	  };
	};

	exports.fetchDirectoryContentsError = fetchDirectoryContentsError;

	var fetchMediaSources = function fetchMediaSources() {
	  var customHeaders = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	  return function (dispatch) {
	    return fetch('/assets/components/eureka/media/sources', {
	      method: 'GET',
	      headers: Object.assign({}, {
	        'Accept': 'application/json',
	        'Content-Type': 'application/json'
	      }, customHeaders)
	    }).then(function (response) {
	      if (response.state < 200 || response.state >= 300) {
	        var error = new Error(response.statusText);
	        error.response = response;
	        throw error;
	      }
	      return response;
	    }).then(function (sources) {
	      return sources.json();
	    }).then(function (sources) {
	      return dispatch(fetchMediaSourcesSuccess(sources));
	    }).catch(function (error) {
	      return dispatch(fetchMediaSourcesError(error));
	    });
	  };
	};

	var FETCH_MEDIA_SOURCES_SUCCESS = 'fetch_media_sources_success';
	var FETCH_MEDIA_SOURCES_ERROR = 'fetch_media_sources_error';

	var fetchMediaSourcesSuccess = function fetchMediaSourcesSuccess(sources) {
	  //console.log('fetchMediaSourcesSuccess', sources);
	  return {
	    type: FETCH_MEDIA_SOURCES_SUCCESS,
	    sources: sources
	  };
	};

	var fetchMediaSourcesError = function fetchMediaSourcesError(error) {
	  return {
	    type: FETCH_MEDIA_SOURCES_ERROR,
	    error: error
	  };
	};

	var DELETE_MEDIA_ITEM_SUCCESS = 'delete_media_item_success';
	var deleteMediaItemSuccess = function deleteMediaItemSuccess(source, path) {
	  //console.log('DELETE_MEDIA_ITEM_SUCCESS', source, path);
	  return {
	    type: DELETE_MEDIA_ITEM_SUCCESS,
	    source: source,
	    path: path
	  };
	};

	exports.DELETE_MEDIA_ITEM_SUCCESS = DELETE_MEDIA_ITEM_SUCCESS;
	exports.deleteMediaItemSuccess = deleteMediaItemSuccess;

	exports.UPDATE_CONFIG = UPDATE_CONFIG;
	exports.updateConfig = updateConfig;

	var DELETE_MEDIA_ITEM_ERROR = 'delete_media_item_error';
	var deleteMediaItemError = function deleteMediaItemError(error) {
	  //console.log('deleteMediaItemError', error);
	  return {
	    type: DELETE_MEDIA_ITEM_ERROR,
	    error: error
	  };
	};

	var deleteMediaItem = function deleteMediaItem(source, path) {
	  var customHeaders = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
	  return function (dispatch) {
	    return fetch(_utility2.default.makeURL('/assets/components/eureka/media/sources/' + source, {
	      path: path
	    }), {
	      method: 'DELETE',
	      headers: Object.assign({}, {
	        'Accept': 'application/json',
	        'Content-Type': 'application/json'
	      }, customHeaders)
	    }).then(function (response) {
	      if (response.state < 200 || response.state >= 300) {
	        var error = new Error(response.statusText);
	        error.response = response;
	        throw error;
	      }
	      return response;
	    }).then(function (response) {
	      return response.json();
	    }).then(function (contents) {
	      if (contents === false) throw new Error('Unable to delete directory ' + path);
	      return contents;
	    }).then(function (contents) {
	      return dispatch(deleteMediaItemSuccess(source, path));
	    }).catch(function (error) {
	      return dispatch(deleteMediaItemError(error));
	    });
	  };
	};

	var DELETE_MEDIA_ITEMS_SUCCESS = 'delete_media_items_success';
	var deleteMediaItemsSuccess = function deleteMediaItemsSuccess(contents, formData) {
	  //console.log('DELETE_MEDIA_ITEM_SUCCESS', source, path);
	  return {
	    type: DELETE_MEDIA_ITEMS_SUCCESS,
	    contents: contents,
	    formData: formData
	  };
	};

	exports.DELETE_MEDIA_ITEMS_SUCCESS = DELETE_MEDIA_ITEMS_SUCCESS;
	exports.deleteMediaItemsSuccess = deleteMediaItemsSuccess;

	var DELETE_MEDIA_ITEMS_ERROR = 'delete_media_items_error';
	var deleteMediaItemsError = function deleteMediaItemsError(source, path) {
	  //console.log('DELETE_MEDIA_ITEM_SUCCESS', source, path);
	  return {
	    type: DELETE_MEDIA_ITEMS_ERROR,
	    source: source,
	    path: path
	  };
	};

	exports.DELETE_MEDIA_ITEMS_ERROR = DELETE_MEDIA_ITEMS_ERROR;
	exports.deleteMediaItemsError = deleteMediaItemsError;

	var deleteMediaItems = function deleteMediaItems(source, formData) {
	  var customHeaders = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

	  console.log('deleteMediaItems');
	  var _iteratorNormalCompletion = true;
	  var _didIteratorError = false;
	  var _iteratorError = undefined;

	  try {
	    for (var _iterator = formData.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	      var pair = _step.value;

	      console.log(pair[0] + ', ' + pair[1]);
	    }
	  } catch (err) {
	    _didIteratorError = true;
	    _iteratorError = err;
	  } finally {
	    try {
	      if (!_iteratorNormalCompletion && _iterator.return) {
	        _iterator.return();
	      }
	    } finally {
	      if (_didIteratorError) {
	        throw _iteratorError;
	      }
	    }
	  }

	  return function (dispatch) {
	    return fetch('/assets/components/eureka/media/sources/' + source, {
	      method: 'DELETE',
	      body: formData,
	      headers: Object.assign({}, {
	        'Accept': 'application/json'
	      }, customHeaders)
	    }).then(function (response) {
	      if (response.state < 200 || response.state >= 300) {
	        var error = new Error(response.statusText);
	        error.response = response;
	        throw error;
	      }
	      return response;
	    }).then(function (response) {
	      return response.json();
	    }).then(function (contents) {
	      //if(contents === false) throw new Error(`Unable to delete directory ${path}`)
	      return contents;
	    }).then(function (contents) {
	      return dispatch(deleteMediaItemsSuccess(contents, formData));
	    }).catch(function (error) {
	      return dispatch(deleteMediaItemsError(error));
	    });
	  };
	};

	//http://localhost:3001/assets/components/eureka/media/sources/0

	/*const deleteMediaItems = (source, formData, customHeaders = {}) => (
	  (dispatch) => (
	    fetch(`/assets/components/eureka/media/sources/${source}`), {
	      method: 'DELETE',
	      body: formData,
	      headers: Object.assign({}, {
	        'Accept': 'application/json',
	        'Content-Type': 'application/json'
	      }, customHeaders)
	    }).then((response) => {
	      if(response.state < 200 || response.state >= 300) {
	        var error = new Error(response.statusText)
	        error.response = response
	        throw error;
	      }
	      return response;
	    }).then((response) => (
	      response.json()
	    )).then((contents) => {
	      if(contents === false) throw new Error(`Unable to delete items`)
	      return contents;
	    }).then((contents) => (
	      dispatch(
	        deleteMediaItemsSuccess(source, formData)
	      )
	    )).catch((error) => (
	      dispatch(
	        deleteMediaItemError(error)
	      )
	    )
	  )
	);*/

	exports.deleteMediaItems = deleteMediaItems;

	var NOTIFICATION = 'notification';
	var notify = function notify(message, notificationType, learnMore, dismissAfter) {
	  var sticky = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
	  var archived = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;

	  return {
	    type: NOTIFICATION,
	    message: message,
	    id: new Date().getTime(),
	    archived: archived,
	    notificationType: notificationType,
	    learnMore: learnMore,
	    dismissAfter: dismissAfter,
	    sticky: sticky
	  };
	};

	exports.NOTIFICATION = NOTIFICATION;
	exports.notify = notify;

	var NOTIFICATION_DELETED = 'notification_dismissed';
	var deleteNotification = function deleteNotification(id) {
	  return {
	    type: NOTIFICATION_DELETED,
	    id: id
	  };
	};

	exports.NOTIFICATION_DELETED = NOTIFICATION_DELETED;
	exports.deleteNotification = deleteNotification;

	var NOTIFICATION_ARCHIVED = 'notification_archived';
	var archiveNotification = function archiveNotification(id) {
	  return {
	    type: NOTIFICATION_ARCHIVED,
	    id: id
	  };
	};

	exports.NOTIFICATION_ARCHIVED = NOTIFICATION_ARCHIVED;
	exports.archiveNotification = archiveNotification;

	var UPLOAD_FILES_SUCCESS = 'upload_files_success';
	var uploadFilesSuccess = function uploadFilesSuccess(contents) {
	  return {
	    type: UPLOAD_FILES_SUCCESS,
	    contents: contents
	  };
	};

	exports.UPLOAD_FILES_SUCCESS = UPLOAD_FILES_SUCCESS;
	exports.uploadFilesSuccess = uploadFilesSuccess;

	var UPLOAD_FILES_ERROR = 'upload_files_error';
	var uploadFilesError = function uploadFilesError(error) {
	  return {
	    type: UPLOAD_FILES_ERROR,
	    error: error
	  };
	};

	exports.UPLOAD_FILES_ERROR = UPLOAD_FILES_ERROR;
	exports.uploadFilesError = uploadFilesError;

	var uploadFiles = function uploadFiles(source, directory, formData) {
	  var customHeaders = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
	  return function (dispatch) {
	    return fetch(_utility2.default.makeURL('/assets/components/eureka/media/sources/' + source, {
	      path: directory
	    }), {
	      method: 'POST',
	      body: formData,
	      headers: Object.assign({}, {
	        //'Accept': 'application/json',
	        //'Content-Type': 'application/json'
	      }, customHeaders)
	    }).then(function (response) {
	      if (response.state < 200 || response.state >= 300) {
	        var error = new Error(response.statusText);
	        error.response = response;
	        throw error;
	      }
	      return response;
	    }).then(function (response) {
	      return response.json();
	    }).then(function (contents) {
	      return dispatch(uploadFilesSuccess(contents));
	    }).catch(function (error) {
	      return dispatch(uploadFilesError(error));
	    });
	  };
	};

	var createDirectory = function createDirectory(source, dir) {
	  var customHeaders = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
	  return function (dispatch) {
	    return fetch(_utility2.default.makeURL('/assets/components/eureka/media/sources/' + source, {
	      path: dir
	    }), {
	      method: 'PUT',
	      headers: Object.assign({}, {
	        'Accept': 'application/json',
	        'Content-Type': 'application/json'
	      }, customHeaders)
	    }).then(function (response) {
	      if (response.state < 200 || response.state >= 300) {
	        var error = new Error(response.statusText);
	        error.response = response;
	        throw error;
	      }
	      return response;
	    }).then(function (response) {
	      return response.json();
	    }).then(function (success) {
	      if (!success) {
	        var error = new Error('unable to create ' + dir + ' for media source ' + source);
	        error.response = false;
	        throw error;
	      }
	    }).then(function (success) {
	      return dispatch(createDirectorySuccess(success));
	    }).catch(function (error) {
	      return dispatch(createDirectoryError(error));
	    });
	  };
	};

	var CREATE_DIRECTORY_SUCCESS = 'create_directory_success';
	var createDirectorySuccess = function createDirectorySuccess(success) {
	  return {
	    type: CREATE_DIRECTORY_SUCCESS,
	    success: success
	  };
	};

	exports.CREATE_DIRECTORY_SUCCESS = CREATE_DIRECTORY_SUCCESS;
	exports.createDirectorySuccess = createDirectorySuccess;

	var CREATE_DIRECTORY_ERROR = 'create_directory_error';
	var createDirectoryError = function createDirectoryError(error) {
	  return {
	    type: CREATE_DIRECTORY_ERROR,
	    error: error
	  };
	};

	exports.CREATE_DIRECTORY_ERROR = CREATE_DIRECTORY_ERROR;
	exports.createDirectoryError = createDirectoryError;

	exports.createDirectory = createDirectory;

	exports.uploadFiles = uploadFiles;

	exports.ADD_ITEM_SUCCESS = ADD_ITEM_SUCCESS;
	exports.addItemSuccess = addItemSuccess;

	exports.ADD_ITEM_ERROR = ADD_ITEM_ERROR;
	exports.addItemError = addItemError;

	exports.UPDATE_VIEW = UPDATE_VIEW;
	exports.updateView = updateView;

	exports.UPDATE_SOURCE = UPDATE_SOURCE;
	exports.updateSource = updateSource;

	exports.updateSourceTree = updateSourceTree;

	exports.UPDATE_SOURCE_TREE_SUCCESS = UPDATE_SOURCE_TREE_SUCCESS;
	exports.updateSourceTreeSuccess = updateSourceTreeSuccess;

	exports.UPDATE_SOURCE_TREE_ERROR = UPDATE_SOURCE_TREE_ERROR;
	exports.updateSourceTreeError = updateSourceTreeError;

	exports.UPDATE_CONTENT = UPDATE_CONTENT;
	exports.updateContent = updateContent;

	exports.FETCH_DIRECTORY_CONTENTS_SUCCESS = FETCH_DIRECTORY_CONTENTS_SUCCESS;
	exports.FETCH_DIRECTORY_CONTENTS_ERROR = FETCH_DIRECTORY_CONTENTS_ERROR;
	exports.fetchDirectoryContents = fetchDirectoryContents;

	exports.fetchMediaSources = fetchMediaSources;

	exports.FETCH_MEDIA_SOURCES_SUCCESS = FETCH_MEDIA_SOURCES_SUCCESS;
	exports.fetchMediaSourcesSuccess = fetchMediaSourcesSuccess;

	exports.FETCH_MEDIA_SOURCES_ERROR = FETCH_MEDIA_SOURCES_ERROR;
	exports.fetchMediaSourcesError = fetchMediaSourcesError;

	exports.DELETE_MEDIA_ITEM_ERROR = DELETE_MEDIA_ITEM_ERROR;
	exports.deleteMediaItemError = deleteMediaItemError;

	exports.deleteMediaItem = deleteMediaItem;

	var renameDirectory = function renameDirectory(source, dirPath, name) {
	  var customHeaders = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
	  return function (dispatch) {
	    return fetch(_utility2.default.makeURL('/assets/components/eureka/media/sources/' + source, {
	      path: dirPath,
	      name: name
	    }), {
	      method: 'PUT',
	      headers: Object.assign({}, {
	        'Accept': 'application/json',
	        'Content-Type': 'application/json'
	      }, customHeaders)
	    }).then(function (response) {
	      if (response.state < 200 || response.state >= 300) {
	        var error = new Error(response.statusText);
	        error.response = response;
	        throw error;
	      }
	      return response;
	    }).then(function (response) {
	      return response.json();
	    }).then(function (success) {
	      if (!success) {
	        var error = new Error('unable to create ' + dirPath + ' for media source ' + source);
	        error.response = false;
	        throw error;
	      }
	    }).then(function (success) {
	      return dispatch(renameDirectorySuccess(success));
	    }).catch(function (error) {
	      return dispatch(renameDirectoryError(error));
	    });
	  };
	};

	var RENAME_DIRECTORY_SUCCESS = 'rename_directory_success';
	var renameDirectorySuccess = function renameDirectorySuccess(success) {
	  return {
	    type: RENAME_DIRECTORY_SUCCESS,
	    success: success
	  };
	};

	var RENAME_DIRECTORY_ERROR = 'rename_directory_error';
	var renameDirectoryError = function renameDirectoryError(error) {
	  return {
	    type: RENAME_DIRECTORY_ERROR,
	    error: error
	  };
	};

	exports.RENAME_DIRECTORY_SUCCESS = RENAME_DIRECTORY_SUCCESS;
	exports.renameDirectorySuccess = renameDirectorySuccess;

	exports.RENAME_DIRECTORY_ERROR = RENAME_DIRECTORY_ERROR;
	exports.renameDirectoryError = renameDirectoryError;

	exports.renameDirectory = renameDirectory;

	var renameItem = function renameItem(source, filePath, name) {
	  var customHeaders = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
	  return function (dispatch) {
	    return fetch(_utility2.default.makeURL('/assets/components/eureka/media/sources/' + source, {
	      path: filePath,
	      name: name
	    }), {
	      method: 'PUT',
	      headers: Object.assign({}, {
	        'Accept': 'application/json',
	        'Content-Type': 'application/json'
	      }, customHeaders)
	    }).then(function (response) {
	      if (response.state < 200 || response.state >= 300) {
	        var error = new Error(response.statusText);
	        error.response = response;
	        throw error;
	      }
	      return response;
	    }).then(function (response) {
	      return response.json();
	    }).then(function (response) {
	      if (!response) {
	        var error = new Error('unable to create ' + filePath + ' for media source ' + source);
	        error.response = false;
	        throw error;
	      }
	      //console.log('response',response);
	      return response;
	    }).then(function (response) {
	      return dispatch(renameItemSuccess(response));
	    }).catch(function (error) {
	      return dispatch(renameItemError(error));
	    });
	  };
	};

	var RENAME_ITEM_SUCCESS = 'rename_item_success';
	var renameItemSuccess = function renameItemSuccess(contents) {
	  //console.log('renameItemSuccess', contents);
	  return {
	    type: RENAME_ITEM_SUCCESS,
	    contents: contents
	  };
	};

	var RENAME_ITEM_ERROR = 'rename_item_error';
	var renameItemError = function renameItemError(error) {
	  return {
	    type: RENAME_ITEM_ERROR,
	    error: error
	  };
	};

	exports.RENAME_ITEM_SUCCESS = RENAME_ITEM_SUCCESS;
	exports.renameItemSuccess = renameItemSuccess;

	exports.RENAME_ITEM_ERROR = RENAME_ITEM_ERROR;
	exports.renameItemError = renameItemError;

	exports.renameItem = renameItem;

	exports.addMediaItemToChosenItems = addMediaItemToChosenItems;
	exports.ADD_MEDIA_ITEM_TO_CHOSEN_ITEMS = ADD_MEDIA_ITEM_TO_CHOSEN_ITEMS;

	exports.removeMediaItemFromChosenItems = removeMediaItemFromChosenItems;
	exports.REMOVE_MEDIA_ITEM_FROM_CHOSEN_ITEMS = REMOVE_MEDIA_ITEM_FROM_CHOSEN_ITEMS;

	exports.invertSelection = invertSelection;
	exports.INVERT_SELECTION = INVERT_SELECTION;

	exports.deselectAll = deselectAll;
	exports.DESELECT_ALL = DESELECT_ALL;

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	// the whatwg-fetch polyfill installs the fetch() function
	// on the global object (window or self)
	//
	// Return that as the export for use in Webpack, Browserify etc.
	__webpack_require__(21);
	module.exports = self.fetch.bind(self);


/***/ },
/* 21 */
/***/ function(module, exports) {

	(function(self) {
	  'use strict';

	  if (self.fetch) {
	    return
	  }

	  var support = {
	    searchParams: 'URLSearchParams' in self,
	    iterable: 'Symbol' in self && 'iterator' in Symbol,
	    blob: 'FileReader' in self && 'Blob' in self && (function() {
	      try {
	        new Blob()
	        return true
	      } catch(e) {
	        return false
	      }
	    })(),
	    formData: 'FormData' in self,
	    arrayBuffer: 'ArrayBuffer' in self
	  }

	  if (support.arrayBuffer) {
	    var viewClasses = [
	      '[object Int8Array]',
	      '[object Uint8Array]',
	      '[object Uint8ClampedArray]',
	      '[object Int16Array]',
	      '[object Uint16Array]',
	      '[object Int32Array]',
	      '[object Uint32Array]',
	      '[object Float32Array]',
	      '[object Float64Array]'
	    ]

	    var isDataView = function(obj) {
	      return obj && DataView.prototype.isPrototypeOf(obj)
	    }

	    var isArrayBufferView = ArrayBuffer.isView || function(obj) {
	      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
	    }
	  }

	  function normalizeName(name) {
	    if (typeof name !== 'string') {
	      name = String(name)
	    }
	    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
	      throw new TypeError('Invalid character in header field name')
	    }
	    return name.toLowerCase()
	  }

	  function normalizeValue(value) {
	    if (typeof value !== 'string') {
	      value = String(value)
	    }
	    return value
	  }

	  // Build a destructive iterator for the value list
	  function iteratorFor(items) {
	    var iterator = {
	      next: function() {
	        var value = items.shift()
	        return {done: value === undefined, value: value}
	      }
	    }

	    if (support.iterable) {
	      iterator[Symbol.iterator] = function() {
	        return iterator
	      }
	    }

	    return iterator
	  }

	  function Headers(headers) {
	    this.map = {}

	    if (headers instanceof Headers) {
	      headers.forEach(function(value, name) {
	        this.append(name, value)
	      }, this)

	    } else if (headers) {
	      Object.getOwnPropertyNames(headers).forEach(function(name) {
	        this.append(name, headers[name])
	      }, this)
	    }
	  }

	  Headers.prototype.append = function(name, value) {
	    name = normalizeName(name)
	    value = normalizeValue(value)
	    var oldValue = this.map[name]
	    this.map[name] = oldValue ? oldValue+','+value : value
	  }

	  Headers.prototype['delete'] = function(name) {
	    delete this.map[normalizeName(name)]
	  }

	  Headers.prototype.get = function(name) {
	    name = normalizeName(name)
	    return this.has(name) ? this.map[name] : null
	  }

	  Headers.prototype.has = function(name) {
	    return this.map.hasOwnProperty(normalizeName(name))
	  }

	  Headers.prototype.set = function(name, value) {
	    this.map[normalizeName(name)] = normalizeValue(value)
	  }

	  Headers.prototype.forEach = function(callback, thisArg) {
	    for (var name in this.map) {
	      if (this.map.hasOwnProperty(name)) {
	        callback.call(thisArg, this.map[name], name, this)
	      }
	    }
	  }

	  Headers.prototype.keys = function() {
	    var items = []
	    this.forEach(function(value, name) { items.push(name) })
	    return iteratorFor(items)
	  }

	  Headers.prototype.values = function() {
	    var items = []
	    this.forEach(function(value) { items.push(value) })
	    return iteratorFor(items)
	  }

	  Headers.prototype.entries = function() {
	    var items = []
	    this.forEach(function(value, name) { items.push([name, value]) })
	    return iteratorFor(items)
	  }

	  if (support.iterable) {
	    Headers.prototype[Symbol.iterator] = Headers.prototype.entries
	  }

	  function consumed(body) {
	    if (body.bodyUsed) {
	      return Promise.reject(new TypeError('Already read'))
	    }
	    body.bodyUsed = true
	  }

	  function fileReaderReady(reader) {
	    return new Promise(function(resolve, reject) {
	      reader.onload = function() {
	        resolve(reader.result)
	      }
	      reader.onerror = function() {
	        reject(reader.error)
	      }
	    })
	  }

	  function readBlobAsArrayBuffer(blob) {
	    var reader = new FileReader()
	    var promise = fileReaderReady(reader)
	    reader.readAsArrayBuffer(blob)
	    return promise
	  }

	  function readBlobAsText(blob) {
	    var reader = new FileReader()
	    var promise = fileReaderReady(reader)
	    reader.readAsText(blob)
	    return promise
	  }

	  function readArrayBufferAsText(buf) {
	    var view = new Uint8Array(buf)
	    var chars = new Array(view.length)

	    for (var i = 0; i < view.length; i++) {
	      chars[i] = String.fromCharCode(view[i])
	    }
	    return chars.join('')
	  }

	  function bufferClone(buf) {
	    if (buf.slice) {
	      return buf.slice(0)
	    } else {
	      var view = new Uint8Array(buf.byteLength)
	      view.set(new Uint8Array(buf))
	      return view.buffer
	    }
	  }

	  function Body() {
	    this.bodyUsed = false

	    this._initBody = function(body) {
	      this._bodyInit = body
	      if (!body) {
	        this._bodyText = ''
	      } else if (typeof body === 'string') {
	        this._bodyText = body
	      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
	        this._bodyBlob = body
	      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
	        this._bodyFormData = body
	      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
	        this._bodyText = body.toString()
	      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
	        this._bodyArrayBuffer = bufferClone(body.buffer)
	        // IE 10-11 can't handle a DataView body.
	        this._bodyInit = new Blob([this._bodyArrayBuffer])
	      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
	        this._bodyArrayBuffer = bufferClone(body)
	      } else {
	        throw new Error('unsupported BodyInit type')
	      }

	      if (!this.headers.get('content-type')) {
	        if (typeof body === 'string') {
	          this.headers.set('content-type', 'text/plain;charset=UTF-8')
	        } else if (this._bodyBlob && this._bodyBlob.type) {
	          this.headers.set('content-type', this._bodyBlob.type)
	        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
	          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
	        }
	      }
	    }

	    if (support.blob) {
	      this.blob = function() {
	        var rejected = consumed(this)
	        if (rejected) {
	          return rejected
	        }

	        if (this._bodyBlob) {
	          return Promise.resolve(this._bodyBlob)
	        } else if (this._bodyArrayBuffer) {
	          return Promise.resolve(new Blob([this._bodyArrayBuffer]))
	        } else if (this._bodyFormData) {
	          throw new Error('could not read FormData body as blob')
	        } else {
	          return Promise.resolve(new Blob([this._bodyText]))
	        }
	      }

	      this.arrayBuffer = function() {
	        if (this._bodyArrayBuffer) {
	          return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
	        } else {
	          return this.blob().then(readBlobAsArrayBuffer)
	        }
	      }
	    }

	    this.text = function() {
	      var rejected = consumed(this)
	      if (rejected) {
	        return rejected
	      }

	      if (this._bodyBlob) {
	        return readBlobAsText(this._bodyBlob)
	      } else if (this._bodyArrayBuffer) {
	        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
	      } else if (this._bodyFormData) {
	        throw new Error('could not read FormData body as text')
	      } else {
	        return Promise.resolve(this._bodyText)
	      }
	    }

	    if (support.formData) {
	      this.formData = function() {
	        return this.text().then(decode)
	      }
	    }

	    this.json = function() {
	      return this.text().then(JSON.parse)
	    }

	    return this
	  }

	  // HTTP methods whose capitalization should be normalized
	  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

	  function normalizeMethod(method) {
	    var upcased = method.toUpperCase()
	    return (methods.indexOf(upcased) > -1) ? upcased : method
	  }

	  function Request(input, options) {
	    options = options || {}
	    var body = options.body

	    if (input instanceof Request) {
	      if (input.bodyUsed) {
	        throw new TypeError('Already read')
	      }
	      this.url = input.url
	      this.credentials = input.credentials
	      if (!options.headers) {
	        this.headers = new Headers(input.headers)
	      }
	      this.method = input.method
	      this.mode = input.mode
	      if (!body && input._bodyInit != null) {
	        body = input._bodyInit
	        input.bodyUsed = true
	      }
	    } else {
	      this.url = String(input)
	    }

	    this.credentials = options.credentials || this.credentials || 'omit'
	    if (options.headers || !this.headers) {
	      this.headers = new Headers(options.headers)
	    }
	    this.method = normalizeMethod(options.method || this.method || 'GET')
	    this.mode = options.mode || this.mode || null
	    this.referrer = null

	    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
	      throw new TypeError('Body not allowed for GET or HEAD requests')
	    }
	    this._initBody(body)
	  }

	  Request.prototype.clone = function() {
	    return new Request(this, { body: this._bodyInit })
	  }

	  function decode(body) {
	    var form = new FormData()
	    body.trim().split('&').forEach(function(bytes) {
	      if (bytes) {
	        var split = bytes.split('=')
	        var name = split.shift().replace(/\+/g, ' ')
	        var value = split.join('=').replace(/\+/g, ' ')
	        form.append(decodeURIComponent(name), decodeURIComponent(value))
	      }
	    })
	    return form
	  }

	  function parseHeaders(rawHeaders) {
	    var headers = new Headers()
	    rawHeaders.split(/\r?\n/).forEach(function(line) {
	      var parts = line.split(':')
	      var key = parts.shift().trim()
	      if (key) {
	        var value = parts.join(':').trim()
	        headers.append(key, value)
	      }
	    })
	    return headers
	  }

	  Body.call(Request.prototype)

	  function Response(bodyInit, options) {
	    if (!options) {
	      options = {}
	    }

	    this.type = 'default'
	    this.status = 'status' in options ? options.status : 200
	    this.ok = this.status >= 200 && this.status < 300
	    this.statusText = 'statusText' in options ? options.statusText : 'OK'
	    this.headers = new Headers(options.headers)
	    this.url = options.url || ''
	    this._initBody(bodyInit)
	  }

	  Body.call(Response.prototype)

	  Response.prototype.clone = function() {
	    return new Response(this._bodyInit, {
	      status: this.status,
	      statusText: this.statusText,
	      headers: new Headers(this.headers),
	      url: this.url
	    })
	  }

	  Response.error = function() {
	    var response = new Response(null, {status: 0, statusText: ''})
	    response.type = 'error'
	    return response
	  }

	  var redirectStatuses = [301, 302, 303, 307, 308]

	  Response.redirect = function(url, status) {
	    if (redirectStatuses.indexOf(status) === -1) {
	      throw new RangeError('Invalid status code')
	    }

	    return new Response(null, {status: status, headers: {location: url}})
	  }

	  self.Headers = Headers
	  self.Request = Request
	  self.Response = Response

	  self.fetch = function(input, init) {
	    return new Promise(function(resolve, reject) {
	      var request = new Request(input, init)
	      var xhr = new XMLHttpRequest()

	      xhr.onload = function() {
	        var options = {
	          status: xhr.status,
	          statusText: xhr.statusText,
	          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
	        }
	        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL')
	        var body = 'response' in xhr ? xhr.response : xhr.responseText
	        resolve(new Response(body, options))
	      }

	      xhr.onerror = function() {
	        reject(new TypeError('Network request failed'))
	      }

	      xhr.ontimeout = function() {
	        reject(new TypeError('Network request failed'))
	      }

	      xhr.open(request.method, request.url, true)

	      if (request.credentials === 'include') {
	        xhr.withCredentials = true
	      }

	      if ('responseType' in xhr && support.blob) {
	        xhr.responseType = 'blob'
	      }

	      request.headers.forEach(function(value, name) {
	        xhr.setRequestHeader(name, value)
	      })

	      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
	    })
	  }
	  self.fetch.polyfill = true
	})(typeof self !== 'undefined' ? self : this);


/***/ },
/* 22 */
/***/ function(module, exports) {

	module.exports = {
		"name": "eureka-browser",
		"description": "Eureka is a progressively enhanced Media Browser Component.",
		"version": "0.0.108",
		"license": "BSD-3-Clause",
		"author": {
			"name": "JP de Vries",
			"email": "mail@devries.jp",
			"url": "https://devries.jp/"
		},
		"proxy": "http://localhost:3001/",
		"main": "dist/main.js",
		"config": {
			"port": "3000"
		},
		"keywords": [
			"react",
			"redux",
			"media",
			"browse",
			"eureka",
			"MODX",
			"a11y",
			"data",
			"table"
		],
		"homepage": "https://eureka.markup.tips",
		"bugs": {
			"url": "https://github.com/jpdevries/eureka/issues",
			"email": "eureka@devries.jp"
		},
		"repository": {
			"type": "git",
			"url": "https://github.com/jpdevries/eureka.git"
		},
		"files": [
			"bower.json",
			"yarn.lock",
			"build/assets/css/eureka.*",
			"build/assets/img/",
			"build/assets/js/",
			"build/static/",
			"dist/",
			"i18n/",
			"src/"
		],
		"devDependencies": {
			"autoprefixer": "^6.7.3",
			"concurrently": "^3.3.0",
			"cssnano": "^3.10.0",
			"eslint": "^3.19.0",
			"eslint-plugin-jsx-a11y": "^4.0.0",
			"grunt-bower-task": "^0.4.0",
			"grunt-contrib-clean": "^1.0.0",
			"grunt-contrib-copy": "^1.0.0",
			"grunt-contrib-cssmin": "^2.0.0",
			"grunt-contrib-uglify": "^2.2.0",
			"grunt-contrib-watch": "^1.0.0",
			"grunt-growl": "^0.1.5",
			"grunt-modernizr": "^1.0.2",
			"grunt-postcss": "^0.8.0",
			"grunt-sass": "^2.0.0",
			"grunt-string-replace": "^1.3.1",
			"grunt-svgmin": "^4.0.0",
			"grunt-svgo": "^0.1.0",
			"grunt-svgstore": "^1.0.0",
			"grunt-webpack": "^2.0.1",
			"json-loader": "^0.5.4",
			"lazyload-script": "^0.0.5",
			"postcss-custom-properties": "^5.0.2",
			"react-scripts": "0.9.0",
			"react-tap-event-plugin": "^2.0.1",
			"react-test-renderer": "^15.4.2",
			"webpack-visualizer-plugin": "^0.1.11"
		},
		"dependencies": {
			"babel-plugin-react-intl": "^2.3.1",
			"babel-preset-es2015": "^6.24.0",
			"babel-preset-react": "^6.23.0",
			"babel-preset-stage-0": "^6.22.0",
			"classnames": "^2.2.5",
			"css-safe": "^0.1.0",
			"filesize": "^3.5.4",
			"html-entities": "^1.2.0",
			"isomorphic-fetch": "^2.2.1",
			"mousetrap": "^1.6.1",
			"path-parse": "^1.0.5",
			"pixrem": "^3.0.2",
			"react": "^15.5.0",
			"react-addons-update": "^15.5.0",
			"react-dom": "^15.5.0",
			"react-dropzone": "^3.10.0",
			"react-intl": "^2.2.3",
			"react-redux": "^5.0.4",
			"react-worker-dom": "^2.0.0-alpha.6",
			"redux": "^3.6.0",
			"redux-thunk": "^2.2.0"
		},
		"scripts": {
			"start": "react-scripts start",
			"build": "yarn i18n && react-scripts build",
			"test": "react-scripts test --env=jsdom",
			"eject": "react-scripts eject",
			"babel": "babel ./src -d ./dist",
			"i18n": "cd ./i18n && node build.js && cd ../",
			"pretag": "grunt bump && grunt clean:buildcss && grunt clean:themecss && yarn i18n && grunt buildcss && yarn build && rm -rf public/assets/css && grunt clean:buildjs && grunt build",
			"pretagsay": "yarn pretag && say \"Eureka Prepared for Tagging\""
		}
	};

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/*
	 * Copyright 2017, Yahoo Inc.
	 * Copyrights licensed under the New BSD License.
	 * See the accompanying LICENSE file for terms.
	 */

	'use strict';

	Object.defineProperty(exports, '__esModule', { value: true });

	function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

	var allLocaleData = _interopDefault(__webpack_require__(24));
	var IntlMessageFormat = _interopDefault(__webpack_require__(25));
	var IntlRelativeFormat = _interopDefault(__webpack_require__(35));
	var React = __webpack_require__(1);
	var React__default = _interopDefault(React);
	var invariant = _interopDefault(__webpack_require__(42));
	var memoizeIntlConstructor = _interopDefault(__webpack_require__(43));

	// GENERATED FILE
	var defaultLocaleData = { "locale": "en", "pluralRuleFunction": function pluralRuleFunction(n, ord) {
	    var s = String(n).split("."),
	        v0 = !s[1],
	        t0 = Number(s[0]) == n,
	        n10 = t0 && s[0].slice(-1),
	        n100 = t0 && s[0].slice(-2);if (ord) return n10 == 1 && n100 != 11 ? "one" : n10 == 2 && n100 != 12 ? "two" : n10 == 3 && n100 != 13 ? "few" : "other";return n == 1 && v0 ? "one" : "other";
	  }, "fields": { "year": { "displayName": "year", "relative": { "0": "this year", "1": "next year", "-1": "last year" }, "relativeTime": { "future": { "one": "in {0} year", "other": "in {0} years" }, "past": { "one": "{0} year ago", "other": "{0} years ago" } } }, "month": { "displayName": "month", "relative": { "0": "this month", "1": "next month", "-1": "last month" }, "relativeTime": { "future": { "one": "in {0} month", "other": "in {0} months" }, "past": { "one": "{0} month ago", "other": "{0} months ago" } } }, "day": { "displayName": "day", "relative": { "0": "today", "1": "tomorrow", "-1": "yesterday" }, "relativeTime": { "future": { "one": "in {0} day", "other": "in {0} days" }, "past": { "one": "{0} day ago", "other": "{0} days ago" } } }, "hour": { "displayName": "hour", "relativeTime": { "future": { "one": "in {0} hour", "other": "in {0} hours" }, "past": { "one": "{0} hour ago", "other": "{0} hours ago" } } }, "minute": { "displayName": "minute", "relativeTime": { "future": { "one": "in {0} minute", "other": "in {0} minutes" }, "past": { "one": "{0} minute ago", "other": "{0} minutes ago" } } }, "second": { "displayName": "second", "relative": { "0": "now" }, "relativeTime": { "future": { "one": "in {0} second", "other": "in {0} seconds" }, "past": { "one": "{0} second ago", "other": "{0} seconds ago" } } } } };

	/*
	 * Copyright 2015, Yahoo Inc.
	 * Copyrights licensed under the New BSD License.
	 * See the accompanying LICENSE file for terms.
	 */

	function addLocaleData() {
	    var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

	    var locales = Array.isArray(data) ? data : [data];

	    locales.forEach(function (localeData) {
	        if (localeData && localeData.locale) {
	            IntlMessageFormat.__addLocaleData(localeData);
	            IntlRelativeFormat.__addLocaleData(localeData);
	        }
	    });
	}

	function hasLocaleData(locale) {
	    var localeParts = (locale || '').split('-');

	    while (localeParts.length > 0) {
	        if (hasIMFAndIRFLocaleData(localeParts.join('-'))) {
	            return true;
	        }

	        localeParts.pop();
	    }

	    return false;
	}

	function hasIMFAndIRFLocaleData(locale) {
	    var normalizedLocale = locale && locale.toLowerCase();

	    return !!(IntlMessageFormat.__localeData__[normalizedLocale] && IntlRelativeFormat.__localeData__[normalizedLocale]);
	}

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
	  return typeof obj;
	} : function (obj) {
	  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	};











	var classCallCheck = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

	var createClass = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }

	  return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) defineProperties(Constructor, staticProps);
	    return Constructor;
	  };
	}();





	var defineProperty = function (obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	};

	var _extends = Object.assign || function (target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i];

	    for (var key in source) {
	      if (Object.prototype.hasOwnProperty.call(source, key)) {
	        target[key] = source[key];
	      }
	    }
	  }

	  return target;
	};



	var inherits = function (subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
	  }

	  subClass.prototype = Object.create(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      enumerable: false,
	      writable: true,
	      configurable: true
	    }
	  });
	  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	};









	var objectWithoutProperties = function (obj, keys) {
	  var target = {};

	  for (var i in obj) {
	    if (keys.indexOf(i) >= 0) continue;
	    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
	    target[i] = obj[i];
	  }

	  return target;
	};

	var possibleConstructorReturn = function (self, call) {
	  if (!self) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }

	  return call && (typeof call === "object" || typeof call === "function") ? call : self;
	};



















	var toConsumableArray = function (arr) {
	  if (Array.isArray(arr)) {
	    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

	    return arr2;
	  } else {
	    return Array.from(arr);
	  }
	};

	/*
	 * Copyright 2015, Yahoo Inc.
	 * Copyrights licensed under the New BSD License.
	 * See the accompanying LICENSE file for terms.
	 */

	var bool = React.PropTypes.bool;
	var number = React.PropTypes.number;
	var string = React.PropTypes.string;
	var func = React.PropTypes.func;
	var object = React.PropTypes.object;
	var oneOf = React.PropTypes.oneOf;
	var shape = React.PropTypes.shape;
	var any = React.PropTypes.any;

	var localeMatcher = oneOf(['best fit', 'lookup']);
	var narrowShortLong = oneOf(['narrow', 'short', 'long']);
	var numeric2digit = oneOf(['numeric', '2-digit']);
	var funcReq = func.isRequired;

	var intlConfigPropTypes = {
	    locale: string,
	    formats: object,
	    messages: object,
	    textComponent: any,

	    defaultLocale: string,
	    defaultFormats: object
	};

	var intlFormatPropTypes = {
	    formatDate: funcReq,
	    formatTime: funcReq,
	    formatRelative: funcReq,
	    formatNumber: funcReq,
	    formatPlural: funcReq,
	    formatMessage: funcReq,
	    formatHTMLMessage: funcReq
	};

	var intlShape = shape(_extends({}, intlConfigPropTypes, intlFormatPropTypes, {
	    formatters: object,
	    now: funcReq
	}));

	var messageDescriptorPropTypes = {
	    id: string.isRequired,
	    description: string,
	    defaultMessage: string
	};

	var dateTimeFormatPropTypes = {
	    localeMatcher: localeMatcher,
	    formatMatcher: oneOf(['basic', 'best fit']),

	    timeZone: string,
	    hour12: bool,

	    weekday: narrowShortLong,
	    era: narrowShortLong,
	    year: numeric2digit,
	    month: oneOf(['numeric', '2-digit', 'narrow', 'short', 'long']),
	    day: numeric2digit,
	    hour: numeric2digit,
	    minute: numeric2digit,
	    second: numeric2digit,
	    timeZoneName: oneOf(['short', 'long'])
	};

	var numberFormatPropTypes = {
	    localeMatcher: localeMatcher,

	    style: oneOf(['decimal', 'currency', 'percent']),
	    currency: string,
	    currencyDisplay: oneOf(['symbol', 'code', 'name']),
	    useGrouping: bool,

	    minimumIntegerDigits: number,
	    minimumFractionDigits: number,
	    maximumFractionDigits: number,
	    minimumSignificantDigits: number,
	    maximumSignificantDigits: number
	};

	var relativeFormatPropTypes = {
	    style: oneOf(['best fit', 'numeric']),
	    units: oneOf(['second', 'minute', 'hour', 'day', 'month', 'year'])
	};

	var pluralFormatPropTypes = {
	    style: oneOf(['cardinal', 'ordinal'])
	};

	/*
	HTML escaping and shallow-equals implementations are the same as React's
	(on purpose.) Therefore, it has the following Copyright and Licensing:

	Copyright 2013-2014, Facebook, Inc.
	All rights reserved.

	This source code is licensed under the BSD-style license found in the LICENSE
	file in the root directory of React's source tree.
	*/

	var intlConfigPropNames = Object.keys(intlConfigPropTypes);

	var ESCAPED_CHARS = {
	    '&': '&amp;',
	    '>': '&gt;',
	    '<': '&lt;',
	    '"': '&quot;',
	    '\'': '&#x27;'
	};

	var UNSAFE_CHARS_REGEX = /[&><"']/g;

	function escape(str) {
	    return ('' + str).replace(UNSAFE_CHARS_REGEX, function (match) {
	        return ESCAPED_CHARS[match];
	    });
	}

	function filterProps(props, whitelist) {
	    var defaults$$1 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

	    return whitelist.reduce(function (filtered, name) {
	        if (props.hasOwnProperty(name)) {
	            filtered[name] = props[name];
	        } else if (defaults$$1.hasOwnProperty(name)) {
	            filtered[name] = defaults$$1[name];
	        }

	        return filtered;
	    }, {});
	}

	function invariantIntlContext() {
	    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
	        intl = _ref.intl;

	    invariant(intl, '[React Intl] Could not find required `intl` object. ' + '<IntlProvider> needs to exist in the component ancestry.');
	}

	function shallowEquals(objA, objB) {
	    if (objA === objB) {
	        return true;
	    }

	    if ((typeof objA === 'undefined' ? 'undefined' : _typeof(objA)) !== 'object' || objA === null || (typeof objB === 'undefined' ? 'undefined' : _typeof(objB)) !== 'object' || objB === null) {
	        return false;
	    }

	    var keysA = Object.keys(objA);
	    var keysB = Object.keys(objB);

	    if (keysA.length !== keysB.length) {
	        return false;
	    }

	    // Test for A's keys different from B.
	    var bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);
	    for (var i = 0; i < keysA.length; i++) {
	        if (!bHasOwnProperty(keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
	            return false;
	        }
	    }

	    return true;
	}

	function shouldIntlComponentUpdate(_ref2, nextProps, nextState) {
	    var props = _ref2.props,
	        state = _ref2.state,
	        _ref2$context = _ref2.context,
	        context = _ref2$context === undefined ? {} : _ref2$context;
	    var nextContext = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
	    var _context$intl = context.intl,
	        intl = _context$intl === undefined ? {} : _context$intl;
	    var _nextContext$intl = nextContext.intl,
	        nextIntl = _nextContext$intl === undefined ? {} : _nextContext$intl;


	    return !shallowEquals(nextProps, props) || !shallowEquals(nextState, state) || !(nextIntl === intl || shallowEquals(filterProps(nextIntl, intlConfigPropNames), filterProps(intl, intlConfigPropNames)));
	}

	/*
	 * Copyright 2015, Yahoo Inc.
	 * Copyrights licensed under the New BSD License.
	 * See the accompanying LICENSE file for terms.
	 */

	// Inspired by react-redux's `connect()` HOC factory function implementation:
	// https://github.com/rackt/react-redux

	function getDisplayName(Component$$1) {
	    return Component$$1.displayName || Component$$1.name || 'Component';
	}

	function injectIntl(WrappedComponent) {
	    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	    var _options$intlPropName = options.intlPropName,
	        intlPropName = _options$intlPropName === undefined ? 'intl' : _options$intlPropName,
	        _options$withRef = options.withRef,
	        withRef = _options$withRef === undefined ? false : _options$withRef;

	    var InjectIntl = function (_Component) {
	        inherits(InjectIntl, _Component);

	        function InjectIntl(props, context) {
	            classCallCheck(this, InjectIntl);

	            var _this = possibleConstructorReturn(this, (InjectIntl.__proto__ || Object.getPrototypeOf(InjectIntl)).call(this, props, context));

	            invariantIntlContext(context);
	            return _this;
	        }

	        createClass(InjectIntl, [{
	            key: 'getWrappedInstance',
	            value: function getWrappedInstance() {
	                invariant(withRef, '[React Intl] To access the wrapped instance, ' + 'the `{withRef: true}` option must be set when calling: ' + '`injectIntl()`');

	                return this.refs.wrappedInstance;
	            }
	        }, {
	            key: 'render',
	            value: function render() {
	                return React__default.createElement(WrappedComponent, _extends({}, this.props, defineProperty({}, intlPropName, this.context.intl), {
	                    ref: withRef ? 'wrappedInstance' : null
	                }));
	            }
	        }]);
	        return InjectIntl;
	    }(React.Component);

	    InjectIntl.displayName = 'InjectIntl(' + getDisplayName(WrappedComponent) + ')';
	    InjectIntl.contextTypes = {
	        intl: intlShape
	    };
	    InjectIntl.WrappedComponent = WrappedComponent;


	    return InjectIntl;
	}

	/*
	 * Copyright 2015, Yahoo Inc.
	 * Copyrights licensed under the New BSD License.
	 * See the accompanying LICENSE file for terms.
	 */

	function defineMessages(messageDescriptors) {
	  // This simply returns what's passed-in because it's meant to be a hook for
	  // babel-plugin-react-intl.
	  return messageDescriptors;
	}

	/*
	 * Copyright 2015, Yahoo Inc.
	 * Copyrights licensed under the New BSD License.
	 * See the accompanying LICENSE file for terms.
	 */

	// This is a "hack" until a proper `intl-pluralformat` package is created.

	function resolveLocale(locales) {
	    // IntlMessageFormat#_resolveLocale() does not depend on `this`.
	    return IntlMessageFormat.prototype._resolveLocale(locales);
	}

	function findPluralFunction(locale) {
	    // IntlMessageFormat#_findPluralFunction() does not depend on `this`.
	    return IntlMessageFormat.prototype._findPluralRuleFunction(locale);
	}

	var IntlPluralFormat = function IntlPluralFormat(locales) {
	    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	    classCallCheck(this, IntlPluralFormat);

	    var useOrdinal = options.style === 'ordinal';
	    var pluralFn = findPluralFunction(resolveLocale(locales));

	    this.format = function (value) {
	        return pluralFn(value, useOrdinal);
	    };
	};

	/*
	 * Copyright 2015, Yahoo Inc.
	 * Copyrights licensed under the New BSD License.
	 * See the accompanying LICENSE file for terms.
	 */

	var DATE_TIME_FORMAT_OPTIONS = Object.keys(dateTimeFormatPropTypes);
	var NUMBER_FORMAT_OPTIONS = Object.keys(numberFormatPropTypes);
	var RELATIVE_FORMAT_OPTIONS = Object.keys(relativeFormatPropTypes);
	var PLURAL_FORMAT_OPTIONS = Object.keys(pluralFormatPropTypes);

	var RELATIVE_FORMAT_THRESHOLDS = {
	    second: 60, // seconds to minute
	    minute: 60, // minutes to hour
	    hour: 24, // hours to day
	    day: 30, // days to month
	    month: 12 };

	function updateRelativeFormatThresholds(newThresholds) {
	    var thresholds = IntlRelativeFormat.thresholds;
	    thresholds.second = newThresholds.second;
	    thresholds.minute = newThresholds.minute;
	    thresholds.hour = newThresholds.hour;
	    thresholds.day = newThresholds.day;
	    thresholds.month = newThresholds.month;
	}

	function getNamedFormat(formats, type, name) {
	    var format = formats && formats[type] && formats[type][name];
	    if (format) {
	        return format;
	    }

	    if (process.env.NODE_ENV !== 'production') {
	        console.error('[React Intl] No ' + type + ' format named: ' + name);
	    }
	}

	function formatDate(config, state, value) {
	    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
	    var locale = config.locale,
	        formats = config.formats;
	    var format = options.format;


	    var date = new Date(value);
	    var defaults$$1 = format && getNamedFormat(formats, 'date', format);
	    var filteredOptions = filterProps(options, DATE_TIME_FORMAT_OPTIONS, defaults$$1);

	    try {
	        return state.getDateTimeFormat(locale, filteredOptions).format(date);
	    } catch (e) {
	        if (process.env.NODE_ENV !== 'production') {
	            console.error('[React Intl] Error formatting date.\n' + e);
	        }
	    }

	    return String(date);
	}

	function formatTime(config, state, value) {
	    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
	    var locale = config.locale,
	        formats = config.formats;
	    var format = options.format;


	    var date = new Date(value);
	    var defaults$$1 = format && getNamedFormat(formats, 'time', format);
	    var filteredOptions = filterProps(options, DATE_TIME_FORMAT_OPTIONS, defaults$$1);

	    if (!filteredOptions.hour && !filteredOptions.minute && !filteredOptions.second) {
	        // Add default formatting options if hour, minute, or second isn't defined.
	        filteredOptions = _extends({}, filteredOptions, { hour: 'numeric', minute: 'numeric' });
	    }

	    try {
	        return state.getDateTimeFormat(locale, filteredOptions).format(date);
	    } catch (e) {
	        if (process.env.NODE_ENV !== 'production') {
	            console.error('[React Intl] Error formatting time.\n' + e);
	        }
	    }

	    return String(date);
	}

	function formatRelative(config, state, value) {
	    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
	    var locale = config.locale,
	        formats = config.formats;
	    var format = options.format;


	    var date = new Date(value);
	    var now = new Date(options.now);
	    var defaults$$1 = format && getNamedFormat(formats, 'relative', format);
	    var filteredOptions = filterProps(options, RELATIVE_FORMAT_OPTIONS, defaults$$1);

	    // Capture the current threshold values, then temporarily override them with
	    // specific values just for this render.
	    var oldThresholds = _extends({}, IntlRelativeFormat.thresholds);
	    updateRelativeFormatThresholds(RELATIVE_FORMAT_THRESHOLDS);

	    try {
	        return state.getRelativeFormat(locale, filteredOptions).format(date, {
	            now: isFinite(now) ? now : state.now()
	        });
	    } catch (e) {
	        if (process.env.NODE_ENV !== 'production') {
	            console.error('[React Intl] Error formatting relative time.\n' + e);
	        }
	    } finally {
	        updateRelativeFormatThresholds(oldThresholds);
	    }

	    return String(date);
	}

	function formatNumber(config, state, value) {
	    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
	    var locale = config.locale,
	        formats = config.formats;
	    var format = options.format;


	    var defaults$$1 = format && getNamedFormat(formats, 'number', format);
	    var filteredOptions = filterProps(options, NUMBER_FORMAT_OPTIONS, defaults$$1);

	    try {
	        return state.getNumberFormat(locale, filteredOptions).format(value);
	    } catch (e) {
	        if (process.env.NODE_ENV !== 'production') {
	            console.error('[React Intl] Error formatting number.\n' + e);
	        }
	    }

	    return String(value);
	}

	function formatPlural(config, state, value) {
	    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
	    var locale = config.locale;


	    var filteredOptions = filterProps(options, PLURAL_FORMAT_OPTIONS);

	    try {
	        return state.getPluralFormat(locale, filteredOptions).format(value);
	    } catch (e) {
	        if (process.env.NODE_ENV !== 'production') {
	            console.error('[React Intl] Error formatting plural.\n' + e);
	        }
	    }

	    return 'other';
	}

	function formatMessage(config, state) {
	    var messageDescriptor = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
	    var values = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
	    var locale = config.locale,
	        formats = config.formats,
	        messages = config.messages,
	        defaultLocale = config.defaultLocale,
	        defaultFormats = config.defaultFormats;
	    var id = messageDescriptor.id,
	        defaultMessage = messageDescriptor.defaultMessage;

	    // `id` is a required field of a Message Descriptor.

	    invariant(id, '[React Intl] An `id` must be provided to format a message.');

	    var message = messages && messages[id];
	    var hasValues = Object.keys(values).length > 0;

	    // Avoid expensive message formatting for simple messages without values. In
	    // development messages will always be formatted in case of missing values.
	    if (!hasValues && process.env.NODE_ENV === 'production') {
	        return message || defaultMessage || id;
	    }

	    var formattedMessage = void 0;

	    if (message) {
	        try {
	            var formatter = state.getMessageFormat(message, locale, formats);

	            formattedMessage = formatter.format(values);
	        } catch (e) {
	            if (process.env.NODE_ENV !== 'production') {
	                console.error('[React Intl] Error formatting message: "' + id + '" for locale: "' + locale + '"' + (defaultMessage ? ', using default message as fallback.' : '') + ('\n' + e));
	            }
	        }
	    } else {
	        if (process.env.NODE_ENV !== 'production') {
	            // This prevents warnings from littering the console in development
	            // when no `messages` are passed into the <IntlProvider> for the
	            // default locale, and a default message is in the source.
	            if (!defaultMessage || locale && locale.toLowerCase() !== defaultLocale.toLowerCase()) {

	                console.error('[React Intl] Missing message: "' + id + '" for locale: "' + locale + '"' + (defaultMessage ? ', using default message as fallback.' : ''));
	            }
	        }
	    }

	    if (!formattedMessage && defaultMessage) {
	        try {
	            var _formatter = state.getMessageFormat(defaultMessage, defaultLocale, defaultFormats);

	            formattedMessage = _formatter.format(values);
	        } catch (e) {
	            if (process.env.NODE_ENV !== 'production') {
	                console.error('[React Intl] Error formatting the default message for: "' + id + '"' + ('\n' + e));
	            }
	        }
	    }

	    if (!formattedMessage) {
	        if (process.env.NODE_ENV !== 'production') {
	            console.error('[React Intl] Cannot format message: "' + id + '", ' + ('using message ' + (message || defaultMessage ? 'source' : 'id') + ' as fallback.'));
	        }
	    }

	    return formattedMessage || message || defaultMessage || id;
	}

	function formatHTMLMessage(config, state, messageDescriptor) {
	    var rawValues = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

	    // Process all the values before they are used when formatting the ICU
	    // Message string. Since the formatted message might be injected via
	    // `innerHTML`, all String-based values need to be HTML-escaped.
	    var escapedValues = Object.keys(rawValues).reduce(function (escaped, name) {
	        var value = rawValues[name];
	        escaped[name] = typeof value === 'string' ? escape(value) : value;
	        return escaped;
	    }, {});

	    return formatMessage(config, state, messageDescriptor, escapedValues);
	}



	var format = Object.freeze({
		formatDate: formatDate,
		formatTime: formatTime,
		formatRelative: formatRelative,
		formatNumber: formatNumber,
		formatPlural: formatPlural,
		formatMessage: formatMessage,
		formatHTMLMessage: formatHTMLMessage
	});

	/*
	 * Copyright 2015, Yahoo Inc.
	 * Copyrights licensed under the New BSD License.
	 * See the accompanying LICENSE file for terms.
	 */

	var intlConfigPropNames$1 = Object.keys(intlConfigPropTypes);
	var intlFormatPropNames = Object.keys(intlFormatPropTypes);

	// These are not a static property on the `IntlProvider` class so the intl
	// config values can be inherited from an <IntlProvider> ancestor.
	var defaultProps = {
	    formats: {},
	    messages: {},
	    textComponent: 'span',

	    defaultLocale: 'en',
	    defaultFormats: {}
	};

	var IntlProvider = function (_Component) {
	    inherits(IntlProvider, _Component);

	    function IntlProvider(props) {
	        var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	        classCallCheck(this, IntlProvider);

	        var _this = possibleConstructorReturn(this, (IntlProvider.__proto__ || Object.getPrototypeOf(IntlProvider)).call(this, props, context));

	        invariant(typeof Intl !== 'undefined', '[React Intl] The `Intl` APIs must be available in the runtime, ' + 'and do not appear to be built-in. An `Intl` polyfill should be loaded.\n' + 'See: http://formatjs.io/guides/runtime-environments/');

	        var intlContext = context.intl;

	        // Used to stabilize time when performing an initial rendering so that
	        // all relative times use the same reference "now" time.

	        var initialNow = void 0;
	        if (isFinite(props.initialNow)) {
	            initialNow = Number(props.initialNow);
	        } else {
	            // When an `initialNow` isn't provided via `props`, look to see an
	            // <IntlProvider> exists in the ancestry and call its `now()`
	            // function to propagate its value for "now".
	            initialNow = intlContext ? intlContext.now() : Date.now();
	        }

	        // Creating `Intl*` formatters is expensive. If there's a parent
	        // `<IntlProvider>`, then its formatters will be used. Otherwise, this
	        // memoize the `Intl*` constructors and cache them for the lifecycle of
	        // this IntlProvider instance.

	        var _ref = intlContext || {},
	            _ref$formatters = _ref.formatters,
	            formatters = _ref$formatters === undefined ? {
	            getDateTimeFormat: memoizeIntlConstructor(Intl.DateTimeFormat),
	            getNumberFormat: memoizeIntlConstructor(Intl.NumberFormat),
	            getMessageFormat: memoizeIntlConstructor(IntlMessageFormat),
	            getRelativeFormat: memoizeIntlConstructor(IntlRelativeFormat),
	            getPluralFormat: memoizeIntlConstructor(IntlPluralFormat)
	        } : _ref$formatters;

	        _this.state = _extends({}, formatters, {

	            // Wrapper to provide stable "now" time for initial render.
	            now: function now() {
	                return _this._didDisplay ? Date.now() : initialNow;
	            }
	        });
	        return _this;
	    }

	    createClass(IntlProvider, [{
	        key: 'getConfig',
	        value: function getConfig() {
	            var intlContext = this.context.intl;

	            // Build a whitelisted config object from `props`, defaults, and
	            // `context.intl`, if an <IntlProvider> exists in the ancestry.

	            var config = filterProps(this.props, intlConfigPropNames$1, intlContext);

	            // Apply default props. This must be applied last after the props have
	            // been resolved and inherited from any <IntlProvider> in the ancestry.
	            // This matches how React resolves `defaultProps`.
	            for (var propName in defaultProps) {
	                if (config[propName] === undefined) {
	                    config[propName] = defaultProps[propName];
	                }
	            }

	            if (!hasLocaleData(config.locale)) {
	                var _config = config,
	                    locale = _config.locale,
	                    defaultLocale = _config.defaultLocale,
	                    defaultFormats = _config.defaultFormats;


	                if (process.env.NODE_ENV !== 'production') {
	                    console.error('[React Intl] Missing locale data for locale: "' + locale + '". ' + ('Using default locale: "' + defaultLocale + '" as fallback.'));
	                }

	                // Since there's no registered locale data for `locale`, this will
	                // fallback to the `defaultLocale` to make sure things can render.
	                // The `messages` are overridden to the `defaultProps` empty object
	                // to maintain referential equality across re-renders. It's assumed
	                // each <FormattedMessage> contains a `defaultMessage` prop.
	                config = _extends({}, config, {
	                    locale: defaultLocale,
	                    formats: defaultFormats,
	                    messages: defaultProps.messages
	                });
	            }

	            return config;
	        }
	    }, {
	        key: 'getBoundFormatFns',
	        value: function getBoundFormatFns(config, state) {
	            return intlFormatPropNames.reduce(function (boundFormatFns, name) {
	                boundFormatFns[name] = format[name].bind(null, config, state);
	                return boundFormatFns;
	            }, {});
	        }
	    }, {
	        key: 'getChildContext',
	        value: function getChildContext() {
	            var config = this.getConfig();

	            // Bind intl factories and current config to the format functions.
	            var boundFormatFns = this.getBoundFormatFns(config, this.state);

	            var _state = this.state,
	                now = _state.now,
	                formatters = objectWithoutProperties(_state, ['now']);


	            return {
	                intl: _extends({}, config, boundFormatFns, {
	                    formatters: formatters,
	                    now: now
	                })
	            };
	        }
	    }, {
	        key: 'shouldComponentUpdate',
	        value: function shouldComponentUpdate() {
	            for (var _len = arguments.length, next = Array(_len), _key = 0; _key < _len; _key++) {
	                next[_key] = arguments[_key];
	            }

	            return shouldIntlComponentUpdate.apply(undefined, [this].concat(next));
	        }
	    }, {
	        key: 'componentDidMount',
	        value: function componentDidMount() {
	            this._didDisplay = true;
	        }
	    }, {
	        key: 'render',
	        value: function render() {
	            return React.Children.only(this.props.children);
	        }
	    }]);
	    return IntlProvider;
	}(React.Component);

	IntlProvider.displayName = 'IntlProvider';
	IntlProvider.contextTypes = {
	    intl: intlShape
	};
	IntlProvider.childContextTypes = {
	    intl: intlShape.isRequired
	};
	process.env.NODE_ENV !== "production" ? IntlProvider.propTypes = _extends({}, intlConfigPropTypes, {
	    children: React.PropTypes.element.isRequired,
	    initialNow: React.PropTypes.any
	}) : void 0;

	/*
	 * Copyright 2015, Yahoo Inc.
	 * Copyrights licensed under the New BSD License.
	 * See the accompanying LICENSE file for terms.
	 */

	var FormattedDate = function (_Component) {
	    inherits(FormattedDate, _Component);

	    function FormattedDate(props, context) {
	        classCallCheck(this, FormattedDate);

	        var _this = possibleConstructorReturn(this, (FormattedDate.__proto__ || Object.getPrototypeOf(FormattedDate)).call(this, props, context));

	        invariantIntlContext(context);
	        return _this;
	    }

	    createClass(FormattedDate, [{
	        key: 'shouldComponentUpdate',
	        value: function shouldComponentUpdate() {
	            for (var _len = arguments.length, next = Array(_len), _key = 0; _key < _len; _key++) {
	                next[_key] = arguments[_key];
	            }

	            return shouldIntlComponentUpdate.apply(undefined, [this].concat(next));
	        }
	    }, {
	        key: 'render',
	        value: function render() {
	            var _context$intl = this.context.intl,
	                formatDate = _context$intl.formatDate,
	                Text = _context$intl.textComponent;
	            var _props = this.props,
	                value = _props.value,
	                children = _props.children;


	            var formattedDate = formatDate(value, this.props);

	            if (typeof children === 'function') {
	                return children(formattedDate);
	            }

	            return React__default.createElement(
	                Text,
	                null,
	                formattedDate
	            );
	        }
	    }]);
	    return FormattedDate;
	}(React.Component);

	FormattedDate.displayName = 'FormattedDate';
	FormattedDate.contextTypes = {
	    intl: intlShape
	};
	process.env.NODE_ENV !== "production" ? FormattedDate.propTypes = _extends({}, dateTimeFormatPropTypes, {
	    value: React.PropTypes.any.isRequired,
	    format: React.PropTypes.string,
	    children: React.PropTypes.func
	}) : void 0;

	/*
	 * Copyright 2015, Yahoo Inc.
	 * Copyrights licensed under the New BSD License.
	 * See the accompanying LICENSE file for terms.
	 */

	var FormattedTime = function (_Component) {
	    inherits(FormattedTime, _Component);

	    function FormattedTime(props, context) {
	        classCallCheck(this, FormattedTime);

	        var _this = possibleConstructorReturn(this, (FormattedTime.__proto__ || Object.getPrototypeOf(FormattedTime)).call(this, props, context));

	        invariantIntlContext(context);
	        return _this;
	    }

	    createClass(FormattedTime, [{
	        key: 'shouldComponentUpdate',
	        value: function shouldComponentUpdate() {
	            for (var _len = arguments.length, next = Array(_len), _key = 0; _key < _len; _key++) {
	                next[_key] = arguments[_key];
	            }

	            return shouldIntlComponentUpdate.apply(undefined, [this].concat(next));
	        }
	    }, {
	        key: 'render',
	        value: function render() {
	            var _context$intl = this.context.intl,
	                formatTime = _context$intl.formatTime,
	                Text = _context$intl.textComponent;
	            var _props = this.props,
	                value = _props.value,
	                children = _props.children;


	            var formattedTime = formatTime(value, this.props);

	            if (typeof children === 'function') {
	                return children(formattedTime);
	            }

	            return React__default.createElement(
	                Text,
	                null,
	                formattedTime
	            );
	        }
	    }]);
	    return FormattedTime;
	}(React.Component);

	FormattedTime.displayName = 'FormattedTime';
	FormattedTime.contextTypes = {
	    intl: intlShape
	};
	process.env.NODE_ENV !== "production" ? FormattedTime.propTypes = _extends({}, dateTimeFormatPropTypes, {
	    value: React.PropTypes.any.isRequired,
	    format: React.PropTypes.string,
	    children: React.PropTypes.func
	}) : void 0;

	/*
	 * Copyright 2015, Yahoo Inc.
	 * Copyrights licensed under the New BSD License.
	 * See the accompanying LICENSE file for terms.
	 */

	var SECOND = 1000;
	var MINUTE = 1000 * 60;
	var HOUR = 1000 * 60 * 60;
	var DAY = 1000 * 60 * 60 * 24;

	// The maximum timer delay value is a 32-bit signed integer.
	// See: https://mdn.io/setTimeout
	var MAX_TIMER_DELAY = 2147483647;

	function selectUnits(delta) {
	    var absDelta = Math.abs(delta);

	    if (absDelta < MINUTE) {
	        return 'second';
	    }

	    if (absDelta < HOUR) {
	        return 'minute';
	    }

	    if (absDelta < DAY) {
	        return 'hour';
	    }

	    // The maximum scheduled delay will be measured in days since the maximum
	    // timer delay is less than the number of milliseconds in 25 days.
	    return 'day';
	}

	function getUnitDelay(units) {
	    switch (units) {
	        case 'second':
	            return SECOND;
	        case 'minute':
	            return MINUTE;
	        case 'hour':
	            return HOUR;
	        case 'day':
	            return DAY;
	        default:
	            return MAX_TIMER_DELAY;
	    }
	}

	function isSameDate(a, b) {
	    if (a === b) {
	        return true;
	    }

	    var aTime = new Date(a).getTime();
	    var bTime = new Date(b).getTime();

	    return isFinite(aTime) && isFinite(bTime) && aTime === bTime;
	}

	var FormattedRelative = function (_Component) {
	    inherits(FormattedRelative, _Component);

	    function FormattedRelative(props, context) {
	        classCallCheck(this, FormattedRelative);

	        var _this = possibleConstructorReturn(this, (FormattedRelative.__proto__ || Object.getPrototypeOf(FormattedRelative)).call(this, props, context));

	        invariantIntlContext(context);

	        var now = isFinite(props.initialNow) ? Number(props.initialNow) : context.intl.now();

	        // `now` is stored as state so that `render()` remains a function of
	        // props + state, instead of accessing `Date.now()` inside `render()`.
	        _this.state = { now: now };
	        return _this;
	    }

	    createClass(FormattedRelative, [{
	        key: 'scheduleNextUpdate',
	        value: function scheduleNextUpdate(props, state) {
	            var _this2 = this;

	            var updateInterval = props.updateInterval;

	            // If the `updateInterval` is falsy, including `0`, then auto updates
	            // have been turned off, so we bail and skip scheduling an update.

	            if (!updateInterval) {
	                return;
	            }

	            var time = new Date(props.value).getTime();
	            var delta = time - state.now;
	            var units = props.units || selectUnits(delta);

	            var unitDelay = getUnitDelay(units);
	            var unitRemainder = Math.abs(delta % unitDelay);

	            // We want the largest possible timer delay which will still display
	            // accurate information while reducing unnecessary re-renders. The delay
	            // should be until the next "interesting" moment, like a tick from
	            // "1 minute ago" to "2 minutes ago" when the delta is 120,000ms.
	            var delay = delta < 0 ? Math.max(updateInterval, unitDelay - unitRemainder) : Math.max(updateInterval, unitRemainder);

	            clearTimeout(this._timer);

	            this._timer = setTimeout(function () {
	                _this2.setState({ now: _this2.context.intl.now() });
	            }, delay);
	        }
	    }, {
	        key: 'componentDidMount',
	        value: function componentDidMount() {
	            this.scheduleNextUpdate(this.props, this.state);
	        }
	    }, {
	        key: 'componentWillReceiveProps',
	        value: function componentWillReceiveProps(_ref) {
	            var nextValue = _ref.value;

	            // When the `props.value` date changes, `state.now` needs to be updated,
	            // and the next update can be rescheduled.
	            if (!isSameDate(nextValue, this.props.value)) {
	                this.setState({ now: this.context.intl.now() });
	            }
	        }
	    }, {
	        key: 'shouldComponentUpdate',
	        value: function shouldComponentUpdate() {
	            for (var _len = arguments.length, next = Array(_len), _key = 0; _key < _len; _key++) {
	                next[_key] = arguments[_key];
	            }

	            return shouldIntlComponentUpdate.apply(undefined, [this].concat(next));
	        }
	    }, {
	        key: 'componentWillUpdate',
	        value: function componentWillUpdate(nextProps, nextState) {
	            this.scheduleNextUpdate(nextProps, nextState);
	        }
	    }, {
	        key: 'componentWillUnmount',
	        value: function componentWillUnmount() {
	            clearTimeout(this._timer);
	        }
	    }, {
	        key: 'render',
	        value: function render() {
	            var _context$intl = this.context.intl,
	                formatRelative = _context$intl.formatRelative,
	                Text = _context$intl.textComponent;
	            var _props = this.props,
	                value = _props.value,
	                children = _props.children;


	            var formattedRelative = formatRelative(value, _extends({}, this.props, this.state));

	            if (typeof children === 'function') {
	                return children(formattedRelative);
	            }

	            return React__default.createElement(
	                Text,
	                null,
	                formattedRelative
	            );
	        }
	    }]);
	    return FormattedRelative;
	}(React.Component);

	FormattedRelative.displayName = 'FormattedRelative';
	FormattedRelative.contextTypes = {
	    intl: intlShape
	};
	FormattedRelative.defaultProps = {
	    updateInterval: 1000 * 10
	};
	process.env.NODE_ENV !== "production" ? FormattedRelative.propTypes = _extends({}, relativeFormatPropTypes, {
	    value: React.PropTypes.any.isRequired,
	    format: React.PropTypes.string,
	    updateInterval: React.PropTypes.number,
	    initialNow: React.PropTypes.any,
	    children: React.PropTypes.func
	}) : void 0;

	/*
	 * Copyright 2015, Yahoo Inc.
	 * Copyrights licensed under the New BSD License.
	 * See the accompanying LICENSE file for terms.
	 */

	var FormattedNumber = function (_Component) {
	    inherits(FormattedNumber, _Component);

	    function FormattedNumber(props, context) {
	        classCallCheck(this, FormattedNumber);

	        var _this = possibleConstructorReturn(this, (FormattedNumber.__proto__ || Object.getPrototypeOf(FormattedNumber)).call(this, props, context));

	        invariantIntlContext(context);
	        return _this;
	    }

	    createClass(FormattedNumber, [{
	        key: 'shouldComponentUpdate',
	        value: function shouldComponentUpdate() {
	            for (var _len = arguments.length, next = Array(_len), _key = 0; _key < _len; _key++) {
	                next[_key] = arguments[_key];
	            }

	            return shouldIntlComponentUpdate.apply(undefined, [this].concat(next));
	        }
	    }, {
	        key: 'render',
	        value: function render() {
	            var _context$intl = this.context.intl,
	                formatNumber = _context$intl.formatNumber,
	                Text = _context$intl.textComponent;
	            var _props = this.props,
	                value = _props.value,
	                children = _props.children;


	            var formattedNumber = formatNumber(value, this.props);

	            if (typeof children === 'function') {
	                return children(formattedNumber);
	            }

	            return React__default.createElement(
	                Text,
	                null,
	                formattedNumber
	            );
	        }
	    }]);
	    return FormattedNumber;
	}(React.Component);

	FormattedNumber.displayName = 'FormattedNumber';
	FormattedNumber.contextTypes = {
	    intl: intlShape
	};
	process.env.NODE_ENV !== "production" ? FormattedNumber.propTypes = _extends({}, numberFormatPropTypes, {
	    value: React.PropTypes.any.isRequired,
	    format: React.PropTypes.string,
	    children: React.PropTypes.func
	}) : void 0;

	/*
	 * Copyright 2015, Yahoo Inc.
	 * Copyrights licensed under the New BSD License.
	 * See the accompanying LICENSE file for terms.
	 */

	var FormattedPlural = function (_Component) {
	    inherits(FormattedPlural, _Component);

	    function FormattedPlural(props, context) {
	        classCallCheck(this, FormattedPlural);

	        var _this = possibleConstructorReturn(this, (FormattedPlural.__proto__ || Object.getPrototypeOf(FormattedPlural)).call(this, props, context));

	        invariantIntlContext(context);
	        return _this;
	    }

	    createClass(FormattedPlural, [{
	        key: 'shouldComponentUpdate',
	        value: function shouldComponentUpdate() {
	            for (var _len = arguments.length, next = Array(_len), _key = 0; _key < _len; _key++) {
	                next[_key] = arguments[_key];
	            }

	            return shouldIntlComponentUpdate.apply(undefined, [this].concat(next));
	        }
	    }, {
	        key: 'render',
	        value: function render() {
	            var _context$intl = this.context.intl,
	                formatPlural = _context$intl.formatPlural,
	                Text = _context$intl.textComponent;
	            var _props = this.props,
	                value = _props.value,
	                other = _props.other,
	                children = _props.children;


	            var pluralCategory = formatPlural(value, this.props);
	            var formattedPlural = this.props[pluralCategory] || other;

	            if (typeof children === 'function') {
	                return children(formattedPlural);
	            }

	            return React__default.createElement(
	                Text,
	                null,
	                formattedPlural
	            );
	        }
	    }]);
	    return FormattedPlural;
	}(React.Component);

	FormattedPlural.displayName = 'FormattedPlural';
	FormattedPlural.contextTypes = {
	    intl: intlShape
	};
	FormattedPlural.defaultProps = {
	    style: 'cardinal'
	};
	process.env.NODE_ENV !== "production" ? FormattedPlural.propTypes = _extends({}, pluralFormatPropTypes, {
	    value: React.PropTypes.any.isRequired,

	    other: React.PropTypes.node.isRequired,
	    zero: React.PropTypes.node,
	    one: React.PropTypes.node,
	    two: React.PropTypes.node,
	    few: React.PropTypes.node,
	    many: React.PropTypes.node,

	    children: React.PropTypes.func
	}) : void 0;

	/*
	 * Copyright 2015, Yahoo Inc.
	 * Copyrights licensed under the New BSD License.
	 * See the accompanying LICENSE file for terms.
	 */

	var FormattedMessage = function (_Component) {
	    inherits(FormattedMessage, _Component);

	    function FormattedMessage(props, context) {
	        classCallCheck(this, FormattedMessage);

	        var _this = possibleConstructorReturn(this, (FormattedMessage.__proto__ || Object.getPrototypeOf(FormattedMessage)).call(this, props, context));

	        invariantIntlContext(context);
	        return _this;
	    }

	    createClass(FormattedMessage, [{
	        key: 'shouldComponentUpdate',
	        value: function shouldComponentUpdate(nextProps) {
	            var values = this.props.values;
	            var nextValues = nextProps.values;


	            if (!shallowEquals(nextValues, values)) {
	                return true;
	            }

	            // Since `values` has already been checked, we know they're not
	            // different, so the current `values` are carried over so the shallow
	            // equals comparison on the other props isn't affected by the `values`.
	            var nextPropsToCheck = _extends({}, nextProps, {
	                values: values
	            });

	            for (var _len = arguments.length, next = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	                next[_key - 1] = arguments[_key];
	            }

	            return shouldIntlComponentUpdate.apply(undefined, [this, nextPropsToCheck].concat(next));
	        }
	    }, {
	        key: 'render',
	        value: function render() {
	            var _context$intl = this.context.intl,
	                formatMessage = _context$intl.formatMessage,
	                Text = _context$intl.textComponent;
	            var _props = this.props,
	                id = _props.id,
	                description = _props.description,
	                defaultMessage = _props.defaultMessage,
	                values = _props.values,
	                _props$tagName = _props.tagName,
	                Component$$1 = _props$tagName === undefined ? Text : _props$tagName,
	                children = _props.children;


	            var tokenDelimiter = void 0;
	            var tokenizedValues = void 0;
	            var elements = void 0;

	            var hasValues = values && Object.keys(values).length > 0;
	            if (hasValues) {
	                (function () {
	                    // Creates a token with a random UID that should not be guessable or
	                    // conflict with other parts of the `message` string.
	                    var uid = Math.floor(Math.random() * 0x10000000000).toString(16);

	                    var generateToken = function () {
	                        var counter = 0;
	                        return function () {
	                            return 'ELEMENT-' + uid + '-' + (counter += 1);
	                        };
	                    }();

	                    // Splitting with a delimiter to support IE8. When using a regex
	                    // with a capture group IE8 does not include the capture group in
	                    // the resulting array.
	                    tokenDelimiter = '@__' + uid + '__@';
	                    tokenizedValues = {};
	                    elements = {};

	                    // Iterates over the `props` to keep track of any React Element
	                    // values so they can be represented by the `token` as a placeholder
	                    // when the `message` is formatted. This allows the formatted
	                    // message to then be broken-up into parts with references to the
	                    // React Elements inserted back in.
	                    Object.keys(values).forEach(function (name) {
	                        var value = values[name];

	                        if (React.isValidElement(value)) {
	                            var token = generateToken();
	                            tokenizedValues[name] = tokenDelimiter + token + tokenDelimiter;
	                            elements[token] = value;
	                        } else {
	                            tokenizedValues[name] = value;
	                        }
	                    });
	                })();
	            }

	            var descriptor = { id: id, description: description, defaultMessage: defaultMessage };
	            var formattedMessage = formatMessage(descriptor, tokenizedValues || values);

	            var nodes = void 0;

	            var hasElements = elements && Object.keys(elements).length > 0;
	            if (hasElements) {
	                // Split the message into parts so the React Element values captured
	                // above can be inserted back into the rendered message. This
	                // approach allows messages to render with React Elements while
	                // keeping React's virtual diffing working properly.
	                nodes = formattedMessage.split(tokenDelimiter).filter(function (part) {
	                    return !!part;
	                }).map(function (part) {
	                    return elements[part] || part;
	                });
	            } else {
	                nodes = [formattedMessage];
	            }

	            if (typeof children === 'function') {
	                return children.apply(undefined, toConsumableArray(nodes));
	            }

	            // Needs to use `createElement()` instead of JSX, otherwise React will
	            // warn about a missing `key` prop with rich-text message formatting.
	            return React.createElement.apply(undefined, [Component$$1, null].concat(toConsumableArray(nodes)));
	        }
	    }]);
	    return FormattedMessage;
	}(React.Component);

	FormattedMessage.displayName = 'FormattedMessage';
	FormattedMessage.contextTypes = {
	    intl: intlShape
	};
	FormattedMessage.defaultProps = {
	    values: {}
	};
	process.env.NODE_ENV !== "production" ? FormattedMessage.propTypes = _extends({}, messageDescriptorPropTypes, {
	    values: React.PropTypes.object,
	    tagName: React.PropTypes.string,
	    children: React.PropTypes.func
	}) : void 0;

	/*
	 * Copyright 2015, Yahoo Inc.
	 * Copyrights licensed under the New BSD License.
	 * See the accompanying LICENSE file for terms.
	 */

	var FormattedHTMLMessage = function (_Component) {
	    inherits(FormattedHTMLMessage, _Component);

	    function FormattedHTMLMessage(props, context) {
	        classCallCheck(this, FormattedHTMLMessage);

	        var _this = possibleConstructorReturn(this, (FormattedHTMLMessage.__proto__ || Object.getPrototypeOf(FormattedHTMLMessage)).call(this, props, context));

	        invariantIntlContext(context);
	        return _this;
	    }

	    createClass(FormattedHTMLMessage, [{
	        key: 'shouldComponentUpdate',
	        value: function shouldComponentUpdate(nextProps) {
	            var values = this.props.values;
	            var nextValues = nextProps.values;


	            if (!shallowEquals(nextValues, values)) {
	                return true;
	            }

	            // Since `values` has already been checked, we know they're not
	            // different, so the current `values` are carried over so the shallow
	            // equals comparison on the other props isn't affected by the `values`.
	            var nextPropsToCheck = _extends({}, nextProps, {
	                values: values
	            });

	            for (var _len = arguments.length, next = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	                next[_key - 1] = arguments[_key];
	            }

	            return shouldIntlComponentUpdate.apply(undefined, [this, nextPropsToCheck].concat(next));
	        }
	    }, {
	        key: 'render',
	        value: function render() {
	            var _context$intl = this.context.intl,
	                formatHTMLMessage = _context$intl.formatHTMLMessage,
	                Text = _context$intl.textComponent;
	            var _props = this.props,
	                id = _props.id,
	                description = _props.description,
	                defaultMessage = _props.defaultMessage,
	                rawValues = _props.values,
	                _props$tagName = _props.tagName,
	                Component$$1 = _props$tagName === undefined ? Text : _props$tagName,
	                children = _props.children;


	            var descriptor = { id: id, description: description, defaultMessage: defaultMessage };
	            var formattedHTMLMessage = formatHTMLMessage(descriptor, rawValues);

	            if (typeof children === 'function') {
	                return children(formattedHTMLMessage);
	            }

	            // Since the message presumably has HTML in it, we need to set
	            // `innerHTML` in order for it to be rendered and not escaped by React.
	            // To be safe, all string prop values were escaped when formatting the
	            // message. It is assumed that the message is not UGC, and came from the
	            // developer making it more like a template.
	            //
	            // Note: There's a perf impact of using this component since there's no
	            // way for React to do its virtual DOM diffing.
	            var html = { __html: formattedHTMLMessage };
	            return React__default.createElement(Component$$1, { dangerouslySetInnerHTML: html });
	        }
	    }]);
	    return FormattedHTMLMessage;
	}(React.Component);

	FormattedHTMLMessage.displayName = 'FormattedHTMLMessage';
	FormattedHTMLMessage.contextTypes = {
	    intl: intlShape
	};
	FormattedHTMLMessage.defaultProps = {
	    values: {}
	};
	process.env.NODE_ENV !== "production" ? FormattedHTMLMessage.propTypes = _extends({}, messageDescriptorPropTypes, {
	    values: React.PropTypes.object,
	    tagName: React.PropTypes.string,
	    children: React.PropTypes.func
	}) : void 0;

	/*
	 * Copyright 2015, Yahoo Inc.
	 * Copyrights licensed under the New BSD License.
	 * See the accompanying LICENSE file for terms.
	 */

	addLocaleData(defaultLocaleData);

	/*
	 * Copyright 2015, Yahoo Inc.
	 * Copyrights licensed under the New BSD License.
	 * See the accompanying LICENSE file for terms.
	 */

	addLocaleData(allLocaleData);

	exports.addLocaleData = addLocaleData;
	exports.intlShape = intlShape;
	exports.injectIntl = injectIntl;
	exports.defineMessages = defineMessages;
	exports.IntlProvider = IntlProvider;
	exports.FormattedDate = FormattedDate;
	exports.FormattedTime = FormattedTime;
	exports.FormattedRelative = FormattedRelative;
	exports.FormattedNumber = FormattedNumber;
	exports.FormattedPlural = FormattedPlural;
	exports.FormattedMessage = FormattedMessage;
	exports.FormattedHTMLMessage = FormattedHTMLMessage;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ },
/* 24 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	/* jshint node:true */

	'use strict';

	var IntlMessageFormat = __webpack_require__(26)['default'];

	// Add all locale data to `IntlMessageFormat`. This module will be ignored when
	// bundling for the browser with Browserify/Webpack.
	__webpack_require__(34);

	// Re-export `IntlMessageFormat` as the CommonJS default exports with all the
	// locale data registered, and with English set as the default locale. Define
	// the `default` prop for use with other compiled ES6 Modules.
	exports = module.exports = IntlMessageFormat;
	exports['default'] = exports;


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	/* jslint esnext: true */

	"use strict";
	var src$core$$ = __webpack_require__(27), src$en$$ = __webpack_require__(33);

	src$core$$["default"].__addLocaleData(src$en$$["default"]);
	src$core$$["default"].defaultLocale = 'en';

	exports["default"] = src$core$$["default"];

	//# sourceMappingURL=main.js.map

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	/*
	Copyright (c) 2014, Yahoo! Inc. All rights reserved.
	Copyrights licensed under the New BSD License.
	See the accompanying LICENSE file for terms.
	*/

	/* jslint esnext: true */

	"use strict";
	var src$utils$$ = __webpack_require__(28), src$es5$$ = __webpack_require__(29), src$compiler$$ = __webpack_require__(30), intl$messageformat$parser$$ = __webpack_require__(31);
	exports["default"] = MessageFormat;

	// -- MessageFormat --------------------------------------------------------

	function MessageFormat(message, locales, formats) {
	    // Parse string messages into an AST.
	    var ast = typeof message === 'string' ?
	            MessageFormat.__parse(message) : message;

	    if (!(ast && ast.type === 'messageFormatPattern')) {
	        throw new TypeError('A message must be provided as a String or AST.');
	    }

	    // Creates a new object with the specified `formats` merged with the default
	    // formats.
	    formats = this._mergeFormats(MessageFormat.formats, formats);

	    // Defined first because it's used to build the format pattern.
	    src$es5$$.defineProperty(this, '_locale',  {value: this._resolveLocale(locales)});

	    // Compile the `ast` to a pattern that is highly optimized for repeated
	    // `format()` invocations. **Note:** This passes the `locales` set provided
	    // to the constructor instead of just the resolved locale.
	    var pluralFn = this._findPluralRuleFunction(this._locale);
	    var pattern  = this._compilePattern(ast, locales, formats, pluralFn);

	    // "Bind" `format()` method to `this` so it can be passed by reference like
	    // the other `Intl` APIs.
	    var messageFormat = this;
	    this.format = function (values) {
	        return messageFormat._format(pattern, values);
	    };
	}

	// Default format options used as the prototype of the `formats` provided to the
	// constructor. These are used when constructing the internal Intl.NumberFormat
	// and Intl.DateTimeFormat instances.
	src$es5$$.defineProperty(MessageFormat, 'formats', {
	    enumerable: true,

	    value: {
	        number: {
	            'currency': {
	                style: 'currency'
	            },

	            'percent': {
	                style: 'percent'
	            }
	        },

	        date: {
	            'short': {
	                month: 'numeric',
	                day  : 'numeric',
	                year : '2-digit'
	            },

	            'medium': {
	                month: 'short',
	                day  : 'numeric',
	                year : 'numeric'
	            },

	            'long': {
	                month: 'long',
	                day  : 'numeric',
	                year : 'numeric'
	            },

	            'full': {
	                weekday: 'long',
	                month  : 'long',
	                day    : 'numeric',
	                year   : 'numeric'
	            }
	        },

	        time: {
	            'short': {
	                hour  : 'numeric',
	                minute: 'numeric'
	            },

	            'medium':  {
	                hour  : 'numeric',
	                minute: 'numeric',
	                second: 'numeric'
	            },

	            'long': {
	                hour        : 'numeric',
	                minute      : 'numeric',
	                second      : 'numeric',
	                timeZoneName: 'short'
	            },

	            'full': {
	                hour        : 'numeric',
	                minute      : 'numeric',
	                second      : 'numeric',
	                timeZoneName: 'short'
	            }
	        }
	    }
	});

	// Define internal private properties for dealing with locale data.
	src$es5$$.defineProperty(MessageFormat, '__localeData__', {value: src$es5$$.objCreate(null)});
	src$es5$$.defineProperty(MessageFormat, '__addLocaleData', {value: function (data) {
	    if (!(data && data.locale)) {
	        throw new Error(
	            'Locale data provided to IntlMessageFormat is missing a ' +
	            '`locale` property'
	        );
	    }

	    MessageFormat.__localeData__[data.locale.toLowerCase()] = data;
	}});

	// Defines `__parse()` static method as an exposed private.
	src$es5$$.defineProperty(MessageFormat, '__parse', {value: intl$messageformat$parser$$["default"].parse});

	// Define public `defaultLocale` property which defaults to English, but can be
	// set by the developer.
	src$es5$$.defineProperty(MessageFormat, 'defaultLocale', {
	    enumerable: true,
	    writable  : true,
	    value     : undefined
	});

	MessageFormat.prototype.resolvedOptions = function () {
	    // TODO: Provide anything else?
	    return {
	        locale: this._locale
	    };
	};

	MessageFormat.prototype._compilePattern = function (ast, locales, formats, pluralFn) {
	    var compiler = new src$compiler$$["default"](locales, formats, pluralFn);
	    return compiler.compile(ast);
	};

	MessageFormat.prototype._findPluralRuleFunction = function (locale) {
	    var localeData = MessageFormat.__localeData__;
	    var data       = localeData[locale.toLowerCase()];

	    // The locale data is de-duplicated, so we have to traverse the locale's
	    // hierarchy until we find a `pluralRuleFunction` to return.
	    while (data) {
	        if (data.pluralRuleFunction) {
	            return data.pluralRuleFunction;
	        }

	        data = data.parentLocale && localeData[data.parentLocale.toLowerCase()];
	    }

	    throw new Error(
	        'Locale data added to IntlMessageFormat is missing a ' +
	        '`pluralRuleFunction` for :' + locale
	    );
	};

	MessageFormat.prototype._format = function (pattern, values) {
	    var result = '',
	        i, len, part, id, value;

	    for (i = 0, len = pattern.length; i < len; i += 1) {
	        part = pattern[i];

	        // Exist early for string parts.
	        if (typeof part === 'string') {
	            result += part;
	            continue;
	        }

	        id = part.id;

	        // Enforce that all required values are provided by the caller.
	        if (!(values && src$utils$$.hop.call(values, id))) {
	            throw new Error('A value must be provided for: ' + id);
	        }

	        value = values[id];

	        // Recursively format plural and select parts' option — which can be a
	        // nested pattern structure. The choosing of the option to use is
	        // abstracted-by and delegated-to the part helper object.
	        if (part.options) {
	            result += this._format(part.getOption(value), values);
	        } else {
	            result += part.format(value);
	        }
	    }

	    return result;
	};

	MessageFormat.prototype._mergeFormats = function (defaults, formats) {
	    var mergedFormats = {},
	        type, mergedType;

	    for (type in defaults) {
	        if (!src$utils$$.hop.call(defaults, type)) { continue; }

	        mergedFormats[type] = mergedType = src$es5$$.objCreate(defaults[type]);

	        if (formats && src$utils$$.hop.call(formats, type)) {
	            src$utils$$.extend(mergedType, formats[type]);
	        }
	    }

	    return mergedFormats;
	};

	MessageFormat.prototype._resolveLocale = function (locales) {
	    if (typeof locales === 'string') {
	        locales = [locales];
	    }

	    // Create a copy of the array so we can push on the default locale.
	    locales = (locales || []).concat(MessageFormat.defaultLocale);

	    var localeData = MessageFormat.__localeData__;
	    var i, len, localeParts, data;

	    // Using the set of locales + the default locale, we look for the first one
	    // which that has been registered. When data does not exist for a locale, we
	    // traverse its ancestors to find something that's been registered within
	    // its hierarchy of locales. Since we lack the proper `parentLocale` data
	    // here, we must take a naive approach to traversal.
	    for (i = 0, len = locales.length; i < len; i += 1) {
	        localeParts = locales[i].toLowerCase().split('-');

	        while (localeParts.length) {
	            data = localeData[localeParts.join('-')];
	            if (data) {
	                // Return the normalized locale string; e.g., we return "en-US",
	                // instead of "en-us".
	                return data.locale;
	            }

	            localeParts.pop();
	        }
	    }

	    var defaultLocale = locales.pop();
	    throw new Error(
	        'No locale data has been added to IntlMessageFormat for: ' +
	        locales.join(', ') + ', or the default locale: ' + defaultLocale
	    );
	};

	//# sourceMappingURL=core.js.map

/***/ },
/* 28 */
/***/ function(module, exports) {

	/*
	Copyright (c) 2014, Yahoo! Inc. All rights reserved.
	Copyrights licensed under the New BSD License.
	See the accompanying LICENSE file for terms.
	*/

	/* jslint esnext: true */

	"use strict";
	exports.extend = extend;
	var hop = Object.prototype.hasOwnProperty;

	function extend(obj) {
	    var sources = Array.prototype.slice.call(arguments, 1),
	        i, len, source, key;

	    for (i = 0, len = sources.length; i < len; i += 1) {
	        source = sources[i];
	        if (!source) { continue; }

	        for (key in source) {
	            if (hop.call(source, key)) {
	                obj[key] = source[key];
	            }
	        }
	    }

	    return obj;
	}
	exports.hop = hop;

	//# sourceMappingURL=utils.js.map

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	/*
	Copyright (c) 2014, Yahoo! Inc. All rights reserved.
	Copyrights licensed under the New BSD License.
	See the accompanying LICENSE file for terms.
	*/

	/* jslint esnext: true */

	"use strict";
	var src$utils$$ = __webpack_require__(28);

	// Purposely using the same implementation as the Intl.js `Intl` polyfill.
	// Copyright 2013 Andy Earnshaw, MIT License

	var realDefineProp = (function () {
	    try { return !!Object.defineProperty({}, 'a', {}); }
	    catch (e) { return false; }
	})();

	var es3 = !realDefineProp && !Object.prototype.__defineGetter__;

	var defineProperty = realDefineProp ? Object.defineProperty :
	        function (obj, name, desc) {

	    if ('get' in desc && obj.__defineGetter__) {
	        obj.__defineGetter__(name, desc.get);
	    } else if (!src$utils$$.hop.call(obj, name) || 'value' in desc) {
	        obj[name] = desc.value;
	    }
	};

	var objCreate = Object.create || function (proto, props) {
	    var obj, k;

	    function F() {}
	    F.prototype = proto;
	    obj = new F();

	    for (k in props) {
	        if (src$utils$$.hop.call(props, k)) {
	            defineProperty(obj, k, props[k]);
	        }
	    }

	    return obj;
	};
	exports.defineProperty = defineProperty, exports.objCreate = objCreate;

	//# sourceMappingURL=es5.js.map

/***/ },
/* 30 */
/***/ function(module, exports) {

	/*
	Copyright (c) 2014, Yahoo! Inc. All rights reserved.
	Copyrights licensed under the New BSD License.
	See the accompanying LICENSE file for terms.
	*/

	/* jslint esnext: true */

	"use strict";
	exports["default"] = Compiler;

	function Compiler(locales, formats, pluralFn) {
	    this.locales  = locales;
	    this.formats  = formats;
	    this.pluralFn = pluralFn;
	}

	Compiler.prototype.compile = function (ast) {
	    this.pluralStack        = [];
	    this.currentPlural      = null;
	    this.pluralNumberFormat = null;

	    return this.compileMessage(ast);
	};

	Compiler.prototype.compileMessage = function (ast) {
	    if (!(ast && ast.type === 'messageFormatPattern')) {
	        throw new Error('Message AST is not of type: "messageFormatPattern"');
	    }

	    var elements = ast.elements,
	        pattern  = [];

	    var i, len, element;

	    for (i = 0, len = elements.length; i < len; i += 1) {
	        element = elements[i];

	        switch (element.type) {
	            case 'messageTextElement':
	                pattern.push(this.compileMessageText(element));
	                break;

	            case 'argumentElement':
	                pattern.push(this.compileArgument(element));
	                break;

	            default:
	                throw new Error('Message element does not have a valid type');
	        }
	    }

	    return pattern;
	};

	Compiler.prototype.compileMessageText = function (element) {
	    // When this `element` is part of plural sub-pattern and its value contains
	    // an unescaped '#', use a `PluralOffsetString` helper to properly output
	    // the number with the correct offset in the string.
	    if (this.currentPlural && /(^|[^\\])#/g.test(element.value)) {
	        // Create a cache a NumberFormat instance that can be reused for any
	        // PluralOffsetString instance in this message.
	        if (!this.pluralNumberFormat) {
	            this.pluralNumberFormat = new Intl.NumberFormat(this.locales);
	        }

	        return new PluralOffsetString(
	                this.currentPlural.id,
	                this.currentPlural.format.offset,
	                this.pluralNumberFormat,
	                element.value);
	    }

	    // Unescape the escaped '#'s in the message text.
	    return element.value.replace(/\\#/g, '#');
	};

	Compiler.prototype.compileArgument = function (element) {
	    var format = element.format;

	    if (!format) {
	        return new StringFormat(element.id);
	    }

	    var formats  = this.formats,
	        locales  = this.locales,
	        pluralFn = this.pluralFn,
	        options;

	    switch (format.type) {
	        case 'numberFormat':
	            options = formats.number[format.style];
	            return {
	                id    : element.id,
	                format: new Intl.NumberFormat(locales, options).format
	            };

	        case 'dateFormat':
	            options = formats.date[format.style];
	            return {
	                id    : element.id,
	                format: new Intl.DateTimeFormat(locales, options).format
	            };

	        case 'timeFormat':
	            options = formats.time[format.style];
	            return {
	                id    : element.id,
	                format: new Intl.DateTimeFormat(locales, options).format
	            };

	        case 'pluralFormat':
	            options = this.compileOptions(element);
	            return new PluralFormat(
	                element.id, format.ordinal, format.offset, options, pluralFn
	            );

	        case 'selectFormat':
	            options = this.compileOptions(element);
	            return new SelectFormat(element.id, options);

	        default:
	            throw new Error('Message element does not have a valid format type');
	    }
	};

	Compiler.prototype.compileOptions = function (element) {
	    var format      = element.format,
	        options     = format.options,
	        optionsHash = {};

	    // Save the current plural element, if any, then set it to a new value when
	    // compiling the options sub-patterns. This conforms the spec's algorithm
	    // for handling `"#"` syntax in message text.
	    this.pluralStack.push(this.currentPlural);
	    this.currentPlural = format.type === 'pluralFormat' ? element : null;

	    var i, len, option;

	    for (i = 0, len = options.length; i < len; i += 1) {
	        option = options[i];

	        // Compile the sub-pattern and save it under the options's selector.
	        optionsHash[option.selector] = this.compileMessage(option.value);
	    }

	    // Pop the plural stack to put back the original current plural value.
	    this.currentPlural = this.pluralStack.pop();

	    return optionsHash;
	};

	// -- Compiler Helper Classes --------------------------------------------------

	function StringFormat(id) {
	    this.id = id;
	}

	StringFormat.prototype.format = function (value) {
	    if (!value) {
	        return '';
	    }

	    return typeof value === 'string' ? value : String(value);
	};

	function PluralFormat(id, useOrdinal, offset, options, pluralFn) {
	    this.id         = id;
	    this.useOrdinal = useOrdinal;
	    this.offset     = offset;
	    this.options    = options;
	    this.pluralFn   = pluralFn;
	}

	PluralFormat.prototype.getOption = function (value) {
	    var options = this.options;

	    var option = options['=' + value] ||
	            options[this.pluralFn(value - this.offset, this.useOrdinal)];

	    return option || options.other;
	};

	function PluralOffsetString(id, offset, numberFormat, string) {
	    this.id           = id;
	    this.offset       = offset;
	    this.numberFormat = numberFormat;
	    this.string       = string;
	}

	PluralOffsetString.prototype.format = function (value) {
	    var number = this.numberFormat.format(value - this.offset);

	    return this.string
	            .replace(/(^|[^\\])#/g, '$1' + number)
	            .replace(/\\#/g, '#');
	};

	function SelectFormat(id, options) {
	    this.id      = id;
	    this.options = options;
	}

	SelectFormat.prototype.getOption = function (value) {
	    var options = this.options;
	    return options[value] || options.other;
	};

	//# sourceMappingURL=compiler.js.map

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports = module.exports = __webpack_require__(32)['default'];
	exports['default'] = exports;


/***/ },
/* 32 */
/***/ function(module, exports) {

	"use strict";

	exports["default"] = (function() {
	  /*
	   * Generated by PEG.js 0.8.0.
	   *
	   * http://pegjs.majda.cz/
	   */

	  function peg$subclass(child, parent) {
	    function ctor() { this.constructor = child; }
	    ctor.prototype = parent.prototype;
	    child.prototype = new ctor();
	  }

	  function SyntaxError(message, expected, found, offset, line, column) {
	    this.message  = message;
	    this.expected = expected;
	    this.found    = found;
	    this.offset   = offset;
	    this.line     = line;
	    this.column   = column;

	    this.name     = "SyntaxError";
	  }

	  peg$subclass(SyntaxError, Error);

	  function parse(input) {
	    var options = arguments.length > 1 ? arguments[1] : {},

	        peg$FAILED = {},

	        peg$startRuleFunctions = { start: peg$parsestart },
	        peg$startRuleFunction  = peg$parsestart,

	        peg$c0 = [],
	        peg$c1 = function(elements) {
	                return {
	                    type    : 'messageFormatPattern',
	                    elements: elements
	                };
	            },
	        peg$c2 = peg$FAILED,
	        peg$c3 = function(text) {
	                var string = '',
	                    i, j, outerLen, inner, innerLen;

	                for (i = 0, outerLen = text.length; i < outerLen; i += 1) {
	                    inner = text[i];

	                    for (j = 0, innerLen = inner.length; j < innerLen; j += 1) {
	                        string += inner[j];
	                    }
	                }

	                return string;
	            },
	        peg$c4 = function(messageText) {
	                return {
	                    type : 'messageTextElement',
	                    value: messageText
	                };
	            },
	        peg$c5 = /^[^ \t\n\r,.+={}#]/,
	        peg$c6 = { type: "class", value: "[^ \\t\\n\\r,.+={}#]", description: "[^ \\t\\n\\r,.+={}#]" },
	        peg$c7 = "{",
	        peg$c8 = { type: "literal", value: "{", description: "\"{\"" },
	        peg$c9 = null,
	        peg$c10 = ",",
	        peg$c11 = { type: "literal", value: ",", description: "\",\"" },
	        peg$c12 = "}",
	        peg$c13 = { type: "literal", value: "}", description: "\"}\"" },
	        peg$c14 = function(id, format) {
	                return {
	                    type  : 'argumentElement',
	                    id    : id,
	                    format: format && format[2]
	                };
	            },
	        peg$c15 = "number",
	        peg$c16 = { type: "literal", value: "number", description: "\"number\"" },
	        peg$c17 = "date",
	        peg$c18 = { type: "literal", value: "date", description: "\"date\"" },
	        peg$c19 = "time",
	        peg$c20 = { type: "literal", value: "time", description: "\"time\"" },
	        peg$c21 = function(type, style) {
	                return {
	                    type : type + 'Format',
	                    style: style && style[2]
	                };
	            },
	        peg$c22 = "plural",
	        peg$c23 = { type: "literal", value: "plural", description: "\"plural\"" },
	        peg$c24 = function(pluralStyle) {
	                return {
	                    type   : pluralStyle.type,
	                    ordinal: false,
	                    offset : pluralStyle.offset || 0,
	                    options: pluralStyle.options
	                };
	            },
	        peg$c25 = "selectordinal",
	        peg$c26 = { type: "literal", value: "selectordinal", description: "\"selectordinal\"" },
	        peg$c27 = function(pluralStyle) {
	                return {
	                    type   : pluralStyle.type,
	                    ordinal: true,
	                    offset : pluralStyle.offset || 0,
	                    options: pluralStyle.options
	                }
	            },
	        peg$c28 = "select",
	        peg$c29 = { type: "literal", value: "select", description: "\"select\"" },
	        peg$c30 = function(options) {
	                return {
	                    type   : 'selectFormat',
	                    options: options
	                };
	            },
	        peg$c31 = "=",
	        peg$c32 = { type: "literal", value: "=", description: "\"=\"" },
	        peg$c33 = function(selector, pattern) {
	                return {
	                    type    : 'optionalFormatPattern',
	                    selector: selector,
	                    value   : pattern
	                };
	            },
	        peg$c34 = "offset:",
	        peg$c35 = { type: "literal", value: "offset:", description: "\"offset:\"" },
	        peg$c36 = function(number) {
	                return number;
	            },
	        peg$c37 = function(offset, options) {
	                return {
	                    type   : 'pluralFormat',
	                    offset : offset,
	                    options: options
	                };
	            },
	        peg$c38 = { type: "other", description: "whitespace" },
	        peg$c39 = /^[ \t\n\r]/,
	        peg$c40 = { type: "class", value: "[ \\t\\n\\r]", description: "[ \\t\\n\\r]" },
	        peg$c41 = { type: "other", description: "optionalWhitespace" },
	        peg$c42 = /^[0-9]/,
	        peg$c43 = { type: "class", value: "[0-9]", description: "[0-9]" },
	        peg$c44 = /^[0-9a-f]/i,
	        peg$c45 = { type: "class", value: "[0-9a-f]i", description: "[0-9a-f]i" },
	        peg$c46 = "0",
	        peg$c47 = { type: "literal", value: "0", description: "\"0\"" },
	        peg$c48 = /^[1-9]/,
	        peg$c49 = { type: "class", value: "[1-9]", description: "[1-9]" },
	        peg$c50 = function(digits) {
	            return parseInt(digits, 10);
	        },
	        peg$c51 = /^[^{}\\\0-\x1F \t\n\r]/,
	        peg$c52 = { type: "class", value: "[^{}\\\\\\0-\\x1F \\t\\n\\r]", description: "[^{}\\\\\\0-\\x1F \\t\\n\\r]" },
	        peg$c53 = "\\\\",
	        peg$c54 = { type: "literal", value: "\\\\", description: "\"\\\\\\\\\"" },
	        peg$c55 = function() { return '\\'; },
	        peg$c56 = "\\#",
	        peg$c57 = { type: "literal", value: "\\#", description: "\"\\\\#\"" },
	        peg$c58 = function() { return '\\#'; },
	        peg$c59 = "\\{",
	        peg$c60 = { type: "literal", value: "\\{", description: "\"\\\\{\"" },
	        peg$c61 = function() { return '\u007B'; },
	        peg$c62 = "\\}",
	        peg$c63 = { type: "literal", value: "\\}", description: "\"\\\\}\"" },
	        peg$c64 = function() { return '\u007D'; },
	        peg$c65 = "\\u",
	        peg$c66 = { type: "literal", value: "\\u", description: "\"\\\\u\"" },
	        peg$c67 = function(digits) {
	                return String.fromCharCode(parseInt(digits, 16));
	            },
	        peg$c68 = function(chars) { return chars.join(''); },

	        peg$currPos          = 0,
	        peg$reportedPos      = 0,
	        peg$cachedPos        = 0,
	        peg$cachedPosDetails = { line: 1, column: 1, seenCR: false },
	        peg$maxFailPos       = 0,
	        peg$maxFailExpected  = [],
	        peg$silentFails      = 0,

	        peg$result;

	    if ("startRule" in options) {
	      if (!(options.startRule in peg$startRuleFunctions)) {
	        throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
	      }

	      peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
	    }

	    function text() {
	      return input.substring(peg$reportedPos, peg$currPos);
	    }

	    function offset() {
	      return peg$reportedPos;
	    }

	    function line() {
	      return peg$computePosDetails(peg$reportedPos).line;
	    }

	    function column() {
	      return peg$computePosDetails(peg$reportedPos).column;
	    }

	    function expected(description) {
	      throw peg$buildException(
	        null,
	        [{ type: "other", description: description }],
	        peg$reportedPos
	      );
	    }

	    function error(message) {
	      throw peg$buildException(message, null, peg$reportedPos);
	    }

	    function peg$computePosDetails(pos) {
	      function advance(details, startPos, endPos) {
	        var p, ch;

	        for (p = startPos; p < endPos; p++) {
	          ch = input.charAt(p);
	          if (ch === "\n") {
	            if (!details.seenCR) { details.line++; }
	            details.column = 1;
	            details.seenCR = false;
	          } else if (ch === "\r" || ch === "\u2028" || ch === "\u2029") {
	            details.line++;
	            details.column = 1;
	            details.seenCR = true;
	          } else {
	            details.column++;
	            details.seenCR = false;
	          }
	        }
	      }

	      if (peg$cachedPos !== pos) {
	        if (peg$cachedPos > pos) {
	          peg$cachedPos = 0;
	          peg$cachedPosDetails = { line: 1, column: 1, seenCR: false };
	        }
	        advance(peg$cachedPosDetails, peg$cachedPos, pos);
	        peg$cachedPos = pos;
	      }

	      return peg$cachedPosDetails;
	    }

	    function peg$fail(expected) {
	      if (peg$currPos < peg$maxFailPos) { return; }

	      if (peg$currPos > peg$maxFailPos) {
	        peg$maxFailPos = peg$currPos;
	        peg$maxFailExpected = [];
	      }

	      peg$maxFailExpected.push(expected);
	    }

	    function peg$buildException(message, expected, pos) {
	      function cleanupExpected(expected) {
	        var i = 1;

	        expected.sort(function(a, b) {
	          if (a.description < b.description) {
	            return -1;
	          } else if (a.description > b.description) {
	            return 1;
	          } else {
	            return 0;
	          }
	        });

	        while (i < expected.length) {
	          if (expected[i - 1] === expected[i]) {
	            expected.splice(i, 1);
	          } else {
	            i++;
	          }
	        }
	      }

	      function buildMessage(expected, found) {
	        function stringEscape(s) {
	          function hex(ch) { return ch.charCodeAt(0).toString(16).toUpperCase(); }

	          return s
	            .replace(/\\/g,   '\\\\')
	            .replace(/"/g,    '\\"')
	            .replace(/\x08/g, '\\b')
	            .replace(/\t/g,   '\\t')
	            .replace(/\n/g,   '\\n')
	            .replace(/\f/g,   '\\f')
	            .replace(/\r/g,   '\\r')
	            .replace(/[\x00-\x07\x0B\x0E\x0F]/g, function(ch) { return '\\x0' + hex(ch); })
	            .replace(/[\x10-\x1F\x80-\xFF]/g,    function(ch) { return '\\x'  + hex(ch); })
	            .replace(/[\u0180-\u0FFF]/g,         function(ch) { return '\\u0' + hex(ch); })
	            .replace(/[\u1080-\uFFFF]/g,         function(ch) { return '\\u'  + hex(ch); });
	        }

	        var expectedDescs = new Array(expected.length),
	            expectedDesc, foundDesc, i;

	        for (i = 0; i < expected.length; i++) {
	          expectedDescs[i] = expected[i].description;
	        }

	        expectedDesc = expected.length > 1
	          ? expectedDescs.slice(0, -1).join(", ")
	              + " or "
	              + expectedDescs[expected.length - 1]
	          : expectedDescs[0];

	        foundDesc = found ? "\"" + stringEscape(found) + "\"" : "end of input";

	        return "Expected " + expectedDesc + " but " + foundDesc + " found.";
	      }

	      var posDetails = peg$computePosDetails(pos),
	          found      = pos < input.length ? input.charAt(pos) : null;

	      if (expected !== null) {
	        cleanupExpected(expected);
	      }

	      return new SyntaxError(
	        message !== null ? message : buildMessage(expected, found),
	        expected,
	        found,
	        pos,
	        posDetails.line,
	        posDetails.column
	      );
	    }

	    function peg$parsestart() {
	      var s0;

	      s0 = peg$parsemessageFormatPattern();

	      return s0;
	    }

	    function peg$parsemessageFormatPattern() {
	      var s0, s1, s2;

	      s0 = peg$currPos;
	      s1 = [];
	      s2 = peg$parsemessageFormatElement();
	      while (s2 !== peg$FAILED) {
	        s1.push(s2);
	        s2 = peg$parsemessageFormatElement();
	      }
	      if (s1 !== peg$FAILED) {
	        peg$reportedPos = s0;
	        s1 = peg$c1(s1);
	      }
	      s0 = s1;

	      return s0;
	    }

	    function peg$parsemessageFormatElement() {
	      var s0;

	      s0 = peg$parsemessageTextElement();
	      if (s0 === peg$FAILED) {
	        s0 = peg$parseargumentElement();
	      }

	      return s0;
	    }

	    function peg$parsemessageText() {
	      var s0, s1, s2, s3, s4, s5;

	      s0 = peg$currPos;
	      s1 = [];
	      s2 = peg$currPos;
	      s3 = peg$parse_();
	      if (s3 !== peg$FAILED) {
	        s4 = peg$parsechars();
	        if (s4 !== peg$FAILED) {
	          s5 = peg$parse_();
	          if (s5 !== peg$FAILED) {
	            s3 = [s3, s4, s5];
	            s2 = s3;
	          } else {
	            peg$currPos = s2;
	            s2 = peg$c2;
	          }
	        } else {
	          peg$currPos = s2;
	          s2 = peg$c2;
	        }
	      } else {
	        peg$currPos = s2;
	        s2 = peg$c2;
	      }
	      if (s2 !== peg$FAILED) {
	        while (s2 !== peg$FAILED) {
	          s1.push(s2);
	          s2 = peg$currPos;
	          s3 = peg$parse_();
	          if (s3 !== peg$FAILED) {
	            s4 = peg$parsechars();
	            if (s4 !== peg$FAILED) {
	              s5 = peg$parse_();
	              if (s5 !== peg$FAILED) {
	                s3 = [s3, s4, s5];
	                s2 = s3;
	              } else {
	                peg$currPos = s2;
	                s2 = peg$c2;
	              }
	            } else {
	              peg$currPos = s2;
	              s2 = peg$c2;
	            }
	          } else {
	            peg$currPos = s2;
	            s2 = peg$c2;
	          }
	        }
	      } else {
	        s1 = peg$c2;
	      }
	      if (s1 !== peg$FAILED) {
	        peg$reportedPos = s0;
	        s1 = peg$c3(s1);
	      }
	      s0 = s1;
	      if (s0 === peg$FAILED) {
	        s0 = peg$currPos;
	        s1 = peg$parsews();
	        if (s1 !== peg$FAILED) {
	          s1 = input.substring(s0, peg$currPos);
	        }
	        s0 = s1;
	      }

	      return s0;
	    }

	    function peg$parsemessageTextElement() {
	      var s0, s1;

	      s0 = peg$currPos;
	      s1 = peg$parsemessageText();
	      if (s1 !== peg$FAILED) {
	        peg$reportedPos = s0;
	        s1 = peg$c4(s1);
	      }
	      s0 = s1;

	      return s0;
	    }

	    function peg$parseargument() {
	      var s0, s1, s2;

	      s0 = peg$parsenumber();
	      if (s0 === peg$FAILED) {
	        s0 = peg$currPos;
	        s1 = [];
	        if (peg$c5.test(input.charAt(peg$currPos))) {
	          s2 = input.charAt(peg$currPos);
	          peg$currPos++;
	        } else {
	          s2 = peg$FAILED;
	          if (peg$silentFails === 0) { peg$fail(peg$c6); }
	        }
	        if (s2 !== peg$FAILED) {
	          while (s2 !== peg$FAILED) {
	            s1.push(s2);
	            if (peg$c5.test(input.charAt(peg$currPos))) {
	              s2 = input.charAt(peg$currPos);
	              peg$currPos++;
	            } else {
	              s2 = peg$FAILED;
	              if (peg$silentFails === 0) { peg$fail(peg$c6); }
	            }
	          }
	        } else {
	          s1 = peg$c2;
	        }
	        if (s1 !== peg$FAILED) {
	          s1 = input.substring(s0, peg$currPos);
	        }
	        s0 = s1;
	      }

	      return s0;
	    }

	    function peg$parseargumentElement() {
	      var s0, s1, s2, s3, s4, s5, s6, s7, s8;

	      s0 = peg$currPos;
	      if (input.charCodeAt(peg$currPos) === 123) {
	        s1 = peg$c7;
	        peg$currPos++;
	      } else {
	        s1 = peg$FAILED;
	        if (peg$silentFails === 0) { peg$fail(peg$c8); }
	      }
	      if (s1 !== peg$FAILED) {
	        s2 = peg$parse_();
	        if (s2 !== peg$FAILED) {
	          s3 = peg$parseargument();
	          if (s3 !== peg$FAILED) {
	            s4 = peg$parse_();
	            if (s4 !== peg$FAILED) {
	              s5 = peg$currPos;
	              if (input.charCodeAt(peg$currPos) === 44) {
	                s6 = peg$c10;
	                peg$currPos++;
	              } else {
	                s6 = peg$FAILED;
	                if (peg$silentFails === 0) { peg$fail(peg$c11); }
	              }
	              if (s6 !== peg$FAILED) {
	                s7 = peg$parse_();
	                if (s7 !== peg$FAILED) {
	                  s8 = peg$parseelementFormat();
	                  if (s8 !== peg$FAILED) {
	                    s6 = [s6, s7, s8];
	                    s5 = s6;
	                  } else {
	                    peg$currPos = s5;
	                    s5 = peg$c2;
	                  }
	                } else {
	                  peg$currPos = s5;
	                  s5 = peg$c2;
	                }
	              } else {
	                peg$currPos = s5;
	                s5 = peg$c2;
	              }
	              if (s5 === peg$FAILED) {
	                s5 = peg$c9;
	              }
	              if (s5 !== peg$FAILED) {
	                s6 = peg$parse_();
	                if (s6 !== peg$FAILED) {
	                  if (input.charCodeAt(peg$currPos) === 125) {
	                    s7 = peg$c12;
	                    peg$currPos++;
	                  } else {
	                    s7 = peg$FAILED;
	                    if (peg$silentFails === 0) { peg$fail(peg$c13); }
	                  }
	                  if (s7 !== peg$FAILED) {
	                    peg$reportedPos = s0;
	                    s1 = peg$c14(s3, s5);
	                    s0 = s1;
	                  } else {
	                    peg$currPos = s0;
	                    s0 = peg$c2;
	                  }
	                } else {
	                  peg$currPos = s0;
	                  s0 = peg$c2;
	                }
	              } else {
	                peg$currPos = s0;
	                s0 = peg$c2;
	              }
	            } else {
	              peg$currPos = s0;
	              s0 = peg$c2;
	            }
	          } else {
	            peg$currPos = s0;
	            s0 = peg$c2;
	          }
	        } else {
	          peg$currPos = s0;
	          s0 = peg$c2;
	        }
	      } else {
	        peg$currPos = s0;
	        s0 = peg$c2;
	      }

	      return s0;
	    }

	    function peg$parseelementFormat() {
	      var s0;

	      s0 = peg$parsesimpleFormat();
	      if (s0 === peg$FAILED) {
	        s0 = peg$parsepluralFormat();
	        if (s0 === peg$FAILED) {
	          s0 = peg$parseselectOrdinalFormat();
	          if (s0 === peg$FAILED) {
	            s0 = peg$parseselectFormat();
	          }
	        }
	      }

	      return s0;
	    }

	    function peg$parsesimpleFormat() {
	      var s0, s1, s2, s3, s4, s5, s6;

	      s0 = peg$currPos;
	      if (input.substr(peg$currPos, 6) === peg$c15) {
	        s1 = peg$c15;
	        peg$currPos += 6;
	      } else {
	        s1 = peg$FAILED;
	        if (peg$silentFails === 0) { peg$fail(peg$c16); }
	      }
	      if (s1 === peg$FAILED) {
	        if (input.substr(peg$currPos, 4) === peg$c17) {
	          s1 = peg$c17;
	          peg$currPos += 4;
	        } else {
	          s1 = peg$FAILED;
	          if (peg$silentFails === 0) { peg$fail(peg$c18); }
	        }
	        if (s1 === peg$FAILED) {
	          if (input.substr(peg$currPos, 4) === peg$c19) {
	            s1 = peg$c19;
	            peg$currPos += 4;
	          } else {
	            s1 = peg$FAILED;
	            if (peg$silentFails === 0) { peg$fail(peg$c20); }
	          }
	        }
	      }
	      if (s1 !== peg$FAILED) {
	        s2 = peg$parse_();
	        if (s2 !== peg$FAILED) {
	          s3 = peg$currPos;
	          if (input.charCodeAt(peg$currPos) === 44) {
	            s4 = peg$c10;
	            peg$currPos++;
	          } else {
	            s4 = peg$FAILED;
	            if (peg$silentFails === 0) { peg$fail(peg$c11); }
	          }
	          if (s4 !== peg$FAILED) {
	            s5 = peg$parse_();
	            if (s5 !== peg$FAILED) {
	              s6 = peg$parsechars();
	              if (s6 !== peg$FAILED) {
	                s4 = [s4, s5, s6];
	                s3 = s4;
	              } else {
	                peg$currPos = s3;
	                s3 = peg$c2;
	              }
	            } else {
	              peg$currPos = s3;
	              s3 = peg$c2;
	            }
	          } else {
	            peg$currPos = s3;
	            s3 = peg$c2;
	          }
	          if (s3 === peg$FAILED) {
	            s3 = peg$c9;
	          }
	          if (s3 !== peg$FAILED) {
	            peg$reportedPos = s0;
	            s1 = peg$c21(s1, s3);
	            s0 = s1;
	          } else {
	            peg$currPos = s0;
	            s0 = peg$c2;
	          }
	        } else {
	          peg$currPos = s0;
	          s0 = peg$c2;
	        }
	      } else {
	        peg$currPos = s0;
	        s0 = peg$c2;
	      }

	      return s0;
	    }

	    function peg$parsepluralFormat() {
	      var s0, s1, s2, s3, s4, s5;

	      s0 = peg$currPos;
	      if (input.substr(peg$currPos, 6) === peg$c22) {
	        s1 = peg$c22;
	        peg$currPos += 6;
	      } else {
	        s1 = peg$FAILED;
	        if (peg$silentFails === 0) { peg$fail(peg$c23); }
	      }
	      if (s1 !== peg$FAILED) {
	        s2 = peg$parse_();
	        if (s2 !== peg$FAILED) {
	          if (input.charCodeAt(peg$currPos) === 44) {
	            s3 = peg$c10;
	            peg$currPos++;
	          } else {
	            s3 = peg$FAILED;
	            if (peg$silentFails === 0) { peg$fail(peg$c11); }
	          }
	          if (s3 !== peg$FAILED) {
	            s4 = peg$parse_();
	            if (s4 !== peg$FAILED) {
	              s5 = peg$parsepluralStyle();
	              if (s5 !== peg$FAILED) {
	                peg$reportedPos = s0;
	                s1 = peg$c24(s5);
	                s0 = s1;
	              } else {
	                peg$currPos = s0;
	                s0 = peg$c2;
	              }
	            } else {
	              peg$currPos = s0;
	              s0 = peg$c2;
	            }
	          } else {
	            peg$currPos = s0;
	            s0 = peg$c2;
	          }
	        } else {
	          peg$currPos = s0;
	          s0 = peg$c2;
	        }
	      } else {
	        peg$currPos = s0;
	        s0 = peg$c2;
	      }

	      return s0;
	    }

	    function peg$parseselectOrdinalFormat() {
	      var s0, s1, s2, s3, s4, s5;

	      s0 = peg$currPos;
	      if (input.substr(peg$currPos, 13) === peg$c25) {
	        s1 = peg$c25;
	        peg$currPos += 13;
	      } else {
	        s1 = peg$FAILED;
	        if (peg$silentFails === 0) { peg$fail(peg$c26); }
	      }
	      if (s1 !== peg$FAILED) {
	        s2 = peg$parse_();
	        if (s2 !== peg$FAILED) {
	          if (input.charCodeAt(peg$currPos) === 44) {
	            s3 = peg$c10;
	            peg$currPos++;
	          } else {
	            s3 = peg$FAILED;
	            if (peg$silentFails === 0) { peg$fail(peg$c11); }
	          }
	          if (s3 !== peg$FAILED) {
	            s4 = peg$parse_();
	            if (s4 !== peg$FAILED) {
	              s5 = peg$parsepluralStyle();
	              if (s5 !== peg$FAILED) {
	                peg$reportedPos = s0;
	                s1 = peg$c27(s5);
	                s0 = s1;
	              } else {
	                peg$currPos = s0;
	                s0 = peg$c2;
	              }
	            } else {
	              peg$currPos = s0;
	              s0 = peg$c2;
	            }
	          } else {
	            peg$currPos = s0;
	            s0 = peg$c2;
	          }
	        } else {
	          peg$currPos = s0;
	          s0 = peg$c2;
	        }
	      } else {
	        peg$currPos = s0;
	        s0 = peg$c2;
	      }

	      return s0;
	    }

	    function peg$parseselectFormat() {
	      var s0, s1, s2, s3, s4, s5, s6;

	      s0 = peg$currPos;
	      if (input.substr(peg$currPos, 6) === peg$c28) {
	        s1 = peg$c28;
	        peg$currPos += 6;
	      } else {
	        s1 = peg$FAILED;
	        if (peg$silentFails === 0) { peg$fail(peg$c29); }
	      }
	      if (s1 !== peg$FAILED) {
	        s2 = peg$parse_();
	        if (s2 !== peg$FAILED) {
	          if (input.charCodeAt(peg$currPos) === 44) {
	            s3 = peg$c10;
	            peg$currPos++;
	          } else {
	            s3 = peg$FAILED;
	            if (peg$silentFails === 0) { peg$fail(peg$c11); }
	          }
	          if (s3 !== peg$FAILED) {
	            s4 = peg$parse_();
	            if (s4 !== peg$FAILED) {
	              s5 = [];
	              s6 = peg$parseoptionalFormatPattern();
	              if (s6 !== peg$FAILED) {
	                while (s6 !== peg$FAILED) {
	                  s5.push(s6);
	                  s6 = peg$parseoptionalFormatPattern();
	                }
	              } else {
	                s5 = peg$c2;
	              }
	              if (s5 !== peg$FAILED) {
	                peg$reportedPos = s0;
	                s1 = peg$c30(s5);
	                s0 = s1;
	              } else {
	                peg$currPos = s0;
	                s0 = peg$c2;
	              }
	            } else {
	              peg$currPos = s0;
	              s0 = peg$c2;
	            }
	          } else {
	            peg$currPos = s0;
	            s0 = peg$c2;
	          }
	        } else {
	          peg$currPos = s0;
	          s0 = peg$c2;
	        }
	      } else {
	        peg$currPos = s0;
	        s0 = peg$c2;
	      }

	      return s0;
	    }

	    function peg$parseselector() {
	      var s0, s1, s2, s3;

	      s0 = peg$currPos;
	      s1 = peg$currPos;
	      if (input.charCodeAt(peg$currPos) === 61) {
	        s2 = peg$c31;
	        peg$currPos++;
	      } else {
	        s2 = peg$FAILED;
	        if (peg$silentFails === 0) { peg$fail(peg$c32); }
	      }
	      if (s2 !== peg$FAILED) {
	        s3 = peg$parsenumber();
	        if (s3 !== peg$FAILED) {
	          s2 = [s2, s3];
	          s1 = s2;
	        } else {
	          peg$currPos = s1;
	          s1 = peg$c2;
	        }
	      } else {
	        peg$currPos = s1;
	        s1 = peg$c2;
	      }
	      if (s1 !== peg$FAILED) {
	        s1 = input.substring(s0, peg$currPos);
	      }
	      s0 = s1;
	      if (s0 === peg$FAILED) {
	        s0 = peg$parsechars();
	      }

	      return s0;
	    }

	    function peg$parseoptionalFormatPattern() {
	      var s0, s1, s2, s3, s4, s5, s6, s7, s8;

	      s0 = peg$currPos;
	      s1 = peg$parse_();
	      if (s1 !== peg$FAILED) {
	        s2 = peg$parseselector();
	        if (s2 !== peg$FAILED) {
	          s3 = peg$parse_();
	          if (s3 !== peg$FAILED) {
	            if (input.charCodeAt(peg$currPos) === 123) {
	              s4 = peg$c7;
	              peg$currPos++;
	            } else {
	              s4 = peg$FAILED;
	              if (peg$silentFails === 0) { peg$fail(peg$c8); }
	            }
	            if (s4 !== peg$FAILED) {
	              s5 = peg$parse_();
	              if (s5 !== peg$FAILED) {
	                s6 = peg$parsemessageFormatPattern();
	                if (s6 !== peg$FAILED) {
	                  s7 = peg$parse_();
	                  if (s7 !== peg$FAILED) {
	                    if (input.charCodeAt(peg$currPos) === 125) {
	                      s8 = peg$c12;
	                      peg$currPos++;
	                    } else {
	                      s8 = peg$FAILED;
	                      if (peg$silentFails === 0) { peg$fail(peg$c13); }
	                    }
	                    if (s8 !== peg$FAILED) {
	                      peg$reportedPos = s0;
	                      s1 = peg$c33(s2, s6);
	                      s0 = s1;
	                    } else {
	                      peg$currPos = s0;
	                      s0 = peg$c2;
	                    }
	                  } else {
	                    peg$currPos = s0;
	                    s0 = peg$c2;
	                  }
	                } else {
	                  peg$currPos = s0;
	                  s0 = peg$c2;
	                }
	              } else {
	                peg$currPos = s0;
	                s0 = peg$c2;
	              }
	            } else {
	              peg$currPos = s0;
	              s0 = peg$c2;
	            }
	          } else {
	            peg$currPos = s0;
	            s0 = peg$c2;
	          }
	        } else {
	          peg$currPos = s0;
	          s0 = peg$c2;
	        }
	      } else {
	        peg$currPos = s0;
	        s0 = peg$c2;
	      }

	      return s0;
	    }

	    function peg$parseoffset() {
	      var s0, s1, s2, s3;

	      s0 = peg$currPos;
	      if (input.substr(peg$currPos, 7) === peg$c34) {
	        s1 = peg$c34;
	        peg$currPos += 7;
	      } else {
	        s1 = peg$FAILED;
	        if (peg$silentFails === 0) { peg$fail(peg$c35); }
	      }
	      if (s1 !== peg$FAILED) {
	        s2 = peg$parse_();
	        if (s2 !== peg$FAILED) {
	          s3 = peg$parsenumber();
	          if (s3 !== peg$FAILED) {
	            peg$reportedPos = s0;
	            s1 = peg$c36(s3);
	            s0 = s1;
	          } else {
	            peg$currPos = s0;
	            s0 = peg$c2;
	          }
	        } else {
	          peg$currPos = s0;
	          s0 = peg$c2;
	        }
	      } else {
	        peg$currPos = s0;
	        s0 = peg$c2;
	      }

	      return s0;
	    }

	    function peg$parsepluralStyle() {
	      var s0, s1, s2, s3, s4;

	      s0 = peg$currPos;
	      s1 = peg$parseoffset();
	      if (s1 === peg$FAILED) {
	        s1 = peg$c9;
	      }
	      if (s1 !== peg$FAILED) {
	        s2 = peg$parse_();
	        if (s2 !== peg$FAILED) {
	          s3 = [];
	          s4 = peg$parseoptionalFormatPattern();
	          if (s4 !== peg$FAILED) {
	            while (s4 !== peg$FAILED) {
	              s3.push(s4);
	              s4 = peg$parseoptionalFormatPattern();
	            }
	          } else {
	            s3 = peg$c2;
	          }
	          if (s3 !== peg$FAILED) {
	            peg$reportedPos = s0;
	            s1 = peg$c37(s1, s3);
	            s0 = s1;
	          } else {
	            peg$currPos = s0;
	            s0 = peg$c2;
	          }
	        } else {
	          peg$currPos = s0;
	          s0 = peg$c2;
	        }
	      } else {
	        peg$currPos = s0;
	        s0 = peg$c2;
	      }

	      return s0;
	    }

	    function peg$parsews() {
	      var s0, s1;

	      peg$silentFails++;
	      s0 = [];
	      if (peg$c39.test(input.charAt(peg$currPos))) {
	        s1 = input.charAt(peg$currPos);
	        peg$currPos++;
	      } else {
	        s1 = peg$FAILED;
	        if (peg$silentFails === 0) { peg$fail(peg$c40); }
	      }
	      if (s1 !== peg$FAILED) {
	        while (s1 !== peg$FAILED) {
	          s0.push(s1);
	          if (peg$c39.test(input.charAt(peg$currPos))) {
	            s1 = input.charAt(peg$currPos);
	            peg$currPos++;
	          } else {
	            s1 = peg$FAILED;
	            if (peg$silentFails === 0) { peg$fail(peg$c40); }
	          }
	        }
	      } else {
	        s0 = peg$c2;
	      }
	      peg$silentFails--;
	      if (s0 === peg$FAILED) {
	        s1 = peg$FAILED;
	        if (peg$silentFails === 0) { peg$fail(peg$c38); }
	      }

	      return s0;
	    }

	    function peg$parse_() {
	      var s0, s1, s2;

	      peg$silentFails++;
	      s0 = peg$currPos;
	      s1 = [];
	      s2 = peg$parsews();
	      while (s2 !== peg$FAILED) {
	        s1.push(s2);
	        s2 = peg$parsews();
	      }
	      if (s1 !== peg$FAILED) {
	        s1 = input.substring(s0, peg$currPos);
	      }
	      s0 = s1;
	      peg$silentFails--;
	      if (s0 === peg$FAILED) {
	        s1 = peg$FAILED;
	        if (peg$silentFails === 0) { peg$fail(peg$c41); }
	      }

	      return s0;
	    }

	    function peg$parsedigit() {
	      var s0;

	      if (peg$c42.test(input.charAt(peg$currPos))) {
	        s0 = input.charAt(peg$currPos);
	        peg$currPos++;
	      } else {
	        s0 = peg$FAILED;
	        if (peg$silentFails === 0) { peg$fail(peg$c43); }
	      }

	      return s0;
	    }

	    function peg$parsehexDigit() {
	      var s0;

	      if (peg$c44.test(input.charAt(peg$currPos))) {
	        s0 = input.charAt(peg$currPos);
	        peg$currPos++;
	      } else {
	        s0 = peg$FAILED;
	        if (peg$silentFails === 0) { peg$fail(peg$c45); }
	      }

	      return s0;
	    }

	    function peg$parsenumber() {
	      var s0, s1, s2, s3, s4, s5;

	      s0 = peg$currPos;
	      if (input.charCodeAt(peg$currPos) === 48) {
	        s1 = peg$c46;
	        peg$currPos++;
	      } else {
	        s1 = peg$FAILED;
	        if (peg$silentFails === 0) { peg$fail(peg$c47); }
	      }
	      if (s1 === peg$FAILED) {
	        s1 = peg$currPos;
	        s2 = peg$currPos;
	        if (peg$c48.test(input.charAt(peg$currPos))) {
	          s3 = input.charAt(peg$currPos);
	          peg$currPos++;
	        } else {
	          s3 = peg$FAILED;
	          if (peg$silentFails === 0) { peg$fail(peg$c49); }
	        }
	        if (s3 !== peg$FAILED) {
	          s4 = [];
	          s5 = peg$parsedigit();
	          while (s5 !== peg$FAILED) {
	            s4.push(s5);
	            s5 = peg$parsedigit();
	          }
	          if (s4 !== peg$FAILED) {
	            s3 = [s3, s4];
	            s2 = s3;
	          } else {
	            peg$currPos = s2;
	            s2 = peg$c2;
	          }
	        } else {
	          peg$currPos = s2;
	          s2 = peg$c2;
	        }
	        if (s2 !== peg$FAILED) {
	          s2 = input.substring(s1, peg$currPos);
	        }
	        s1 = s2;
	      }
	      if (s1 !== peg$FAILED) {
	        peg$reportedPos = s0;
	        s1 = peg$c50(s1);
	      }
	      s0 = s1;

	      return s0;
	    }

	    function peg$parsechar() {
	      var s0, s1, s2, s3, s4, s5, s6, s7;

	      if (peg$c51.test(input.charAt(peg$currPos))) {
	        s0 = input.charAt(peg$currPos);
	        peg$currPos++;
	      } else {
	        s0 = peg$FAILED;
	        if (peg$silentFails === 0) { peg$fail(peg$c52); }
	      }
	      if (s0 === peg$FAILED) {
	        s0 = peg$currPos;
	        if (input.substr(peg$currPos, 2) === peg$c53) {
	          s1 = peg$c53;
	          peg$currPos += 2;
	        } else {
	          s1 = peg$FAILED;
	          if (peg$silentFails === 0) { peg$fail(peg$c54); }
	        }
	        if (s1 !== peg$FAILED) {
	          peg$reportedPos = s0;
	          s1 = peg$c55();
	        }
	        s0 = s1;
	        if (s0 === peg$FAILED) {
	          s0 = peg$currPos;
	          if (input.substr(peg$currPos, 2) === peg$c56) {
	            s1 = peg$c56;
	            peg$currPos += 2;
	          } else {
	            s1 = peg$FAILED;
	            if (peg$silentFails === 0) { peg$fail(peg$c57); }
	          }
	          if (s1 !== peg$FAILED) {
	            peg$reportedPos = s0;
	            s1 = peg$c58();
	          }
	          s0 = s1;
	          if (s0 === peg$FAILED) {
	            s0 = peg$currPos;
	            if (input.substr(peg$currPos, 2) === peg$c59) {
	              s1 = peg$c59;
	              peg$currPos += 2;
	            } else {
	              s1 = peg$FAILED;
	              if (peg$silentFails === 0) { peg$fail(peg$c60); }
	            }
	            if (s1 !== peg$FAILED) {
	              peg$reportedPos = s0;
	              s1 = peg$c61();
	            }
	            s0 = s1;
	            if (s0 === peg$FAILED) {
	              s0 = peg$currPos;
	              if (input.substr(peg$currPos, 2) === peg$c62) {
	                s1 = peg$c62;
	                peg$currPos += 2;
	              } else {
	                s1 = peg$FAILED;
	                if (peg$silentFails === 0) { peg$fail(peg$c63); }
	              }
	              if (s1 !== peg$FAILED) {
	                peg$reportedPos = s0;
	                s1 = peg$c64();
	              }
	              s0 = s1;
	              if (s0 === peg$FAILED) {
	                s0 = peg$currPos;
	                if (input.substr(peg$currPos, 2) === peg$c65) {
	                  s1 = peg$c65;
	                  peg$currPos += 2;
	                } else {
	                  s1 = peg$FAILED;
	                  if (peg$silentFails === 0) { peg$fail(peg$c66); }
	                }
	                if (s1 !== peg$FAILED) {
	                  s2 = peg$currPos;
	                  s3 = peg$currPos;
	                  s4 = peg$parsehexDigit();
	                  if (s4 !== peg$FAILED) {
	                    s5 = peg$parsehexDigit();
	                    if (s5 !== peg$FAILED) {
	                      s6 = peg$parsehexDigit();
	                      if (s6 !== peg$FAILED) {
	                        s7 = peg$parsehexDigit();
	                        if (s7 !== peg$FAILED) {
	                          s4 = [s4, s5, s6, s7];
	                          s3 = s4;
	                        } else {
	                          peg$currPos = s3;
	                          s3 = peg$c2;
	                        }
	                      } else {
	                        peg$currPos = s3;
	                        s3 = peg$c2;
	                      }
	                    } else {
	                      peg$currPos = s3;
	                      s3 = peg$c2;
	                    }
	                  } else {
	                    peg$currPos = s3;
	                    s3 = peg$c2;
	                  }
	                  if (s3 !== peg$FAILED) {
	                    s3 = input.substring(s2, peg$currPos);
	                  }
	                  s2 = s3;
	                  if (s2 !== peg$FAILED) {
	                    peg$reportedPos = s0;
	                    s1 = peg$c67(s2);
	                    s0 = s1;
	                  } else {
	                    peg$currPos = s0;
	                    s0 = peg$c2;
	                  }
	                } else {
	                  peg$currPos = s0;
	                  s0 = peg$c2;
	                }
	              }
	            }
	          }
	        }
	      }

	      return s0;
	    }

	    function peg$parsechars() {
	      var s0, s1, s2;

	      s0 = peg$currPos;
	      s1 = [];
	      s2 = peg$parsechar();
	      if (s2 !== peg$FAILED) {
	        while (s2 !== peg$FAILED) {
	          s1.push(s2);
	          s2 = peg$parsechar();
	        }
	      } else {
	        s1 = peg$c2;
	      }
	      if (s1 !== peg$FAILED) {
	        peg$reportedPos = s0;
	        s1 = peg$c68(s1);
	      }
	      s0 = s1;

	      return s0;
	    }

	    peg$result = peg$startRuleFunction();

	    if (peg$result !== peg$FAILED && peg$currPos === input.length) {
	      return peg$result;
	    } else {
	      if (peg$result !== peg$FAILED && peg$currPos < input.length) {
	        peg$fail({ type: "end", description: "end of input" });
	      }

	      throw peg$buildException(null, peg$maxFailExpected, peg$maxFailPos);
	    }
	  }

	  return {
	    SyntaxError: SyntaxError,
	    parse:       parse
	  };
	})();

	//# sourceMappingURL=parser.js.map

/***/ },
/* 33 */
/***/ function(module, exports) {

	// GENERATED FILE
	"use strict";
	exports["default"] = {"locale":"en","pluralRuleFunction":function (n,ord){var s=String(n).split("."),v0=!s[1],t0=Number(s[0])==n,n10=t0&&s[0].slice(-1),n100=t0&&s[0].slice(-2);if(ord)return n10==1&&n100!=11?"one":n10==2&&n100!=12?"two":n10==3&&n100!=13?"few":"other";return n==1&&v0?"one":"other"}};

	//# sourceMappingURL=en.js.map

/***/ },
/* 34 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	/* jshint node:true */

	'use strict';

	var IntlRelativeFormat = __webpack_require__(36)['default'];

	// Add all locale data to `IntlRelativeFormat`. This module will be ignored when
	// bundling for the browser with Browserify/Webpack.
	__webpack_require__(41);

	// Re-export `IntlRelativeFormat` as the CommonJS default exports with all the
	// locale data registered, and with English set as the default locale. Define
	// the `default` prop for use with other compiled ES6 Modules.
	exports = module.exports = IntlRelativeFormat;
	exports['default'] = exports;


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	/* jslint esnext: true */

	"use strict";
	var src$core$$ = __webpack_require__(37), src$en$$ = __webpack_require__(40);

	src$core$$["default"].__addLocaleData(src$en$$["default"]);
	src$core$$["default"].defaultLocale = 'en';

	exports["default"] = src$core$$["default"];

	//# sourceMappingURL=main.js.map

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	/*
	Copyright (c) 2014, Yahoo! Inc. All rights reserved.
	Copyrights licensed under the New BSD License.
	See the accompanying LICENSE file for terms.
	*/

	/* jslint esnext: true */

	"use strict";
	var intl$messageformat$$ = __webpack_require__(25), src$diff$$ = __webpack_require__(38), src$es5$$ = __webpack_require__(39);
	exports["default"] = RelativeFormat;

	// -----------------------------------------------------------------------------

	var FIELDS = ['second', 'minute', 'hour', 'day', 'month', 'year'];
	var STYLES = ['best fit', 'numeric'];

	// -- RelativeFormat -----------------------------------------------------------

	function RelativeFormat(locales, options) {
	    options = options || {};

	    // Make a copy of `locales` if it's an array, so that it doesn't change
	    // since it's used lazily.
	    if (src$es5$$.isArray(locales)) {
	        locales = locales.concat();
	    }

	    src$es5$$.defineProperty(this, '_locale', {value: this._resolveLocale(locales)});
	    src$es5$$.defineProperty(this, '_options', {value: {
	        style: this._resolveStyle(options.style),
	        units: this._isValidUnits(options.units) && options.units
	    }});

	    src$es5$$.defineProperty(this, '_locales', {value: locales});
	    src$es5$$.defineProperty(this, '_fields', {value: this._findFields(this._locale)});
	    src$es5$$.defineProperty(this, '_messages', {value: src$es5$$.objCreate(null)});

	    // "Bind" `format()` method to `this` so it can be passed by reference like
	    // the other `Intl` APIs.
	    var relativeFormat = this;
	    this.format = function format(date, options) {
	        return relativeFormat._format(date, options);
	    };
	}

	// Define internal private properties for dealing with locale data.
	src$es5$$.defineProperty(RelativeFormat, '__localeData__', {value: src$es5$$.objCreate(null)});
	src$es5$$.defineProperty(RelativeFormat, '__addLocaleData', {value: function (data) {
	    if (!(data && data.locale)) {
	        throw new Error(
	            'Locale data provided to IntlRelativeFormat is missing a ' +
	            '`locale` property value'
	        );
	    }

	    RelativeFormat.__localeData__[data.locale.toLowerCase()] = data;

	    // Add data to IntlMessageFormat.
	    intl$messageformat$$["default"].__addLocaleData(data);
	}});

	// Define public `defaultLocale` property which can be set by the developer, or
	// it will be set when the first RelativeFormat instance is created by
	// leveraging the resolved locale from `Intl`.
	src$es5$$.defineProperty(RelativeFormat, 'defaultLocale', {
	    enumerable: true,
	    writable  : true,
	    value     : undefined
	});

	// Define public `thresholds` property which can be set by the developer, and
	// defaults to relative time thresholds from moment.js.
	src$es5$$.defineProperty(RelativeFormat, 'thresholds', {
	    enumerable: true,

	    value: {
	        second: 45,  // seconds to minute
	        minute: 45,  // minutes to hour
	        hour  : 22,  // hours to day
	        day   : 26,  // days to month
	        month : 11   // months to year
	    }
	});

	RelativeFormat.prototype.resolvedOptions = function () {
	    return {
	        locale: this._locale,
	        style : this._options.style,
	        units : this._options.units
	    };
	};

	RelativeFormat.prototype._compileMessage = function (units) {
	    // `this._locales` is the original set of locales the user specified to the
	    // constructor, while `this._locale` is the resolved root locale.
	    var locales        = this._locales;
	    var resolvedLocale = this._locale;

	    var field        = this._fields[units];
	    var relativeTime = field.relativeTime;
	    var future       = '';
	    var past         = '';
	    var i;

	    for (i in relativeTime.future) {
	        if (relativeTime.future.hasOwnProperty(i)) {
	            future += ' ' + i + ' {' +
	                relativeTime.future[i].replace('{0}', '#') + '}';
	        }
	    }

	    for (i in relativeTime.past) {
	        if (relativeTime.past.hasOwnProperty(i)) {
	            past += ' ' + i + ' {' +
	                relativeTime.past[i].replace('{0}', '#') + '}';
	        }
	    }

	    var message = '{when, select, future {{0, plural, ' + future + '}}' +
	                                 'past {{0, plural, ' + past + '}}}';

	    // Create the synthetic IntlMessageFormat instance using the original
	    // locales value specified by the user when constructing the the parent
	    // IntlRelativeFormat instance.
	    return new intl$messageformat$$["default"](message, locales);
	};

	RelativeFormat.prototype._getMessage = function (units) {
	    var messages = this._messages;

	    // Create a new synthetic message based on the locale data from CLDR.
	    if (!messages[units]) {
	        messages[units] = this._compileMessage(units);
	    }

	    return messages[units];
	};

	RelativeFormat.prototype._getRelativeUnits = function (diff, units) {
	    var field = this._fields[units];

	    if (field.relative) {
	        return field.relative[diff];
	    }
	};

	RelativeFormat.prototype._findFields = function (locale) {
	    var localeData = RelativeFormat.__localeData__;
	    var data       = localeData[locale.toLowerCase()];

	    // The locale data is de-duplicated, so we have to traverse the locale's
	    // hierarchy until we find `fields` to return.
	    while (data) {
	        if (data.fields) {
	            return data.fields;
	        }

	        data = data.parentLocale && localeData[data.parentLocale.toLowerCase()];
	    }

	    throw new Error(
	        'Locale data added to IntlRelativeFormat is missing `fields` for :' +
	        locale
	    );
	};

	RelativeFormat.prototype._format = function (date, options) {
	    var now = options && options.now !== undefined ? options.now : src$es5$$.dateNow();

	    if (date === undefined) {
	        date = now;
	    }

	    // Determine if the `date` and optional `now` values are valid, and throw a
	    // similar error to what `Intl.DateTimeFormat#format()` would throw.
	    if (!isFinite(now)) {
	        throw new RangeError(
	            'The `now` option provided to IntlRelativeFormat#format() is not ' +
	            'in valid range.'
	        );
	    }

	    if (!isFinite(date)) {
	        throw new RangeError(
	            'The date value provided to IntlRelativeFormat#format() is not ' +
	            'in valid range.'
	        );
	    }

	    var diffReport  = src$diff$$["default"](now, date);
	    var units       = this._options.units || this._selectUnits(diffReport);
	    var diffInUnits = diffReport[units];

	    if (this._options.style !== 'numeric') {
	        var relativeUnits = this._getRelativeUnits(diffInUnits, units);
	        if (relativeUnits) {
	            return relativeUnits;
	        }
	    }

	    return this._getMessage(units).format({
	        '0' : Math.abs(diffInUnits),
	        when: diffInUnits < 0 ? 'past' : 'future'
	    });
	};

	RelativeFormat.prototype._isValidUnits = function (units) {
	    if (!units || src$es5$$.arrIndexOf.call(FIELDS, units) >= 0) {
	        return true;
	    }

	    if (typeof units === 'string') {
	        var suggestion = /s$/.test(units) && units.substr(0, units.length - 1);
	        if (suggestion && src$es5$$.arrIndexOf.call(FIELDS, suggestion) >= 0) {
	            throw new Error(
	                '"' + units + '" is not a valid IntlRelativeFormat `units` ' +
	                'value, did you mean: ' + suggestion
	            );
	        }
	    }

	    throw new Error(
	        '"' + units + '" is not a valid IntlRelativeFormat `units` value, it ' +
	        'must be one of: "' + FIELDS.join('", "') + '"'
	    );
	};

	RelativeFormat.prototype._resolveLocale = function (locales) {
	    if (typeof locales === 'string') {
	        locales = [locales];
	    }

	    // Create a copy of the array so we can push on the default locale.
	    locales = (locales || []).concat(RelativeFormat.defaultLocale);

	    var localeData = RelativeFormat.__localeData__;
	    var i, len, localeParts, data;

	    // Using the set of locales + the default locale, we look for the first one
	    // which that has been registered. When data does not exist for a locale, we
	    // traverse its ancestors to find something that's been registered within
	    // its hierarchy of locales. Since we lack the proper `parentLocale` data
	    // here, we must take a naive approach to traversal.
	    for (i = 0, len = locales.length; i < len; i += 1) {
	        localeParts = locales[i].toLowerCase().split('-');

	        while (localeParts.length) {
	            data = localeData[localeParts.join('-')];
	            if (data) {
	                // Return the normalized locale string; e.g., we return "en-US",
	                // instead of "en-us".
	                return data.locale;
	            }

	            localeParts.pop();
	        }
	    }

	    var defaultLocale = locales.pop();
	    throw new Error(
	        'No locale data has been added to IntlRelativeFormat for: ' +
	        locales.join(', ') + ', or the default locale: ' + defaultLocale
	    );
	};

	RelativeFormat.prototype._resolveStyle = function (style) {
	    // Default to "best fit" style.
	    if (!style) {
	        return STYLES[0];
	    }

	    if (src$es5$$.arrIndexOf.call(STYLES, style) >= 0) {
	        return style;
	    }

	    throw new Error(
	        '"' + style + '" is not a valid IntlRelativeFormat `style` value, it ' +
	        'must be one of: "' + STYLES.join('", "') + '"'
	    );
	};

	RelativeFormat.prototype._selectUnits = function (diffReport) {
	    var i, l, units;

	    for (i = 0, l = FIELDS.length; i < l; i += 1) {
	        units = FIELDS[i];

	        if (Math.abs(diffReport[units]) < RelativeFormat.thresholds[units]) {
	            break;
	        }
	    }

	    return units;
	};

	//# sourceMappingURL=core.js.map

/***/ },
/* 38 */
/***/ function(module, exports) {

	/*
	Copyright (c) 2014, Yahoo! Inc. All rights reserved.
	Copyrights licensed under the New BSD License.
	See the accompanying LICENSE file for terms.
	*/

	/* jslint esnext: true */

	"use strict";

	var round = Math.round;

	function daysToYears(days) {
	    // 400 years have 146097 days (taking into account leap year rules)
	    return days * 400 / 146097;
	}

	exports["default"] = function (from, to) {
	    // Convert to ms timestamps.
	    from = +from;
	    to   = +to;

	    var millisecond = round(to - from),
	        second      = round(millisecond / 1000),
	        minute      = round(second / 60),
	        hour        = round(minute / 60),
	        day         = round(hour / 24),
	        week        = round(day / 7);

	    var rawYears = daysToYears(day),
	        month    = round(rawYears * 12),
	        year     = round(rawYears);

	    return {
	        millisecond: millisecond,
	        second     : second,
	        minute     : minute,
	        hour       : hour,
	        day        : day,
	        week       : week,
	        month      : month,
	        year       : year
	    };
	};

	//# sourceMappingURL=diff.js.map

/***/ },
/* 39 */
/***/ function(module, exports) {

	/*
	Copyright (c) 2014, Yahoo! Inc. All rights reserved.
	Copyrights licensed under the New BSD License.
	See the accompanying LICENSE file for terms.
	*/

	/* jslint esnext: true */

	"use strict";

	// Purposely using the same implementation as the Intl.js `Intl` polyfill.
	// Copyright 2013 Andy Earnshaw, MIT License

	var hop = Object.prototype.hasOwnProperty;
	var toString = Object.prototype.toString;

	var realDefineProp = (function () {
	    try { return !!Object.defineProperty({}, 'a', {}); }
	    catch (e) { return false; }
	})();

	var es3 = !realDefineProp && !Object.prototype.__defineGetter__;

	var defineProperty = realDefineProp ? Object.defineProperty :
	        function (obj, name, desc) {

	    if ('get' in desc && obj.__defineGetter__) {
	        obj.__defineGetter__(name, desc.get);
	    } else if (!hop.call(obj, name) || 'value' in desc) {
	        obj[name] = desc.value;
	    }
	};

	var objCreate = Object.create || function (proto, props) {
	    var obj, k;

	    function F() {}
	    F.prototype = proto;
	    obj = new F();

	    for (k in props) {
	        if (hop.call(props, k)) {
	            defineProperty(obj, k, props[k]);
	        }
	    }

	    return obj;
	};

	var arrIndexOf = Array.prototype.indexOf || function (search, fromIndex) {
	    /*jshint validthis:true */
	    var arr = this;
	    if (!arr.length) {
	        return -1;
	    }

	    for (var i = fromIndex || 0, max = arr.length; i < max; i++) {
	        if (arr[i] === search) {
	            return i;
	        }
	    }

	    return -1;
	};

	var isArray = Array.isArray || function (obj) {
	    return toString.call(obj) === '[object Array]';
	};

	var dateNow = Date.now || function () {
	    return new Date().getTime();
	};
	exports.defineProperty = defineProperty, exports.objCreate = objCreate, exports.arrIndexOf = arrIndexOf, exports.isArray = isArray, exports.dateNow = dateNow;

	//# sourceMappingURL=es5.js.map

/***/ },
/* 40 */
/***/ function(module, exports) {

	// GENERATED FILE
	"use strict";
	exports["default"] = {"locale":"en","pluralRuleFunction":function (n,ord){var s=String(n).split("."),v0=!s[1],t0=Number(s[0])==n,n10=t0&&s[0].slice(-1),n100=t0&&s[0].slice(-2);if(ord)return n10==1&&n100!=11?"one":n10==2&&n100!=12?"two":n10==3&&n100!=13?"few":"other";return n==1&&v0?"one":"other"},"fields":{"year":{"displayName":"year","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"one":"in {0} year","other":"in {0} years"},"past":{"one":"{0} year ago","other":"{0} years ago"}}},"month":{"displayName":"month","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"one":"in {0} month","other":"in {0} months"},"past":{"one":"{0} month ago","other":"{0} months ago"}}},"day":{"displayName":"day","relative":{"0":"today","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"one":"in {0} day","other":"in {0} days"},"past":{"one":"{0} day ago","other":"{0} days ago"}}},"hour":{"displayName":"hour","relativeTime":{"future":{"one":"in {0} hour","other":"in {0} hours"},"past":{"one":"{0} hour ago","other":"{0} hours ago"}}},"minute":{"displayName":"minute","relativeTime":{"future":{"one":"in {0} minute","other":"in {0} minutes"},"past":{"one":"{0} minute ago","other":"{0} minutes ago"}}},"second":{"displayName":"second","relative":{"0":"now"},"relativeTime":{"future":{"one":"in {0} second","other":"in {0} seconds"},"past":{"one":"{0} second ago","other":"{0} seconds ago"}}}}};

	//# sourceMappingURL=en.js.map

/***/ },
/* 41 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 */

	'use strict';

	/**
	 * Use invariant() to assert state which your program assumes to be true.
	 *
	 * Provide sprintf-style format (only %s is supported) and arguments
	 * to provide information about what broke and what you were
	 * expecting.
	 *
	 * The invariant message will be stripped in production, but the invariant
	 * will remain to ensure logic does not differ in production.
	 */

	var invariant = function(condition, format, a, b, c, d, e, f) {
	  if (process.env.NODE_ENV !== 'production') {
	    if (format === undefined) {
	      throw new Error('invariant requires an error message argument');
	    }
	  }

	  if (!condition) {
	    var error;
	    if (format === undefined) {
	      error = new Error(
	        'Minified exception occurred; use the non-minified dev environment ' +
	        'for the full error message and additional helpful warnings.'
	      );
	    } else {
	      var args = [a, b, c, d, e, f];
	      var argIndex = 0;
	      error = new Error(
	        format.replace(/%s/g, function() { return args[argIndex++]; })
	      );
	      error.name = 'Invariant Violation';
	    }

	    error.framesToPop = 1; // we don't care about invariant's own frame
	    throw error;
	  }
	};

	module.exports = invariant;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports = module.exports = __webpack_require__(44)['default'];
	exports['default'] = exports;


/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var src$es5$$ = __webpack_require__(45);
	exports["default"] = createFormatCache;

	// -----------------------------------------------------------------------------

	function createFormatCache(FormatConstructor) {
	    var cache = src$es5$$.objCreate(null);

	    return function () {
	        var args    = Array.prototype.slice.call(arguments);
	        var cacheId = getCacheId(args);
	        var format  = cacheId && cache[cacheId];

	        if (!format) {
	            format = new (src$es5$$.bind.apply(FormatConstructor, [null].concat(args)))();

	            if (cacheId) {
	                cache[cacheId] = format;
	            }
	        }

	        return format;
	    };
	}

	// -- Utilities ----------------------------------------------------------------

	function getCacheId(inputs) {
	    // When JSON is not available in the runtime, we will not create a cache id.
	    if (typeof JSON === 'undefined') { return; }

	    var cacheId = [];

	    var i, len, input;

	    for (i = 0, len = inputs.length; i < len; i += 1) {
	        input = inputs[i];

	        if (input && typeof input === 'object') {
	            cacheId.push(orderedProps(input));
	        } else {
	            cacheId.push(input);
	        }
	    }

	    return JSON.stringify(cacheId);
	}

	function orderedProps(obj) {
	    var props = [],
	        keys  = [];

	    var key, i, len, prop;

	    for (key in obj) {
	        if (obj.hasOwnProperty(key)) {
	            keys.push(key);
	        }
	    }

	    var orderedKeys = keys.sort();

	    for (i = 0, len = orderedKeys.length; i < len; i += 1) {
	        key  = orderedKeys[i];
	        prop = {};

	        prop[key] = obj[key];
	        props[i]  = prop;
	    }

	    return props;
	}

	//# sourceMappingURL=memoizer.js.map

/***/ },
/* 45 */
/***/ function(module, exports) {

	"use strict";
	/*
	Copyright (c) 2014, Yahoo! Inc. All rights reserved.
	Copyrights licensed under the New BSD License.
	See the accompanying LICENSE file for terms.
	*/

	/* jslint esnext: true */

	// Function.prototype.bind implementation from Mozilla Developer Network:
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind#Polyfill

	var bind = Function.prototype.bind || function (oThis) {
	    if (typeof this !== 'function') {
	      // closest thing possible to the ECMAScript 5
	      // internal IsCallable function
	      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
	    }

	    var aArgs   = Array.prototype.slice.call(arguments, 1),
	        fToBind = this,
	        fNOP    = function() {},
	        fBound  = function() {
	          return fToBind.apply(this instanceof fNOP
	                 ? this
	                 : oThis,
	                 aArgs.concat(Array.prototype.slice.call(arguments)));
	        };

	    if (this.prototype) {
	      // native functions don't have a prototype
	      fNOP.prototype = this.prototype;
	    }
	    fBound.prototype = new fNOP();

	    return fBound;
	};

	// Purposely using the same implementation as the Intl.js `Intl` polyfill.
	// Copyright 2013 Andy Earnshaw, MIT License

	var hop = Object.prototype.hasOwnProperty;

	var realDefineProp = (function () {
	    try { return !!Object.defineProperty({}, 'a', {}); }
	    catch (e) { return false; }
	})();

	var es3 = !realDefineProp && !Object.prototype.__defineGetter__;

	var defineProperty = realDefineProp ? Object.defineProperty :
	        function (obj, name, desc) {

	    if ('get' in desc && obj.__defineGetter__) {
	        obj.__defineGetter__(name, desc.get);
	    } else if (!hop.call(obj, name) || 'value' in desc) {
	        obj[name] = desc.value;
	    }
	};

	var objCreate = Object.create || function (proto, props) {
	    var obj, k;

	    function F() {}
	    F.prototype = proto;
	    obj = new F();

	    for (k in props) {
	        if (hop.call(props, k)) {
	            defineProperty(obj, k, props[k]);
	        }
	    }

	    return obj;
	};

	exports.bind = bind, exports.defineProperty = defineProperty, exports.objCreate = objCreate;

	//# sourceMappingURL=es5.js.map

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _store = __webpack_require__(9);

	var _store2 = _interopRequireDefault(_store);

	var _actions = __webpack_require__(19);

	var _actions2 = _interopRequireDefault(_actions);

	var _utility = __webpack_require__(17);

	var _utility2 = _interopRequireDefault(_utility);

	var _reactIntl = __webpack_require__(23);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	var MediaDirectorySelector = function MediaDirectorySelector(props) {
	  var _React$createElement;

	  var decoratedActions = props.decoratedActions ? Object.assign({}, _actions2.default, props.decoratedActions) : _actions2.default;

	  var optgroups = props.directory.map(function (source, index) {
	    // todo: rename props.directory to something that makes more sense (or combine it with the sources reducer?)
	    var opts = source.directories.sort(function (a, b) {
	      if (a.cd === b.cd) return 0;
	      return a.cd > b.cd ? 1 : -1;
	    }).map(function (directory, index) {
	      //console.log(props.source.currentSource.id == source.id && props.content.cd == directory.cd, props.source.currentSource.id, source.id, props.content.cd, directory.cd);
	      return _react2.default.createElement(
	        'option',
	        { key: index, value: source.id + '||' + directory.cd, checked: props.source.currentSource.id == source.id && props.content.cd == directory.cd },
	        directory.cd
	      );
	    });
	    return _react2.default.createElement(
	      'optgroup',
	      { key: index, label: source.name, 'data-source': source.id === undefined ? index : source.id },
	      _react2.default.createElement(
	        'option',
	        { value: source.id + '||/', checked: props.content.cd == "/" && props.source.currentSource == source.id },
	        './'
	      ),
	      opts
	    );
	  });

	  var hiddenInput = _react2.default.createElement('input', (_React$createElement = { type: 'hidden', name: (props.config.storagePrefix !== undefined ? props.config.storagePrefix : 'eureka__') + 'mediaSourceId' }, _defineProperty(_React$createElement, 'name', (props.config.storagePrefix !== undefined ? props.config.storagePrefix : 'eureka__') + 'mediaSourceId'), _defineProperty(_React$createElement, 'value', props.config.uid), _React$createElement));
	  var submit = _utility2.default.serverSideRendering ? _react2.default.createElement(
	    'button',
	    { type: 'submit' },
	    _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'directory.set', defaultMessage: 'Set Directory' })
	  ) : undefined;
	  var select = _react2.default.createElement(
	    'select',
	    { role: 'navigation', 'aria-live': 'polite', value: props.source.currentSource + '||' + props.content.cd, name: 'eureka__media-browser_0__browsing', id: 'eureka__media-browser_0__browsing', onChange: function onChange(event) {
	        var _utility$parseMediaSo = _utility2.default.parseMediaSourceOutOfCombinedPath(event.target.value, '||'),
	            _utility$parseMediaSo2 = _slicedToArray(_utility$parseMediaSo, 2),
	            cs = _utility$parseMediaSo2[0],
	            cd = _utility$parseMediaSo2[1]; // option values are like 0||assets/img/redwoods where 0 is the media source id and assets/img/redwoods is the directory
	        //console.log('YOLO',cs,cd);


	        _store2.default.dispatch(decoratedActions.updateSource(cs));
	        _store2.default.dispatch(decoratedActions.updateView({
	          fetchingContents: true
	        }));
	        _store2.default.dispatch(decoratedActions.updateContent({ // updates the "current directory" of the view right away
	          cd: cd,
	          contents: []
	        }));
	        _store2.default.dispatch(decoratedActions.fetchDirectoryContents(cs, { // asyncronously fetches the directory contents from the API
	          path: cd
	        }, props.config.headers));
	      } },
	    optgroups
	  );
	  var hiddenUploadDirectoryInput = _react2.default.createElement('input', { type: 'hidden', name: (props.config.storagePrefix !== undefined ? props.config.storagePrefix : 'eureka__') + 'upload-dir', value: props.content.cd });
	  var form = _utility2.default.serverSideRendering ? _react2.default.createElement(
	    'div',
	    null,
	    hiddenInput,
	    hiddenUploadDirectoryInput,
	    select,
	    submit
	  ) : _react2.default.createElement(
	    'form',
	    { action: '#' },
	    hiddenInput,
	    select,
	    submit
	  );

	  return _react2.default.createElement(
	    'div',
	    { className: 'eureka__media-directory-selector' },
	    _react2.default.createElement(
	      'label',
	      { htmlFor: 'eureka__media-browser_0__browsing' },
	      _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'directory.browse', defaultMessage: 'Browse Directory' }),
	      ':'
	    ),
	    '\u2002',
	    form
	  );
	};

	exports.default = MediaDirectorySelector;

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _Icon = __webpack_require__(48);

	var _Icon2 = _interopRequireDefault(_Icon);

	var _reactIntl = __webpack_require__(23);

	var _definedMessages = __webpack_require__(49);

	var _definedMessages2 = _interopRequireDefault(_definedMessages);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var TreeBar = function TreeBar(props) {
	  var formatMessage = props.intl.formatMessage,
	      uploadFileToMessage = formatMessage(_definedMessages2.default.uploadFileTo, {
	    cd: props.content.cd
	  }),
	      createFileInMessage = formatMessage(_definedMessages2.default.createFileInMessage, {
	    cd: props.content.cd
	  }),
	      uploadBtn = props.config.allowUploads ? _react2.default.createElement(
	    'button',
	    { title: uploadFileToMessage, onClick: function onClick(event) {
	        try {
	          event.target.parentNode.parentNode.querySelector('.eureka__drop-area-zone').click();
	        } catch (e) {}
	      } },
	    _react2.default.createElement(
	      'span',
	      { className: 'visually-hidden' },
	      uploadFileToMessage
	    ),
	    _react2.default.createElement(_Icon2.default, _extends({}, props, { icon: 'upload' }))
	  ) : undefined,
	      createFileBtn = props.config.handlers && props.config.handlers.createFile ? _react2.default.createElement(
	    'a',
	    _extends({}, props.config.handlers.createFile(props.source.currentSource, props.content.cd), { className: 'button', title: createFileInMessage }),
	    _react2.default.createElement(
	      'span',
	      { className: 'visually-hidden' },
	      createFileInMessage
	    ),
	    _react2.default.createElement(_Icon2.default, _extends({}, props, { icon: 'file-text-o' }))
	  ) : undefined,
	      createDirectoryInMessage = formatMessage(_definedMessages2.default.createNewDirectoryIn, {
	    cd: props.content.cd
	  });

	  return _react2.default.createElement(
	    'div',
	    { className: 'eureka__tree-bar' },
	    _react2.default.createElement(
	      'button',
	      { title: createDirectoryInMessage, onClick: props.onCreateDirectory },
	      _react2.default.createElement(
	        'span',
	        { className: 'visually-hidden' },
	        createDirectoryInMessage
	      ),
	      _react2.default.createElement(_Icon2.default, _extends({}, props, { icon: 'plus-square' }))
	    ),
	    createFileBtn,
	    uploadBtn
	  );
	};

	exports.default = TreeBar;

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _path = __webpack_require__(3);

	var _path2 = _interopRequireDefault(_path);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Icon = function Icon(props) {
	  var config = Object.assign({}, {
	    assetsBasePath: './assets/',
	    iconSVG: './img/icons.svg'
	  }, props.config);
	  return _react2.default.createElement(
	    'svg',
	    { 'aria-hidden': props.ariaHidden === undefined ? true : props.ariaHidden, className: 'icon icon-' + props.icon },
	    _react2.default.createElement('use', { xlinkHref: _path2.default.join(config.assetsBasePath, config.iconSVG) + '#icon-' + props.icon })
	  );
	};

	exports.default = Icon;

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _defineMessages;

	var _reactIntl = __webpack_require__(23);

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	exports.default = (0, _reactIntl.defineMessages)((_defineMessages = {
	  directory: {
	    'id': 'directory.create',
	    'defaultMessage': 'Create a Directory'
	  },
	  createNewDirectoryIn: {
	    'id': 'directory.createNewIn',
	    'defaultMessage': 'Create a new Directory in {cd}'
	  },
	  choose: {
	    'id': 'choose',
	    'defaultMessage': 'Choose'
	  },
	  cancel: {
	    'id': 'cancel',
	    'defaultMessage': 'Cancel'
	  },
	  mediaSourceTree: {
	    'id': 'mediaSourceTree',
	    'defaultMessage': 'Media Source Panel'
	  },
	  close: {
	    'id': 'close',
	    'defaultMessage': 'Close'
	  },
	  open: {
	    'id': 'open',
	    'defaultMessage': 'Open'
	  },
	  rename: {
	    'id': 'rename',
	    'defaultMessage': 'Rename'
	  },
	  welcomeToEureka: {
	    'id': 'welcomeToEureka',
	    'defaultMessage': 'Welcome to Eureka. You found it.'
	  },
	  delete: {
	    'id': 'delete',
	    'defaultMessage': 'Delete'
	  },
	  in: {
	    'id': 'in',
	    'defaultMessage': 'in'
	  },
	  createFile: {
	    'id': 'file.create',
	    'defaultMessage': 'Create File'
	  },
	  contentsOfBy: {
	    'id': 'contents.ofby',
	    'defaultMessage': 'contents of {cd} by filename, filesize, dimensions or even modification date'
	  },
	  filterContentsOfBy: {
	    'id': 'contents.filterBy',
	    'defaultMessage': 'Filter contents of {cd} by filename, filesize, dimensions or even modification date'
	  },
	  quickCreateFile: {
	    'id': 'file.quickCreate',
	    'defaultMessage': 'Quick Create Files'
	  },
	  cannotRename: {
	    'id': 'rename.cannot',
	    'defaultMessage': 'Cannot rename {filename} to the same name'
	  },
	  expand: {
	    'id': 'expand',
	    'defaultMessage': 'Expand'
	  },
	  chooseItem: {
	    'id': 'choose.item',
	    'defaultMessage': 'Choose {filename}'
	  },
	  renameItem: {
	    'id': 'rename.item',
	    'defaultMessage': 'Rename {filename}'
	  },
	  deleteDirectory: {
	    'id': 'directory.delete',
	    'defaultMessage': 'Delete Directory'
	  },
	  fetchingContents: {
	    'id': 'contents.fetchingContents',
	    'defaultMessage': 'Hold tight while we fetch {cd}'
	  },
	  deleteItem: {
	    'id': 'delete.item',
	    'defaultMessage': 'Delete {filename}'
	  },
	  deletedItem: {
	    'id': 'deleted.item',
	    'defaultMessage': 'Deleted {filename}'
	  },
	  download: {
	    'id': 'download',
	    'defaultMessage': 'Download'
	  },
	  downloadItem: {
	    'id': 'download.item',
	    'defaultMessage': 'Download {filename}'
	  },
	  expandItem: {
	    'id': 'expand.item',
	    'defaultMessage': 'Expand {filename}'
	  },
	  refreshDirectory: {
	    'id': 'directory.refresh',
	    'defaultMessage': 'Refresh Directory'
	  },
	  uploadFiles: {
	    'id': 'upload.files',
	    'defaultMessage': 'Upload Files'
	  },
	  uploadFileTo: {
	    'id': 'upload.filesTo',
	    'defaultMessage': 'Upload File to {cd}'
	  },
	  createFileInMessage: {
	    'id': 'upload.createFileIn',
	    'defaultMessage': 'Create File in {cd}'
	  },
	  closeMediaBrowser: {
	    'id': 'close.mediaBrowser',
	    'defaultMessage': 'Close Media Browser'
	  },
	  performContextualActions: {
	    'id': 'context.performActions',
	    'defaultMessage': 'Perform Actions such as Expand or Choose on {filename}'
	  }
	}, _defineProperty(_defineMessages, 'choose', {
	  'id': 'choose',
	  'defaultMessage': 'Choose'
	}), _defineProperty(_defineMessages, 'chmodDirectory', {
	  'id': 'directory.chmod',
	  'defaultMessage': 'chmod Directory'
	}), _defineProperty(_defineMessages, 'item', {
	  'id': 'item',
	  'defaultMessage': 'item'
	}), _defineProperty(_defineMessages, 'tabularLayoutDescription', {
	  'id': 'layout.tabular',
	  'defaultMessage': 'Tabular Layout displays image thumbnails along with Name, Description, File Size and Edited On columns'
	}), _defineProperty(_defineMessages, 'thumbnailLayoutDescription', {
	  'id': 'layout.thumbnail',
	  'defaultMessage': 'Thumbnail layout displays a grid of medium sized thumbnails'
	}), _defineProperty(_defineMessages, 'gridLayoutDescription', {
	  'id': 'layout.grid',
	  'defaultMessage': 'Grid View displays images a grid of large images'
	}), _defineProperty(_defineMessages, 'listLayoutDescription', {
	  'id': 'layout.list',
	  'defaultMessage': 'List Layout displays Name, Description, File Size and Edited On columns'
	}), _defineProperty(_defineMessages, 'openFileInNewTab', {
	  'id': 'file.openInNewTab',
	  'defaultMessage': 'Open {filename} in a new tab'
	}), _defineProperty(_defineMessages, 'mediaItem', {
	  'id': 'mediaItem',
	  'defaultMessage': 'media item'
	}), _defineProperty(_defineMessages, 'toggle', {
	  'id': 'toggle',
	  'defaultMessage': 'Toggle'
	}), _defineProperty(_defineMessages, 'pluralItem', {
	  'id': 'pluralItem',
	  'defaultMessage': 'a media item'
	}), _defineProperty(_defineMessages, 'pluralChoose', {
	  'id': 'pluralChoose',
	  'defaultMessage': 'item'
	}), _defineProperty(_defineMessages, 'copyListofSelectedFiles', {
	  'id': 'copyListofSelectedFiles',
	  'defaultMessage': 'Copy list of selected files'
	}), _defineProperty(_defineMessages, 'mediaSourceTreeMessage', {
	  'id': 'media.sourceTree',
	  'defaultMessage': 'Media Source Panel'
	}), _defineProperty(_defineMessages, 'dragFilesUploading', {
	  'id': 'upload.dragFilesUploading',
	  'defaultMessage': 'Uploading files\u2026'
	}), _defineProperty(_defineMessages, 'dragFilesToBeUploadedTo', {
	  'id': 'upload.dragFilestoUpload',
	  'defaultMessage': 'Drag files here to be uploaded to {cd}'
	}), _defineMessages));

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.TreeToggle = undefined;

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _store = __webpack_require__(9);

	var _store2 = _interopRequireDefault(_store);

	var _actions = __webpack_require__(19);

	var _actions2 = _interopRequireDefault(_actions);

	var _Icon = __webpack_require__(48);

	var _Icon2 = _interopRequireDefault(_Icon);

	var _definedMessages = __webpack_require__(49);

	var _definedMessages2 = _interopRequireDefault(_definedMessages);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var TreeToggle = exports.TreeToggle = function TreeToggle(props) {
	  var formatMessage = props.intl.formatMessage,

	  //closeMessage = formatMessage(definedMessages.close),
	  //openMessage = formatMessage(definedMessages.open),
	  //toggleMessage = formatMessage(definedMessages.toggle),
	  mediaSourceTreeMessage = formatMessage(_definedMessages2.default.mediaSourceTreeMessage);
	  //<Icon {...props} icon={`caret-square-o-${props.view.sourceTreeOpen ? 'left' : 'right'}`} />&ensp;
	  return _react2.default.createElement(
	    'div',
	    null,
	    _react2.default.createElement(
	      'button',
	      { role: 'menuitem', id: 'eureka__tree-toggle__button', 'aria-controls': 'eureka__pathbrowser', 'aria-pressed': props.view.sourceTreeOpen, 'aria-expanded': props.view.sourceTreeOpen, onClick: function onClick(event) {
	          _store2.default.dispatch(_actions2.default.updateView({
	            sourceTreeOpen: !props.view.sourceTreeOpen
	          }));
	        } },
	      '' + mediaSourceTreeMessage
	    )
	  );
	};

	//import { FormattedMessage } from 'react-intl';
	exports.default = TreeToggle;

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _store = __webpack_require__(9);

	var _store2 = _interopRequireDefault(_store);

	var _actions = __webpack_require__(19);

	var _actions2 = _interopRequireDefault(_actions);

	var _utility = __webpack_require__(17);

	var _utility2 = _interopRequireDefault(_utility);

	var _reactIntl = __webpack_require__(23);

	var _definedMessages = __webpack_require__(49);

	var _definedMessages2 = _interopRequireDefault(_definedMessages);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var ChooseBar = function ChooseBar(props) {
	  //console.log('ChooseBar',props);

	  var _props$intl = props.intl,
	      formatMessage = _props$intl.formatMessage,
	      formatPlural = _props$intl.formatPlural,
	      closeMediaBrowserMessage = formatMessage(_definedMessages2.default.closeMediaBrowser),
	      chooseMessage = formatMessage(_definedMessages2.default.choose),
	      mediaItem = formatMessage(_definedMessages2.default.mediaItem),
	      pluralItemPlaceholder = formatPlural(_definedMessages2.default.pluralItem),
	      fileNames = props.content.chosenMediaItemsInverted.map(function (item) {
	    return item.filename;
	  }),
	      deleteBtnFormFileNames = props.content.chosenMediaItemsInverted.map(function (item) {
	    return _react2.default.createElement('input', { type: 'hidden', name: 'delete_file[]', key: item.filename, value: item.filename });
	  }),
	      len = props.content.chosenMediaItemsInverted.length,
	      pluralChooseItemPlaceholder = _definedMessages2.default.pluralChoose[formatPlural({
	    value: len
	  })],
	      cancelMessage = formatMessage(_definedMessages2.default.cancel),
	      postChooseMessage = len > 1 && props.view.chooseMultiple ? ' ' + len + ' ' + pluralChooseItemPlaceholder : _react2.default.createElement(
	    'span',
	    { className: 'visually-hidden' },
	    ' ',
	    function () {
	      try {
	        return props.view.focusedMediaItem.filename || ' ' + pluralItemPlaceholder;
	      } catch (e) {
	        return ' ' + mediaItem;
	      }
	    }()
	  ),
	      chooseBtn = props.config.allowChoose ? _react2.default.createElement(
	    'button',
	    { 'aria-describedby': props.config.storagePrefix + 'selected_file_names', id: (props.config.storagePrefix !== undefined ? props.config.storagePrefix : 'eureka__') + 'choose-button', className: 'eureka__primary', disabled: !props.view.focusedMediaItem && !_utility2.default.serverSideRendering, onClick: function onClick(event) {
	        if (props.view.chooseMultiple) {
	          if (props.view.selectionInverted) props.config.callbacks.choose(props.content.chosenMediaItemsInverted);else props.config.callbacks.choose(props.content.chosenMediaItems);
	          return;
	        }
	        if (!props.view.focusedMediaItem) return;
	        try {
	          props.config.callbacks.choose(props.view.focusedMediaItem);
	        } catch (e) {
	          console.log(e);
	        }
	      } },
	    chooseMessage,
	    postChooseMessage
	  ) : undefined,
	      deleteBtn = len > 1 && props.view.chooseMultiple && props.config.allowDelete ? _react2.default.createElement(
	    'form',
	    { onSubmit: function onSubmit(event) {
	        event.preventDefault();
	        event.stopPropagation();
	        var formData = new FormData(event.target);
	        /*for(var pair of formData.entries()) {
	           console.log(pair[0]+ ', '+ pair[1]);
	        }*/

	        //console.log('yolo', formData.getAll('delete_file[]'));

	        _store2.default.dispatch(_actions2.default.deleteMediaItems(props.source.currentSource, formData, props.config.headers)).then(function () {
	          _store2.default.dispatch(_actions2.default.notify('Deleted ' + formData.getAll('delete_file[]').length + ' ' + _definedMessages2.default.pluralItem[formatPlural({
	            value: formData.getAll('delete_file[]').length
	          })], _utility2.default.DANGEROUS));
	        });

	        /*for (var value of formData.values()) {
	          console.log(value);
	        }*/
	      } },
	    _react2.default.createElement('input', { type: 'hidden', name: 'cd', value: props.content.cd }),
	    _react2.default.createElement('input', { type: 'hidden', name: 'cs', value: props.source.currentSource }),
	    deleteBtnFormFileNames,
	    _react2.default.createElement(
	      'button',
	      { className: 'dangerous' },
	      _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'delete', defaultValue: 'Delete' }),
	      postChooseMessage
	    )
	  ) : undefined;

	  return _react2.default.createElement(
	    'div',
	    { 'aria-hidden': props.ariaHidden, className: 'eureka__button-bar eureka__choose-bar' },
	    _react2.default.createElement(
	      'button',
	      { 'aria-label': closeMediaBrowserMessage, onClick: function onClick(event) {
	          //console.log('closing');
	          try {
	            props.config.callbacks.close();
	          } catch (e) {
	            console.log(e);
	          }
	        } },
	      cancelMessage
	    ),
	    deleteBtn,
	    chooseBtn
	  );
	};

	exports.default = ChooseBar;

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _store = __webpack_require__(9);

	var _store2 = _interopRequireDefault(_store);

	var _actions = __webpack_require__(19);

	var _actions2 = _interopRequireDefault(_actions);

	var _utility = __webpack_require__(17);

	var _utility2 = _interopRequireDefault(_utility);

	var _filesize = __webpack_require__(18);

	var _filesize2 = _interopRequireDefault(_filesize);

	var _reactIntl = __webpack_require__(23);

	var _definedMessages = __webpack_require__(49);

	var _definedMessages2 = _interopRequireDefault(_definedMessages);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var SearchBar = function (_Component) {
	  _inherits(SearchBar, _Component);

	  function SearchBar(props) {
	    _classCallCheck(this, SearchBar);

	    var _this = _possibleConstructorReturn(this, (SearchBar.__proto__ || Object.getPrototypeOf(SearchBar)).call(this, props));

	    _this.state = {
	      placeholderField: 'filename',
	      lastDir: '/'
	    };
	    if (!_utility2.default.serverSideRendering && _this.props.view.intervals.searchBarPlaceholder) {
	      setInterval(function () {
	        _this.pickRandomField();
	      }, _this.props.view.intervals.searchBarPlaceholder);
	    }

	    return _this;
	  }

	  _createClass(SearchBar, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      //console.log('componentDidMount');
	      this.pickRandomField();

	      /*store.subscribe(() => {
	        if(this.state.lastDir !== store.getState().content.cd) this.pickRandomField();
	         this.setState({
	          lastDir:store.getState().content.cd
	        })
	      });*/
	    }
	  }, {
	    key: 'pickRandomField',
	    value: function pickRandomField() {
	      var random = Math.random();
	      var cases = ['filename', 'dimensions', 'editedOn', 'fileSize'];
	      this.setState({
	        placeholderField: cases[Math.round(Math.random() * (cases.length - 1))]
	      });
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this2 = this;

	      var props = this.props;

	      var formatMessage = props.intl.formatMessage;

	      var options = [_react2.default.createElement(
	        'option',
	        { key: '0' },
	        'FileSystem'
	      )];

	      var placeholder = function () {
	        try {
	          if (!props.content.contents.length) return "";
	        } catch (e) {
	          return "";
	        }

	        var randomItem = props.content.contents[Math.round(Math.random() * (props.content.contents.length - 1))];

	        switch (_this2.state.placeholderField) {
	          case 'filename':
	            return randomItem.filename;

	          case 'dimensions':
	            return randomItem.dimensions.join('x');

	          case 'editedOn':
	            return Math.random() < .5 ? new Date(randomItem.editedOn).toLocaleString() : new Date(randomItem.editedOn).toLocaleString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });

	          case 'fileSize':
	            return (0, _filesize2.default)(randomItem.fileSize, { round: 0 });
	        }
	      }();

	      //console.log('props',props);

	      var list = _react2.default.createElement(
	        'datalist',
	        { id: (props.config.storagePrefix !== undefined ? props.config.storagePrefix : 'eureka__') + '__datalist' },
	        props.content.contents.map(function (item) {
	          return _react2.default.createElement('option', { key: item.filename, value: item.filename });
	        })
	      );

	      var filterTitle = formatMessage(_definedMessages2.default.filterContentsOfBy, {
	        cd: props.content.cd
	      });

	      var contentsOfBy = formatMessage(_definedMessages2.default.contentsOfBy, {
	        cd: props.content.cd
	      });

	      var filterMessage = _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'filter', defaultMessage: 'Filter' });

	      return !_utility2.default.serverSideRendering ? _react2.default.createElement(
	        'form',
	        { role: 'search', className: 'eureka__search-bar', onSubmit: function onSubmit(event) {
	            return event.preventDefault();
	          } },
	        _react2.default.createElement(
	          'label',
	          { htmlFor: 'eureka__filter', title: filterTitle },
	          filterMessage,
	          _react2.default.createElement(
	            'span',
	            { className: 'visually-hidden' },
	            ' ',
	            contentsOfBy
	          ),
	          ':\u2002'
	        ),
	        _react2.default.createElement('input', { list: (props.config.storagePrefix !== undefined ? props.config.storagePrefix : 'eureka__') + '__datalist', type: 'text', name: 'eureka__filter', id: 'eureka__filter', placeholder: placeholder, value: props.view.filter, onChange: function onChange(event) {
	            _store2.default.dispatch(_actions2.default.updateView({
	              filter: event.target.value || undefined
	            }));
	          } }),
	        list
	      ) : _react2.default.createElement(
	        'div',
	        { className: 'eureka__search-bar' },
	        _react2.default.createElement(
	          'label',
	          { htmlFor: 'eureka__filter', title: filterTitle },
	          filterMessage,
	          _react2.default.createElement(
	            'span',
	            { className: 'visually-hidden' },
	            ' ',
	            contentsOfBy
	          ),
	          ':\u2002'
	        ),
	        _react2.default.createElement('input', { list: (props.config.storagePrefix !== undefined ? props.config.storagePrefix : 'eureka__') + '__datalist', type: 'text', name: 'eureka__filter', id: 'eureka__filter', placeholder: placeholder, value: props.view.filter, onChange: function onChange(event) {
	            _store2.default.dispatch(_actions2.default.updateView({
	              filter: event.target.value || undefined
	            }));
	          } }),
	        list
	      );
	    }
	  }]);

	  return SearchBar;
	}(_react.Component);

	exports.default = SearchBar;

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _store = __webpack_require__(9);

	var _store2 = _interopRequireDefault(_store);

	var _actions = __webpack_require__(19);

	var _actions2 = _interopRequireDefault(_actions);

	var _Icon = __webpack_require__(48);

	var _Icon2 = _interopRequireDefault(_Icon);

	var _classnames = __webpack_require__(54);

	var _classnames2 = _interopRequireDefault(_classnames);

	var _utility = __webpack_require__(17);

	var _reactIntl = __webpack_require__(23);

	var _definedMessages = __webpack_require__(49);

	var _definedMessages2 = _interopRequireDefault(_definedMessages);

	var _FullScreenPureComponent = __webpack_require__(55);

	var _FullScreenPureComponent2 = _interopRequireDefault(_FullScreenPureComponent);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ViewChooser = function (_FullScreenPureCompon) {
	  _inherits(ViewChooser, _FullScreenPureCompon);

	  function ViewChooser() {
	    _classCallCheck(this, ViewChooser);

	    return _possibleConstructorReturn(this, (ViewChooser.__proto__ || Object.getPrototypeOf(ViewChooser)).apply(this, arguments));
	  }

	  _createClass(ViewChooser, [{
	    key: 'render',
	    value: function render() {
	      var _this2 = this;

	      //console.log('ViewChooser', this.props);
	      var props = this.props,
	          formatMessage = props.intl.formatMessage,
	          tabularLayoutMessage = formatMessage(_definedMessages2.default.tabularLayoutDescription),
	          thumbLayoutMessage = formatMessage(_definedMessages2.default.thumbnailLayoutDescription),
	          gridLayoutMessage = formatMessage(_definedMessages2.default.gridLayoutDescription),
	          listLayoutMessage = formatMessage(_definedMessages2.default.listLayoutDescription),
	          fullscreenToggle = props.view.allowFullscreen && this.state.supportsFullscreen ? _react2.default.createElement(
	        'div',
	        null,
	        _react2.default.createElement('input', { type: 'checkbox', id: 'eureka__fullscreen-toggle', name: 'eureka__fullscreen-toggle', value: '1', onChange: function onChange(event) {
	            var closestRoot = event.target.closest('.eureka-root');
	            var isFullscreen = false;
	            if (event.target.checked) {
	              try {
	                closestRoot.requestFullscreen();
	              } catch (e) {
	                (0, _utility.runPrefixMethod)(closestRoot, 'RequestFullscreen');
	              }
	              isFullscreen = true;
	            } else {
	              try {
	                closestRoot.exitFullscreen();
	              } catch (e) {
	                (0, _utility.runPrefixMethod)(document, 'ExitFullscreen');
	                (0, _utility.runPrefixMethod)(document, 'CancelFullscreen');
	              }
	            }
	            _this2.setState({
	              isFullscreen: isFullscreen
	            });
	          } }),
	        _react2.default.createElement(
	          'label',
	          { className: (0, _classnames2.default)({
	              'eureka__checked-active': this.state.isFullscreen
	            }), htmlFor: 'eureka__fullscreen-toggle' },
	          _react2.default.createElement(
	            'span',
	            { className: 'visually-hidden' },
	            _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'layout.fullscreenMode', defaultMessage: 'Fullscreen Mode' })
	          ),
	          _react2.default.createElement(_Icon2.default, _extends({}, props, { 'aria-hidden': 'true', icon: this.state.isFullscreen ? 'compress' : 'expand' }))
	        )
	      ) : undefined;

	      return _react2.default.createElement(
	        'form',
	        { className: 'eureka__layout-chooser' },
	        _react2.default.createElement(
	          'fieldset',
	          null,
	          _react2.default.createElement(
	            'legend',
	            null,
	            'Choose a Layout Mode'
	          ),
	          _react2.default.createElement(
	            'div',
	            { className: 'eureka__icon-radio-btns' },
	            _react2.default.createElement(
	              'div',
	              null,
	              _react2.default.createElement('input', { type: 'radio', id: 'eureka__view-table', name: 'eureka__view', onChange: function onChange(event) {
	                  return _store2.default.dispatch(_actions2.default.updateView({
	                    mode: event.target.value
	                  }));
	                }, checked: props.view.mode === 'table', value: 'table' }),
	              '\u2003',
	              _react2.default.createElement(
	                'label',
	                { htmlFor: 'eureka__view-table', title: tabularLayoutMessage },
	                _react2.default.createElement(_Icon2.default, _extends({}, props, { icon: 'th-list' })),
	                _react2.default.createElement(
	                  'span',
	                  { className: 'visually-hidden' },
	                  _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'layout.table', defaultMessage: 'Table Layout' })
	                )
	              )
	            ),
	            _react2.default.createElement(
	              'div',
	              null,
	              _react2.default.createElement('input', { type: 'radio', id: 'eureka__view-thumb', name: 'eureka__view', onChange: function onChange(event) {
	                  return _store2.default.dispatch(_actions2.default.updateView({
	                    mode: event.target.value
	                  }));
	                }, checked: props.view.mode === 'thumb', value: 'thumb' }),
	              '\u2003',
	              _react2.default.createElement(
	                'label',
	                { htmlFor: 'eureka__view-thumb', title: thumbLayoutMessage },
	                _react2.default.createElement(_Icon2.default, _extends({}, props, { icon: 'th-large' })),
	                _react2.default.createElement(
	                  'span',
	                  { className: 'visually-hidden' },
	                  _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'layout.thumb', defaultMessage: 'Thumbnail Layout' })
	                )
	              )
	            ),
	            _react2.default.createElement(
	              'div',
	              null,
	              _react2.default.createElement('input', { type: 'radio', id: 'eureka__view-grid', name: 'eureka__view', onChange: function onChange(event) {
	                  return _store2.default.dispatch(_actions2.default.updateView({
	                    mode: event.target.value
	                  }));
	                }, checked: props.view.mode === 'grid', value: 'grid' }),
	              '\u2003',
	              _react2.default.createElement(
	                'label',
	                { htmlFor: 'eureka__view-grid', title: gridLayoutMessage },
	                _react2.default.createElement(_Icon2.default, _extends({}, props, { icon: 'square' })),
	                _react2.default.createElement(
	                  'span',
	                  { className: 'visually-hidden' },
	                  _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'layout.grid', defaultMessage: 'Grid Layout' })
	                )
	              )
	            ),
	            _react2.default.createElement(
	              'div',
	              null,
	              _react2.default.createElement('input', { type: 'radio', id: 'eureka__view-list', name: 'eureka__view', onChange: function onChange(event) {
	                  return _store2.default.dispatch(_actions2.default.updateView({
	                    mode: event.target.value
	                  }));
	                }, checked: props.view.mode === 'list', value: 'list' }),
	              '\u2003',
	              _react2.default.createElement(
	                'label',
	                { htmlFor: 'eureka__view-list', title: listLayoutMessage },
	                _react2.default.createElement(_Icon2.default, _extends({}, props, { icon: 'list' })),
	                _react2.default.createElement(
	                  'span',
	                  { className: 'visually-hidden' },
	                  _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'layout.list', defaultMessage: 'List Layout' })
	                )
	              )
	            ),
	            fullscreenToggle
	          )
	        )
	      );
	    }
	  }]);

	  return ViewChooser;
	}(_FullScreenPureComponent2.default);

	exports.default = ViewChooser;

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	  Copyright (c) 2016 Jed Watson.
	  Licensed under the MIT License (MIT), see
	  http://jedwatson.github.io/classnames
	*/
	/* global define */

	(function () {
		'use strict';

		var hasOwn = {}.hasOwnProperty;

		function classNames () {
			var classes = [];

			for (var i = 0; i < arguments.length; i++) {
				var arg = arguments[i];
				if (!arg) continue;

				var argType = typeof arg;

				if (argType === 'string' || argType === 'number') {
					classes.push(arg);
				} else if (Array.isArray(arg)) {
					classes.push(classNames.apply(null, arg));
				} else if (argType === 'object') {
					for (var key in arg) {
						if (hasOwn.call(arg, key) && arg[key]) {
							classes.push(key);
						}
					}
				}
			}

			return classes.join(' ');
		}

		if (typeof module !== 'undefined' && module.exports) {
			module.exports = classNames;
		} else if (true) {
			// register as 'classnames', consistent with npm package name
			!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
				return classNames;
			}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else {
			window.classNames = classNames;
		}
	}());


/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var FullScreenPureComponent = function (_PureComponent) {
	  _inherits(FullScreenPureComponent, _PureComponent);

	  function FullScreenPureComponent(props) {
	    _classCallCheck(this, FullScreenPureComponent);

	    var _this = _possibleConstructorReturn(this, (FullScreenPureComponent.__proto__ || Object.getPrototypeOf(FullScreenPureComponent)).call(this, props));

	    _this.state = {
	      ifFullscreen: false,
	      supportsFullscreen: _this.featureDetectFullscreen()
	    };

	    // isn't this fun? why are you crying?
	    document.onfullscreenchange = document.onwebkitfullscreenchange = document.onmozfullscreenchange = document.onmsfullscreenchange = document.onwebkitfullscreenchange = _this.handleFullScreenChange.bind(_this);
	    return _this;
	  }

	  _createClass(FullScreenPureComponent, [{
	    key: 'handleFullScreenChange',
	    value: function handleFullScreenChange(event) {
	      this.setState({
	        isFullscreen: this.getFullScreenElement() !== undefined
	      });
	    }
	  }, {
	    key: 'featureDetectFullscreen',
	    value: function featureDetectFullscreen() {
	      return document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled;
	    }
	  }, {
	    key: 'getFullScreenElement',
	    value: function getFullScreenElement() {
	      return document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement || undefined;
	    }
	  }]);

	  return FullScreenPureComponent;
	}(_react.PureComponent);

	exports.default = FullScreenPureComponent;

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _store = __webpack_require__(9);

	var _store2 = _interopRequireDefault(_store);

	var _actions = __webpack_require__(19);

	var _actions2 = _interopRequireDefault(_actions);

	var _EurekaTableTbody = __webpack_require__(57);

	var _EurekaTableTbody2 = _interopRequireDefault(_EurekaTableTbody);

	var _classnames = __webpack_require__(54);

	var _classnames2 = _interopRequireDefault(_classnames);

	var _reactDropzone = __webpack_require__(84);

	var _reactDropzone2 = _interopRequireDefault(_reactDropzone);

	var _Icon = __webpack_require__(48);

	var _Icon2 = _interopRequireDefault(_Icon);

	var _utility = __webpack_require__(17);

	var _utility2 = _interopRequireDefault(_utility);

	var _reactIntl = __webpack_require__(23);

	var _definedMessages = __webpack_require__(49);

	var _definedMessages2 = _interopRequireDefault(_definedMessages);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var EurekaTable = function (_Component) {
	  _inherits(EurekaTable, _Component);

	  function EurekaTable(props) {
	    _classCallCheck(this, EurekaTable);

	    var _this = _possibleConstructorReturn(this, (EurekaTable.__proto__ || Object.getPrototypeOf(EurekaTable)).call(this, props));

	    _this.state = {
	      contents: function () {
	        try {
	          return _this.sortContents(props.content.contents, props.view);
	        } catch (e) {}
	        return [];
	      }(),
	      sort: Object.assign({}, {
	        by: 'filename',
	        dir: _utility2.default.ASCENDING,
	        renamingItem: undefined
	      }, props.sort)
	    };
	    _this.decoratedActions = props.decoratedActions ? Object.assign({}, _actions2.default, props.decoratedActions) : _actions2.default;
	    //console.log('EurekaTable constructor', props, this.state);
	    return _this;
	  }

	  /*componentShouldUpdate(nextProps, nextState) {
	    if(this.state !== nextState) return true;
	    if(this.props !== nextProps) return true;
	    //console.log('EurekaTable should not update');
	    return false;
	  }*/

	  _createClass(EurekaTable, [{
	    key: 'sortContents',
	    value: function sortContents() {
	      var contents = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.state.contents;
	      var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.props.view;

	      //console.log('sorting contents', contents, state.sort);
	      //return contents;
	      return contents.sort(function (a, b) {
	        if (a[state.sort.by] === b[state.sort.by]) return 0;

	        var n = void 0;

	        //console.log('props.sort.by',props.sort.by,a,b);

	        switch (state.sort.by) {
	          case 'dimensions':
	            n = a.dimensions[0] * a.dimensions[1] > b.dimensions[0] * b.dimensions[1] ? 1 : -1;
	            break;

	          case 'editedOn':
	            n = new Date(a.editedOn).getTime() > new Date(b.editedOn).getTime() ? 1 : -1;
	            break;

	          case 'fileSize':
	            n = a.fileSize < b.fileSize ? 1 : -1;
	            break;

	          default:
	            //console.log(a[state.sort.by], b[state.sort.by], a[state.sort.by] > b[state.sort.by]);
	            n = a[state.sort.by] < b[state.sort.by] ? 1 : -1;
	            break;
	        }

	        return state.sort.dir === _utility2.default.DESCENDING ? n : 0 - n;
	      });
	    }
	  }, {
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      //console.log('EurekaTable componentDidMount');
	      this.setState({
	        contents: this.sortContents(this.props.content.contents)
	      });
	    }
	  }, {
	    key: 'shouldComponentUpdate',
	    value: function shouldComponentUpdate(nextProps, nextState) {
	      if (nextProps.view.filter) return true;
	      if (this.state.sort !== nextState.sort) return true;
	      if (nextProps.content.contents !== this.state.contents) return true;
	      if (this.state.contents.length !== nextState.contents.length || this.state.contents !== nextState.contents) return true;
	      if (nextProps.view.chooseMultiple !== this.props.view.chooseMultiple) return true;

	      if (nextProps.view.sort !== this.props.view.sort) return true;
	      return true;
	      //console.log('EurekaTable should not update');
	      return false;
	    }
	  }, {
	    key: 'componentWillUpdate',
	    value: function componentWillUpdate(nextProps, nextState) {
	      //console.log('EurekaTable componentWillUpdate');
	      //console.log('nextProps.sort', nextProps.sort);
	      //console.log('nextState.sort', nextState.sort);
	      //console.log('this.props.sort', this.props.sort);
	      //console.log('nextState.sort', nextState.sort);

	      /*if(nextProps.sort !== nextState.sort) {
	        console.log('nextProps.sort !== nextState.sort');
	        this.setState({
	          sort: nextProps.sort,
	          //contents: this.sortContents(nextProps.content.contents, nextState)
	        });
	        return;
	      }*/

	      if (this.props.view.sort !== nextProps.view.sort || this.props.content.cd !== nextProps.content.cd) {
	        //console.log('this.props.view.sort !== nextProps.view.sort || this.props.content.cd !== nextProps.content.cd');
	        this.setState({
	          contents: this.sortContents(nextProps.content.contents, nextProps.view)
	        });
	      } else if (nextProps.content.contents !== this.props.content.contents) {
	        //console.log('nextProps.content.contents !== this.state.contents');
	        this.setState({
	          contents: nextProps.view.filter ? nextProps.content.contents : this.sortContents(nextProps.content.contents, nextProps.view)
	        });
	      }
	    }
	  }, {
	    key: 'onDrop',
	    value: function onDrop(files) {
	      var props = this.props;
	      //console.log('Received files: ', files);

	      var formData = new FormData();

	      var decoratedActions = this.decoratedActions;

	      files.forEach(function (file) {
	        formData.append('eureka__uploadFiles', file, file.name);
	      });

	      _store2.default.dispatch(_actions2.default.updateView({
	        isUploading: true
	      }));

	      _store2.default.dispatch(decoratedActions.uploadFiles(props.source.currentSource, props.content.cd, formData, props.config.headers));
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _React$createElement,
	          _this2 = this,
	          _React$createElement2,
	          _React$createElement3,
	          _React$createElement4,
	          _React$createElement5,
	          _React$createElement6;

	      var props = this.props,
	          state = this.state,
	          formatMessage = props.intl.formatMessage;

	      //console.log('render EurekaTable');

	      var decoratedActions = this.decoratedActions;

	      var html5ContextMenus = props.content.contents.length ? props.content.contents.map(function (item, index) {
	        var chooseMenuItem = props.config.allowChoose ? _react2.default.createElement('menuitem', { label: formatMessage(_definedMessages2.default.chooseItem, {
	            filename: item.filename
	          }), onClick: function onClick(event) {
	            // #janky
	            document.getElementById('choose__' + _utility2.default.cssSafe(item.filename)).click();
	          } }) : undefined,
	            downloadMenuItem = props.config.allowDownload ? _react2.default.createElement('menuitem', { label: formatMessage(_definedMessages2.default.downloadItem, {
	            filename: item.filename
	          }), onClick: function onClick(event) {
	            // #janky
	            var a = document.createElement('a');
	            a.setAttribute('download', item.filename);
	            a.href = item.absoluteURL;
	            a.classList.add('visually-hidden');
	            document.body.appendChild(a);
	            a.click();
	            a.remove();
	          } }) : undefined;
	        return _react2.default.createElement(
	          'menu',
	          { key: index, hidden: 'true', type: 'context', id: 'context_menu__tbody-' + index },
	          _react2.default.createElement('menuitem', { label: formatMessage(_definedMessages2.default.expandItem, {
	              filename: item.filename
	            }), onClick: function onClick(event) {
	              document.getElementById('expand__' + _utility2.default.cssSafe(item.filename)).click();
	            } }),
	          chooseMenuItem,
	          _react2.default.createElement('menuitem', { label: formatMessage(_definedMessages2.default.renameItem, {
	              item: item.filename
	            }), onClick: function onClick(event) {
	              document.getElementById((props.config.storagePrefix !== undefined ? props.config.storagePrefix : 'eureka__') + 'rename__' + _utility2.default.cssSafe(item.filename)).click();
	            } }),
	          _react2.default.createElement('menuitem', { label: formatMessage(_definedMessages2.default.deleteItem, {
	              filename: item.filename
	            }), onClick: function onClick(event) {
	              _store2.default.dispatch(decoratedActions.deleteMediaItem(props.source.currentSource, item.path, props.config.headers));
	            } }),
	          downloadMenuItem
	        );
	      }) : undefined;

	      var selectHead = _utility2.default.serverSideRendering ? _react2.default.createElement(
	        'th',
	        { scope: 'col', role: 'columnheader' },
	        'Select'
	      ) : undefined;
	      var checkboxHead = !_utility2.default.serverSideRendering && props.view.chooseMultiple ? _react2.default.createElement(
	        'th',
	        { scope: 'col', role: 'columnheader', className: 'eureka__choose' },
	        _react2.default.createElement(
	          'span',
	          { className: 'visually-hidden' },
	          _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'choose', defaultMessage: 'Choose' })
	        )
	      ) : undefined;

	      var table = _react2.default.createElement(
	        'table',
	        { className: 'eureka__table', cellSpacing: '0', cellPadding: '0', role: 'grid' },
	        _react2.default.createElement(
	          'thead',
	          { hidden: !props.content.contents.length, className: (0, _classnames2.default)(_store2.default.getState().view.isTableScrolling ? 'eureka__tbody-scrolling' : undefined) },
	          _react2.default.createElement(
	            'tr',
	            null,
	            selectHead,
	            checkboxHead,
	            _react2.default.createElement(
	              'th',
	              (_React$createElement = { role: 'rowheader', scope: 'col' }, _defineProperty(_React$createElement, 'role', 'columnheader'), _defineProperty(_React$createElement, 'className', 'eureka__th-media'), _React$createElement),
	              _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'media', defaultMessage: 'Media' })
	            ),
	            _react2.default.createElement(
	              'th',
	              (_React$createElement2 = { className: 'eureka__th-filename', 'aria-sort': props.view.sort.by === 'filename' ? props.view.sort.dir : undefined, role: 'rowheader', scope: 'col' }, _defineProperty(_React$createElement2, 'role', 'columnheader'), _defineProperty(_React$createElement2, 'onClick', function onClick(event) {
	                var dir = _this2.props.view.sort.dir;
	                //console.log("this.state.sort.by === 'filename'", this.state.sort.by === 'filename', dir);
	                if (_this2.props.view.sort.by === 'filename') {
	                  dir = dir === _utility2.default.ASCENDING ? _utility2.default.DESCENDING : _utility2.default.ASCENDING;
	                }
	                //console.log('dir',dir);
	                _store2.default.dispatch(_actions2.default.updateView({
	                  sort: {
	                    by: 'filename',
	                    dir: dir
	                  }
	                }));
	                /*this.setState({
	                  sort:{
	                    by:'filename',
	                    dir: dir
	                  }
	                });
	                this.props.handleSort({
	                  by: 'filename',
	                  dir: dir
	                });*/
	              }), _React$createElement2),
	              _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'name', defaultMessage: 'Name' }),
	              '\u2002',
	              !_utility2.default.serverSideRendering ? _react2.default.createElement(_Icon2.default, _extends({}, props, { icon: 'sort' })) : undefined
	            ),
	            _react2.default.createElement(
	              'th',
	              (_React$createElement3 = { role: 'rowheader', scope: 'col' }, _defineProperty(_React$createElement3, 'role', 'columnheader'), _defineProperty(_React$createElement3, 'className', 'visually-hidden eureka__th-actions'), _React$createElement3),
	              'Actions'
	            ),
	            _react2.default.createElement(
	              'th',
	              (_React$createElement4 = { className: 'eureka__th-dimensions', 'aria-sort': props.view.sort.by === 'dimensions' ? props.view.sort.dir : undefined, role: 'rowheader', scope: 'col' }, _defineProperty(_React$createElement4, 'role', 'columnheader'), _defineProperty(_React$createElement4, 'onClick', function onClick(event) {
	                var dir = _this2.state.sort.dir;
	                if (_this2.props.view.sort.by === 'dimensions') {
	                  dir = dir === _utility2.default.ASCENDING ? _utility2.default.DESCENDING : _utility2.default.ASCENDING;
	                }
	                _store2.default.dispatch(_actions2.default.updateView({
	                  sort: {
	                    by: 'dimensions',
	                    dir: dir
	                  }
	                }));
	                /*this.setState({
	                  sort:{
	                    by:'dimensions',
	                    dir: dir
	                  }
	                });
	                this.props.handleSort({
	                  by: 'dimensions',
	                  dir: dir
	                });*/
	              }), _React$createElement4),
	              _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'dimensions', defaultMessage: 'Dimensions' }),
	              '\u2002',
	              !_utility2.default.serverSideRendering ? _react2.default.createElement(_Icon2.default, _extends({}, props, { icon: 'sort' })) : undefined
	            ),
	            _react2.default.createElement(
	              'th',
	              (_React$createElement5 = { className: 'eureka__th-file-size', 'aria-sort': props.view.sort.by === 'fileSize' ? props.view.sort.dir : undefined, role: 'rowheader', scope: 'col' }, _defineProperty(_React$createElement5, 'role', 'columnheader'), _defineProperty(_React$createElement5, 'onClick', function onClick(event) {
	                var dir = _this2.state.sort.dir;
	                if (_this2.props.view.sort.by === 'fileSize') {
	                  dir = dir === _utility2.default.ASCENDING ? _utility2.default.DESCENDING : _utility2.default.ASCENDING;
	                }
	                _store2.default.dispatch(_actions2.default.updateView({
	                  sort: {
	                    by: 'fileSize',
	                    dir: dir
	                  }
	                }));
	                /*this.setState({
	                  sort:{
	                    by:'fileSize',
	                    dir:dir
	                  }
	                });
	                this.props.handleSort({
	                  by: 'fileSize',
	                  dir: dir
	                });*/
	              }), _React$createElement5),
	              _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'fileSize', defaultMessage: 'File Size' }),
	              '\u2002',
	              !_utility2.default.serverSideRendering ? _react2.default.createElement(_Icon2.default, _extends({}, props, { icon: 'sort' })) : undefined
	            ),
	            _react2.default.createElement(
	              'th',
	              (_React$createElement6 = { className: 'eureka__th-edited-on', 'aria-sort': props.view.sort.by === 'editedOn' ? props.view.sort.dir : undefined, role: 'rowheader', scope: 'col' }, _defineProperty(_React$createElement6, 'role', 'columnheader'), _defineProperty(_React$createElement6, 'onClick', function onClick(event) {
	                var dir = _this2.state.sort.dir;
	                if (_this2.props.view.sort.by === 'editedOn') {
	                  dir = dir === _utility2.default.ASCENDING ? _utility2.default.DESCENDING : _utility2.default.ASCENDING;
	                }
	                _store2.default.dispatch(_actions2.default.updateView({
	                  sort: {
	                    by: 'editedOn',
	                    dir: dir
	                  }
	                }));
	                /*this.setState({
	                  sort:{
	                    by:'editedOn',
	                    dir:dir
	                  }
	                });
	                this.props.handleSort({
	                  by: 'editedOn',
	                  dir: dir
	                });*/
	              }), _React$createElement6),
	              _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'editedOn', defaultMessage: 'Edited On' }),
	              '\u2002',
	              !_utility2.default.serverSideRendering ? _react2.default.createElement(_Icon2.default, _extends({}, props, { icon: 'sort' })) : undefined
	            )
	          )
	        ),
	        _react2.default.createElement(_EurekaTableTbody2.default, _extends({}, props, { intl: props.intl, filter: props.view.filter, content: props.content, contents: state.contents, sort: this.props.sort }))
	      );

	      var dz = props.config.doDragNDrop ? _react2.default.createElement(
	        _reactDropzone2.default,
	        { onDrop: this.onDrop.bind(this), disableClick: true, style: {} },
	        table,
	        html5ContextMenus
	      ) : _react2.default.createElement(
	        'div',
	        null,
	        table,
	        html5ContextMenus
	      );

	      return props.config.allowUploads && !_utility2.default.serverSideRendering ? dz : _react2.default.createElement(
	        'div',
	        null,
	        table
	      );
	    }
	  }]);

	  return EurekaTable;
	}(_react.Component);

	exports.default = EurekaTable;

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _MediaRow = __webpack_require__(58);

	var _MediaRow2 = _interopRequireDefault(_MediaRow);

	var _ContextMenu = __webpack_require__(59);

	var _ContextMenu2 = _interopRequireDefault(_ContextMenu);

	var _store = __webpack_require__(9);

	var _store2 = _interopRequireDefault(_store);

	var _actions = __webpack_require__(19);

	var _actions2 = _interopRequireDefault(_actions);

	var _filesize = __webpack_require__(18);

	var _filesize2 = _interopRequireDefault(_filesize);

	var _classnames = __webpack_require__(54);

	var _classnames2 = _interopRequireDefault(_classnames);

	var _utility = __webpack_require__(17);

	var _utility2 = _interopRequireDefault(_utility);

	var _Icon = __webpack_require__(48);

	var _Icon2 = _interopRequireDefault(_Icon);

	var _reactIntl = __webpack_require__(23);

	var _definedMessages = __webpack_require__(49);

	var _definedMessages2 = _interopRequireDefault(_definedMessages);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var EurekaTableTbody = function (_PureComponent) {
	  _inherits(EurekaTableTbody, _PureComponent);

	  function EurekaTableTbody(props) {
	    _classCallCheck(this, EurekaTableTbody);

	    var _this = _possibleConstructorReturn(this, (EurekaTableTbody.__proto__ || Object.getPrototypeOf(EurekaTableTbody)).call(this, props));

	    _this.state = {
	      focusedMediaItem: undefined,
	      filter: undefined
	    };

	    //this.handleResize = this.handleResizeEvent.bind(this);
	    return _this;
	  }

	  _createClass(EurekaTableTbody, [{
	    key: 'componentWillMount',
	    value: function componentWillMount() {
	      try {
	        window.addEventListener("resize", this.handleResize, false);
	      } catch (e) {}
	    }
	  }, {
	    key: 'componentWillUnmount',
	    value: function componentWillUnmount() {
	      try {
	        window.removeEventListener("resize", this.handleResize, false);
	      } catch (e) {}
	    }

	    /*componentDidMount() {
	      //console.log('EurekaTableTbody componentDidMount');
	      store.dispatch(actions.updateView({
	        isTableScrolling: this.isScrollable(this.tbody)
	      }));
	    }*/

	    /*isScrollable(el) {
	      const y1 = el.scrollTop;
	      el.scrollTop+=1;
	      const y2 = el.scrollTop;
	      el.scrollTop-=1;
	      const y3 = el.scrollTop;
	      el.scrollTop = y1;
	      const x1 = el.scrollLeft;
	      el.scrollTop+=1;
	      const x2 = el.scrollLeft;
	      el.scrollTop-=1;
	      const x3 = el.scrollLeft;
	      el.scrollLeft = x1;
	      return !(y1 === y2 && y2 === y3 && x1 === x2 && x2 === x3);
	    }
	     handleResizeEvent(event) {
	      const isScrollable = this.isScrollable(this.tbody);
	      if(isScrollable === store.getState().view.isTableScrolling) return;
	      store.dispatch(actions.updateView({
	        isTableScrolling:isScrollable
	      }));
	    }*/

	  }, {
	    key: 'handleRenameStart',
	    value: function handleRenameStart(item) {
	      console.log('handleRenameStart', item);
	    }

	    /*handleScroll(event) {
	      const isScrollable = this.isScrollable(this.tbody);
	      if(isScrollable === store.getState().view.isTableScrolling) return;
	      store.dispatch(actions.updateView({
	        isTableScrolling: isScrollable
	      }));
	    }*/

	  }, {
	    key: 'shouldComponentUpdate',
	    value: function shouldComponentUpdate(nextProps, nextState) {
	      return true;
	      console.log(this.props, this.state);
	      if (nextProps.view.filter || !nextProps.view.filter && this.props.view.filter) return true;
	      if (nextProps.view.sort !== this.props.view.sort) return true;
	      if (nextProps.view.chooseMultiple !== this.props.view.chooseMultiple) return true;
	      try {
	        //console.log('shouldComponentUpdate', (this.state.focusedMediaItem.path !== nextProps.view.focusedMediaItem.path), this.state.focusedMediaItem.path, nextProps.view.focusedMediaItem.path);
	        //if((this.state.focusedMediaItem.path !== nextProps.view.focusedMediaItem.path)) return true; // #janky SLOOOOW
	      } catch (e) {}
	      //console.log(this.props.contents[0], nextProps.contents[0]);
	      return !(this.props.contents === nextProps.contents);
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this2 = this;

	      //console.log('rendering EurekaTableTbody');
	      var props = this.props,
	          state = this.state;

	      //console.log('render EurekaTableTbody');

	      function shouldHide(item) {

	        try {
	          //console.log('shouldHide',props.view.focusedMediaItem.path,item.path,props.view.focusedMediaItem.path !== item.path);
	          return props.view.focusedMediaItem.path !== item.path;
	        } catch (e) {
	          //console.log('shouldHide',true);
	          return true;
	        }
	      }

	      var contents = props.contents;

	      if (props.filter) {
	        (function () {
	          // filter based on filename, dimensions, date
	          var filter = props.view.filter.toLowerCase();
	          contents = contents.filter(function (value) {
	            var editedOnDate = new Date(value.editedOn);
	            //console.log('value', value);
	            //return value.filename.toLowerCase().includes(filter);
	            return value.filename.toLowerCase().includes(filter) || value.dimensions.join('x').toLowerCase().includes(filter) || value.localString.toLowerCase().includes(filter) || value.localStringVerbose.toLowerCase().includes(filter) || value.fileSizeHumanReadable.toLowerCase().includes(filter) || value.fileSizeHumanReadable.toLowerCase().replace(/ +?/g, '').includes(filter);
	          });
	        })();
	      }

	      /*const sortContents = true;
	      contents = contents.sort((a,b) => {
	        if(a[props.sort.by] === b[props.sort.by]) return 0;
	         let n;
	         //console.log('props.sort.by',props.sort.by,a,b);
	         switch(props.sort.by) {
	          case 'dimensions':
	          n = a.dimensions[0] * a.dimensions[1] > b.dimensions[0] * b.dimensions[1] ? 1 : -1;
	          break;
	           case 'editedOn':
	          n = new Date(a.editedOn).getTime() > new Date(b.editedOn).getTime() ? 1 : -1;
	          break;
	           default:
	          n = (a[props.sort.by] > b[props.sort.by]) ? 1 : -1;
	          break;
	        }
	         return (props.sort.dir === utility.ASCENDING) ? n : 0-n;
	      });*/

	      var contentList = contents.length ? contents.map(function (item, index) {
	        return [_react2.default.createElement(_MediaRow2.default, _extends({ key: _utility2.default.cssSafe(item.filename) }, props, { intl: props.intl, focusedMediaItem: props.view.focusedMediaItem, renameStart: _this2.handleRenameStart, item: item, index: index, onFocus: function onFocus(event) {

	            /*this.setState({
	              focusedMediaItem: item
	            })*/
	            _store2.default.dispatch(_actions2.default.updateView({
	              focusedMediaItem: item
	            }));
	          },
	          onBlur: function onBlur(event) {}
	        }))];
	      }) : _react2.default.createElement(NoResults, props);

	      return (
	        //onScroll={this.handleScroll.bind(this)}
	        _react2.default.createElement(
	          'tbody',
	          { role: 'rowgroup', 'aria-live': 'polite', className: (0, _classnames2.default)({ empty: !contents.length }), ref: function ref(tbody) {
	              _this2.tbody = tbody;
	            } },
	          contentList
	        )
	      );
	    }
	  }]);

	  return EurekaTableTbody;
	}(_react.PureComponent);

	function NoResults(props) {
	  var searchTryAnother = _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'search.tryAnother', defaultMessage: 'Try another search' });

	  if (props.view.fetchingContents) {
	    return _react2.default.createElement(
	      'tr',
	      { role: 'row' },
	      _react2.default.createElement(
	        'td',
	        { role: 'presentation', colSpan: '5', className: 'comfortable' },
	        _react2.default.createElement(
	          'p',
	          { className: 'alert-info eureka__notice', 'aria-live': 'assertive' },
	          _react2.default.createElement(
	            'span',
	            { className: 'spinner' },
	            _react2.default.createElement(_Icon2.default, _extends({}, props, { icon: 'circle-o-notch' }))
	          ),
	          _react2.default.createElement('br', null),
	          _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'contents.fetchingContents', defaultMessage: 'Hold tight while we fetch {cd}', values: {
	              cd: props.content.cd
	            } })
	        )
	      )
	    );
	  }

	  return props.view.filter ? _react2.default.createElement(
	    'tr',
	    { role: 'row' },
	    _react2.default.createElement(
	      'td',
	      { role: 'presentation', colSpan: '5', className: 'comfortable' },
	      _react2.default.createElement(
	        'p',
	        { className: 'alert-info eureka__notice', 'aria-live': 'assertive' },
	        _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'search.noResults', defaultMessage: 'Uh oh. No results found for "{filter}"', values: {
	            filter: props.view.filter
	          } }),
	        '. ',
	        _react2.default.createElement(
	          'a',
	          { href: '#eureka__filter', onClick: function onClick(event) {
	              event.preventDefault();
	              document.getElementById('eureka__filter').focus();
	            } },
	          searchTryAnother
	        ),
	        ' ',
	        _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'grammar.or', defaultMessage: 'or' }),
	        ' ',
	        _react2.default.createElement(
	          'a',
	          { href: '#eureka__filter', onClick: function onClick(event) {
	              event.preventDefault();
	              _store2.default.dispatch(_actions2.default.updateView({
	                filter: undefined
	              }));
	              document.getElementById('eureka__filter').value = '';
	            } },
	          _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'search.clearFilter', defaultMessage: 'clear the search\xA0filter' })
	        ),
	        '.'
	      )
	    )
	  ) : _react2.default.createElement(
	    'tr',
	    { role: 'row' },
	    _react2.default.createElement(
	      'td',
	      { role: 'presentation', colSpan: '5', className: 'comfortable' },
	      _react2.default.createElement(
	        'p',
	        { className: 'alert-info eureka__notice', 'aria-live': 'assertive' },
	        _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'directory.appearsToBeEmpty', defaultMessage: 'Directory "{cd}" appears to be empty.', values: {
	            cd: props.content.cd
	          } }),
	        _react2.default.createElement('br', null),
	        _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'perhapsYouWouldLikeTo', defaultMessage: 'Perhaps you\'d like to' }),
	        ' ',
	        _react2.default.createElement(
	          'a',
	          { href: '#eureka__upload-form', onClick: function onClick(event) {
	              event.preventDefault();
	              //document.getElementById('eureka__upload-form').focus();

	              try {
	                // wont work if the sidebar is closed
	                document.getElementById('eureka__upload-form').click();
	              } catch (e) {
	                document.querySelector('.eureka__drop-area-zone').click();
	              }
	            } },
	          _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'upload.someFiles', defaultMessage: 'upload some files' }),
	          _react2.default.createElement(
	            'span',
	            { className: 'visually-hidden' },
	            ' ',
	            _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'grammar.to', defaultMessage: 'to' }),
	            ' ',
	            props.content.cd
	          )
	        ),
	        '?'
	      )
	    )
	  );
	}

	exports.default = EurekaTableTbody;

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _filesize = __webpack_require__(18);

	var _filesize2 = _interopRequireDefault(_filesize);

	var _ContextMenu = __webpack_require__(59);

	var _ContextMenu2 = _interopRequireDefault(_ContextMenu);

	var _store = __webpack_require__(9);

	var _store2 = _interopRequireDefault(_store);

	var _actions = __webpack_require__(19);

	var _actions2 = _interopRequireDefault(_actions);

	var _utility = __webpack_require__(17);

	var _utility2 = _interopRequireDefault(_utility);

	var _path = __webpack_require__(3);

	var _path2 = _interopRequireDefault(_path);

	var _classnames = __webpack_require__(54);

	var _classnames2 = _interopRequireDefault(_classnames);

	var _Icon = __webpack_require__(48);

	var _Icon2 = _interopRequireDefault(_Icon);

	var _mousetrap = __webpack_require__(61);

	var _mousetrap2 = _interopRequireDefault(_mousetrap);

	var _reactIntl = __webpack_require__(23);

	var _definedMessages = __webpack_require__(49);

	var _definedMessages2 = _interopRequireDefault(_definedMessages);

	var _reactTapEventPlugin = __webpack_require__(62);

	var _reactTapEventPlugin2 = _interopRequireDefault(_reactTapEventPlugin);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var pathParse = __webpack_require__(83);

	try {
	  (0, _reactTapEventPlugin2.default)();
	} catch (e) {}

	var MediaRow = function (_PureComponent) {
	  _inherits(MediaRow, _PureComponent);

	  function MediaRow(props) {
	    _classCallCheck(this, MediaRow);

	    var _this = _possibleConstructorReturn(this, (MediaRow.__proto__ || Object.getPrototypeOf(MediaRow)).call(this, props));

	    _this.state = {
	      focusWithin: false,
	      chooseChecked: false
	    };

	    _this.handleKeyboardBackspace = _this.handleKeyboardBackspace.bind(_this);
	    _this.handleKeyboardChoose = _this.handleKeyboardChoose.bind(_this);
	    _this.handleKeyboardExpand = _this.handleKeyboardExpand.bind(_this);
	    _this.handleKeyboardRename = _this.handleKeyboardRename.bind(_this);
	    return _this;
	  }

	  _createClass(MediaRow, [{
	    key: 'componentWillUpdate',
	    value: function componentWillUpdate(nextProps, nextState) {
	      //return;
	      //console.log('MediaRow componentWillUpdate');
	      if (this.props.view.selectionInverted !== nextProps.view.selectionInverted) {
	        this.setState({
	          chooseChecked: !this.state.chooseChecked
	        });
	        return;
	      }

	      //const c = (nextProps.view.sele)
	      if (nextProps.view.selectionInverted) {
	        if (this.props.content.chosenMediaItemsInverted.length > 1 && nextProps.content.chosenMediaItemsInverted.length < 1) {
	          this.setState({
	            chooseChecked: false
	          });
	        }
	      } else {
	        if (this.props.content.chosenMediaItems.length > 1 && nextProps.content.chosenMediaItems.length < 1) {
	          this.setState({
	            chooseChecked: false
	          });
	        }
	      }
	    }
	  }, {
	    key: 'shouldComponentUpdate',
	    value: function shouldComponentUpdate(nextProps, nextState) {
	      //console.log('MediaRow shouldComponentUpdate', this.props, nextProps, this.state, nextState);
	      //return true;

	      if (this.props.item !== nextProps.item) return true;
	      if (this.state.chooseChecked !== nextState.chooseChecked) return true;
	      if (this.props.content.chosenMediaItems.length !== nextProps.content.chosenMediaItems.length || this.props.content.chosenMediaItemsInverted.length !== nextProps.content.chosenMediaItemsInverted.length) return true;
	      try {
	        //console.log((nextProps.focusedMediaItem !== undefined));
	        return nextProps.focusedMediaItem !== undefined;
	      } catch (e) {}
	      //console.log('MediaRow should not update');
	      return false;
	    }
	  }, {
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      this.assignKeyboardListeners();
	      //Mousetrap(document.querySelector('.eureka')).bind(['alt+z'], this.handleKeyboardDeselect);

	      /*store.subscribe(() => {
	        const state = store.getState();
	        //console.log(state);
	         if(!state.content.chosenMediaItemsInverted.length) {
	          this.setState({
	            chooseChecked: false
	          })
	        }
	       });*/
	    }

	    /*handleKeyboardDeselect = (event) => {
	      console.log('handleKeyboardDeselect');
	      this.setState({
	        chooseChecked: false
	      })
	    }*/

	  }, {
	    key: 'assignKeyboardListeners',
	    value: function assignKeyboardListeners() {
	      _mousetrap2.default.bind(['backspace'], this.handleKeyboardBackspace);
	      _mousetrap2.default.bind(['enter'], this.handleKeyboardChoose);
	      _mousetrap2.default.bind(['alt+space'], this.handleKeyboardExpand);
	      _mousetrap2.default.bind(['ctrl+r'], this.handleKeyboardRename);
	    }
	  }, {
	    key: 'onBlur',
	    value: function onBlur(event) {
	      //console.log('onBlur');
	      this.removeKeyboardListeners();
	    }
	  }, {
	    key: 'componentWillUnmount',
	    value: function componentWillUnmount() {
	      this.removeKeyboardListeners();
	      //Mousetrap(document.querySelector('.eureka')).unbind(['alt+z'], this.handleKeyboardDeselect);
	    }
	  }, {
	    key: 'removeKeyboardListeners',
	    value: function removeKeyboardListeners() {
	      _mousetrap2.default.unbind(['backspace'], this.handleKeyboardBackspace);
	      _mousetrap2.default.unbind(['enter'], this.handleKeyboardChoose);
	      _mousetrap2.default.unbind(['alt+space'], this.handleKeyboardExpand);
	      _mousetrap2.default.unbind(['ctrl+r'], this.handleKeyboardRename);
	    }
	  }, {
	    key: 'handleKeyboardRename',
	    value: function handleKeyboardRename(event) {
	      //console.log('handleKeyboardRename', event);
	      try {
	        this.props.onRenameItem(this.props.item);
	      } catch (e) {}
	    }
	  }, {
	    key: 'handleKeyboardChoose',
	    value: function handleKeyboardChoose(event) {
	      if (!event.target.matches('.eureka__focused-media-item')) return;
	      //event.preventDefault();
	      try {
	        document.getElementById('choose__' + _utility2.default.cssSafe(this.props.item.filename)).click();
	      } catch (e) {}
	    }
	  }, {
	    key: 'handleKeyboardExpand',
	    value: function handleKeyboardExpand(event) {
	      if (!event.target.matches('.eureka__focused-media-item')) return;
	      try {
	        document.getElementById('expand__' + _utility2.default.cssSafe(this.props.item.filename)).click();
	      } catch (e) {}
	    }
	  }, {
	    key: 'removeFocusedMediaItems',
	    value: function removeFocusedMediaItems(target) {
	      // super #janky but haven't been able to optimize another way
	      //console.log(`tr[role="row"]:not(#${target.getAttribute('id')})`);
	      var focusedMediaItems = target.closest('tbody').querySelectorAll('tr[role="row"]'); // :not(#${target.getAttribute('id')})
	      for (var i = 0; i < focusedMediaItems.length; i++) {
	        if (focusedMediaItems[i].getAttribute('id') !== target.getAttribute('id')) {
	          focusedMediaItems[i].classList.remove('eureka__focused-media-item');
	          focusedMediaItems[i].querySelector('.eureka__context-row').setAttribute('hidden', 'true');
	        }
	      }
	    }
	  }, {
	    key: 'onFocus',
	    value: function onFocus(event) {
	      if (!event.target.matches('tr')) return;

	      this.assignKeyboardListeners();

	      this.removeFocusedMediaItems(event.target);
	      event.target.classList.add('eureka__focused-media-item');
	      event.target.querySelector('.eureka__context-row').removeAttribute('hidden');
	      this.props.onFocus();
	    }
	  }, {
	    key: 'handleKeyboardBackspace',
	    value: function handleKeyboardBackspace(event) {
	      var props = this.props,
	          formatMessage = props.intl.formatMessage,
	          decoratedActions = props.decoratedActions ? Object.assign({}, _actions2.default, props.decoratedActions) : _actions2.default,
	          deletedItemMessage = formatMessage(_definedMessages2.default.deletedItem, {
	        filename: props.item.filename
	      });
	      //console.log('handleKeyboardBackspace', event, props.item.path);
	      _store2.default.dispatch(decoratedActions.deleteMediaItem(props.source.currentSource, props.item.path, props.config.headers)).then(function () {
	        /*utility.notify(`Deleted item ${props.item.filename}`, {
	          badge: path.join(props.config.assetsBasePath, 'img/src/png/trash-o.png'),
	          silent: true
	        });*/
	        _store2.default.dispatch(_actions2.default.notify(deletedItemMessage, _utility2.default.DANGEROUS));
	      });
	    }

	    //http://localhost:3000/assets/components/eureka/media/sources/1?path=%2FUsers%2FjP%2FSites%2Fstatic%2Feureka%2Fprod%2Fsources%2Ffilesystem%2Fassets%2Fimg%2Fredwoods%2F243823_842410181688_1308368_o.jpg
	    //http://localhost:3000/assets/components/eureka/media/sources/1?path=%2FUsers%2FjP%2FSites%2Fstatic%2Feureka%2Fprod%2Fsources%2Ffilesystem%2Fassets%2Fimg%2Fredwoods%2F243150_842410286478_7945184_o.jpg

	    /*componentWillUnmount() {
	      Mousetrap.unbind(['backspace'], this.handleKeyboardBackspace);
	    }*/

	  }, {
	    key: 'render',
	    value: function render() {
	      var _this2 = this,
	          _React$createElement,
	          _React$createElement2;

	      var props = this.props,
	          item = props.item,
	          index = props.index,
	          formatMessage = props.intl.formatMessage,
	          ariaLabel = props.item.filename + ' displays at ' + props.item.dimensions.join('x') + ', weighs ' + (0, _filesize2.default)(props.item.fileSize, { round: 0 }) + ', and was edited on ' + new Date(props.item.editedOn).toLocaleString(props.view.locale, { weekday: 'long', year: 'numeric', month: 'long', day: '2-digit', timeZoneName: 'long' });

	      function shouldHide(item) {
	        //console.log('shouldHide', item);
	        try {
	          //console.log('shouldHide',props.focusedMediaItem.path,item.path,props.focusedMediaItem.path !== item.path);
	          return props.focusedMediaItem.path !== item.path;
	        } catch (e) {
	          //console.log('shouldHide',true);
	          return true;
	        }
	      }

	      var contentEditable = false;
	      var checkboxId = 'eureka__choose_multiple_' + _utility2.default.cssSafe(props.item.filename);
	      var onMediaClick = props.view.chooseMultiple ? function (event) {
	        // #janky way to simulate <label>, <label> messes up styling for the default view
	        event.target.closest('.eureka').querySelector('#' + checkboxId).click();
	      } : undefined;

	      var media = function (ext) {
	        // consider abstracting this to its own module
	        //console.log(pathParse(props.item.filename).ext,'props.item',props.item);

	        var src = props.item.absolutePreviewURL || props.item.absoluteURL,
	            alt = props.item.alt || '';

	        switch (ext.toLowerCase()) {
	          case '.jpg':
	          case '.jpeg':
	          case '.gif':
	          case '.png':
	          case '.png8':
	          case '.png24':
	          case '.svg':
	          case '.bmp':
	          case '.tiff':
	            return _react2.default.createElement('img', { src: src, alt: alt, onClick: onMediaClick });
	            break;

	          case '.mp4':
	          case '.mov':
	            return _react2.default.createElement(
	              'video',
	              { width: '320', height: '240', controls: props.view.mode !== 'list' },
	              _react2.default.createElement('source', { src: src, type: 'video/mp4' }),
	              _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'support.noVideo', defaultMessage: 'Your browser does not support the video tag.' })
	            );
	            break;

	          case '.ogv':
	            return _react2.default.createElement(
	              'video',
	              { width: '320', height: '240', controls: props.view.mode !== 'list' },
	              _react2.default.createElement('source', { src: src, type: 'video/ogg' }),
	              _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'support.noVideo', defaultMessage: 'Your browser does not support the video tag.' })
	            );
	            break;

	          case '.webm':
	          case '.wbm':
	            return _react2.default.createElement(
	              'video',
	              { width: '320', height: '240', controls: props.view.mode !== 'list' },
	              _react2.default.createElement('source', { src: src, type: 'video/webm' }),
	              _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'support.noVideo', defaultMessage: 'Your browser does not support the video tag.' })
	            );
	            break;

	          case '.pdf':
	            return _react2.default.createElement('embed', { src: src, width: '320', height: '240' });
	            break;

	          case '.ogg':
	            return _react2.default.createElement(
	              'audio',
	              { controls: true },
	              _react2.default.createElement('source', { src: src, type: 'audio/ogg' }),
	              _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'support.noAudio', defaultMessage: 'Your browser does not support the audio tag.' })
	            );
	            break;

	          case '.mp3':
	            return _react2.default.createElement(
	              'audio',
	              { controls: true },
	              _react2.default.createElement('source', { src: src, type: 'audio/mpeg' }),
	              _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'support.noAudio', defaultMessage: 'Your browser does not support the audio tag.' })
	            );
	            break;

	          case '.wav':
	            return _react2.default.createElement(
	              'audio',
	              { controls: true },
	              _react2.default.createElement('source', { src: src, type: 'audio/wav' }),
	              _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'support.noAudio', defaultMessage: 'Your browser does not support the audio tag.' })
	            );
	            break;

	          case '.flac':
	            return _react2.default.createElement(
	              'audio',
	              { controls: true },
	              _react2.default.createElement('source', { src: src, type: 'audio/flac' }),
	              _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'support.noAudio', defaultMessage: 'Your browser does not support the audio tag.' })
	            );
	            break;

	          default:
	            var icon = _utility2.default.getIconByExtension(pathParse(props.item.filename).ext);
	            return _react2.default.createElement(
	              'p',
	              { onClick: onMediaClick },
	              _react2.default.createElement(_Icon2.default, _extends({}, props, { icon: icon })),
	              '\u2002',
	              props.item.absoluteURL
	            );
	        }
	      }(pathParse(props.item.filename).ext);

	      //if((props.item == props.focusedMediaItem)) console.log(props.item == props.focusedMediaItem, props.item, props.focusedMediaItem);


	      var mediaId = (props.config.storagePrefix || 'eureka__') + '__media__' + _utility2.default.cssSafe(props.item.filename),
	          mediaSelectId = (props.config.storagePrefix || 'eureka__') + '__radio_' + _utility2.default.cssSafe(props.item.filename),
	          mediaSelect = _utility2.default.serverSideRendering ? _react2.default.createElement(
	        'td',
	        null,
	        _react2.default.createElement('input', { id: mediaSelectId, value: props.item.filename, name: 'eureka__chosen_item', type: 'radio', 'aria-labelledby': (props.config.storagePrefix !== undefined ? props.config.storagePrefix : 'eureka__') + 'choose-button', 'aria-describedby': mediaId + ' ' + _utility2.default.cssSafe(props.item.filename) }),
	        _react2.default.createElement(
	          'span',
	          { className: 'visually-hidden' },
	          '\u2002',
	          _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'select', defaultMessage: 'Select' }),
	          ' ',
	          props.item.filename
	        )
	      ) : undefined,
	          className = props.item == props.focusedMediaItem ? { 'eureka__focused-media-item': true } : {},
	          tabIndex = _utility2.default.serverSideRendering ? undefined : "0",
	          ext = pathParse(props.item.absoluteURL).ext,
	          isLinkableFileType = function (ext) {
	        switch (ext.toLowerCase()) {
	          case '.jpg':
	          case '.jpeg':
	          case '.gif':
	          case '.png':
	          case '.png8':
	          case '.png24':
	          case '.svg':
	          case '.bmp':
	          case '.tiff':
	            return true;
	            break;

	          default:
	            return false;
	        }
	      }(ext);

	      //console.log('this.state.chooseChecked', this.state.chooseChecked);
	      var checkboxAriaLabel = formatMessage(_definedMessages2.default.chooseItem, {
	        filename: item.filename
	      });

	      var checkbox = props.view.chooseMultiple ? _react2.default.createElement(
	        'td',
	        { className: 'eureka__choose' },
	        _react2.default.createElement('input', { 'aria-label': 'Choose ' + item.filename, type: 'checkbox', name: 'eureka__chose_multiple', id: checkboxId, key: 'eureka__choose_multiple_' + _utility2.default.cssSafe(props.item.filename) + '__' + (this.state.chooseChecked ? 'checked' : ''), checked: this.state.chooseChecked, onChange: function onChange(event) {
	            event.preventDefault();
	            event.stopPropagation();

	            //console.log('event.target.checked', event.target.checked);

	            _this2.setState({
	              chooseChecked: event.target.checked
	            });

	            if (props.view.selectionInverted ? !event.target.checked : event.target.checked) {
	              _store2.default.dispatch(_actions2.default.addMediaItemToChosenItems(props.item, props.view.selectionInverted));
	            } else {
	              _store2.default.dispatch(_actions2.default.removeMediaItemFromChosenItems(props.item, props.view.selectionInverted));
	            }
	            //console.log('event.target.checked', event.target.checked);
	          } })
	      ) : undefined;

	      var openInANewTabMessage = formatMessage(_definedMessages2.default.openFileInNewTab, {
	        filename: props.item.fileName
	      });

	      if (_utility2.default.serverSideRendering && isLinkableFileType) {
	        //media = <label style={{display:'block'}} htmlFor={mediaSelectId} aria-labelledby={`${props.config.storagePrefix !== undefined ? props.config.storagePrefix : 'eureka__' }filename__${utility.cssSafe(props.item.filename)}`}>{media}</label>;
	        media = _react2.default.createElement(
	          'a',
	          { href: props.item.absoluteURL, target: '_' + mediaSelectId, 'aria-label': openInANewTabMessage, role: 'presentation' },
	          media
	        );
	      }

	      if (props.view.chooseMultiple) {
	        //media = <label htmlFor={checkboxId}>{media}</label>
	      }

	      var fileName = _utility2.default.wordBreaksEvery(props.item.filename);
	      if (_utility2.default.serverSideRendering) {
	        //fileName = <a href={`#${mediaSelectId}`} role="presentation" tabIndex="-1" id={`${props.config.storagePrefix !== undefined ? props.config.storagePrefix : 'eureka__' }filename__${utility.cssSafe(props.item.filename)}`}>{fileName}</a>
	        fileName = _react2.default.createElement(
	          'label',
	          { htmlFor: mediaSelectId },
	          fileName
	        );
	      }

	      var contextMenu = _utility2.default.serverSideRendering ? undefined : _react2.default.createElement(_ContextMenu2.default, _extends({ className: 'eureka__context-row' }, props, { item: item, hidden: shouldHide(item), key: 'cm__' + index }));

	      //<span className="visually-hidden"><FormattedMessage id="media.contents" defaultMessage="Media Contents" /></span>
	      return _react2.default.createElement(
	        'tr',
	        (_React$createElement2 = { role: 'row', className: (0, _classnames2.default)(className), id: _utility2.default.cssSafe(props.item.filename), 'aria-label': ariaLabel }, _defineProperty(_React$createElement2, 'role', 'row'), _defineProperty(_React$createElement2, 'tabIndex', tabIndex), _defineProperty(_React$createElement2, 'onFocus', this.onFocus.bind(this)), _defineProperty(_React$createElement2, 'onBlur', this.onBlur.bind(this)), _defineProperty(_React$createElement2, 'contextMenu', 'context_menu__tbody-' + props.index), _React$createElement2),
	        checkbox,
	        mediaSelect,
	        _react2.default.createElement(
	          'td',
	          { role: 'gridcell', id: mediaId, title: ariaLabel, className: 'eureka__td-media', onTouchTap: !props.view.isTouch ? undefined : function (e) {
	              if (_utility2.default.isDblTouchTap(e)) {
	                if (!props.view.focusedMediaItem) return;

	                props.config.callbacks.choose(props.item);
	              }
	            }, onDoubleClick: props.view.isTouch ? undefined : function (event) {
	              if (!props.view.focusedMediaItem) return;

	              props.config.callbacks.choose(props.item);

	              /*document.dispatchEvent(new CustomEvent('EurekaFoundIt', {
	              detail: props.item
	              }));*/
	            } },
	          media
	        ),
	        _react2.default.createElement(
	          'td',
	          (_React$createElement = { role: 'gridcell', id: (props.config.storagePrefix !== undefined ? props.config.storagePrefix : 'eureka__') + 'filename__' + _utility2.default.cssSafe(props.item.filename) }, _defineProperty(_React$createElement, 'role', 'gridcell'), _defineProperty(_React$createElement, 'className', 'eureka__td-filename'), _defineProperty(_React$createElement, 'contentEditable', contentEditable), _defineProperty(_React$createElement, 'onBlur', function onBlur(event) {
	            try {
	              if (!event.target.innerHTML.trim()) {
	                event.target.innerHTML = props.item.filename;
	                //alert('file name cannot be empty'); // i mostly hate alerts
	                throw new Error('file name cannot be empty');
	              }

	              //console.log(event.target.innerHTML, event.target.innerHTML.trim());
	              props.onRenameItemModalSubmit(event.target.innerHTML.trim(), props.item);
	            } catch (e) {
	              console.log(e);
	            }
	          }), _defineProperty(_React$createElement, 'onKeyUp', function onKeyUp(event) {
	            //console.log('onKeyUp', event);
	          }), _defineProperty(_React$createElement, 'onKeyDown', function onKeyDown(event) {
	            //console.log('onKeyDown', event, event.keyCode);
	            if (event.keyCode === 13) {
	              event.preventDefault();
	              event.target.blur();
	            }
	          }), _defineProperty(_React$createElement, 'onPaste', function onPaste(event) {
	            console.log('onPaste', event);
	          }), _defineProperty(_React$createElement, 'onCopy', function onCopy(event) {
	            console.log('onCopy', event);
	          }), _defineProperty(_React$createElement, 'onCut', function onCut(event) {
	            console.log('onCut', event);
	          }), _React$createElement),
	          fileName
	        ),
	        contextMenu,
	        _react2.default.createElement(
	          'td',
	          { className: 'eureka__dimensions', role: 'gridcell' },
	          props.item.dimensions[0] + 'x' + props.item.dimensions[1]
	        ),
	        _react2.default.createElement(
	          'td',
	          { className: 'eureka__file-size', role: 'gridcell' },
	          (0, _filesize2.default)(props.item.fileSize)
	        ),
	        _react2.default.createElement(
	          'td',
	          { className: 'eureka__edited-on', role: 'gridcell', title: props.item.editedOnLongTimeZone || new Date(props.item.editedOn).toLocaleString(props.view.locale, { weekday: 'long', year: 'numeric', month: 'long', day: '2-digit', timeZoneName: 'long' }) },
	          props.item.editedOnTwoDigit || new Date(props.item.editedOn).toLocaleString(props.view.locale, { year: '2-digit', month: '2-digit', day: '2-digit' })
	        )
	      );
	    }
	  }]);

	  return MediaRow;
	}(_react.PureComponent);

	exports.default = MediaRow;

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _store = __webpack_require__(9);

	var _store2 = _interopRequireDefault(_store);

	var _actions = __webpack_require__(19);

	var _actions2 = _interopRequireDefault(_actions);

	var _ContextButtons = __webpack_require__(60);

	var _ContextButtons2 = _interopRequireDefault(_ContextButtons);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var ContextMenu = function ContextMenu(props) {
	  var item = props.item;
	  return _react2.default.createElement(
	    'td',
	    { className: props.className, hidden: props.hidden === undefined ? true : props.hidden },
	    _react2.default.createElement(_ContextButtons2.default, _extends({ onBlur: props.onBlur, onFirstFocus: props.onFirstFocus }, props))
	  );
	};

	exports.default = ContextMenu;

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _store = __webpack_require__(9);

	var _store2 = _interopRequireDefault(_store);

	var _actions = __webpack_require__(19);

	var _actions2 = _interopRequireDefault(_actions);

	var _utility = __webpack_require__(17);

	var _path = __webpack_require__(3);

	var _path2 = _interopRequireDefault(_path);

	var _reactIntl = __webpack_require__(23);

	var _definedMessages = __webpack_require__(49);

	var _definedMessages2 = _interopRequireDefault(_definedMessages);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var ContextButtons = function ContextButtons(props) {
	  //console.log('ContextButtons', props);
	  var item = props.item;

	  var decoratedActions = props.decoratedActions ? Object.assign({}, _actions2.default, props.decoratedActions) : _actions2.default;

	  var formatMessage = props.intl.formatMessage,
	      renameMessage = formatMessage(_definedMessages2.default.rename),
	      renameItemMessage = formatMessage(_definedMessages2.default.renameItem, {
	    item: ' ' + item.filename
	  }),
	      performContextualActionsMessage = formatMessage(_definedMessages2.default.performContextualActions, {
	    filename: item.filename
	  }),
	      expandMessage = formatMessage(_definedMessages2.default.expand),
	      chooseItemMessage = formatMessage(_definedMessages2.default.chooseItem, {
	    filename: item.filename
	  }),
	      chooseMessage = formatMessage(_definedMessages2.default.choose),
	      deleteMessage = formatMessage(_definedMessages2.default.delete),
	      deleteItemMessage = formatMessage(_definedMessages2.default.deleteItem, {
	    filename: item.filename
	  }),
	      deletedItemMessage = formatMessage(_definedMessages2.default.deletedItem, {
	    filename: item.filename
	  }),
	      expandItemMessage = formatMessage(_definedMessages2.default.expandItem, {
	    filename: item.filename
	  }),
	      downloadMessage = formatMessage(_definedMessages2.default.download),
	      downloadItemMessage = formatMessage(_definedMessages2.default.downloadItem, {
	    filename: item.filename
	  });

	  var chooseBtn = props.config.allowChoose ? _react2.default.createElement(
	    'button',
	    { role: 'option', id: 'choose__' + (0, _utility.cssSafe)(item.filename), title: chooseItemMessage, onClick: function onClick(event) {
	        if (!props.view.focusedMediaItem) return;
	        try {
	          props.config.callbacks.choose(item);
	        } catch (e) {
	          console.log(e);
	        }
	        /*document.dispatchEvent(new CustomEvent('EurekaFoundIt', {
	          detail: item
	        }));*/
	      } },
	    chooseMessage,
	    _react2.default.createElement(
	      'span',
	      { className: 'visually-hidden' },
	      ' ',
	      item.filename
	    )
	  ) : undefined,
	      renameBtn = props.config.allowRename ? _react2.default.createElement(
	    'button',
	    { id: (props.config.storagePrefix !== undefined ? props.config.storagePrefix : 'eureka__') + 'rename__' + (0, _utility.cssSafe)(item.filename), role: 'option', title: renameItemMessage, onClick: props.onRenameItem ? props.onRenameItem.bind(null, item) : undefined },
	    renameMessage,
	    _react2.default.createElement(
	      'span',
	      { className: 'visually-hidden' },
	      ' ',
	      item.filename
	    )
	  ) : undefined,
	      deleteBtn = props.config.allowDelete ? _react2.default.createElement(
	    'button',
	    { id: (props.config.storagePrefix !== undefined ? props.config.storagePrefix : 'eureka__') + 'delete__' + (0, _utility.cssSafe)(item.filename), role: 'option', onClick: function onClick(event) {
	        _store2.default.dispatch(decoratedActions.deleteMediaItem(props.source.currentSource, item.path, props.config.headers)).then(function () {
	          /*notify(`Deleted item ${item.filename}`, {
	            badge: path.join(props.config.assetsBasePath, 'img/src/png/trash-o.png'),
	            silent: true
	          });*/
	          _store2.default.dispatch(_actions2.default.notify(deletedItemMessage, _utility.DANGEROUS));
	        });
	      }, title: deleteItemMessage, className: 'dangerous' },
	    deleteMessage,
	    _react2.default.createElement(
	      'span',
	      { className: 'visually-hidden' },
	      ' ',
	      item.filename
	    )
	  ) : undefined,
	      downloadID = (props.config.storagePrefix !== undefined ? props.config.storagePrefix : 'eureka__') + 'download__' + (0, _utility.cssSafe)(item.filename),
	      downloadBtn = props.config.allowDownload ? _react2.default.createElement(
	    'a',
	    { download: item.filename, href: item.absoluteURL, id: downloadID, className: 'button', target: '_' + downloadID, title: downloadItemMessage },
	    downloadMessage,
	    _react2.default.createElement(
	      'span',
	      { className: 'visually-hidden' },
	      ' ',
	      item.filename
	    )
	  ) : undefined;

	  return (// future-role="toolbar listbox"
	    _react2.default.createElement(
	      'div',
	      { className: 'eureka__button-bar eureka__context-buttons', role: 'listbox', 'aria-label': performContextualActionsMessage, tabIndex: '0', 'aria-activedescendant': 'expand__' + (0, _utility.cssSafe)(item.filename) },
	      _react2.default.createElement(
	        'a',
	        { onBlur: props.onBlur, role: 'option', id: 'expand__' + (0, _utility.cssSafe)(item.filename), href: item.absoluteURL, target: '_' + encodeURI(item.absoluteURL), className: 'button', title: expandItemMessage },
	        expandMessage,
	        _react2.default.createElement(
	          'span',
	          { className: 'visually-hidden' },
	          ' ',
	          item.filename
	        )
	      ),
	      chooseBtn,
	      renameBtn,
	      deleteBtn,
	      downloadBtn
	    )
	  );
	};

	exports.default = ContextButtons;

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/*global define:false */
	/**
	 * Copyright 2012-2017 Craig Campbell
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 *
	 * Mousetrap is a simple keyboard shortcut library for Javascript with
	 * no external dependencies
	 *
	 * @version 1.6.1
	 * @url craig.is/killing/mice
	 */
	(function(window, document, undefined) {

	    // Check if mousetrap is used inside browser, if not, return
	    if (!window) {
	        return;
	    }

	    /**
	     * mapping of special keycodes to their corresponding keys
	     *
	     * everything in this dictionary cannot use keypress events
	     * so it has to be here to map to the correct keycodes for
	     * keyup/keydown events
	     *
	     * @type {Object}
	     */
	    var _MAP = {
	        8: 'backspace',
	        9: 'tab',
	        13: 'enter',
	        16: 'shift',
	        17: 'ctrl',
	        18: 'alt',
	        20: 'capslock',
	        27: 'esc',
	        32: 'space',
	        33: 'pageup',
	        34: 'pagedown',
	        35: 'end',
	        36: 'home',
	        37: 'left',
	        38: 'up',
	        39: 'right',
	        40: 'down',
	        45: 'ins',
	        46: 'del',
	        91: 'meta',
	        93: 'meta',
	        224: 'meta'
	    };

	    /**
	     * mapping for special characters so they can support
	     *
	     * this dictionary is only used incase you want to bind a
	     * keyup or keydown event to one of these keys
	     *
	     * @type {Object}
	     */
	    var _KEYCODE_MAP = {
	        106: '*',
	        107: '+',
	        109: '-',
	        110: '.',
	        111 : '/',
	        186: ';',
	        187: '=',
	        188: ',',
	        189: '-',
	        190: '.',
	        191: '/',
	        192: '`',
	        219: '[',
	        220: '\\',
	        221: ']',
	        222: '\''
	    };

	    /**
	     * this is a mapping of keys that require shift on a US keypad
	     * back to the non shift equivelents
	     *
	     * this is so you can use keyup events with these keys
	     *
	     * note that this will only work reliably on US keyboards
	     *
	     * @type {Object}
	     */
	    var _SHIFT_MAP = {
	        '~': '`',
	        '!': '1',
	        '@': '2',
	        '#': '3',
	        '$': '4',
	        '%': '5',
	        '^': '6',
	        '&': '7',
	        '*': '8',
	        '(': '9',
	        ')': '0',
	        '_': '-',
	        '+': '=',
	        ':': ';',
	        '\"': '\'',
	        '<': ',',
	        '>': '.',
	        '?': '/',
	        '|': '\\'
	    };

	    /**
	     * this is a list of special strings you can use to map
	     * to modifier keys when you specify your keyboard shortcuts
	     *
	     * @type {Object}
	     */
	    var _SPECIAL_ALIASES = {
	        'option': 'alt',
	        'command': 'meta',
	        'return': 'enter',
	        'escape': 'esc',
	        'plus': '+',
	        'mod': /Mac|iPod|iPhone|iPad/.test(navigator.platform) ? 'meta' : 'ctrl'
	    };

	    /**
	     * variable to store the flipped version of _MAP from above
	     * needed to check if we should use keypress or not when no action
	     * is specified
	     *
	     * @type {Object|undefined}
	     */
	    var _REVERSE_MAP;

	    /**
	     * loop through the f keys, f1 to f19 and add them to the map
	     * programatically
	     */
	    for (var i = 1; i < 20; ++i) {
	        _MAP[111 + i] = 'f' + i;
	    }

	    /**
	     * loop through to map numbers on the numeric keypad
	     */
	    for (i = 0; i <= 9; ++i) {

	        // This needs to use a string cause otherwise since 0 is falsey
	        // mousetrap will never fire for numpad 0 pressed as part of a keydown
	        // event.
	        //
	        // @see https://github.com/ccampbell/mousetrap/pull/258
	        _MAP[i + 96] = i.toString();
	    }

	    /**
	     * cross browser add event method
	     *
	     * @param {Element|HTMLDocument} object
	     * @param {string} type
	     * @param {Function} callback
	     * @returns void
	     */
	    function _addEvent(object, type, callback) {
	        if (object.addEventListener) {
	            object.addEventListener(type, callback, false);
	            return;
	        }

	        object.attachEvent('on' + type, callback);
	    }

	    /**
	     * takes the event and returns the key character
	     *
	     * @param {Event} e
	     * @return {string}
	     */
	    function _characterFromEvent(e) {

	        // for keypress events we should return the character as is
	        if (e.type == 'keypress') {
	            var character = String.fromCharCode(e.which);

	            // if the shift key is not pressed then it is safe to assume
	            // that we want the character to be lowercase.  this means if
	            // you accidentally have caps lock on then your key bindings
	            // will continue to work
	            //
	            // the only side effect that might not be desired is if you
	            // bind something like 'A' cause you want to trigger an
	            // event when capital A is pressed caps lock will no longer
	            // trigger the event.  shift+a will though.
	            if (!e.shiftKey) {
	                character = character.toLowerCase();
	            }

	            return character;
	        }

	        // for non keypress events the special maps are needed
	        if (_MAP[e.which]) {
	            return _MAP[e.which];
	        }

	        if (_KEYCODE_MAP[e.which]) {
	            return _KEYCODE_MAP[e.which];
	        }

	        // if it is not in the special map

	        // with keydown and keyup events the character seems to always
	        // come in as an uppercase character whether you are pressing shift
	        // or not.  we should make sure it is always lowercase for comparisons
	        return String.fromCharCode(e.which).toLowerCase();
	    }

	    /**
	     * checks if two arrays are equal
	     *
	     * @param {Array} modifiers1
	     * @param {Array} modifiers2
	     * @returns {boolean}
	     */
	    function _modifiersMatch(modifiers1, modifiers2) {
	        return modifiers1.sort().join(',') === modifiers2.sort().join(',');
	    }

	    /**
	     * takes a key event and figures out what the modifiers are
	     *
	     * @param {Event} e
	     * @returns {Array}
	     */
	    function _eventModifiers(e) {
	        var modifiers = [];

	        if (e.shiftKey) {
	            modifiers.push('shift');
	        }

	        if (e.altKey) {
	            modifiers.push('alt');
	        }

	        if (e.ctrlKey) {
	            modifiers.push('ctrl');
	        }

	        if (e.metaKey) {
	            modifiers.push('meta');
	        }

	        return modifiers;
	    }

	    /**
	     * prevents default for this event
	     *
	     * @param {Event} e
	     * @returns void
	     */
	    function _preventDefault(e) {
	        if (e.preventDefault) {
	            e.preventDefault();
	            return;
	        }

	        e.returnValue = false;
	    }

	    /**
	     * stops propogation for this event
	     *
	     * @param {Event} e
	     * @returns void
	     */
	    function _stopPropagation(e) {
	        if (e.stopPropagation) {
	            e.stopPropagation();
	            return;
	        }

	        e.cancelBubble = true;
	    }

	    /**
	     * determines if the keycode specified is a modifier key or not
	     *
	     * @param {string} key
	     * @returns {boolean}
	     */
	    function _isModifier(key) {
	        return key == 'shift' || key == 'ctrl' || key == 'alt' || key == 'meta';
	    }

	    /**
	     * reverses the map lookup so that we can look for specific keys
	     * to see what can and can't use keypress
	     *
	     * @return {Object}
	     */
	    function _getReverseMap() {
	        if (!_REVERSE_MAP) {
	            _REVERSE_MAP = {};
	            for (var key in _MAP) {

	                // pull out the numeric keypad from here cause keypress should
	                // be able to detect the keys from the character
	                if (key > 95 && key < 112) {
	                    continue;
	                }

	                if (_MAP.hasOwnProperty(key)) {
	                    _REVERSE_MAP[_MAP[key]] = key;
	                }
	            }
	        }
	        return _REVERSE_MAP;
	    }

	    /**
	     * picks the best action based on the key combination
	     *
	     * @param {string} key - character for key
	     * @param {Array} modifiers
	     * @param {string=} action passed in
	     */
	    function _pickBestAction(key, modifiers, action) {

	        // if no action was picked in we should try to pick the one
	        // that we think would work best for this key
	        if (!action) {
	            action = _getReverseMap()[key] ? 'keydown' : 'keypress';
	        }

	        // modifier keys don't work as expected with keypress,
	        // switch to keydown
	        if (action == 'keypress' && modifiers.length) {
	            action = 'keydown';
	        }

	        return action;
	    }

	    /**
	     * Converts from a string key combination to an array
	     *
	     * @param  {string} combination like "command+shift+l"
	     * @return {Array}
	     */
	    function _keysFromString(combination) {
	        if (combination === '+') {
	            return ['+'];
	        }

	        combination = combination.replace(/\+{2}/g, '+plus');
	        return combination.split('+');
	    }

	    /**
	     * Gets info for a specific key combination
	     *
	     * @param  {string} combination key combination ("command+s" or "a" or "*")
	     * @param  {string=} action
	     * @returns {Object}
	     */
	    function _getKeyInfo(combination, action) {
	        var keys;
	        var key;
	        var i;
	        var modifiers = [];

	        // take the keys from this pattern and figure out what the actual
	        // pattern is all about
	        keys = _keysFromString(combination);

	        for (i = 0; i < keys.length; ++i) {
	            key = keys[i];

	            // normalize key names
	            if (_SPECIAL_ALIASES[key]) {
	                key = _SPECIAL_ALIASES[key];
	            }

	            // if this is not a keypress event then we should
	            // be smart about using shift keys
	            // this will only work for US keyboards however
	            if (action && action != 'keypress' && _SHIFT_MAP[key]) {
	                key = _SHIFT_MAP[key];
	                modifiers.push('shift');
	            }

	            // if this key is a modifier then add it to the list of modifiers
	            if (_isModifier(key)) {
	                modifiers.push(key);
	            }
	        }

	        // depending on what the key combination is
	        // we will try to pick the best event for it
	        action = _pickBestAction(key, modifiers, action);

	        return {
	            key: key,
	            modifiers: modifiers,
	            action: action
	        };
	    }

	    function _belongsTo(element, ancestor) {
	        if (element === null || element === document) {
	            return false;
	        }

	        if (element === ancestor) {
	            return true;
	        }

	        return _belongsTo(element.parentNode, ancestor);
	    }

	    function Mousetrap(targetElement) {
	        var self = this;

	        targetElement = targetElement || document;

	        if (!(self instanceof Mousetrap)) {
	            return new Mousetrap(targetElement);
	        }

	        /**
	         * element to attach key events to
	         *
	         * @type {Element}
	         */
	        self.target = targetElement;

	        /**
	         * a list of all the callbacks setup via Mousetrap.bind()
	         *
	         * @type {Object}
	         */
	        self._callbacks = {};

	        /**
	         * direct map of string combinations to callbacks used for trigger()
	         *
	         * @type {Object}
	         */
	        self._directMap = {};

	        /**
	         * keeps track of what level each sequence is at since multiple
	         * sequences can start out with the same sequence
	         *
	         * @type {Object}
	         */
	        var _sequenceLevels = {};

	        /**
	         * variable to store the setTimeout call
	         *
	         * @type {null|number}
	         */
	        var _resetTimer;

	        /**
	         * temporary state where we will ignore the next keyup
	         *
	         * @type {boolean|string}
	         */
	        var _ignoreNextKeyup = false;

	        /**
	         * temporary state where we will ignore the next keypress
	         *
	         * @type {boolean}
	         */
	        var _ignoreNextKeypress = false;

	        /**
	         * are we currently inside of a sequence?
	         * type of action ("keyup" or "keydown" or "keypress") or false
	         *
	         * @type {boolean|string}
	         */
	        var _nextExpectedAction = false;

	        /**
	         * resets all sequence counters except for the ones passed in
	         *
	         * @param {Object} doNotReset
	         * @returns void
	         */
	        function _resetSequences(doNotReset) {
	            doNotReset = doNotReset || {};

	            var activeSequences = false,
	                key;

	            for (key in _sequenceLevels) {
	                if (doNotReset[key]) {
	                    activeSequences = true;
	                    continue;
	                }
	                _sequenceLevels[key] = 0;
	            }

	            if (!activeSequences) {
	                _nextExpectedAction = false;
	            }
	        }

	        /**
	         * finds all callbacks that match based on the keycode, modifiers,
	         * and action
	         *
	         * @param {string} character
	         * @param {Array} modifiers
	         * @param {Event|Object} e
	         * @param {string=} sequenceName - name of the sequence we are looking for
	         * @param {string=} combination
	         * @param {number=} level
	         * @returns {Array}
	         */
	        function _getMatches(character, modifiers, e, sequenceName, combination, level) {
	            var i;
	            var callback;
	            var matches = [];
	            var action = e.type;

	            // if there are no events related to this keycode
	            if (!self._callbacks[character]) {
	                return [];
	            }

	            // if a modifier key is coming up on its own we should allow it
	            if (action == 'keyup' && _isModifier(character)) {
	                modifiers = [character];
	            }

	            // loop through all callbacks for the key that was pressed
	            // and see if any of them match
	            for (i = 0; i < self._callbacks[character].length; ++i) {
	                callback = self._callbacks[character][i];

	                // if a sequence name is not specified, but this is a sequence at
	                // the wrong level then move onto the next match
	                if (!sequenceName && callback.seq && _sequenceLevels[callback.seq] != callback.level) {
	                    continue;
	                }

	                // if the action we are looking for doesn't match the action we got
	                // then we should keep going
	                if (action != callback.action) {
	                    continue;
	                }

	                // if this is a keypress event and the meta key and control key
	                // are not pressed that means that we need to only look at the
	                // character, otherwise check the modifiers as well
	                //
	                // chrome will not fire a keypress if meta or control is down
	                // safari will fire a keypress if meta or meta+shift is down
	                // firefox will fire a keypress if meta or control is down
	                if ((action == 'keypress' && !e.metaKey && !e.ctrlKey) || _modifiersMatch(modifiers, callback.modifiers)) {

	                    // when you bind a combination or sequence a second time it
	                    // should overwrite the first one.  if a sequenceName or
	                    // combination is specified in this call it does just that
	                    //
	                    // @todo make deleting its own method?
	                    var deleteCombo = !sequenceName && callback.combo == combination;
	                    var deleteSequence = sequenceName && callback.seq == sequenceName && callback.level == level;
	                    if (deleteCombo || deleteSequence) {
	                        self._callbacks[character].splice(i, 1);
	                    }

	                    matches.push(callback);
	                }
	            }

	            return matches;
	        }

	        /**
	         * actually calls the callback function
	         *
	         * if your callback function returns false this will use the jquery
	         * convention - prevent default and stop propogation on the event
	         *
	         * @param {Function} callback
	         * @param {Event} e
	         * @returns void
	         */
	        function _fireCallback(callback, e, combo, sequence) {

	            // if this event should not happen stop here
	            if (self.stopCallback(e, e.target || e.srcElement, combo, sequence)) {
	                return;
	            }

	            if (callback(e, combo) === false) {
	                _preventDefault(e);
	                _stopPropagation(e);
	            }
	        }

	        /**
	         * handles a character key event
	         *
	         * @param {string} character
	         * @param {Array} modifiers
	         * @param {Event} e
	         * @returns void
	         */
	        self._handleKey = function(character, modifiers, e) {
	            var callbacks = _getMatches(character, modifiers, e);
	            var i;
	            var doNotReset = {};
	            var maxLevel = 0;
	            var processedSequenceCallback = false;

	            // Calculate the maxLevel for sequences so we can only execute the longest callback sequence
	            for (i = 0; i < callbacks.length; ++i) {
	                if (callbacks[i].seq) {
	                    maxLevel = Math.max(maxLevel, callbacks[i].level);
	                }
	            }

	            // loop through matching callbacks for this key event
	            for (i = 0; i < callbacks.length; ++i) {

	                // fire for all sequence callbacks
	                // this is because if for example you have multiple sequences
	                // bound such as "g i" and "g t" they both need to fire the
	                // callback for matching g cause otherwise you can only ever
	                // match the first one
	                if (callbacks[i].seq) {

	                    // only fire callbacks for the maxLevel to prevent
	                    // subsequences from also firing
	                    //
	                    // for example 'a option b' should not cause 'option b' to fire
	                    // even though 'option b' is part of the other sequence
	                    //
	                    // any sequences that do not match here will be discarded
	                    // below by the _resetSequences call
	                    if (callbacks[i].level != maxLevel) {
	                        continue;
	                    }

	                    processedSequenceCallback = true;

	                    // keep a list of which sequences were matches for later
	                    doNotReset[callbacks[i].seq] = 1;
	                    _fireCallback(callbacks[i].callback, e, callbacks[i].combo, callbacks[i].seq);
	                    continue;
	                }

	                // if there were no sequence matches but we are still here
	                // that means this is a regular match so we should fire that
	                if (!processedSequenceCallback) {
	                    _fireCallback(callbacks[i].callback, e, callbacks[i].combo);
	                }
	            }

	            // if the key you pressed matches the type of sequence without
	            // being a modifier (ie "keyup" or "keypress") then we should
	            // reset all sequences that were not matched by this event
	            //
	            // this is so, for example, if you have the sequence "h a t" and you
	            // type "h e a r t" it does not match.  in this case the "e" will
	            // cause the sequence to reset
	            //
	            // modifier keys are ignored because you can have a sequence
	            // that contains modifiers such as "enter ctrl+space" and in most
	            // cases the modifier key will be pressed before the next key
	            //
	            // also if you have a sequence such as "ctrl+b a" then pressing the
	            // "b" key will trigger a "keypress" and a "keydown"
	            //
	            // the "keydown" is expected when there is a modifier, but the
	            // "keypress" ends up matching the _nextExpectedAction since it occurs
	            // after and that causes the sequence to reset
	            //
	            // we ignore keypresses in a sequence that directly follow a keydown
	            // for the same character
	            var ignoreThisKeypress = e.type == 'keypress' && _ignoreNextKeypress;
	            if (e.type == _nextExpectedAction && !_isModifier(character) && !ignoreThisKeypress) {
	                _resetSequences(doNotReset);
	            }

	            _ignoreNextKeypress = processedSequenceCallback && e.type == 'keydown';
	        };

	        /**
	         * handles a keydown event
	         *
	         * @param {Event} e
	         * @returns void
	         */
	        function _handleKeyEvent(e) {

	            // normalize e.which for key events
	            // @see http://stackoverflow.com/questions/4285627/javascript-keycode-vs-charcode-utter-confusion
	            if (typeof e.which !== 'number') {
	                e.which = e.keyCode;
	            }

	            var character = _characterFromEvent(e);

	            // no character found then stop
	            if (!character) {
	                return;
	            }

	            // need to use === for the character check because the character can be 0
	            if (e.type == 'keyup' && _ignoreNextKeyup === character) {
	                _ignoreNextKeyup = false;
	                return;
	            }

	            self.handleKey(character, _eventModifiers(e), e);
	        }

	        /**
	         * called to set a 1 second timeout on the specified sequence
	         *
	         * this is so after each key press in the sequence you have 1 second
	         * to press the next key before you have to start over
	         *
	         * @returns void
	         */
	        function _resetSequenceTimer() {
	            clearTimeout(_resetTimer);
	            _resetTimer = setTimeout(_resetSequences, 1000);
	        }

	        /**
	         * binds a key sequence to an event
	         *
	         * @param {string} combo - combo specified in bind call
	         * @param {Array} keys
	         * @param {Function} callback
	         * @param {string=} action
	         * @returns void
	         */
	        function _bindSequence(combo, keys, callback, action) {

	            // start off by adding a sequence level record for this combination
	            // and setting the level to 0
	            _sequenceLevels[combo] = 0;

	            /**
	             * callback to increase the sequence level for this sequence and reset
	             * all other sequences that were active
	             *
	             * @param {string} nextAction
	             * @returns {Function}
	             */
	            function _increaseSequence(nextAction) {
	                return function() {
	                    _nextExpectedAction = nextAction;
	                    ++_sequenceLevels[combo];
	                    _resetSequenceTimer();
	                };
	            }

	            /**
	             * wraps the specified callback inside of another function in order
	             * to reset all sequence counters as soon as this sequence is done
	             *
	             * @param {Event} e
	             * @returns void
	             */
	            function _callbackAndReset(e) {
	                _fireCallback(callback, e, combo);

	                // we should ignore the next key up if the action is key down
	                // or keypress.  this is so if you finish a sequence and
	                // release the key the final key will not trigger a keyup
	                if (action !== 'keyup') {
	                    _ignoreNextKeyup = _characterFromEvent(e);
	                }

	                // weird race condition if a sequence ends with the key
	                // another sequence begins with
	                setTimeout(_resetSequences, 10);
	            }

	            // loop through keys one at a time and bind the appropriate callback
	            // function.  for any key leading up to the final one it should
	            // increase the sequence. after the final, it should reset all sequences
	            //
	            // if an action is specified in the original bind call then that will
	            // be used throughout.  otherwise we will pass the action that the
	            // next key in the sequence should match.  this allows a sequence
	            // to mix and match keypress and keydown events depending on which
	            // ones are better suited to the key provided
	            for (var i = 0; i < keys.length; ++i) {
	                var isFinal = i + 1 === keys.length;
	                var wrappedCallback = isFinal ? _callbackAndReset : _increaseSequence(action || _getKeyInfo(keys[i + 1]).action);
	                _bindSingle(keys[i], wrappedCallback, action, combo, i);
	            }
	        }

	        /**
	         * binds a single keyboard combination
	         *
	         * @param {string} combination
	         * @param {Function} callback
	         * @param {string=} action
	         * @param {string=} sequenceName - name of sequence if part of sequence
	         * @param {number=} level - what part of the sequence the command is
	         * @returns void
	         */
	        function _bindSingle(combination, callback, action, sequenceName, level) {

	            // store a direct mapped reference for use with Mousetrap.trigger
	            self._directMap[combination + ':' + action] = callback;

	            // make sure multiple spaces in a row become a single space
	            combination = combination.replace(/\s+/g, ' ');

	            var sequence = combination.split(' ');
	            var info;

	            // if this pattern is a sequence of keys then run through this method
	            // to reprocess each pattern one key at a time
	            if (sequence.length > 1) {
	                _bindSequence(combination, sequence, callback, action);
	                return;
	            }

	            info = _getKeyInfo(combination, action);

	            // make sure to initialize array if this is the first time
	            // a callback is added for this key
	            self._callbacks[info.key] = self._callbacks[info.key] || [];

	            // remove an existing match if there is one
	            _getMatches(info.key, info.modifiers, {type: info.action}, sequenceName, combination, level);

	            // add this call back to the array
	            // if it is a sequence put it at the beginning
	            // if not put it at the end
	            //
	            // this is important because the way these are processed expects
	            // the sequence ones to come first
	            self._callbacks[info.key][sequenceName ? 'unshift' : 'push']({
	                callback: callback,
	                modifiers: info.modifiers,
	                action: info.action,
	                seq: sequenceName,
	                level: level,
	                combo: combination
	            });
	        }

	        /**
	         * binds multiple combinations to the same callback
	         *
	         * @param {Array} combinations
	         * @param {Function} callback
	         * @param {string|undefined} action
	         * @returns void
	         */
	        self._bindMultiple = function(combinations, callback, action) {
	            for (var i = 0; i < combinations.length; ++i) {
	                _bindSingle(combinations[i], callback, action);
	            }
	        };

	        // start!
	        _addEvent(targetElement, 'keypress', _handleKeyEvent);
	        _addEvent(targetElement, 'keydown', _handleKeyEvent);
	        _addEvent(targetElement, 'keyup', _handleKeyEvent);
	    }

	    /**
	     * binds an event to mousetrap
	     *
	     * can be a single key, a combination of keys separated with +,
	     * an array of keys, or a sequence of keys separated by spaces
	     *
	     * be sure to list the modifier keys first to make sure that the
	     * correct key ends up getting bound (the last key in the pattern)
	     *
	     * @param {string|Array} keys
	     * @param {Function} callback
	     * @param {string=} action - 'keypress', 'keydown', or 'keyup'
	     * @returns void
	     */
	    Mousetrap.prototype.bind = function(keys, callback, action) {
	        var self = this;
	        keys = keys instanceof Array ? keys : [keys];
	        self._bindMultiple.call(self, keys, callback, action);
	        return self;
	    };

	    /**
	     * unbinds an event to mousetrap
	     *
	     * the unbinding sets the callback function of the specified key combo
	     * to an empty function and deletes the corresponding key in the
	     * _directMap dict.
	     *
	     * TODO: actually remove this from the _callbacks dictionary instead
	     * of binding an empty function
	     *
	     * the keycombo+action has to be exactly the same as
	     * it was defined in the bind method
	     *
	     * @param {string|Array} keys
	     * @param {string} action
	     * @returns void
	     */
	    Mousetrap.prototype.unbind = function(keys, action) {
	        var self = this;
	        return self.bind.call(self, keys, function() {}, action);
	    };

	    /**
	     * triggers an event that has already been bound
	     *
	     * @param {string} keys
	     * @param {string=} action
	     * @returns void
	     */
	    Mousetrap.prototype.trigger = function(keys, action) {
	        var self = this;
	        if (self._directMap[keys + ':' + action]) {
	            self._directMap[keys + ':' + action]({}, keys);
	        }
	        return self;
	    };

	    /**
	     * resets the library back to its initial state.  this is useful
	     * if you want to clear out the current keyboard shortcuts and bind
	     * new ones - for example if you switch to another page
	     *
	     * @returns void
	     */
	    Mousetrap.prototype.reset = function() {
	        var self = this;
	        self._callbacks = {};
	        self._directMap = {};
	        return self;
	    };

	    /**
	     * should we stop this event before firing off callbacks
	     *
	     * @param {Event} e
	     * @param {Element} element
	     * @return {boolean}
	     */
	    Mousetrap.prototype.stopCallback = function(e, element) {
	        var self = this;

	        // if the element has the class "mousetrap" then no need to stop
	        if ((' ' + element.className + ' ').indexOf(' mousetrap ') > -1) {
	            return false;
	        }

	        if (_belongsTo(element, self.target)) {
	            return false;
	        }

	        // stop for input, select, and textarea
	        return element.tagName == 'INPUT' || element.tagName == 'SELECT' || element.tagName == 'TEXTAREA' || element.isContentEditable;
	    };

	    /**
	     * exposes _handleKey publicly so it can be overwritten by extensions
	     */
	    Mousetrap.prototype.handleKey = function() {
	        var self = this;
	        return self._handleKey.apply(self, arguments);
	    };

	    /**
	     * allow custom key mappings
	     */
	    Mousetrap.addKeycodes = function(object) {
	        for (var key in object) {
	            if (object.hasOwnProperty(key)) {
	                _MAP[key] = object[key];
	            }
	        }
	        _REVERSE_MAP = null;
	    };

	    /**
	     * Init the global mousetrap functions
	     *
	     * This method is needed to allow the global mousetrap functions to work
	     * now that mousetrap is a constructor function.
	     */
	    Mousetrap.init = function() {
	        var documentMousetrap = Mousetrap(document);
	        for (var method in documentMousetrap) {
	            if (method.charAt(0) !== '_') {
	                Mousetrap[method] = (function(method) {
	                    return function() {
	                        return documentMousetrap[method].apply(documentMousetrap, arguments);
	                    };
	                } (method));
	            }
	        }
	    };

	    Mousetrap.init();

	    // expose mousetrap to the global object
	    window.Mousetrap = Mousetrap;

	    // expose as a common js module
	    if (typeof module !== 'undefined' && module.exports) {
	        module.exports = Mousetrap;
	    }

	    // expose mousetrap as an AMD module
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
	            return Mousetrap;
	        }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    }
	}) (typeof window !== 'undefined' ? window : null, typeof  window !== 'undefined' ? document : null);


/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var invariant = __webpack_require__(16);
	var defaultClickRejectionStrategy = __webpack_require__(63);

	var alreadyInjected = false;

	module.exports = function injectTapEventPlugin (strategyOverrides) {
	  strategyOverrides = strategyOverrides || {}
	  var shouldRejectClick = strategyOverrides.shouldRejectClick || defaultClickRejectionStrategy;

	  if (process.env.NODE_ENV !== 'production') {
	    invariant(
	      !alreadyInjected,
	      'injectTapEventPlugin(): Can only be called once per application lifecycle.\n\n\
	It is recommended to call injectTapEventPlugin() just before you call \
	ReactDOM.render(). If you are using an external library which calls injectTapEventPlugin() \
	itself, please contact the maintainer as it shouldn\'t be called in library code and \
	should be injected by the application.'
	    )
	  }

	  alreadyInjected = true;

	  __webpack_require__(64).injection.injectEventPluginsByName({
	    'TapEventPlugin':       __webpack_require__(73)(shouldRejectClick)
	  });
	};

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ },
/* 63 */
/***/ function(module, exports) {

	module.exports = function(lastTouchEvent, clickTimestamp) {
	  if (lastTouchEvent && (clickTimestamp - lastTouchEvent) < 750) {
	    return true;
	  }
	};


/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 */

	'use strict';

	var _prodInvariant = __webpack_require__(65);

	var EventPluginRegistry = __webpack_require__(66);
	var EventPluginUtils = __webpack_require__(67);
	var ReactErrorUtils = __webpack_require__(68);

	var accumulateInto = __webpack_require__(71);
	var forEachAccumulated = __webpack_require__(72);
	var invariant = __webpack_require__(16);

	/**
	 * Internal store for event listeners
	 */
	var listenerBank = {};

	/**
	 * Internal queue of events that have accumulated their dispatches and are
	 * waiting to have their dispatches executed.
	 */
	var eventQueue = null;

	/**
	 * Dispatches an event and releases it back into the pool, unless persistent.
	 *
	 * @param {?object} event Synthetic event to be dispatched.
	 * @param {boolean} simulated If the event is simulated (changes exn behavior)
	 * @private
	 */
	var executeDispatchesAndRelease = function (event, simulated) {
	  if (event) {
	    EventPluginUtils.executeDispatchesInOrder(event, simulated);

	    if (!event.isPersistent()) {
	      event.constructor.release(event);
	    }
	  }
	};
	var executeDispatchesAndReleaseSimulated = function (e) {
	  return executeDispatchesAndRelease(e, true);
	};
	var executeDispatchesAndReleaseTopLevel = function (e) {
	  return executeDispatchesAndRelease(e, false);
	};

	var getDictionaryKey = function (inst) {
	  // Prevents V8 performance issue:
	  // https://github.com/facebook/react/pull/7232
	  return '.' + inst._rootNodeID;
	};

	function isInteractive(tag) {
	  return tag === 'button' || tag === 'input' || tag === 'select' || tag === 'textarea';
	}

	function shouldPreventMouseEvent(name, type, props) {
	  switch (name) {
	    case 'onClick':
	    case 'onClickCapture':
	    case 'onDoubleClick':
	    case 'onDoubleClickCapture':
	    case 'onMouseDown':
	    case 'onMouseDownCapture':
	    case 'onMouseMove':
	    case 'onMouseMoveCapture':
	    case 'onMouseUp':
	    case 'onMouseUpCapture':
	      return !!(props.disabled && isInteractive(type));
	    default:
	      return false;
	  }
	}

	/**
	 * This is a unified interface for event plugins to be installed and configured.
	 *
	 * Event plugins can implement the following properties:
	 *
	 *   `extractEvents` {function(string, DOMEventTarget, string, object): *}
	 *     Required. When a top-level event is fired, this method is expected to
	 *     extract synthetic events that will in turn be queued and dispatched.
	 *
	 *   `eventTypes` {object}
	 *     Optional, plugins that fire events must publish a mapping of registration
	 *     names that are used to register listeners. Values of this mapping must
	 *     be objects that contain `registrationName` or `phasedRegistrationNames`.
	 *
	 *   `executeDispatch` {function(object, function, string)}
	 *     Optional, allows plugins to override how an event gets dispatched. By
	 *     default, the listener is simply invoked.
	 *
	 * Each plugin that is injected into `EventsPluginHub` is immediately operable.
	 *
	 * @public
	 */
	var EventPluginHub = {

	  /**
	   * Methods for injecting dependencies.
	   */
	  injection: {

	    /**
	     * @param {array} InjectedEventPluginOrder
	     * @public
	     */
	    injectEventPluginOrder: EventPluginRegistry.injectEventPluginOrder,

	    /**
	     * @param {object} injectedNamesToPlugins Map from names to plugin modules.
	     */
	    injectEventPluginsByName: EventPluginRegistry.injectEventPluginsByName

	  },

	  /**
	   * Stores `listener` at `listenerBank[registrationName][key]`. Is idempotent.
	   *
	   * @param {object} inst The instance, which is the source of events.
	   * @param {string} registrationName Name of listener (e.g. `onClick`).
	   * @param {function} listener The callback to store.
	   */
	  putListener: function (inst, registrationName, listener) {
	    !(typeof listener === 'function') ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Expected %s listener to be a function, instead got type %s', registrationName, typeof listener) : _prodInvariant('94', registrationName, typeof listener) : void 0;

	    var key = getDictionaryKey(inst);
	    var bankForRegistrationName = listenerBank[registrationName] || (listenerBank[registrationName] = {});
	    bankForRegistrationName[key] = listener;

	    var PluginModule = EventPluginRegistry.registrationNameModules[registrationName];
	    if (PluginModule && PluginModule.didPutListener) {
	      PluginModule.didPutListener(inst, registrationName, listener);
	    }
	  },

	  /**
	   * @param {object} inst The instance, which is the source of events.
	   * @param {string} registrationName Name of listener (e.g. `onClick`).
	   * @return {?function} The stored callback.
	   */
	  getListener: function (inst, registrationName) {
	    // TODO: shouldPreventMouseEvent is DOM-specific and definitely should not
	    // live here; needs to be moved to a better place soon
	    var bankForRegistrationName = listenerBank[registrationName];
	    if (shouldPreventMouseEvent(registrationName, inst._currentElement.type, inst._currentElement.props)) {
	      return null;
	    }
	    var key = getDictionaryKey(inst);
	    return bankForRegistrationName && bankForRegistrationName[key];
	  },

	  /**
	   * Deletes a listener from the registration bank.
	   *
	   * @param {object} inst The instance, which is the source of events.
	   * @param {string} registrationName Name of listener (e.g. `onClick`).
	   */
	  deleteListener: function (inst, registrationName) {
	    var PluginModule = EventPluginRegistry.registrationNameModules[registrationName];
	    if (PluginModule && PluginModule.willDeleteListener) {
	      PluginModule.willDeleteListener(inst, registrationName);
	    }

	    var bankForRegistrationName = listenerBank[registrationName];
	    // TODO: This should never be null -- when is it?
	    if (bankForRegistrationName) {
	      var key = getDictionaryKey(inst);
	      delete bankForRegistrationName[key];
	    }
	  },

	  /**
	   * Deletes all listeners for the DOM element with the supplied ID.
	   *
	   * @param {object} inst The instance, which is the source of events.
	   */
	  deleteAllListeners: function (inst) {
	    var key = getDictionaryKey(inst);
	    for (var registrationName in listenerBank) {
	      if (!listenerBank.hasOwnProperty(registrationName)) {
	        continue;
	      }

	      if (!listenerBank[registrationName][key]) {
	        continue;
	      }

	      var PluginModule = EventPluginRegistry.registrationNameModules[registrationName];
	      if (PluginModule && PluginModule.willDeleteListener) {
	        PluginModule.willDeleteListener(inst, registrationName);
	      }

	      delete listenerBank[registrationName][key];
	    }
	  },

	  /**
	   * Allows registered plugins an opportunity to extract events from top-level
	   * native browser events.
	   *
	   * @return {*} An accumulation of synthetic events.
	   * @internal
	   */
	  extractEvents: function (topLevelType, targetInst, nativeEvent, nativeEventTarget) {
	    var events;
	    var plugins = EventPluginRegistry.plugins;
	    for (var i = 0; i < plugins.length; i++) {
	      // Not every plugin in the ordering may be loaded at runtime.
	      var possiblePlugin = plugins[i];
	      if (possiblePlugin) {
	        var extractedEvents = possiblePlugin.extractEvents(topLevelType, targetInst, nativeEvent, nativeEventTarget);
	        if (extractedEvents) {
	          events = accumulateInto(events, extractedEvents);
	        }
	      }
	    }
	    return events;
	  },

	  /**
	   * Enqueues a synthetic event that should be dispatched when
	   * `processEventQueue` is invoked.
	   *
	   * @param {*} events An accumulation of synthetic events.
	   * @internal
	   */
	  enqueueEvents: function (events) {
	    if (events) {
	      eventQueue = accumulateInto(eventQueue, events);
	    }
	  },

	  /**
	   * Dispatches all synthetic events on the event queue.
	   *
	   * @internal
	   */
	  processEventQueue: function (simulated) {
	    // Set `eventQueue` to null before processing it so that we can tell if more
	    // events get enqueued while processing.
	    var processingEventQueue = eventQueue;
	    eventQueue = null;
	    if (simulated) {
	      forEachAccumulated(processingEventQueue, executeDispatchesAndReleaseSimulated);
	    } else {
	      forEachAccumulated(processingEventQueue, executeDispatchesAndReleaseTopLevel);
	    }
	    !!eventQueue ? process.env.NODE_ENV !== 'production' ? invariant(false, 'processEventQueue(): Additional events were enqueued while processing an event queue. Support for this has not yet been implemented.') : _prodInvariant('95') : void 0;
	    // This would be a good time to rethrow if any of the event handlers threw.
	    ReactErrorUtils.rethrowCaughtError();
	  },

	  /**
	   * These are needed for tests only. Do not use!
	   */
	  __purge: function () {
	    listenerBank = {};
	  },

	  __getListenerBank: function () {
	    return listenerBank;
	  }

	};

	module.exports = EventPluginHub;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ },
/* 65 */
/***/ function(module, exports) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * 
	 */
	'use strict';

	/**
	 * WARNING: DO NOT manually require this module.
	 * This is a replacement for `invariant(...)` used by the error code system
	 * and will _only_ be required by the corresponding babel pass.
	 * It always throws.
	 */

	function reactProdInvariant(code) {
	  var argCount = arguments.length - 1;

	  var message = 'Minified React error #' + code + '; visit ' + 'http://facebook.github.io/react/docs/error-decoder.html?invariant=' + code;

	  for (var argIdx = 0; argIdx < argCount; argIdx++) {
	    message += '&args[]=' + encodeURIComponent(arguments[argIdx + 1]);
	  }

	  message += ' for the full message or use the non-minified dev environment' + ' for full errors and additional helpful warnings.';

	  var error = new Error(message);
	  error.name = 'Invariant Violation';
	  error.framesToPop = 1; // we don't care about reactProdInvariant's own frame

	  throw error;
	}

	module.exports = reactProdInvariant;

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * 
	 */

	'use strict';

	var _prodInvariant = __webpack_require__(65);

	var invariant = __webpack_require__(16);

	/**
	 * Injectable ordering of event plugins.
	 */
	var eventPluginOrder = null;

	/**
	 * Injectable mapping from names to event plugin modules.
	 */
	var namesToPlugins = {};

	/**
	 * Recomputes the plugin list using the injected plugins and plugin ordering.
	 *
	 * @private
	 */
	function recomputePluginOrdering() {
	  if (!eventPluginOrder) {
	    // Wait until an `eventPluginOrder` is injected.
	    return;
	  }
	  for (var pluginName in namesToPlugins) {
	    var pluginModule = namesToPlugins[pluginName];
	    var pluginIndex = eventPluginOrder.indexOf(pluginName);
	    !(pluginIndex > -1) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'EventPluginRegistry: Cannot inject event plugins that do not exist in the plugin ordering, `%s`.', pluginName) : _prodInvariant('96', pluginName) : void 0;
	    if (EventPluginRegistry.plugins[pluginIndex]) {
	      continue;
	    }
	    !pluginModule.extractEvents ? process.env.NODE_ENV !== 'production' ? invariant(false, 'EventPluginRegistry: Event plugins must implement an `extractEvents` method, but `%s` does not.', pluginName) : _prodInvariant('97', pluginName) : void 0;
	    EventPluginRegistry.plugins[pluginIndex] = pluginModule;
	    var publishedEvents = pluginModule.eventTypes;
	    for (var eventName in publishedEvents) {
	      !publishEventForPlugin(publishedEvents[eventName], pluginModule, eventName) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'EventPluginRegistry: Failed to publish event `%s` for plugin `%s`.', eventName, pluginName) : _prodInvariant('98', eventName, pluginName) : void 0;
	    }
	  }
	}

	/**
	 * Publishes an event so that it can be dispatched by the supplied plugin.
	 *
	 * @param {object} dispatchConfig Dispatch configuration for the event.
	 * @param {object} PluginModule Plugin publishing the event.
	 * @return {boolean} True if the event was successfully published.
	 * @private
	 */
	function publishEventForPlugin(dispatchConfig, pluginModule, eventName) {
	  !!EventPluginRegistry.eventNameDispatchConfigs.hasOwnProperty(eventName) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'EventPluginHub: More than one plugin attempted to publish the same event name, `%s`.', eventName) : _prodInvariant('99', eventName) : void 0;
	  EventPluginRegistry.eventNameDispatchConfigs[eventName] = dispatchConfig;

	  var phasedRegistrationNames = dispatchConfig.phasedRegistrationNames;
	  if (phasedRegistrationNames) {
	    for (var phaseName in phasedRegistrationNames) {
	      if (phasedRegistrationNames.hasOwnProperty(phaseName)) {
	        var phasedRegistrationName = phasedRegistrationNames[phaseName];
	        publishRegistrationName(phasedRegistrationName, pluginModule, eventName);
	      }
	    }
	    return true;
	  } else if (dispatchConfig.registrationName) {
	    publishRegistrationName(dispatchConfig.registrationName, pluginModule, eventName);
	    return true;
	  }
	  return false;
	}

	/**
	 * Publishes a registration name that is used to identify dispatched events and
	 * can be used with `EventPluginHub.putListener` to register listeners.
	 *
	 * @param {string} registrationName Registration name to add.
	 * @param {object} PluginModule Plugin publishing the event.
	 * @private
	 */
	function publishRegistrationName(registrationName, pluginModule, eventName) {
	  !!EventPluginRegistry.registrationNameModules[registrationName] ? process.env.NODE_ENV !== 'production' ? invariant(false, 'EventPluginHub: More than one plugin attempted to publish the same registration name, `%s`.', registrationName) : _prodInvariant('100', registrationName) : void 0;
	  EventPluginRegistry.registrationNameModules[registrationName] = pluginModule;
	  EventPluginRegistry.registrationNameDependencies[registrationName] = pluginModule.eventTypes[eventName].dependencies;

	  if (process.env.NODE_ENV !== 'production') {
	    var lowerCasedName = registrationName.toLowerCase();
	    EventPluginRegistry.possibleRegistrationNames[lowerCasedName] = registrationName;

	    if (registrationName === 'onDoubleClick') {
	      EventPluginRegistry.possibleRegistrationNames.ondblclick = registrationName;
	    }
	  }
	}

	/**
	 * Registers plugins so that they can extract and dispatch events.
	 *
	 * @see {EventPluginHub}
	 */
	var EventPluginRegistry = {

	  /**
	   * Ordered list of injected plugins.
	   */
	  plugins: [],

	  /**
	   * Mapping from event name to dispatch config
	   */
	  eventNameDispatchConfigs: {},

	  /**
	   * Mapping from registration name to plugin module
	   */
	  registrationNameModules: {},

	  /**
	   * Mapping from registration name to event name
	   */
	  registrationNameDependencies: {},

	  /**
	   * Mapping from lowercase registration names to the properly cased version,
	   * used to warn in the case of missing event handlers. Available
	   * only in __DEV__.
	   * @type {Object}
	   */
	  possibleRegistrationNames: process.env.NODE_ENV !== 'production' ? {} : null,
	  // Trust the developer to only use possibleRegistrationNames in __DEV__

	  /**
	   * Injects an ordering of plugins (by plugin name). This allows the ordering
	   * to be decoupled from injection of the actual plugins so that ordering is
	   * always deterministic regardless of packaging, on-the-fly injection, etc.
	   *
	   * @param {array} InjectedEventPluginOrder
	   * @internal
	   * @see {EventPluginHub.injection.injectEventPluginOrder}
	   */
	  injectEventPluginOrder: function (injectedEventPluginOrder) {
	    !!eventPluginOrder ? process.env.NODE_ENV !== 'production' ? invariant(false, 'EventPluginRegistry: Cannot inject event plugin ordering more than once. You are likely trying to load more than one copy of React.') : _prodInvariant('101') : void 0;
	    // Clone the ordering so it cannot be dynamically mutated.
	    eventPluginOrder = Array.prototype.slice.call(injectedEventPluginOrder);
	    recomputePluginOrdering();
	  },

	  /**
	   * Injects plugins to be used by `EventPluginHub`. The plugin names must be
	   * in the ordering injected by `injectEventPluginOrder`.
	   *
	   * Plugins can be injected as part of page initialization or on-the-fly.
	   *
	   * @param {object} injectedNamesToPlugins Map from names to plugin modules.
	   * @internal
	   * @see {EventPluginHub.injection.injectEventPluginsByName}
	   */
	  injectEventPluginsByName: function (injectedNamesToPlugins) {
	    var isOrderingDirty = false;
	    for (var pluginName in injectedNamesToPlugins) {
	      if (!injectedNamesToPlugins.hasOwnProperty(pluginName)) {
	        continue;
	      }
	      var pluginModule = injectedNamesToPlugins[pluginName];
	      if (!namesToPlugins.hasOwnProperty(pluginName) || namesToPlugins[pluginName] !== pluginModule) {
	        !!namesToPlugins[pluginName] ? process.env.NODE_ENV !== 'production' ? invariant(false, 'EventPluginRegistry: Cannot inject two different event plugins using the same name, `%s`.', pluginName) : _prodInvariant('102', pluginName) : void 0;
	        namesToPlugins[pluginName] = pluginModule;
	        isOrderingDirty = true;
	      }
	    }
	    if (isOrderingDirty) {
	      recomputePluginOrdering();
	    }
	  },

	  /**
	   * Looks up the plugin for the supplied event.
	   *
	   * @param {object} event A synthetic event.
	   * @return {?object} The plugin that created the supplied event.
	   * @internal
	   */
	  getPluginModuleForEvent: function (event) {
	    var dispatchConfig = event.dispatchConfig;
	    if (dispatchConfig.registrationName) {
	      return EventPluginRegistry.registrationNameModules[dispatchConfig.registrationName] || null;
	    }
	    if (dispatchConfig.phasedRegistrationNames !== undefined) {
	      // pulling phasedRegistrationNames out of dispatchConfig helps Flow see
	      // that it is not undefined.
	      var phasedRegistrationNames = dispatchConfig.phasedRegistrationNames;

	      for (var phase in phasedRegistrationNames) {
	        if (!phasedRegistrationNames.hasOwnProperty(phase)) {
	          continue;
	        }
	        var pluginModule = EventPluginRegistry.registrationNameModules[phasedRegistrationNames[phase]];
	        if (pluginModule) {
	          return pluginModule;
	        }
	      }
	    }
	    return null;
	  },

	  /**
	   * Exposed for unit testing.
	   * @private
	   */
	  _resetEventPlugins: function () {
	    eventPluginOrder = null;
	    for (var pluginName in namesToPlugins) {
	      if (namesToPlugins.hasOwnProperty(pluginName)) {
	        delete namesToPlugins[pluginName];
	      }
	    }
	    EventPluginRegistry.plugins.length = 0;

	    var eventNameDispatchConfigs = EventPluginRegistry.eventNameDispatchConfigs;
	    for (var eventName in eventNameDispatchConfigs) {
	      if (eventNameDispatchConfigs.hasOwnProperty(eventName)) {
	        delete eventNameDispatchConfigs[eventName];
	      }
	    }

	    var registrationNameModules = EventPluginRegistry.registrationNameModules;
	    for (var registrationName in registrationNameModules) {
	      if (registrationNameModules.hasOwnProperty(registrationName)) {
	        delete registrationNameModules[registrationName];
	      }
	    }

	    if (process.env.NODE_ENV !== 'production') {
	      var possibleRegistrationNames = EventPluginRegistry.possibleRegistrationNames;
	      for (var lowerCasedName in possibleRegistrationNames) {
	        if (possibleRegistrationNames.hasOwnProperty(lowerCasedName)) {
	          delete possibleRegistrationNames[lowerCasedName];
	        }
	      }
	    }
	  }

	};

	module.exports = EventPluginRegistry;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 */

	'use strict';

	var _prodInvariant = __webpack_require__(65);

	var ReactErrorUtils = __webpack_require__(68);

	var invariant = __webpack_require__(16);
	var warning = __webpack_require__(69);

	/**
	 * Injected dependencies:
	 */

	/**
	 * - `ComponentTree`: [required] Module that can convert between React instances
	 *   and actual node references.
	 */
	var ComponentTree;
	var TreeTraversal;
	var injection = {
	  injectComponentTree: function (Injected) {
	    ComponentTree = Injected;
	    if (process.env.NODE_ENV !== 'production') {
	      process.env.NODE_ENV !== 'production' ? warning(Injected && Injected.getNodeFromInstance && Injected.getInstanceFromNode, 'EventPluginUtils.injection.injectComponentTree(...): Injected ' + 'module is missing getNodeFromInstance or getInstanceFromNode.') : void 0;
	    }
	  },
	  injectTreeTraversal: function (Injected) {
	    TreeTraversal = Injected;
	    if (process.env.NODE_ENV !== 'production') {
	      process.env.NODE_ENV !== 'production' ? warning(Injected && Injected.isAncestor && Injected.getLowestCommonAncestor, 'EventPluginUtils.injection.injectTreeTraversal(...): Injected ' + 'module is missing isAncestor or getLowestCommonAncestor.') : void 0;
	    }
	  }
	};

	function isEndish(topLevelType) {
	  return topLevelType === 'topMouseUp' || topLevelType === 'topTouchEnd' || topLevelType === 'topTouchCancel';
	}

	function isMoveish(topLevelType) {
	  return topLevelType === 'topMouseMove' || topLevelType === 'topTouchMove';
	}
	function isStartish(topLevelType) {
	  return topLevelType === 'topMouseDown' || topLevelType === 'topTouchStart';
	}

	var validateEventDispatches;
	if (process.env.NODE_ENV !== 'production') {
	  validateEventDispatches = function (event) {
	    var dispatchListeners = event._dispatchListeners;
	    var dispatchInstances = event._dispatchInstances;

	    var listenersIsArr = Array.isArray(dispatchListeners);
	    var listenersLen = listenersIsArr ? dispatchListeners.length : dispatchListeners ? 1 : 0;

	    var instancesIsArr = Array.isArray(dispatchInstances);
	    var instancesLen = instancesIsArr ? dispatchInstances.length : dispatchInstances ? 1 : 0;

	    process.env.NODE_ENV !== 'production' ? warning(instancesIsArr === listenersIsArr && instancesLen === listenersLen, 'EventPluginUtils: Invalid `event`.') : void 0;
	  };
	}

	/**
	 * Dispatch the event to the listener.
	 * @param {SyntheticEvent} event SyntheticEvent to handle
	 * @param {boolean} simulated If the event is simulated (changes exn behavior)
	 * @param {function} listener Application-level callback
	 * @param {*} inst Internal component instance
	 */
	function executeDispatch(event, simulated, listener, inst) {
	  var type = event.type || 'unknown-event';
	  event.currentTarget = EventPluginUtils.getNodeFromInstance(inst);
	  if (simulated) {
	    ReactErrorUtils.invokeGuardedCallbackWithCatch(type, listener, event);
	  } else {
	    ReactErrorUtils.invokeGuardedCallback(type, listener, event);
	  }
	  event.currentTarget = null;
	}

	/**
	 * Standard/simple iteration through an event's collected dispatches.
	 */
	function executeDispatchesInOrder(event, simulated) {
	  var dispatchListeners = event._dispatchListeners;
	  var dispatchInstances = event._dispatchInstances;
	  if (process.env.NODE_ENV !== 'production') {
	    validateEventDispatches(event);
	  }
	  if (Array.isArray(dispatchListeners)) {
	    for (var i = 0; i < dispatchListeners.length; i++) {
	      if (event.isPropagationStopped()) {
	        break;
	      }
	      // Listeners and Instances are two parallel arrays that are always in sync.
	      executeDispatch(event, simulated, dispatchListeners[i], dispatchInstances[i]);
	    }
	  } else if (dispatchListeners) {
	    executeDispatch(event, simulated, dispatchListeners, dispatchInstances);
	  }
	  event._dispatchListeners = null;
	  event._dispatchInstances = null;
	}

	/**
	 * Standard/simple iteration through an event's collected dispatches, but stops
	 * at the first dispatch execution returning true, and returns that id.
	 *
	 * @return {?string} id of the first dispatch execution who's listener returns
	 * true, or null if no listener returned true.
	 */
	function executeDispatchesInOrderStopAtTrueImpl(event) {
	  var dispatchListeners = event._dispatchListeners;
	  var dispatchInstances = event._dispatchInstances;
	  if (process.env.NODE_ENV !== 'production') {
	    validateEventDispatches(event);
	  }
	  if (Array.isArray(dispatchListeners)) {
	    for (var i = 0; i < dispatchListeners.length; i++) {
	      if (event.isPropagationStopped()) {
	        break;
	      }
	      // Listeners and Instances are two parallel arrays that are always in sync.
	      if (dispatchListeners[i](event, dispatchInstances[i])) {
	        return dispatchInstances[i];
	      }
	    }
	  } else if (dispatchListeners) {
	    if (dispatchListeners(event, dispatchInstances)) {
	      return dispatchInstances;
	    }
	  }
	  return null;
	}

	/**
	 * @see executeDispatchesInOrderStopAtTrueImpl
	 */
	function executeDispatchesInOrderStopAtTrue(event) {
	  var ret = executeDispatchesInOrderStopAtTrueImpl(event);
	  event._dispatchInstances = null;
	  event._dispatchListeners = null;
	  return ret;
	}

	/**
	 * Execution of a "direct" dispatch - there must be at most one dispatch
	 * accumulated on the event or it is considered an error. It doesn't really make
	 * sense for an event with multiple dispatches (bubbled) to keep track of the
	 * return values at each dispatch execution, but it does tend to make sense when
	 * dealing with "direct" dispatches.
	 *
	 * @return {*} The return value of executing the single dispatch.
	 */
	function executeDirectDispatch(event) {
	  if (process.env.NODE_ENV !== 'production') {
	    validateEventDispatches(event);
	  }
	  var dispatchListener = event._dispatchListeners;
	  var dispatchInstance = event._dispatchInstances;
	  !!Array.isArray(dispatchListener) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'executeDirectDispatch(...): Invalid `event`.') : _prodInvariant('103') : void 0;
	  event.currentTarget = dispatchListener ? EventPluginUtils.getNodeFromInstance(dispatchInstance) : null;
	  var res = dispatchListener ? dispatchListener(event) : null;
	  event.currentTarget = null;
	  event._dispatchListeners = null;
	  event._dispatchInstances = null;
	  return res;
	}

	/**
	 * @param {SyntheticEvent} event
	 * @return {boolean} True iff number of dispatches accumulated is greater than 0.
	 */
	function hasDispatches(event) {
	  return !!event._dispatchListeners;
	}

	/**
	 * General utilities that are useful in creating custom Event Plugins.
	 */
	var EventPluginUtils = {
	  isEndish: isEndish,
	  isMoveish: isMoveish,
	  isStartish: isStartish,

	  executeDirectDispatch: executeDirectDispatch,
	  executeDispatchesInOrder: executeDispatchesInOrder,
	  executeDispatchesInOrderStopAtTrue: executeDispatchesInOrderStopAtTrue,
	  hasDispatches: hasDispatches,

	  getInstanceFromNode: function (node) {
	    return ComponentTree.getInstanceFromNode(node);
	  },
	  getNodeFromInstance: function (node) {
	    return ComponentTree.getNodeFromInstance(node);
	  },
	  isAncestor: function (a, b) {
	    return TreeTraversal.isAncestor(a, b);
	  },
	  getLowestCommonAncestor: function (a, b) {
	    return TreeTraversal.getLowestCommonAncestor(a, b);
	  },
	  getParentInstance: function (inst) {
	    return TreeTraversal.getParentInstance(inst);
	  },
	  traverseTwoPhase: function (target, fn, arg) {
	    return TreeTraversal.traverseTwoPhase(target, fn, arg);
	  },
	  traverseEnterLeave: function (from, to, fn, argFrom, argTo) {
	    return TreeTraversal.traverseEnterLeave(from, to, fn, argFrom, argTo);
	  },

	  injection: injection
	};

	module.exports = EventPluginUtils;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * 
	 */

	'use strict';

	var caughtError = null;

	/**
	 * Call a function while guarding against errors that happens within it.
	 *
	 * @param {String} name of the guard to use for logging or debugging
	 * @param {Function} func The function to invoke
	 * @param {*} a First argument
	 * @param {*} b Second argument
	 */
	function invokeGuardedCallback(name, func, a) {
	  try {
	    func(a);
	  } catch (x) {
	    if (caughtError === null) {
	      caughtError = x;
	    }
	  }
	}

	var ReactErrorUtils = {
	  invokeGuardedCallback: invokeGuardedCallback,

	  /**
	   * Invoked by ReactTestUtils.Simulate so that any errors thrown by the event
	   * handler are sure to be rethrown by rethrowCaughtError.
	   */
	  invokeGuardedCallbackWithCatch: invokeGuardedCallback,

	  /**
	   * During execution of guarded functions we will capture the first error which
	   * we will rethrow to be handled by the top level error handler.
	   */
	  rethrowCaughtError: function () {
	    if (caughtError) {
	      var error = caughtError;
	      caughtError = null;
	      throw error;
	    }
	  }
	};

	if (process.env.NODE_ENV !== 'production') {
	  /**
	   * To help development we can get better devtools integration by simulating a
	   * real browser event.
	   */
	  if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function' && typeof document !== 'undefined' && typeof document.createEvent === 'function') {
	    var fakeNode = document.createElement('react');
	    ReactErrorUtils.invokeGuardedCallback = function (name, func, a) {
	      var boundFunc = func.bind(null, a);
	      var evtType = 'react-' + name;
	      fakeNode.addEventListener(evtType, boundFunc, false);
	      var evt = document.createEvent('Event');
	      // $FlowFixMe https://github.com/facebook/flow/issues/2336
	      evt.initEvent(evtType, false, false);
	      fakeNode.dispatchEvent(evt);
	      fakeNode.removeEventListener(evtType, boundFunc, false);
	    };
	  }
	}

	module.exports = ReactErrorUtils;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright 2014-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 */

	'use strict';

	var emptyFunction = __webpack_require__(70);

	/**
	 * Similar to invariant but only logs a warning if the condition is not met.
	 * This can be used to log issues in development environments in critical
	 * paths. Removing the logging code for production environments will keep the
	 * same logic and follow the same code paths.
	 */

	var warning = emptyFunction;

	if (process.env.NODE_ENV !== 'production') {
	  (function () {
	    var printWarning = function printWarning(format) {
	      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	        args[_key - 1] = arguments[_key];
	      }

	      var argIndex = 0;
	      var message = 'Warning: ' + format.replace(/%s/g, function () {
	        return args[argIndex++];
	      });
	      if (typeof console !== 'undefined') {
	        console.error(message);
	      }
	      try {
	        // --- Welcome to debugging React ---
	        // This error was thrown as a convenience so that you can use this stack
	        // to find the callsite that caused this warning to fire.
	        throw new Error(message);
	      } catch (x) {}
	    };

	    warning = function warning(condition, format) {
	      if (format === undefined) {
	        throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
	      }

	      if (format.indexOf('Failed Composite propType: ') === 0) {
	        return; // Ignore CompositeComponent proptype check.
	      }

	      if (!condition) {
	        for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
	          args[_key2 - 2] = arguments[_key2];
	        }

	        printWarning.apply(undefined, [format].concat(args));
	      }
	    };
	  })();
	}

	module.exports = warning;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ },
/* 70 */
/***/ function(module, exports) {

	"use strict";

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * 
	 */

	function makeEmptyFunction(arg) {
	  return function () {
	    return arg;
	  };
	}

	/**
	 * This function accepts and discards inputs; it has no side effects. This is
	 * primarily useful idiomatically for overridable function endpoints which
	 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
	 */
	var emptyFunction = function emptyFunction() {};

	emptyFunction.thatReturns = makeEmptyFunction;
	emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
	emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
	emptyFunction.thatReturnsNull = makeEmptyFunction(null);
	emptyFunction.thatReturnsThis = function () {
	  return this;
	};
	emptyFunction.thatReturnsArgument = function (arg) {
	  return arg;
	};

	module.exports = emptyFunction;

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright 2014-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * 
	 */

	'use strict';

	var _prodInvariant = __webpack_require__(65);

	var invariant = __webpack_require__(16);

	/**
	 * Accumulates items that must not be null or undefined into the first one. This
	 * is used to conserve memory by avoiding array allocations, and thus sacrifices
	 * API cleanness. Since `current` can be null before being passed in and not
	 * null after this function, make sure to assign it back to `current`:
	 *
	 * `a = accumulateInto(a, b);`
	 *
	 * This API should be sparingly used. Try `accumulate` for something cleaner.
	 *
	 * @return {*|array<*>} An accumulation of items.
	 */

	function accumulateInto(current, next) {
	  !(next != null) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'accumulateInto(...): Accumulated items must not be null or undefined.') : _prodInvariant('30') : void 0;

	  if (current == null) {
	    return next;
	  }

	  // Both are not empty. Warning: Never call x.concat(y) when you are not
	  // certain that x is an Array (x could be a string with concat method).
	  if (Array.isArray(current)) {
	    if (Array.isArray(next)) {
	      current.push.apply(current, next);
	      return current;
	    }
	    current.push(next);
	    return current;
	  }

	  if (Array.isArray(next)) {
	    // A bit too dangerous to mutate `next`.
	    return [current].concat(next);
	  }

	  return [current, next];
	}

	module.exports = accumulateInto;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ },
/* 72 */
/***/ function(module, exports) {

	/**
	 * Copyright 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * 
	 */

	'use strict';

	/**
	 * @param {array} arr an "accumulation" of items which is either an Array or
	 * a single item. Useful when paired with the `accumulate` module. This is a
	 * simple utility that allows us to reason about a collection of items, but
	 * handling the case when there is exactly one item (and we do not need to
	 * allocate an array).
	 */

	function forEachAccumulated(arr, cb, scope) {
	  if (Array.isArray(arr)) {
	    arr.forEach(cb, scope);
	  } else if (arr) {
	    cb.call(scope, arr);
	  }
	}

	module.exports = forEachAccumulated;

/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2014 Facebook, Inc.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 *
	 * @providesModule TapEventPlugin
	 * @typechecks static-only
	 */

	"use strict";

	var EventConstants = __webpack_require__(74);
	var EventPluginUtils = __webpack_require__(67);
	var EventPropagators = __webpack_require__(75);
	var SyntheticUIEvent = __webpack_require__(76);
	var TouchEventUtils = __webpack_require__(80);
	var ViewportMetrics = __webpack_require__(81);

	var keyOf = __webpack_require__(82);
	var topLevelTypes = EventConstants.topLevelTypes;

	var isStartish = EventPluginUtils.isStartish;
	var isEndish = EventPluginUtils.isEndish;

	var isTouch = function(topLevelType) {
	  var touchTypes = [
	    'topTouchCancel',
	    'topTouchEnd',
	    'topTouchStart',
	    'topTouchMove'
	  ];
	  return touchTypes.indexOf(topLevelType) >= 0;
	}

	/**
	 * Number of pixels that are tolerated in between a `touchStart` and `touchEnd`
	 * in order to still be considered a 'tap' event.
	 */
	var tapMoveThreshold = 10;
	var ignoreMouseThreshold = 750;
	var startCoords = {x: null, y: null};
	var lastTouchEvent = null;

	var Axis = {
	  x: {page: 'pageX', client: 'clientX', envScroll: 'currentPageScrollLeft'},
	  y: {page: 'pageY', client: 'clientY', envScroll: 'currentPageScrollTop'}
	};

	function getAxisCoordOfEvent(axis, nativeEvent) {
	  var singleTouch = TouchEventUtils.extractSingleTouch(nativeEvent);
	  if (singleTouch) {
	    return singleTouch[axis.page];
	  }
	  return axis.page in nativeEvent ?
	    nativeEvent[axis.page] :
	    nativeEvent[axis.client] + ViewportMetrics[axis.envScroll];
	}

	function getDistance(coords, nativeEvent) {
	  var pageX = getAxisCoordOfEvent(Axis.x, nativeEvent);
	  var pageY = getAxisCoordOfEvent(Axis.y, nativeEvent);
	  return Math.pow(
	    Math.pow(pageX - coords.x, 2) + Math.pow(pageY - coords.y, 2),
	    0.5
	  );
	}

	var touchEvents = [
	  'topTouchStart',
	  'topTouchCancel',
	  'topTouchEnd',
	  'topTouchMove',
	];

	var dependencies = [
	  'topMouseDown',
	  'topMouseMove',
	  'topMouseUp',
	].concat(touchEvents);

	var eventTypes = {
	  touchTap: {
	    phasedRegistrationNames: {
	      bubbled: keyOf({onTouchTap: null}),
	      captured: keyOf({onTouchTapCapture: null})
	    },
	    dependencies: dependencies
	  }
	};

	var now = (function() {
	  if (Date.now) {
	    return Date.now;
	  } else {
	    // IE8 support: http://stackoverflow.com/questions/9430357/please-explain-why-and-how-new-date-works-as-workaround-for-date-now-in
	    return function () {
	      return +new Date;
	    }
	  }
	})();

	function createTapEventPlugin(shouldRejectClick) {
	  return {

	    tapMoveThreshold: tapMoveThreshold,

	    ignoreMouseThreshold: ignoreMouseThreshold,

	    eventTypes: eventTypes,

	    /**
	     * @param {string} topLevelType Record from `EventConstants`.
	     * @param {DOMEventTarget} targetInst The listening component root node.
	     * @param {object} nativeEvent Native browser event.
	     * @return {*} An accumulation of synthetic events.
	     * @see {EventPluginHub.extractEvents}
	     */
	    extractEvents: function(
	      topLevelType,
	      targetInst,
	      nativeEvent,
	      nativeEventTarget
	    ) {

	      if (!isStartish(topLevelType) && !isEndish(topLevelType)) {
	        return null;
	      }

	      if (isTouch(topLevelType)) {
	        lastTouchEvent = now();
	      } else {
	        if (shouldRejectClick(lastTouchEvent, now())) {
	          return null;
	        }
	      }

	      var event = null;
	      var distance = getDistance(startCoords, nativeEvent);
	      if (isEndish(topLevelType) && distance < tapMoveThreshold) {
	        event = SyntheticUIEvent.getPooled(
	          eventTypes.touchTap,
	          targetInst,
	          nativeEvent,
	          nativeEventTarget
	        );
	      }
	      if (isStartish(topLevelType)) {
	        startCoords.x = getAxisCoordOfEvent(Axis.x, nativeEvent);
	        startCoords.y = getAxisCoordOfEvent(Axis.y, nativeEvent);
	      } else if (isEndish(topLevelType)) {
	        startCoords.x = 0;
	        startCoords.y = 0;
	      }
	      EventPropagators.accumulateTwoPhaseDispatches(event);
	      return event;
	    }

	  };
	}

	module.exports = createTapEventPlugin;


/***/ },
/* 74 */
/***/ function(module, exports) {

	/**
	 * Copyright 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 */

	'use strict';

	/**
	 * Types of raw signals from the browser caught at the top level.
	 */
	var topLevelTypes = {
	  topAbort: null,
	  topAnimationEnd: null,
	  topAnimationIteration: null,
	  topAnimationStart: null,
	  topBlur: null,
	  topCanPlay: null,
	  topCanPlayThrough: null,
	  topChange: null,
	  topClick: null,
	  topCompositionEnd: null,
	  topCompositionStart: null,
	  topCompositionUpdate: null,
	  topContextMenu: null,
	  topCopy: null,
	  topCut: null,
	  topDoubleClick: null,
	  topDrag: null,
	  topDragEnd: null,
	  topDragEnter: null,
	  topDragExit: null,
	  topDragLeave: null,
	  topDragOver: null,
	  topDragStart: null,
	  topDrop: null,
	  topDurationChange: null,
	  topEmptied: null,
	  topEncrypted: null,
	  topEnded: null,
	  topError: null,
	  topFocus: null,
	  topInput: null,
	  topInvalid: null,
	  topKeyDown: null,
	  topKeyPress: null,
	  topKeyUp: null,
	  topLoad: null,
	  topLoadedData: null,
	  topLoadedMetadata: null,
	  topLoadStart: null,
	  topMouseDown: null,
	  topMouseMove: null,
	  topMouseOut: null,
	  topMouseOver: null,
	  topMouseUp: null,
	  topPaste: null,
	  topPause: null,
	  topPlay: null,
	  topPlaying: null,
	  topProgress: null,
	  topRateChange: null,
	  topReset: null,
	  topScroll: null,
	  topSeeked: null,
	  topSeeking: null,
	  topSelectionChange: null,
	  topStalled: null,
	  topSubmit: null,
	  topSuspend: null,
	  topTextInput: null,
	  topTimeUpdate: null,
	  topTouchCancel: null,
	  topTouchEnd: null,
	  topTouchMove: null,
	  topTouchStart: null,
	  topTransitionEnd: null,
	  topVolumeChange: null,
	  topWaiting: null,
	  topWheel: null
	};

	var EventConstants = {
	  topLevelTypes: topLevelTypes
	};

	module.exports = EventConstants;

/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 */

	'use strict';

	var EventPluginHub = __webpack_require__(64);
	var EventPluginUtils = __webpack_require__(67);

	var accumulateInto = __webpack_require__(71);
	var forEachAccumulated = __webpack_require__(72);
	var warning = __webpack_require__(69);

	var getListener = EventPluginHub.getListener;

	/**
	 * Some event types have a notion of different registration names for different
	 * "phases" of propagation. This finds listeners by a given phase.
	 */
	function listenerAtPhase(inst, event, propagationPhase) {
	  var registrationName = event.dispatchConfig.phasedRegistrationNames[propagationPhase];
	  return getListener(inst, registrationName);
	}

	/**
	 * Tags a `SyntheticEvent` with dispatched listeners. Creating this function
	 * here, allows us to not have to bind or create functions for each event.
	 * Mutating the event's members allows us to not have to create a wrapping
	 * "dispatch" object that pairs the event with the listener.
	 */
	function accumulateDirectionalDispatches(inst, phase, event) {
	  if (process.env.NODE_ENV !== 'production') {
	    process.env.NODE_ENV !== 'production' ? warning(inst, 'Dispatching inst must not be null') : void 0;
	  }
	  var listener = listenerAtPhase(inst, event, phase);
	  if (listener) {
	    event._dispatchListeners = accumulateInto(event._dispatchListeners, listener);
	    event._dispatchInstances = accumulateInto(event._dispatchInstances, inst);
	  }
	}

	/**
	 * Collect dispatches (must be entirely collected before dispatching - see unit
	 * tests). Lazily allocate the array to conserve memory.  We must loop through
	 * each event and perform the traversal for each one. We cannot perform a
	 * single traversal for the entire collection of events because each event may
	 * have a different target.
	 */
	function accumulateTwoPhaseDispatchesSingle(event) {
	  if (event && event.dispatchConfig.phasedRegistrationNames) {
	    EventPluginUtils.traverseTwoPhase(event._targetInst, accumulateDirectionalDispatches, event);
	  }
	}

	/**
	 * Same as `accumulateTwoPhaseDispatchesSingle`, but skips over the targetID.
	 */
	function accumulateTwoPhaseDispatchesSingleSkipTarget(event) {
	  if (event && event.dispatchConfig.phasedRegistrationNames) {
	    var targetInst = event._targetInst;
	    var parentInst = targetInst ? EventPluginUtils.getParentInstance(targetInst) : null;
	    EventPluginUtils.traverseTwoPhase(parentInst, accumulateDirectionalDispatches, event);
	  }
	}

	/**
	 * Accumulates without regard to direction, does not look for phased
	 * registration names. Same as `accumulateDirectDispatchesSingle` but without
	 * requiring that the `dispatchMarker` be the same as the dispatched ID.
	 */
	function accumulateDispatches(inst, ignoredDirection, event) {
	  if (event && event.dispatchConfig.registrationName) {
	    var registrationName = event.dispatchConfig.registrationName;
	    var listener = getListener(inst, registrationName);
	    if (listener) {
	      event._dispatchListeners = accumulateInto(event._dispatchListeners, listener);
	      event._dispatchInstances = accumulateInto(event._dispatchInstances, inst);
	    }
	  }
	}

	/**
	 * Accumulates dispatches on an `SyntheticEvent`, but only for the
	 * `dispatchMarker`.
	 * @param {SyntheticEvent} event
	 */
	function accumulateDirectDispatchesSingle(event) {
	  if (event && event.dispatchConfig.registrationName) {
	    accumulateDispatches(event._targetInst, null, event);
	  }
	}

	function accumulateTwoPhaseDispatches(events) {
	  forEachAccumulated(events, accumulateTwoPhaseDispatchesSingle);
	}

	function accumulateTwoPhaseDispatchesSkipTarget(events) {
	  forEachAccumulated(events, accumulateTwoPhaseDispatchesSingleSkipTarget);
	}

	function accumulateEnterLeaveDispatches(leave, enter, from, to) {
	  EventPluginUtils.traverseEnterLeave(from, to, accumulateDispatches, leave, enter);
	}

	function accumulateDirectDispatches(events) {
	  forEachAccumulated(events, accumulateDirectDispatchesSingle);
	}

	/**
	 * A small set of propagation patterns, each of which will accept a small amount
	 * of information, and generate a set of "dispatch ready event objects" - which
	 * are sets of events that have already been annotated with a set of dispatched
	 * listener functions/ids. The API is designed this way to discourage these
	 * propagation strategies from actually executing the dispatches, since we
	 * always want to collect the entire set of dispatches before executing event a
	 * single one.
	 *
	 * @constructor EventPropagators
	 */
	var EventPropagators = {
	  accumulateTwoPhaseDispatches: accumulateTwoPhaseDispatches,
	  accumulateTwoPhaseDispatchesSkipTarget: accumulateTwoPhaseDispatchesSkipTarget,
	  accumulateDirectDispatches: accumulateDirectDispatches,
	  accumulateEnterLeaveDispatches: accumulateEnterLeaveDispatches
	};

	module.exports = EventPropagators;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 */

	'use strict';

	var SyntheticEvent = __webpack_require__(77);

	var getEventTarget = __webpack_require__(79);

	/**
	 * @interface UIEvent
	 * @see http://www.w3.org/TR/DOM-Level-3-Events/
	 */
	var UIEventInterface = {
	  view: function (event) {
	    if (event.view) {
	      return event.view;
	    }

	    var target = getEventTarget(event);
	    if (target.window === target) {
	      // target is a window object
	      return target;
	    }

	    var doc = target.ownerDocument;
	    // TODO: Figure out why `ownerDocument` is sometimes undefined in IE8.
	    if (doc) {
	      return doc.defaultView || doc.parentWindow;
	    } else {
	      return window;
	    }
	  },
	  detail: function (event) {
	    return event.detail || 0;
	  }
	};

	/**
	 * @param {object} dispatchConfig Configuration used to dispatch this event.
	 * @param {string} dispatchMarker Marker identifying the event target.
	 * @param {object} nativeEvent Native browser event.
	 * @extends {SyntheticEvent}
	 */
	function SyntheticUIEvent(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
	  return SyntheticEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
	}

	SyntheticEvent.augmentClass(SyntheticUIEvent, UIEventInterface);

	module.exports = SyntheticUIEvent;

/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 */

	'use strict';

	var _assign = __webpack_require__(15);

	var PooledClass = __webpack_require__(78);

	var emptyFunction = __webpack_require__(70);
	var warning = __webpack_require__(69);

	var didWarnForAddedNewProperty = false;
	var isProxySupported = typeof Proxy === 'function';

	var shouldBeReleasedProperties = ['dispatchConfig', '_targetInst', 'nativeEvent', 'isDefaultPrevented', 'isPropagationStopped', '_dispatchListeners', '_dispatchInstances'];

	/**
	 * @interface Event
	 * @see http://www.w3.org/TR/DOM-Level-3-Events/
	 */
	var EventInterface = {
	  type: null,
	  target: null,
	  // currentTarget is set when dispatching; no use in copying it here
	  currentTarget: emptyFunction.thatReturnsNull,
	  eventPhase: null,
	  bubbles: null,
	  cancelable: null,
	  timeStamp: function (event) {
	    return event.timeStamp || Date.now();
	  },
	  defaultPrevented: null,
	  isTrusted: null
	};

	/**
	 * Synthetic events are dispatched by event plugins, typically in response to a
	 * top-level event delegation handler.
	 *
	 * These systems should generally use pooling to reduce the frequency of garbage
	 * collection. The system should check `isPersistent` to determine whether the
	 * event should be released into the pool after being dispatched. Users that
	 * need a persisted event should invoke `persist`.
	 *
	 * Synthetic events (and subclasses) implement the DOM Level 3 Events API by
	 * normalizing browser quirks. Subclasses do not necessarily have to implement a
	 * DOM interface; custom application-specific events can also subclass this.
	 *
	 * @param {object} dispatchConfig Configuration used to dispatch this event.
	 * @param {*} targetInst Marker identifying the event target.
	 * @param {object} nativeEvent Native browser event.
	 * @param {DOMEventTarget} nativeEventTarget Target node.
	 */
	function SyntheticEvent(dispatchConfig, targetInst, nativeEvent, nativeEventTarget) {
	  if (process.env.NODE_ENV !== 'production') {
	    // these have a getter/setter for warnings
	    delete this.nativeEvent;
	    delete this.preventDefault;
	    delete this.stopPropagation;
	  }

	  this.dispatchConfig = dispatchConfig;
	  this._targetInst = targetInst;
	  this.nativeEvent = nativeEvent;

	  var Interface = this.constructor.Interface;
	  for (var propName in Interface) {
	    if (!Interface.hasOwnProperty(propName)) {
	      continue;
	    }
	    if (process.env.NODE_ENV !== 'production') {
	      delete this[propName]; // this has a getter/setter for warnings
	    }
	    var normalize = Interface[propName];
	    if (normalize) {
	      this[propName] = normalize(nativeEvent);
	    } else {
	      if (propName === 'target') {
	        this.target = nativeEventTarget;
	      } else {
	        this[propName] = nativeEvent[propName];
	      }
	    }
	  }

	  var defaultPrevented = nativeEvent.defaultPrevented != null ? nativeEvent.defaultPrevented : nativeEvent.returnValue === false;
	  if (defaultPrevented) {
	    this.isDefaultPrevented = emptyFunction.thatReturnsTrue;
	  } else {
	    this.isDefaultPrevented = emptyFunction.thatReturnsFalse;
	  }
	  this.isPropagationStopped = emptyFunction.thatReturnsFalse;
	  return this;
	}

	_assign(SyntheticEvent.prototype, {

	  preventDefault: function () {
	    this.defaultPrevented = true;
	    var event = this.nativeEvent;
	    if (!event) {
	      return;
	    }

	    if (event.preventDefault) {
	      event.preventDefault();
	    } else if (typeof event.returnValue !== 'unknown') {
	      // eslint-disable-line valid-typeof
	      event.returnValue = false;
	    }
	    this.isDefaultPrevented = emptyFunction.thatReturnsTrue;
	  },

	  stopPropagation: function () {
	    var event = this.nativeEvent;
	    if (!event) {
	      return;
	    }

	    if (event.stopPropagation) {
	      event.stopPropagation();
	    } else if (typeof event.cancelBubble !== 'unknown') {
	      // eslint-disable-line valid-typeof
	      // The ChangeEventPlugin registers a "propertychange" event for
	      // IE. This event does not support bubbling or cancelling, and
	      // any references to cancelBubble throw "Member not found".  A
	      // typeof check of "unknown" circumvents this issue (and is also
	      // IE specific).
	      event.cancelBubble = true;
	    }

	    this.isPropagationStopped = emptyFunction.thatReturnsTrue;
	  },

	  /**
	   * We release all dispatched `SyntheticEvent`s after each event loop, adding
	   * them back into the pool. This allows a way to hold onto a reference that
	   * won't be added back into the pool.
	   */
	  persist: function () {
	    this.isPersistent = emptyFunction.thatReturnsTrue;
	  },

	  /**
	   * Checks if this event should be released back into the pool.
	   *
	   * @return {boolean} True if this should not be released, false otherwise.
	   */
	  isPersistent: emptyFunction.thatReturnsFalse,

	  /**
	   * `PooledClass` looks for `destructor` on each instance it releases.
	   */
	  destructor: function () {
	    var Interface = this.constructor.Interface;
	    for (var propName in Interface) {
	      if (process.env.NODE_ENV !== 'production') {
	        Object.defineProperty(this, propName, getPooledWarningPropertyDefinition(propName, Interface[propName]));
	      } else {
	        this[propName] = null;
	      }
	    }
	    for (var i = 0; i < shouldBeReleasedProperties.length; i++) {
	      this[shouldBeReleasedProperties[i]] = null;
	    }
	    if (process.env.NODE_ENV !== 'production') {
	      Object.defineProperty(this, 'nativeEvent', getPooledWarningPropertyDefinition('nativeEvent', null));
	      Object.defineProperty(this, 'preventDefault', getPooledWarningPropertyDefinition('preventDefault', emptyFunction));
	      Object.defineProperty(this, 'stopPropagation', getPooledWarningPropertyDefinition('stopPropagation', emptyFunction));
	    }
	  }

	});

	SyntheticEvent.Interface = EventInterface;

	if (process.env.NODE_ENV !== 'production') {
	  if (isProxySupported) {
	    /*eslint-disable no-func-assign */
	    SyntheticEvent = new Proxy(SyntheticEvent, {
	      construct: function (target, args) {
	        return this.apply(target, Object.create(target.prototype), args);
	      },
	      apply: function (constructor, that, args) {
	        return new Proxy(constructor.apply(that, args), {
	          set: function (target, prop, value) {
	            if (prop !== 'isPersistent' && !target.constructor.Interface.hasOwnProperty(prop) && shouldBeReleasedProperties.indexOf(prop) === -1) {
	              process.env.NODE_ENV !== 'production' ? warning(didWarnForAddedNewProperty || target.isPersistent(), 'This synthetic event is reused for performance reasons. If you\'re ' + 'seeing this, you\'re adding a new property in the synthetic event object. ' + 'The property is never released. See ' + 'https://fb.me/react-event-pooling for more information.') : void 0;
	              didWarnForAddedNewProperty = true;
	            }
	            target[prop] = value;
	            return true;
	          }
	        });
	      }
	    });
	    /*eslint-enable no-func-assign */
	  }
	}
	/**
	 * Helper to reduce boilerplate when creating subclasses.
	 *
	 * @param {function} Class
	 * @param {?object} Interface
	 */
	SyntheticEvent.augmentClass = function (Class, Interface) {
	  var Super = this;

	  var E = function () {};
	  E.prototype = Super.prototype;
	  var prototype = new E();

	  _assign(prototype, Class.prototype);
	  Class.prototype = prototype;
	  Class.prototype.constructor = Class;

	  Class.Interface = _assign({}, Super.Interface, Interface);
	  Class.augmentClass = Super.augmentClass;

	  PooledClass.addPoolingTo(Class, PooledClass.fourArgumentPooler);
	};

	PooledClass.addPoolingTo(SyntheticEvent, PooledClass.fourArgumentPooler);

	module.exports = SyntheticEvent;

	/**
	  * Helper to nullify syntheticEvent instance properties when destructing
	  *
	  * @param {object} SyntheticEvent
	  * @param {String} propName
	  * @return {object} defineProperty object
	  */
	function getPooledWarningPropertyDefinition(propName, getVal) {
	  var isFunction = typeof getVal === 'function';
	  return {
	    configurable: true,
	    set: set,
	    get: get
	  };

	  function set(val) {
	    var action = isFunction ? 'setting the method' : 'setting the property';
	    warn(action, 'This is effectively a no-op');
	    return val;
	  }

	  function get() {
	    var action = isFunction ? 'accessing the method' : 'accessing the property';
	    var result = isFunction ? 'This is a no-op function' : 'This is set to null';
	    warn(action, result);
	    return getVal;
	  }

	  function warn(action, result) {
	    var warningCondition = false;
	    process.env.NODE_ENV !== 'production' ? warning(warningCondition, 'This synthetic event is reused for performance reasons. If you\'re seeing this, ' + 'you\'re %s `%s` on a released/nullified synthetic event. %s. ' + 'If you must keep the original synthetic event around, use event.persist(). ' + 'See https://fb.me/react-event-pooling for more information.', action, propName, result) : void 0;
	  }
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * 
	 */

	'use strict';

	var _prodInvariant = __webpack_require__(65);

	var invariant = __webpack_require__(16);

	/**
	 * Static poolers. Several custom versions for each potential number of
	 * arguments. A completely generic pooler is easy to implement, but would
	 * require accessing the `arguments` object. In each of these, `this` refers to
	 * the Class itself, not an instance. If any others are needed, simply add them
	 * here, or in their own files.
	 */
	var oneArgumentPooler = function (copyFieldsFrom) {
	  var Klass = this;
	  if (Klass.instancePool.length) {
	    var instance = Klass.instancePool.pop();
	    Klass.call(instance, copyFieldsFrom);
	    return instance;
	  } else {
	    return new Klass(copyFieldsFrom);
	  }
	};

	var twoArgumentPooler = function (a1, a2) {
	  var Klass = this;
	  if (Klass.instancePool.length) {
	    var instance = Klass.instancePool.pop();
	    Klass.call(instance, a1, a2);
	    return instance;
	  } else {
	    return new Klass(a1, a2);
	  }
	};

	var threeArgumentPooler = function (a1, a2, a3) {
	  var Klass = this;
	  if (Klass.instancePool.length) {
	    var instance = Klass.instancePool.pop();
	    Klass.call(instance, a1, a2, a3);
	    return instance;
	  } else {
	    return new Klass(a1, a2, a3);
	  }
	};

	var fourArgumentPooler = function (a1, a2, a3, a4) {
	  var Klass = this;
	  if (Klass.instancePool.length) {
	    var instance = Klass.instancePool.pop();
	    Klass.call(instance, a1, a2, a3, a4);
	    return instance;
	  } else {
	    return new Klass(a1, a2, a3, a4);
	  }
	};

	var standardReleaser = function (instance) {
	  var Klass = this;
	  !(instance instanceof Klass) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Trying to release an instance into a pool of a different type.') : _prodInvariant('25') : void 0;
	  instance.destructor();
	  if (Klass.instancePool.length < Klass.poolSize) {
	    Klass.instancePool.push(instance);
	  }
	};

	var DEFAULT_POOL_SIZE = 10;
	var DEFAULT_POOLER = oneArgumentPooler;

	/**
	 * Augments `CopyConstructor` to be a poolable class, augmenting only the class
	 * itself (statically) not adding any prototypical fields. Any CopyConstructor
	 * you give this may have a `poolSize` property, and will look for a
	 * prototypical `destructor` on instances.
	 *
	 * @param {Function} CopyConstructor Constructor that can be used to reset.
	 * @param {Function} pooler Customizable pooler.
	 */
	var addPoolingTo = function (CopyConstructor, pooler) {
	  // Casting as any so that flow ignores the actual implementation and trusts
	  // it to match the type we declared
	  var NewKlass = CopyConstructor;
	  NewKlass.instancePool = [];
	  NewKlass.getPooled = pooler || DEFAULT_POOLER;
	  if (!NewKlass.poolSize) {
	    NewKlass.poolSize = DEFAULT_POOL_SIZE;
	  }
	  NewKlass.release = standardReleaser;
	  return NewKlass;
	};

	var PooledClass = {
	  addPoolingTo: addPoolingTo,
	  oneArgumentPooler: oneArgumentPooler,
	  twoArgumentPooler: twoArgumentPooler,
	  threeArgumentPooler: threeArgumentPooler,
	  fourArgumentPooler: fourArgumentPooler
	};

	module.exports = PooledClass;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ },
/* 79 */
/***/ function(module, exports) {

	/**
	 * Copyright 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 */

	'use strict';

	/**
	 * Gets the target node from a native browser event by accounting for
	 * inconsistencies in browser DOM APIs.
	 *
	 * @param {object} nativeEvent Native browser event.
	 * @return {DOMEventTarget} Target node.
	 */

	function getEventTarget(nativeEvent) {
	  var target = nativeEvent.target || nativeEvent.srcElement || window;

	  // Normalize SVG <use> element events #4963
	  if (target.correspondingUseElement) {
	    target = target.correspondingUseElement;
	  }

	  // Safari may fire events on text nodes (Node.TEXT_NODE is 3).
	  // @see http://www.quirksmode.org/js/events_properties.html
	  return target.nodeType === 3 ? target.parentNode : target;
	}

	module.exports = getEventTarget;

/***/ },
/* 80 */
/***/ function(module, exports) {

	/**
	 * Copyright 2013-2014 Facebook, Inc.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 *
	 * @providesModule TouchEventUtils
	 */

	var TouchEventUtils = {
	  /**
	   * Utility function for common case of extracting out the primary touch from a
	   * touch event.
	   * - `touchEnd` events usually do not have the `touches` property.
	   *   http://stackoverflow.com/questions/3666929/
	   *   mobile-sarai-touchend-event-not-firing-when-last-touch-is-removed
	   *
	   * @param {Event} nativeEvent Native event that may or may not be a touch.
	   * @return {TouchesObject?} an object with pageX and pageY or null.
	   */
	  extractSingleTouch: function(nativeEvent) {
	    var touches = nativeEvent.touches;
	    var changedTouches = nativeEvent.changedTouches;
	    var hasTouches = touches && touches.length > 0;
	    var hasChangedTouches = changedTouches && changedTouches.length > 0;

	    return !hasTouches && hasChangedTouches ? changedTouches[0] :
	           hasTouches ? touches[0] :
	           nativeEvent;
	  }
	};

	module.exports = TouchEventUtils;


/***/ },
/* 81 */
/***/ function(module, exports) {

	/**
	 * Copyright 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 */

	'use strict';

	var ViewportMetrics = {

	  currentScrollLeft: 0,

	  currentScrollTop: 0,

	  refreshScrollValues: function (scrollPosition) {
	    ViewportMetrics.currentScrollLeft = scrollPosition.x;
	    ViewportMetrics.currentScrollTop = scrollPosition.y;
	  }

	};

	module.exports = ViewportMetrics;

/***/ },
/* 82 */
/***/ function(module, exports) {

	"use strict";

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 */

	/**
	 * Allows extraction of a minified key. Let's the build system minify keys
	 * without losing the ability to dynamically use key strings as values
	 * themselves. Pass in an object with a single key/val pair and it will return
	 * you the string key of that single record. Suppose you want to grab the
	 * value for a key 'className' inside of an object. Key/val minification may
	 * have aliased that key to be 'xa12'. keyOf({className: null}) will return
	 * 'xa12' in that case. Resolve keys you want to use once at startup time, then
	 * reuse those resolutions.
	 */
	var keyOf = function keyOf(oneKeyObj) {
	  var key;
	  for (key in oneKeyObj) {
	    if (!oneKeyObj.hasOwnProperty(key)) {
	      continue;
	    }
	    return key;
	  }
	  return null;
	};

	module.exports = keyOf;

/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	var isWindows = process.platform === 'win32';

	// Regex to split a windows path into three parts: [*, device, slash,
	// tail] windows-only
	var splitDeviceRe =
	    /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/;

	// Regex to split the tail part of the above into [*, dir, basename, ext]
	var splitTailRe =
	    /^([\s\S]*?)((?:\.{1,2}|[^\\\/]+?|)(\.[^.\/\\]*|))(?:[\\\/]*)$/;

	var win32 = {};

	// Function to split a filename into [root, dir, basename, ext]
	function win32SplitPath(filename) {
	  // Separate device+slash from tail
	  var result = splitDeviceRe.exec(filename),
	      device = (result[1] || '') + (result[2] || ''),
	      tail = result[3] || '';
	  // Split the tail into dir, basename and extension
	  var result2 = splitTailRe.exec(tail),
	      dir = result2[1],
	      basename = result2[2],
	      ext = result2[3];
	  return [device, dir, basename, ext];
	}

	win32.parse = function(pathString) {
	  if (typeof pathString !== 'string') {
	    throw new TypeError(
	        "Parameter 'pathString' must be a string, not " + typeof pathString
	    );
	  }
	  var allParts = win32SplitPath(pathString);
	  if (!allParts || allParts.length !== 4) {
	    throw new TypeError("Invalid path '" + pathString + "'");
	  }
	  return {
	    root: allParts[0],
	    dir: allParts[0] + allParts[1].slice(0, -1),
	    base: allParts[2],
	    ext: allParts[3],
	    name: allParts[2].slice(0, allParts[2].length - allParts[3].length)
	  };
	};



	// Split a filename into [root, dir, basename, ext], unix version
	// 'root' is just a slash, or nothing.
	var splitPathRe =
	    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
	var posix = {};


	function posixSplitPath(filename) {
	  return splitPathRe.exec(filename).slice(1);
	}


	posix.parse = function(pathString) {
	  if (typeof pathString !== 'string') {
	    throw new TypeError(
	        "Parameter 'pathString' must be a string, not " + typeof pathString
	    );
	  }
	  var allParts = posixSplitPath(pathString);
	  if (!allParts || allParts.length !== 4) {
	    throw new TypeError("Invalid path '" + pathString + "'");
	  }
	  allParts[1] = allParts[1] || '';
	  allParts[2] = allParts[2] || '';
	  allParts[3] = allParts[3] || '';

	  return {
	    root: allParts[0],
	    dir: allParts[0] + allParts[1].slice(0, -1),
	    base: allParts[2],
	    ext: allParts[3],
	    name: allParts[2].slice(0, allParts[2].length - allParts[3].length)
	  };
	};


	if (isWindows)
	  module.exports = win32.parse;
	else /* posix */
	  module.exports = posix.parse;

	module.exports.posix = posix.parse;
	module.exports.win32 = win32.parse;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	(function webpackUniversalModuleDefinition(root, factory) {
		if(true)
			module.exports = factory(__webpack_require__(1));
		else if(typeof define === 'function' && define.amd)
			define(["react"], factory);
		else if(typeof exports === 'object')
			exports["Dropzone"] = factory(require("react"));
		else
			root["Dropzone"] = factory(root["react"]);
	})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
	return /******/ (function(modules) { // webpackBootstrap
	/******/ 	// The module cache
	/******/ 	var installedModules = {};
	/******/
	/******/ 	// The require function
	/******/ 	function __webpack_require__(moduleId) {
	/******/
	/******/ 		// Check if module is in cache
	/******/ 		if(installedModules[moduleId])
	/******/ 			return installedModules[moduleId].exports;
	/******/
	/******/ 		// Create a new module (and put it into the cache)
	/******/ 		var module = installedModules[moduleId] = {
	/******/ 			exports: {},
	/******/ 			id: moduleId,
	/******/ 			loaded: false
	/******/ 		};
	/******/
	/******/ 		// Execute the module function
	/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
	/******/
	/******/ 		// Flag the module as loaded
	/******/ 		module.loaded = true;
	/******/
	/******/ 		// Return the exports of the module
	/******/ 		return module.exports;
	/******/ 	}
	/******/
	/******/
	/******/ 	// expose the modules object (__webpack_modules__)
	/******/ 	__webpack_require__.m = modules;
	/******/
	/******/ 	// expose the module cache
	/******/ 	__webpack_require__.c = installedModules;
	/******/
	/******/ 	// __webpack_public_path__
	/******/ 	__webpack_require__.p = "";
	/******/
	/******/ 	// Load entry module and return exports
	/******/ 	return __webpack_require__(0);
	/******/ })
	/************************************************************************/
	/******/ ([
	/* 0 */
	/***/ function(module, exports, __webpack_require__) {

		'use strict';
		
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		
		var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
		
		var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
		
		var _react = __webpack_require__(1);
		
		var _react2 = _interopRequireDefault(_react);
		
		var _attrAccept = __webpack_require__(2);
		
		var _attrAccept2 = _interopRequireDefault(_attrAccept);
		
		var _getDataTransferItems = __webpack_require__(3);
		
		var _getDataTransferItems2 = _interopRequireDefault(_getDataTransferItems);
		
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
		
		function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
		
		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
		
		function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
		
		function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint prefer-template: 0 */
		
		
		var supportMultiple = typeof document !== 'undefined' && document && document.createElement ? 'multiple' in document.createElement('input') : true;
		
		var Dropzone = function (_React$Component) {
		  _inherits(Dropzone, _React$Component);
		
		  _createClass(Dropzone, null, [{
		    key: 'renderChildren',
		    value: function renderChildren(children, isDragActive, isDragReject) {
		      if (typeof children === 'function') {
		        return children({ isDragActive: isDragActive, isDragReject: isDragReject });
		      }
		      return children;
		    }
		  }]);
		
		  function Dropzone(props, context) {
		    _classCallCheck(this, Dropzone);
		
		    var _this = _possibleConstructorReturn(this, (Dropzone.__proto__ || Object.getPrototypeOf(Dropzone)).call(this, props, context));
		
		    _this.onClick = _this.onClick.bind(_this);
		    _this.onDragStart = _this.onDragStart.bind(_this);
		    _this.onDragEnter = _this.onDragEnter.bind(_this);
		    _this.onDragLeave = _this.onDragLeave.bind(_this);
		    _this.onDragOver = _this.onDragOver.bind(_this);
		    _this.onDrop = _this.onDrop.bind(_this);
		    _this.onFileDialogCancel = _this.onFileDialogCancel.bind(_this);
		    _this.fileAccepted = _this.fileAccepted.bind(_this);
		    _this.isFileDialogActive = false;
		    _this.state = {
		      isDragActive: false
		    };
		    return _this;
		  }
		
		  _createClass(Dropzone, [{
		    key: 'componentDidMount',
		    value: function componentDidMount() {
		      this.enterCounter = 0;
		      // Tried implementing addEventListener, but didn't work out
		      document.body.onfocus = this.onFileDialogCancel;
		    }
		  }, {
		    key: 'componentWillUnmount',
		    value: function componentWillUnmount() {
		      // Can be replaced with removeEventListener, if addEventListener works
		      document.body.onfocus = null;
		    }
		  }, {
		    key: 'onDragStart',
		    value: function onDragStart(e) {
		      if (this.props.onDragStart) {
		        this.props.onDragStart.call(this, e);
		      }
		    }
		  }, {
		    key: 'onDragEnter',
		    value: function onDragEnter(e) {
		      e.preventDefault();
		
		      // Count the dropzone and any children that are entered.
		      ++this.enterCounter;
		
		      var allFilesAccepted = this.allFilesAccepted((0, _getDataTransferItems2.default)(e, this.props.multiple));
		
		      this.setState({
		        isDragActive: allFilesAccepted,
		        isDragReject: !allFilesAccepted
		      });
		
		      if (this.props.onDragEnter) {
		        this.props.onDragEnter.call(this, e);
		      }
		    }
		  }, {
		    key: 'onDragOver',
		    value: function onDragOver(e) {
		      // eslint-disable-line class-methods-use-this
		      e.preventDefault();
		      e.stopPropagation();
		      try {
		        e.dataTransfer.dropEffect = 'copy'; // eslint-disable-line no-param-reassign
		      } catch (err) {
		        // continue regardless of error
		      }
		
		      if (this.props.onDragOver) {
		        this.props.onDragOver.call(this, e);
		      }
		      return false;
		    }
		  }, {
		    key: 'onDragLeave',
		    value: function onDragLeave(e) {
		      e.preventDefault();
		
		      // Only deactivate once the dropzone and all children was left.
		      if (--this.enterCounter > 0) {
		        return;
		      }
		
		      this.setState({
		        isDragActive: false,
		        isDragReject: false
		      });
		
		      if (this.props.onDragLeave) {
		        this.props.onDragLeave.call(this, e);
		      }
		    }
		  }, {
		    key: 'onDrop',
		    value: function onDrop(e) {
		      var _this2 = this;
		
		      var _props = this.props,
		          onDrop = _props.onDrop,
		          onDropAccepted = _props.onDropAccepted,
		          onDropRejected = _props.onDropRejected,
		          multiple = _props.multiple,
		          disablePreview = _props.disablePreview;
		
		      var fileList = (0, _getDataTransferItems2.default)(e, multiple);
		      var acceptedFiles = [];
		      var rejectedFiles = [];
		
		      // Stop default browser behavior
		      e.preventDefault();
		
		      // Reset the counter along with the drag on a drop.
		      this.enterCounter = 0;
		      this.isFileDialogActive = false;
		
		      fileList.forEach(function (file) {
		        if (!disablePreview) {
		          file.preview = window.URL.createObjectURL(file); // eslint-disable-line no-param-reassign
		        }
		
		        if (_this2.fileAccepted(file) && _this2.fileMatchSize(file)) {
		          acceptedFiles.push(file);
		        } else {
		          rejectedFiles.push(file);
		        }
		      });
		
		      if (onDrop) {
		        onDrop.call(this, acceptedFiles, rejectedFiles, e);
		      }
		
		      if (rejectedFiles.length > 0 && onDropRejected) {
		        onDropRejected.call(this, rejectedFiles, e);
		      }
		
		      if (acceptedFiles.length > 0 && onDropAccepted) {
		        onDropAccepted.call(this, acceptedFiles, e);
		      }
		
		      // Reset drag state
		      this.setState({
		        isDragActive: false,
		        isDragReject: false
		      });
		    }
		  }, {
		    key: 'onClick',
		    value: function onClick(e) {
		      var _props2 = this.props,
		          onClick = _props2.onClick,
		          disableClick = _props2.disableClick;
		
		      if (!disableClick) {
		        e.stopPropagation();
		        this.open();
		        if (onClick) {
		          onClick.call(this, e);
		        }
		      }
		    }
		  }, {
		    key: 'onFileDialogCancel',
		    value: function onFileDialogCancel() {
		      // timeout will not recognize context of this method
		      var onFileDialogCancel = this.props.onFileDialogCancel;
		      var fileInputEl = this.fileInputEl;
		      var isFileDialogActive = this.isFileDialogActive;
		      // execute the timeout only if the onFileDialogCancel is defined and FileDialog
		      // is opened in the browser
		
		      if (onFileDialogCancel && isFileDialogActive) {
		        setTimeout(function () {
		          // Returns an object as FileList
		          var FileList = fileInputEl.files;
		          if (!FileList.length) {
		            isFileDialogActive = false;
		            onFileDialogCancel();
		          }
		        }, 300);
		      }
		    }
		  }, {
		    key: 'fileAccepted',
		    value: function fileAccepted(file) {
		      return (0, _attrAccept2.default)(file, this.props.accept);
		    }
		  }, {
		    key: 'fileMatchSize',
		    value: function fileMatchSize(file) {
		      return file.size <= this.props.maxSize && file.size >= this.props.minSize;
		    }
		  }, {
		    key: 'allFilesAccepted',
		    value: function allFilesAccepted(files) {
		      return files.every(this.fileAccepted);
		    }
		  }, {
		    key: 'open',
		    value: function open() {
		      this.isFileDialogActive = true;
		      this.fileInputEl.value = null;
		      this.fileInputEl.click();
		    }
		  }, {
		    key: 'render',
		    value: function render() {
		      var _this3 = this;
		
		      var _props3 = this.props,
		          accept = _props3.accept,
		          activeClassName = _props3.activeClassName,
		          inputProps = _props3.inputProps,
		          multiple = _props3.multiple,
		          name = _props3.name,
		          rejectClassName = _props3.rejectClassName,
		          children = _props3.children,
		          rest = _objectWithoutProperties(_props3, ['accept', 'activeClassName', 'inputProps', 'multiple', 'name', 'rejectClassName', 'children']);
		
		      var activeStyle = rest.activeStyle,
		          className = rest.className,
		          rejectStyle = rest.rejectStyle,
		          style = rest.style,
		          props = _objectWithoutProperties(rest, ['activeStyle', 'className', 'rejectStyle', 'style']);
		
		      var _state = this.state,
		          isDragActive = _state.isDragActive,
		          isDragReject = _state.isDragReject;
		
		
		      className = className || '';
		
		      if (isDragActive && activeClassName) {
		        className += ' ' + activeClassName;
		      }
		      if (isDragReject && rejectClassName) {
		        className += ' ' + rejectClassName;
		      }
		
		      if (!className && !style && !activeStyle && !rejectStyle) {
		        style = {
		          width: 200,
		          height: 200,
		          borderWidth: 2,
		          borderColor: '#666',
		          borderStyle: 'dashed',
		          borderRadius: 5
		        };
		        activeStyle = {
		          borderStyle: 'solid',
		          backgroundColor: '#eee'
		        };
		        rejectStyle = {
		          borderStyle: 'solid',
		          backgroundColor: '#ffdddd'
		        };
		      }
		
		      var appliedStyle = void 0;
		      if (activeStyle && isDragActive) {
		        appliedStyle = _extends({}, style, activeStyle);
		      } else if (rejectStyle && isDragReject) {
		        appliedStyle = _extends({}, style, rejectStyle);
		      } else {
		        appliedStyle = _extends({}, style);
		      }
		
		      var inputAttributes = {
		        accept: accept,
		        type: 'file',
		        style: { display: 'none' },
		        multiple: supportMultiple && multiple,
		        ref: function ref(el) {
		          return _this3.fileInputEl = el;
		        }, // eslint-disable-line
		        onChange: this.onDrop
		      };
		
		      if (name && name.length) {
		        inputAttributes.name = name;
		      }
		
		      // Remove custom properties before passing them to the wrapper div element
		      var customProps = ['acceptedFiles', 'disablePreview', 'disableClick', 'onDropAccepted', 'onDropRejected', 'onFileDialogCancel', 'maxSize', 'minSize'];
		      var divProps = _extends({}, props);
		      customProps.forEach(function (prop) {
		        return delete divProps[prop];
		      });
		
		      return _react2.default.createElement(
		        'div',
		        _extends({
		          className: className,
		          style: appliedStyle
		        }, divProps /* expand user provided props first so event handlers are never overridden */, {
		          onClick: this.onClick,
		          onDragStart: this.onDragStart,
		          onDragEnter: this.onDragEnter,
		          onDragOver: this.onDragOver,
		          onDragLeave: this.onDragLeave,
		          onDrop: this.onDrop
		        }),
		        Dropzone.renderChildren(children, isDragActive, isDragReject),
		        _react2.default.createElement('input', _extends({}, inputProps /* expand user provided inputProps first so inputAttributes override them */, inputAttributes))
		      );
		    }
		  }]);
		
		  return Dropzone;
		}(_react2.default.Component);
		
		Dropzone.defaultProps = {
		  disablePreview: false,
		  disableClick: false,
		  multiple: true,
		  maxSize: Infinity,
		  minSize: 0
		};
		
		Dropzone.propTypes = {
		  onClick: _react2.default.PropTypes.func,
		  onDrop: _react2.default.PropTypes.func,
		  onDropAccepted: _react2.default.PropTypes.func,
		  onDropRejected: _react2.default.PropTypes.func,
		  onDragStart: _react2.default.PropTypes.func,
		  onDragEnter: _react2.default.PropTypes.func,
		  onDragOver: _react2.default.PropTypes.func,
		  onDragLeave: _react2.default.PropTypes.func,
		
		  children: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.node, _react2.default.PropTypes.func]), // Contents of the dropzone
		  style: _react2.default.PropTypes.object, // CSS styles to apply
		  activeStyle: _react2.default.PropTypes.object, // CSS styles to apply when drop will be accepted
		  rejectStyle: _react2.default.PropTypes.object, // CSS styles to apply when drop will be rejected
		  className: _react2.default.PropTypes.string, // Optional className
		  activeClassName: _react2.default.PropTypes.string, // className for accepted state
		  rejectClassName: _react2.default.PropTypes.string, // className for rejected state
		
		  disablePreview: _react2.default.PropTypes.bool, // Enable/disable preview generation
		  disableClick: _react2.default.PropTypes.bool, // Disallow clicking on the dropzone container to open file dialog
		  onFileDialogCancel: _react2.default.PropTypes.func, // Provide a callback on clicking the cancel button of the file dialog
		
		  inputProps: _react2.default.PropTypes.object, // Pass additional attributes to the <input type="file"/> tag
		  multiple: _react2.default.PropTypes.bool, // Allow dropping multiple files
		  accept: _react2.default.PropTypes.string, // Allow specific types of files. See https://github.com/okonet/attr-accept for more information
		  name: _react2.default.PropTypes.string, // name attribute for the input tag
		  maxSize: _react2.default.PropTypes.number,
		  minSize: _react2.default.PropTypes.number
		};
		
		exports.default = Dropzone;
		module.exports = exports['default'];

	/***/ },
	/* 1 */
	/***/ function(module, exports) {

		module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

	/***/ },
	/* 2 */
	/***/ function(module, exports) {

		module.exports=function(t){function n(e){if(r[e])return r[e].exports;var o=r[e]={exports:{},id:e,loaded:!1};return t[e].call(o.exports,o,o.exports,n),o.loaded=!0,o.exports}var r={};return n.m=t,n.c=r,n.p="",n(0)}([function(t,n,r){"use strict";n.__esModule=!0,r(8),r(9),n["default"]=function(t,n){if(t&&n){var r=function(){var r=Array.isArray(n)?n:n.split(","),e=t.name||"",o=t.type||"",i=o.replace(/\/.*$/,"");return{v:r.some(function(t){var n=t.trim();return"."===n.charAt(0)?e.toLowerCase().endsWith(n.toLowerCase()):/\/\*$/.test(n)?i===n.replace(/\/.*$/,""):o===n})}}();if("object"==typeof r)return r.v}return!0},t.exports=n["default"]},function(t,n){var r=t.exports={version:"1.2.2"};"number"==typeof __e&&(__e=r)},function(t,n){var r=t.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=r)},function(t,n,r){var e=r(2),o=r(1),i=r(4),u=r(19),c="prototype",f=function(t,n){return function(){return t.apply(n,arguments)}},s=function(t,n,r){var a,p,l,y,d=t&s.G,h=t&s.P,v=d?e:t&s.S?e[n]||(e[n]={}):(e[n]||{})[c],x=d?o:o[n]||(o[n]={});d&&(r=n);for(a in r)p=!(t&s.F)&&v&&a in v,l=(p?v:r)[a],y=t&s.B&&p?f(l,e):h&&"function"==typeof l?f(Function.call,l):l,v&&!p&&u(v,a,l),x[a]!=l&&i(x,a,y),h&&((x[c]||(x[c]={}))[a]=l)};e.core=o,s.F=1,s.G=2,s.S=4,s.P=8,s.B=16,s.W=32,t.exports=s},function(t,n,r){var e=r(5),o=r(18);t.exports=r(22)?function(t,n,r){return e.setDesc(t,n,o(1,r))}:function(t,n,r){return t[n]=r,t}},function(t,n){var r=Object;t.exports={create:r.create,getProto:r.getPrototypeOf,isEnum:{}.propertyIsEnumerable,getDesc:r.getOwnPropertyDescriptor,setDesc:r.defineProperty,setDescs:r.defineProperties,getKeys:r.keys,getNames:r.getOwnPropertyNames,getSymbols:r.getOwnPropertySymbols,each:[].forEach}},function(t,n){var r=0,e=Math.random();t.exports=function(t){return"Symbol(".concat(void 0===t?"":t,")_",(++r+e).toString(36))}},function(t,n,r){var e=r(20)("wks"),o=r(2).Symbol;t.exports=function(t){return e[t]||(e[t]=o&&o[t]||(o||r(6))("Symbol."+t))}},function(t,n,r){r(26),t.exports=r(1).Array.some},function(t,n,r){r(25),t.exports=r(1).String.endsWith},function(t,n){t.exports=function(t){if("function"!=typeof t)throw TypeError(t+" is not a function!");return t}},function(t,n){var r={}.toString;t.exports=function(t){return r.call(t).slice(8,-1)}},function(t,n,r){var e=r(10);t.exports=function(t,n,r){if(e(t),void 0===n)return t;switch(r){case 1:return function(r){return t.call(n,r)};case 2:return function(r,e){return t.call(n,r,e)};case 3:return function(r,e,o){return t.call(n,r,e,o)}}return function(){return t.apply(n,arguments)}}},function(t,n){t.exports=function(t){if(void 0==t)throw TypeError("Can't call method on  "+t);return t}},function(t,n,r){t.exports=function(t){var n=/./;try{"/./"[t](n)}catch(e){try{return n[r(7)("match")]=!1,!"/./"[t](n)}catch(o){}}return!0}},function(t,n){t.exports=function(t){try{return!!t()}catch(n){return!0}}},function(t,n){t.exports=function(t){return"object"==typeof t?null!==t:"function"==typeof t}},function(t,n,r){var e=r(16),o=r(11),i=r(7)("match");t.exports=function(t){var n;return e(t)&&(void 0!==(n=t[i])?!!n:"RegExp"==o(t))}},function(t,n){t.exports=function(t,n){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:n}}},function(t,n,r){var e=r(2),o=r(4),i=r(6)("src"),u="toString",c=Function[u],f=(""+c).split(u);r(1).inspectSource=function(t){return c.call(t)},(t.exports=function(t,n,r,u){"function"==typeof r&&(o(r,i,t[n]?""+t[n]:f.join(String(n))),"name"in r||(r.name=n)),t===e?t[n]=r:(u||delete t[n],o(t,n,r))})(Function.prototype,u,function(){return"function"==typeof this&&this[i]||c.call(this)})},function(t,n,r){var e=r(2),o="__core-js_shared__",i=e[o]||(e[o]={});t.exports=function(t){return i[t]||(i[t]={})}},function(t,n,r){var e=r(17),o=r(13);t.exports=function(t,n,r){if(e(n))throw TypeError("String#"+r+" doesn't accept regex!");return String(o(t))}},function(t,n,r){t.exports=!r(15)(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a})},function(t,n){var r=Math.ceil,e=Math.floor;t.exports=function(t){return isNaN(t=+t)?0:(t>0?e:r)(t)}},function(t,n,r){var e=r(23),o=Math.min;t.exports=function(t){return t>0?o(e(t),9007199254740991):0}},function(t,n,r){"use strict";var e=r(3),o=r(24),i=r(21),u="endsWith",c=""[u];e(e.P+e.F*r(14)(u),"String",{endsWith:function(t){var n=i(this,t,u),r=arguments,e=r.length>1?r[1]:void 0,f=o(n.length),s=void 0===e?f:Math.min(o(e),f),a=String(t);return c?c.call(n,a,s):n.slice(s-a.length,s)===a}})},function(t,n,r){var e=r(5),o=r(3),i=r(1).Array||Array,u={},c=function(t,n){e.each.call(t.split(","),function(t){void 0==n&&t in i?u[t]=i[t]:t in[]&&(u[t]=r(12)(Function.call,[][t],n))})};c("pop,reverse,shift,keys,values,entries",1),c("indexOf,every,some,forEach,map,filter,find,findIndex,includes",3),c("join,slice,concat,push,splice,unshift,sort,lastIndexOf,reduce,reduceRight,copyWithin,fill"),o(o.S,"Array",u)}]);

	/***/ },
	/* 3 */
	/***/ function(module, exports) {

		"use strict";
		
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		exports.default = getDataTransferFiles;
		function getDataTransferFiles(event) {
		  var isMultipleAllowed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
		
		  var dataTransferItemsList = [];
		  if (event.dataTransfer) {
		    var dt = event.dataTransfer;
		    if (dt.files && dt.files.length) {
		      dataTransferItemsList = dt.files;
		    } else if (dt.items && dt.items.length) {
		      // During the drag even the dataTransfer.files is null
		      // but Chrome implements some drag store, which is accesible via dataTransfer.items
		      dataTransferItemsList = dt.items;
		    }
		  } else if (event.target && event.target.files) {
		    dataTransferItemsList = event.target.files;
		  }
		
		  if (dataTransferItemsList.length > 0) {
		    dataTransferItemsList = isMultipleAllowed ? dataTransferItemsList : [dataTransferItemsList[0]];
		  }
		
		  // Convert from DataTransferItemsList to the native Array
		  return Array.prototype.slice.call(dataTransferItemsList);
		}
		module.exports = exports["default"];

	/***/ }
	/******/ ])
	});
	;
	//# sourceMappingURL=index.js.map

/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _store = __webpack_require__(9);

	var _store2 = _interopRequireDefault(_store);

	var _actions = __webpack_require__(19);

	var _actions2 = _interopRequireDefault(_actions);

	var _Icon = __webpack_require__(48);

	var _Icon2 = _interopRequireDefault(_Icon);

	var _path = __webpack_require__(3);

	var _path2 = _interopRequireDefault(_path);

	var _definedMessages = __webpack_require__(49);

	var _definedMessages2 = _interopRequireDefault(_definedMessages);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var FileTreeSpan = function (_PureComponent) {
	  _inherits(FileTreeSpan, _PureComponent);

	  function FileTreeSpan(props) {
	    _classCallCheck(this, FileTreeSpan);

	    var _this = _possibleConstructorReturn(this, (FileTreeSpan.__proto__ || Object.getPrototypeOf(FileTreeSpan)).call(this, props));

	    _this.state = {
	      editable: false
	    };
	    _this.decoratedActions = props.decoratedActions ? Object.assign({}, _actions2.default, props.decoratedActions) : _actions2.default;
	    return _this;
	  }

	  _createClass(FileTreeSpan, [{
	    key: 'render',
	    value: function render() {
	      var _this2 = this;

	      var state = this.state,
	          props = this.props,
	          item = props.item;

	      var decoratedActions = this.decoratedActions;

	      return _react2.default.createElement(
	        'span',
	        { ref: function ref(span) {
	            return _this2.span = span;
	          }, contentEditable: state.editable, onClick: function onClick(event) {
	            event.preventDefault();
	            //event.stopPropagation();
	            _store2.default.dispatch(decoratedActions.updateContent({ // updates the "current directory" of the view right away
	              cd: item.cd
	            }));
	            _store2.default.dispatch(decoratedActions.fetchDirectoryContents(props.source.currentSource, { // asyncronously fetches the directory contents from the API
	              path: item.cd
	            }, props.config.headers));
	          },
	          onDoubleClick: function onDoubleClick(event) {
	            _this2.setState({
	              editable: !state.editable
	            });
	            if (!state.editable) _this2.span.focus();else _this2.span.blur();
	            //if(!state.editable)
	          },
	          onKeyDown: function onKeyDown(event) {
	            console.log('onKeyDown', event, event.keyCode, event.keyCode === 13);
	            if (event.keyCode === 13) {
	              event.preventDefault();
	              event.stopPropagation();
	              event.target.blur();
	            }
	          }
	        },
	        item.name
	      );
	    }
	  }]);

	  return FileTreeSpan;
	}(_react.PureComponent);

	var FileTree = function FileTree(props) {

	  var decoratedActions = props.decoratedActions ? Object.assign({}, _actions2.default, props.decoratedActions) : _actions2.default;

	  var formatMessage = props.intl.formatMessage,
	      chmodDirectoryMessage = formatMessage(_definedMessages2.default.chmodDirectory),
	      renameMessage = formatMessage(_definedMessages2.default.rename),
	      refreshDirectoryMessage = formatMessage(_definedMessages2.default.refreshDirectory),
	      uploadFilesMessage = formatMessage(_definedMessages2.default.uploadFiles),
	      createFileMessage = formatMessage(_definedMessages2.default.createFile),
	      quickCreateFileMessage = formatMessage(_definedMessages2.default.quickCreateFile),
	      deleteDirectoryMessage = formatMessage(_definedMessages2.default.deleteDirectory);

	  function listTree(tree) {
	    function shouldBeOpen(item) {
	      //console.log('shouldBeOpen', props.content.cd, item.cd, props.content.cd.indexOf(item.cd));
	      try {
	        return item.cd === './' || props.content.cd.indexOf(item.cd) === 0 ? true : undefined;
	      } catch (e) {
	        return undefined;
	      }
	    }

	    return tree.map(function (item, index) {
	      return item.children || true ? // still deciding if we need this disabled for now
	      _react2.default.createElement(
	        'details',
	        { onToggle: function onToggle(event) {
	            console.log('TOGGLE!!!', item);
	            console.log(event.target.hasAttribute('open'));
	          }, key: index, open: shouldBeOpen(item) },
	        _react2.default.createElement(
	          'summary',
	          { role: 'treeitem', contextMenu: 'context_menu__' + item.cd.replace(/^[^a-z]+|[^\w:.-]+/gi, ""), className: props.content.cd === item.cd ? 'active' : undefined },
	          _react2.default.createElement(_Icon2.default, _extends({}, props, { icon: 'folder' })),
	          _react2.default.createElement(_Icon2.default, _extends({}, props, { icon: 'folder-open' })),
	          _react2.default.createElement(FileTreeSpan, _extends({}, props, { item: item, index: index, key: index })),
	          _react2.default.createElement(
	            'menu',
	            { hidden: 'true', type: 'context', id: 'context_menu__' + item.cd.replace(/^[^a-z]+|[^\w:.-]+/gi, "") },
	            _react2.default.createElement('menuitem', { label: 'Create Directory Here', onClick: function onClick(event) {
	                props.onCreateDirectory();
	              } }),
	            _react2.default.createElement('menuitem', { label: chmodDirectoryMessage }),
	            _react2.default.createElement('menuitem', { label: renameMessage }),
	            _react2.default.createElement('menuitem', { label: refreshDirectoryMessage }),
	            _react2.default.createElement('hr', null),
	            _react2.default.createElement('menuitem', { label: uploadFilesMessage }),
	            _react2.default.createElement('menuitem', { label: createFileMessage }),
	            _react2.default.createElement('menuitem', { label: quickCreateFileMessage }),
	            _react2.default.createElement('menuitem', { label: deleteDirectoryMessage, onClick: function onClick(event) {
	                _store2.default.dispatch(decoratedActions.deleteMediaItem(props.source.currentSource, item.cd, props.config.headers));
	              } })
	          )
	        ),
	        _react2.default.createElement(
	          'div',
	          null,
	          item.children ? listTree(item.children) : undefined
	        )
	      ) : _react2.default.createElement(
	        'span',
	        { key: index },
	        item.name
	      );
	    });
	  }

	  var contentList = listTree([{
	    cd: './',
	    name: './',
	    children: props.tree
	  }]);

	  return _react2.default.createElement(
	    'nav',
	    { className: 'eureka__tree', role: 'tree' },
	    contentList
	  );
	};

	exports.default = FileTree;

/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _store = __webpack_require__(9);

	var _store2 = _interopRequireDefault(_store);

	var _actions = __webpack_require__(19);

	var _actions2 = _interopRequireDefault(_actions);

	var _utility = __webpack_require__(17);

	var _utility2 = _interopRequireDefault(_utility);

	var _Icon = __webpack_require__(48);

	var _Icon2 = _interopRequireDefault(_Icon);

	var _reactIntl = __webpack_require__(23);

	var _definedMessages = __webpack_require__(49);

	var _definedMessages2 = _interopRequireDefault(_definedMessages);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var classNames = __webpack_require__(54);

	var UploadForm = function (_PureComponent) {
	  _inherits(UploadForm, _PureComponent);

	  function UploadForm(props) {
	    _classCallCheck(this, UploadForm);

	    var _this = _possibleConstructorReturn(this, (UploadForm.__proto__ || Object.getPrototypeOf(UploadForm)).call(this, props));

	    _this.decoratedActions = props.decoratedActions ? Object.assign({}, _actions2.default, props.decoratedActions) : _actions2.default;

	    return _this;
	  }

	  _createClass(UploadForm, [{
	    key: 'handleSubmit',
	    value: function handleSubmit(event) {
	      event.preventDefault();

	      var props = this.props;

	      var decoratedActions = this.decoratedActions;

	      var formData = new FormData(event.target);
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;

	      try {
	        for (var _iterator = formData.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var pair = _step.value;

	          console.log(pair[0], pair[1]);
	        }
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }

	      _store2.default.dispatch(_actions2.default.updateView({
	        isUploading: true
	      }));
	      _store2.default.dispatch(decoratedActions.uploadFiles(props.source.currentSource, props.content.cd, formData, props.config.headers));
	    }
	  }, {
	    key: 'handleLabelKeyPress',
	    value: function handleLabelKeyPress(e) {
	      //console.log(e.target.matches());
	      //console.log(e.nativeEvent.code.toLowerCase());
	      //console.log(e.target.parentNode.querySelector('input[type="file"]'));
	      switch (e.nativeEvent.code.toLowerCase()) {
	        case 'space':
	        case 'enter':
	        case 'return':
	          //console.log(e.target.parentNode.querySelector('input[type="file"]'));
	          e.target.parentNode.querySelector('input[type="file"]').click();
	          break;
	      }
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this2 = this;

	      var props = this.props,
	          uploadFilesMessage = !props.view.isUploading ? _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'upload.files', defaultMessage: 'Upload files' }) : _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'upload.dragFilesUploading', defaultMessage: 'Uploading files\u2026' }),
	          uploadFilesIcon = !props.view.isUploading ? undefined : _react2.default.createElement(
	        'span',
	        { className: 'spinner' },
	        _react2.default.createElement(_Icon2.default, _extends({}, props, { icon: 'circle-o-notch' }))
	      ),
	          submit = _utility2.default.serverSideRendering ? _react2.default.createElement(
	        'button',
	        { type: 'submit', formmethod: 'post' },
	        uploadFilesMessage
	      ) : undefined,
	          form = _utility2.default.serverSideRendering ? _react2.default.createElement(
	        'div',
	        null,
	        _react2.default.createElement(
	          'label',
	          { tabIndex: '0', role: 'menuitem', htmlFor: 'eureka__upload-form' },
	          uploadFilesMessage,
	          _react2.default.createElement(
	            'span',
	            { className: classNames({ "visually-hidden": !_utility2.default.serverSideRendering }) },
	            ' to ',
	            props.content.cd
	          ),
	          ':\u2002'
	        ),
	        _react2.default.createElement('input', { id: 'eureka__upload-form', multiple: 'multiple', name: 'eureka__uploadFiles', type: 'file' }),
	        submit
	      ) : _react2.default.createElement(
	        'form',
	        { onSubmit: this.handleSubmit.bind(this), encType: 'multipart/form-data', ref: function ref(form) {
	            _this2.form = form;
	          } },
	        _react2.default.createElement('input', { hidden: props.view.isUploading, disabled: props.view.isUploading, id: 'eureka__upload-form', multiple: 'multiple', name: 'eureka__uploadFiles', type: 'file', onChange: function onChange(e) {
	            _this2.form.dispatchEvent(new Event("submit")); // so there is no click button they need to click
	          } }),
	        _react2.default.createElement(
	          'label',
	          { onKeyPress: !props.view.isUploading ? this.handleLabelKeyPress : undefined, tabIndex: '0', role: 'menuitem', htmlFor: !props.view.isUploading ? "eureka__upload-form" : undefined },
	          uploadFilesIcon,
	          uploadFilesMessage,
	          _react2.default.createElement(
	            'span',
	            { className: 'visually-hidden' },
	            ' ',
	            _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'grammar.to', defaultMessage: 'to' }),
	            ' ',
	            props.content.cd
	          )
	        )
	      );

	      return _react2.default.createElement(
	        'div',
	        { className: 'eureka__upload-form' },
	        form
	      );
	    }
	  }]);

	  return UploadForm;
	}(_react.PureComponent);

	exports.default = UploadForm;

/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _Icon = __webpack_require__(48);

	var _Icon2 = _interopRequireDefault(_Icon);

	var _ContextButtons = __webpack_require__(60);

	var _ContextButtons2 = _interopRequireDefault(_ContextButtons);

	var _path = __webpack_require__(3);

	var _path2 = _interopRequireDefault(_path);

	var _utility = __webpack_require__(17);

	var _utility2 = _interopRequireDefault(_utility);

	var _definedMessages = __webpack_require__(49);

	var _definedMessages2 = _interopRequireDefault(_definedMessages);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var pathParse = __webpack_require__(83);

	/*
	Example of file
	Example of file-archive-o
	Example of file-audio-o
	Example of file-code-o
	Example of file-excel-o
	Example of file-image-o
	Example of file-movie-o (alias)
	Example of file-o
	Example of file-pdf-o
	Example of file-photo-o (alias)
	Example of file-picture-o (alias)
	Example of file-powerpoint-o
	Example of file-sound-o (alias)
	Example of file-text
	Example of file-text-o
	Example of file-video-o
	Example of file-word-o
	Example of file-zip-o
	*/

	var PathBar = function PathBar(props) {
	  var formatMessage = props.intl.formatMessage;
	  var contextBtns = props.view.focusedMediaItem ? _react2.default.createElement(_ContextButtons2.default, _extends({}, props, { item: props.view.focusedMediaItem })) : undefined;

	  var copyListofSelectedFiles = formatMessage(_definedMessages2.default.copyListofSelectedFiles);

	  var icon = _utility2.default.getIconByExtension(pathParse(props.view.focusedMediaItem.filename).ext);
	  var p = props.view.chooseMultiple && props.content.chosenMediaItems.length > 1 ? props.view.focusedMediaItem.directory : _path2.default.join(props.view.focusedMediaItem.directory, props.view.focusedMediaItem.filename);
	  var fileNames = props.content.chosenMediaItemsInverted.map(function (item) {
	    return item.filename;
	  });
	  //console.log('props.content.chosenMediaItems', props.content.chosenMediaItems);
	  //console.log('fileNames', fileNames);
	  var len = props.view.selectionInverted ? props.content.contents.length - props.content.chosenMediaItems.length : props.content.chosenMediaItems.length;
	  var fileNamesIf = len > 1 && props.view.chooseMultiple ? _react2.default.createElement('textarea', { 'aria-readonly': 'true', 'aria-label': copyListofSelectedFiles, rows: '10', cols: '50', onClick: function onClick(event) {
	      event.target.focus();
	      event.target.select();
	    }, style: {
	      margin: '0'
	    }, readOnly: 'readonly', value: fileNames.join(', ') }) : undefined,
	      a = len < 2 ? _react2.default.createElement(
	    'a',
	    { id: props.config.storagePrefix + 'selected_file_names', role: 'presentation', href: props.view.focusedMediaItem.absoluteURL, target: '_' + encodeURI(props.view.focusedMediaItem.absoluteURL) },
	    _react2.default.createElement(_Icon2.default, _extends({}, props, { icon: icon })),
	    '\u2002',
	    p,
	    fileNamesIf
	  ) : _react2.default.createElement(
	    'div',
	    { id: props.config.storagePrefix + 'selected_file_names' },
	    _react2.default.createElement(_Icon2.default, _extends({}, props, { icon: icon })),
	    '\u2002',
	    p,
	    fileNamesIf
	  );

	  var selectedPaths = len > 12 ? _react2.default.createElement(
	    'details',
	    { open: true },
	    _react2.default.createElement(
	      'summary',
	      null,
	      'Selected Paths'
	    ),
	    fileNamesIf
	  ) : fileNamesIf;

	  return _react2.default.createElement(
	    'div',
	    { className: 'eureka__pathbar' },
	    _react2.default.createElement(
	      'div',
	      { className: 'eureka__hide-for-mobile-up', 'aria-hidden': 'true' },
	      _react2.default.createElement(
	        'details',
	        null,
	        _react2.default.createElement(
	          'summary',
	          null,
	          _react2.default.createElement(_Icon2.default, _extends({}, props, { icon: icon })),
	          '\u2002',
	          props.view.chooseMultiple ? '' + props.view.focusedMediaItem.directory : '' + props.view.focusedMediaItem.directory + props.view.focusedMediaItem.filename
	        ),
	        selectedPaths,
	        _react2.default.createElement(
	          'div',
	          null,
	          _react2.default.createElement(
	            'div',
	            null,
	            _react2.default.createElement('img', { src: props.view.focusedMediaItem.absoluteURL, alt: '' })
	          ),
	          contextBtns
	        )
	      )
	    ),
	    _react2.default.createElement(
	      'div',
	      { role: 'status', className: 'eureka__show-for-mobile-up' },
	      a
	    )
	  );
	};

	exports.default = PathBar;

/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactDropzone = __webpack_require__(84);

	var _reactDropzone2 = _interopRequireDefault(_reactDropzone);

	var _store = __webpack_require__(9);

	var _store2 = _interopRequireDefault(_store);

	var _actions = __webpack_require__(19);

	var _actions2 = _interopRequireDefault(_actions);

	var _Icon = __webpack_require__(48);

	var _Icon2 = _interopRequireDefault(_Icon);

	var _reactIntl = __webpack_require__(23);

	var _definedMessages = __webpack_require__(49);

	var _definedMessages2 = _interopRequireDefault(_definedMessages);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var DropArea = function (_PureComponent) {
	  _inherits(DropArea, _PureComponent);

	  function DropArea(props) {
	    _classCallCheck(this, DropArea);

	    var _this = _possibleConstructorReturn(this, (DropArea.__proto__ || Object.getPrototypeOf(DropArea)).call(this, props));

	    _this.decoratedActions = props.decoratedActions ? Object.assign({}, _actions2.default, props.decoratedActions) : _actions2.default;
	    return _this;
	  }

	  _createClass(DropArea, [{
	    key: 'onDrop',
	    value: function onDrop(files) {
	      var props = this.props;
	      //console.log('Received files: ', files);

	      var decoratedActions = this.decoratedActions;

	      var formData = new FormData();

	      files.forEach(function (file) {
	        formData.append('eureka__uploadFiles', file, file.name);
	      });
	      _store2.default.dispatch(_actions2.default.updateView({
	        isUploading: true
	      }));
	      _store2.default.dispatch(decoratedActions.uploadFiles(props.source.currentSource, props.content.cd, formData, props.config.headers));
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var props = this.props,
	          formatMessage = props.intl.formatMessage,
	          dragFilesToBeUploadedToMessage = props.view.isUploading ? formatMessage(_definedMessages2.default.dragFilesUploading, {
	        cd: props.content.cd
	      }) : formatMessage(_definedMessages2.default.dragFilesToBeUploadedTo, {
	        cd: props.content.cd
	      });

	      return _react2.default.createElement(
	        'div',
	        { className: (props.config.storagePrefix !== undefined ? props.config.storagePrefix : 'eureka__') + 'drop-area', title: dragFilesToBeUploadedToMessage },
	        _react2.default.createElement(
	          _reactDropzone2.default,
	          { onDrop: this.onDrop.bind(this), className: (props.config.storagePrefix !== undefined ? props.config.storagePrefix : 'eureka__') + 'drop-area-zone', activeClassName: (props.config.storagePrefix !== undefined ? props.config.storagePrefix : 'eureka__') + 'drop-area-zone-active', style: {} },
	          _react2.default.createElement(_Icon2.default, _extends({}, props, { icon: props.view.isUploading ? 'circle-o-notch' : 'upload' }))
	        )
	      );
	    }
	  }]);

	  return DropArea;
	}(_react.PureComponent);

	exports.default = DropArea;

/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactIntl = __webpack_require__(23);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Modal = function Modal(props) {
	  return _react2.default.createElement(
	    'div',
	    { className: 'eureka__modal', role: 'dialog' },
	    _react2.default.createElement(
	      'div',
	      { className: 'eureka__modal-panel' },
	      _react2.default.createElement(
	        'h2',
	        null,
	        props.title
	      ),
	      _react2.default.cloneElement(_react2.default.Children.only(props.children), props)
	    ),
	    _react2.default.createElement(
	      'div',
	      { role: 'button', tabIndex: '0',
	        'aria-pressed': 'false', className: 'eureka__modal-scrim', onClick: props.onCancel },
	      _react2.default.createElement(
	        'span',
	        { className: 'visually-hidden test' },
	        _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'modal.closeWindow', defaultMessage: 'Close {title} Modal Window', values: {
	            title: props.title
	          } })
	      )
	    )
	  );
	};

	exports.default = Modal;

/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _path = __webpack_require__(3);

	var _path2 = _interopRequireDefault(_path);

	var _classnames = __webpack_require__(54);

	var _classnames2 = _interopRequireDefault(_classnames);

	var _Icon = __webpack_require__(48);

	var _Icon2 = _interopRequireDefault(_Icon);

	var _reactIntl = __webpack_require__(23);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ModalCreateDirectoryForm = function (_Component) {
	  _inherits(ModalCreateDirectoryForm, _Component);

	  function ModalCreateDirectoryForm(props) {
	    _classCallCheck(this, ModalCreateDirectoryForm);

	    var _this = _possibleConstructorReturn(this, (ModalCreateDirectoryForm.__proto__ || Object.getPrototypeOf(ModalCreateDirectoryForm)).call(this, props));

	    _this.state = {
	      createDirectory: ''
	    };
	    return _this;
	  }

	  _createClass(ModalCreateDirectoryForm, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      this.refs.input.focus(); // simulate HTML5 autofocus
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this2 = this;

	      var state = this.state;
	      var props = this.props;

	      var disable = !state.createDirectory;
	      var directoryExists = false;

	      var label = 'Create a new directory in ' + _path2.default.join('/', props.content.cd);
	      var labelIcon = undefined;

	      if (!disable) {
	        disable = function () {
	          for (var i = 0; i < props.fetched.lastDirectoriesFetched.length; i++) {
	            var folderName = props.fetched.lastDirectoriesFetched[i];
	            //console.log(folderName, state.createDirectory, folderName === state.createDirectory);
	            if (folderName === state.createDirectory) {

	              label = '&ensp;' + 'Directory ' + _path2.default.join('/', props.content.cd, folderName) + ' already exists';
	              labelIcon = _react2.default.createElement(_Icon2.default, _extends({}, props, { icon: 'exclamation-triangle' }));
	              directoryExists = true;
	              return true;
	            }
	          }
	          return disable;
	        }();
	      }

	      return _react2.default.createElement(
	        'form',
	        { onSubmit: function onSubmit(event) {
	            event.preventDefault();
	            props.onSubmit(_this2.state.createDirectory);
	          } },
	        _react2.default.createElement(
	          'label',
	          { htmlFor: 'eureka__modal-panel__directory', 'aria-live': 'polite', className: (0, _classnames2.default)({
	              dangerous: directoryExists
	            }) },
	          labelIcon,
	          label
	        ),
	        _react2.default.createElement('input', { ref: 'input', type: 'text', id: 'eureka__modal-panel__directory', name: 'eureka__modal-panel__directory', placeholder: 'untitled folder', autoComplete: 'off', value: state.createDirectory, onChange: function onChange(event) {
	            _this2.setState({
	              createDirectory: event.target.value
	            });
	          } }),
	        _react2.default.createElement(
	          'div',
	          { className: 'flex-bar' },
	          _react2.default.createElement(
	            'button',
	            { type: 'reset', onBlur: function onBlur(event) {
	                if (state.createDirectory) return;
	                _this2.refs.input.focus();
	              }, onClick: props.onCancel },
	            _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'cancel', defaultMessage: 'Cancel' }),
	            ' ',
	            _react2.default.createElement(
	              'span',
	              { className: 'visually-hidden' },
	              ' ',
	              _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'directory.cancelCreating', defaultMessage: 'creating directory {cd}', value: {
	                  cd: state.createDirectory
	                }, values: {
	                  state: state
	                } })
	            )
	          ),
	          _react2.default.createElement(
	            'button',
	            { type: 'submit', onBlur: function onBlur(event) {
	                _this2.refs.input.focus();
	              }, disabled: disable },
	            _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'create', defaultMessage: 'Create' }),
	            ' ',
	            _react2.default.createElement(
	              'span',
	              { className: 'visually-hidden' },
	              ' ',
	              _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'directory', defaultMessage: 'directory' }),
	              ' ',
	              state.createDirectory
	            )
	          )
	        )
	      );
	    }
	  }]);

	  return ModalCreateDirectoryForm;
	}(_react.Component);

	exports.default = ModalCreateDirectoryForm;

/***/ },
/* 91 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _path = __webpack_require__(3);

	var _path2 = _interopRequireDefault(_path);

	var _classnames = __webpack_require__(54);

	var _classnames2 = _interopRequireDefault(_classnames);

	var _Icon = __webpack_require__(48);

	var _Icon2 = _interopRequireDefault(_Icon);

	var _reactIntl = __webpack_require__(23);

	var _definedMessages = __webpack_require__(49);

	var _definedMessages2 = _interopRequireDefault(_definedMessages);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ModalRenameItemForm = function (_PureComponent) {
	  _inherits(ModalRenameItemForm, _PureComponent);

	  function ModalRenameItemForm(props) {
	    _classCallCheck(this, ModalRenameItemForm);

	    var _this = _possibleConstructorReturn(this, (ModalRenameItemForm.__proto__ || Object.getPrototypeOf(ModalRenameItemForm)).call(this, props));

	    _this.state = {
	      newName: undefined
	    };
	    return _this;
	  }

	  _createClass(ModalRenameItemForm, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      this.refs.input.focus(); // simulate HTML5 autofocus
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this2 = this;

	      var state = this.state,
	          props = this.props,
	          formatMessage = props.intl.formatMessage;

	      var filename = props.item.filename;

	      var disable = false,
	          sameName = false,
	          label = 'Rename item',
	          labelIcon = undefined;

	      var cannotRenameMessage = formatMessage(_definedMessages2.default.cannotRename, {
	        filename: filename
	      });

	      if (state.newName === props.item.filename) {
	        disable = true;
	        sameName = true;
	        label = '&ensp;' + cannotRenameMessage;
	        labelIcon = _react2.default.createElement(_Icon2.default, _extends({}, props, { icon: 'exclamation-triangle' }));
	      }

	      /*if(!disable) {
	        disable = (() => {
	          for(let i = 0; i < props.fetched.lastDirectoriesFetched.length; i++) {
	            const folderName = props.fetched.lastDirectoriesFetched[i];
	            console.log(folderName, state.createDirectory, folderName === state.createDirectory);
	            if(folderName === state.createDirectory) {
	              const Entities = require('html-entities').AllHtmlEntities;
	               const entities = new Entities();
	               label = `${entities.decode('&ensp;')}Directory ${path.join('/', props.content.cd, folderName)} already exists`;
	              labelIcon = (<Icon {...props} icon="exclamation-triangle" />);
	              directoryExists = true;
	              return true;
	            }
	          }
	          return disable;
	        })();
	      }*/

	      return _react2.default.createElement(
	        'form',
	        { onSubmit: function onSubmit(event) {
	            event.preventDefault();
	            props.onSubmit(state.newName, props.item);
	          } },
	        _react2.default.createElement(
	          'label',
	          { htmlFor: 'eureka__modal-panel__directory', 'aria-live': 'polite', className: (0, _classnames2.default)({
	              dangerous: sameName
	            }) },
	          labelIcon,
	          label
	        ),
	        _react2.default.createElement('input', { ref: 'input', type: 'text', id: 'eureka__modal-panel__directory', name: 'eureka__modal-panel__directory', placeholder: 'foo' + _path2.default.extname(props.item.filename), autoComplete: 'off', value: state.newName, onChange: function onChange(event) {
	            _this2.setState({
	              newName: event.target.value
	            });
	          } }),
	        _react2.default.createElement(
	          'div',
	          { className: 'flex-bar' },
	          _react2.default.createElement(
	            'button',
	            { type: 'reset', onBlur: function onBlur(event) {
	                if (state.newName) return;
	                _this2.refs.input.focus();
	              }, onClick: props.onCancel },
	            _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'cancel', defaultMessage: 'Cancel' }),
	            ' ',
	            _react2.default.createElement(
	              'span',
	              { className: 'visually-hidden' },
	              ' ',
	              _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'renamingItem', defaultMessage: 'renaming item {filename}', values: {
	                  filename: filename
	                } })
	            )
	          ),
	          _react2.default.createElement(
	            'button',
	            { type: 'submit', onBlur: function onBlur(event) {
	                _this2.refs.input.focus();
	              }, disabled: disable },
	            'Rename ',
	            _react2.default.createElement(
	              'span',
	              { className: 'visually-hidden' },
	              ' item ',
	              props.item.filename,
	              ' to ',
	              state.newName
	            )
	          )
	        )
	      );
	    }
	  }]);

	  return ModalRenameItemForm;
	}(_react.PureComponent);

	exports.default = ModalRenameItemForm;

/***/ },
/* 92 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _path = __webpack_require__(3);

	var _path2 = _interopRequireDefault(_path);

	var _reactIntl = __webpack_require__(23);

	var _definedMessages = __webpack_require__(49);

	var _definedMessages2 = _interopRequireDefault(_definedMessages);

	var _utility = __webpack_require__(17);

	var _utility2 = _interopRequireDefault(_utility);

	var _store = __webpack_require__(9);

	var _store2 = _interopRequireDefault(_store);

	var _actions = __webpack_require__(19);

	var _actions2 = _interopRequireDefault(_actions);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var SortContents = function SortContents(props) {
	  var _props$intl = props.intl,
	      formatMessage = _props$intl.formatMessage,
	      formatDate = _props$intl.formatDate;

	  var optionNameMessage = 'Name',
	      optionDimensionsMessage = 'Dimensions',
	      optionFilesizeMessage = 'File Size',
	      optionEditedOnMessage = 'Edited On';

	  //console.log('props.sort', props.sort);


	  return _react2.default.createElement(
	    'form',
	    { className: 'eureka__sort-select' },
	    _react2.default.createElement(
	      'label',
	      { htmlFor: 'eureka__sort-select' },
	      _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'sortBy', defaultMessage: 'Sort by' }),
	      ':'
	    ),
	    _react2.default.createElement(
	      'select',
	      { value: props.sort.by, name: 'eureka__sort-select', id: 'eureka__sort-select', onChange: function onChange(event) {
	          _store2.default.dispatch(_actions2.default.updateView({
	            sort: Object.assign({}, props.view.sort, {
	              by: event.target.value
	            })
	          }));
	        } },
	      _react2.default.createElement(
	        'option',
	        { value: 'filename' },
	        optionNameMessage
	      ),
	      _react2.default.createElement(
	        'option',
	        { value: 'dimensions' },
	        optionDimensionsMessage
	      ),
	      _react2.default.createElement(
	        'option',
	        { value: 'fileSize' },
	        optionFilesizeMessage
	      ),
	      _react2.default.createElement(
	        'option',
	        { value: 'editedOn' },
	        optionEditedOnMessage
	      )
	    ),
	    _react2.default.createElement(
	      'label',
	      { htmlFor: 'eureka__sort-direction' },
	      'Sort Direction:'
	    ),
	    _react2.default.createElement(
	      'select',
	      { value: props.sort.dir, name: 'eureka__sort-direction', id: 'eureka__sort-direction', onChange: function onChange(event) {
	          _store2.default.dispatch(_actions2.default.updateView({
	            sort: Object.assign({}, props.view.sort, {
	              dir: event.target.value
	            })
	          }));
	        } },
	      _react2.default.createElement(
	        'option',
	        { checked: props.sort.dir == _utility2.default.ASCENDING, value: _utility2.default.ASCENDING },
	        'Ascending'
	      ),
	      _react2.default.createElement(
	        'option',
	        { checked: props.sort.dir == _utility2.default.DESCENDING, value: _utility2.default.DESCENDING },
	        'Descending'
	      )
	    )
	  );
	};

	exports.default = SortContents;

/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Notification = undefined;

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _Icon = __webpack_require__(48);

	var _Icon2 = _interopRequireDefault(_Icon);

	var _reactIntl = __webpack_require__(23);

	var _mousetrap = __webpack_require__(61);

	var _mousetrap2 = _interopRequireDefault(_mousetrap);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Notification = exports.Notification = function (_Component) {
	  _inherits(Notification, _Component);

	  function Notification(props) {
	    _classCallCheck(this, Notification);

	    var _this = _possibleConstructorReturn(this, (Notification.__proto__ || Object.getPrototypeOf(Notification)).call(this, props));
	    //console.log('Notification created!!!', props);


	    _initialiseProps.call(_this);

	    _this.state = { hidden: true, dismissed: false };
	    return _this;
	  }

	  _createClass(Notification, [{
	    key: 'slideInOut',
	    value: function slideInOut() {
	      setTimeout(this.show, 60);
	      if (this.props.dismissAfter) setTimeout(this.dismiss, this.props.dismissAfter);
	    }
	  }, {
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      this.slideInOut();
	      this.assignKeyboardListeners();
	    }
	  }, {
	    key: 'componentWillUnmount',
	    value: function componentWillUnmount() {
	      this.removeKeyboardListeners();
	    }
	  }, {
	    key: 'assignKeyboardListeners',
	    value: function assignKeyboardListeners() {
	      _mousetrap2.default.bind(['esc'], this.dismiss);
	    }
	  }, {
	    key: 'removeKeyboardListeners',
	    value: function removeKeyboardListeners() {
	      _mousetrap2.default.unbind(['esc'], this.dismiss);
	    }
	  }, {
	    key: 'componentWillUpdate',
	    value: function componentWillUpdate(nextProps, nextState) {
	      // incase they aren't using a unique key in user land
	      if (this.props.id !== nextProps.id) {
	        this.setState({ hidden: true, dismissed: false });
	        this.slideInOut();
	      }
	      if (this.props.dismissAfter !== nextProps.dismissAfter) {
	        //console.log('updating dismissAfter');
	        if (nextProps.dismissAfter) setTimeout(this.dismiss, this.props.dismissAfter);
	      }
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this2 = this;

	      var props = this.props;
	      var className = 'eureka__notification-wrapper ';
	      var notificationClass = '';
	      var lb = props.learnMore ? _react2.default.createElement('br', null) : undefined;
	      var learnMore = props.learnMore ? _react2.default.createElement(
	        'a',
	        { href: props.learnMore, target: '_blank' },
	        _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'welcome.learnMore', defaultMessage: 'Learn more' })
	      ) : undefined;

	      var icon = function () {
	        switch (props.type) {
	          case 'dangerous':
	            notificationClass = 'eureka__dangerous';
	            return _react2.default.createElement(_Icon2.default, _extends({}, props, { 'aria-hidden': 'true', icon: 'exclamation-triangle' }));
	            break;

	          default:
	            return _react2.default.createElement(_Icon2.default, _extends({}, props, { 'aria-hidden': 'true', icon: 'info-circle' }));
	        }
	      }();

	      return _react2.default.createElement(
	        'div',
	        { className: className, 'aria-hidden': this.state.hidden },
	        _react2.default.createElement(
	          'div',
	          { className: notificationClass },
	          _react2.default.createElement(
	            'p',
	            null,
	            icon,
	            '\u2002',
	            props.message,
	            ' ',
	            lb,
	            learnMore
	          ),
	          _react2.default.createElement(
	            'button',
	            { 'aria-hidden': 'true', 'aria-label': 'Dismiss Notification', onClick: this.state.dismissed ? undefined : function (event) {
	                // hiding because it isn't very necessary for screen readers given notifications auto-dismiss after ~3 seconds
	                _this2.dismiss();
	              } },
	            _react2.default.createElement(_Icon2.default, _extends({}, props, { icon: 'times' }))
	          )
	        )
	      );
	    }
	  }]);

	  return Notification;
	}(_react.Component);

	var _initialiseProps = function _initialiseProps() {
	  var _this3 = this;

	  this.show = function () {
	    _this3.setState({ hidden: false });
	  };

	  this.dismiss = function () {
	    var props = _this3.props;
	    //console.log('dismiss');

	    _this3.setState({
	      dismissed: true,
	      hidden: true
	    });
	    if (props.onDismiss) {
	      setTimeout(function () {
	        props.onDismiss(props.id);
	      }, 420);
	    }
	  };
	};

	Notification.defaultProps = {
	  dismissAfter: 6000
	};

	exports.default = Notification;

/***/ },
/* 94 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _store = __webpack_require__(9);

	var _store2 = _interopRequireDefault(_store);

	var _actions = __webpack_require__(19);

	var _actions2 = _interopRequireDefault(_actions);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function ChooseRadio(props) {
	  var invert = props.view.chooseMultiple && props.config.allowInvertSelection ? _react2.default.createElement(
	    'label',
	    { htmlFor: 'eureka__invert_selection' },
	    '\u2003',
	    _react2.default.createElement('input', { checked: props.view.selectionInverted, onChange: function onChange(event) {
	        _store2.default.dispatch(_actions2.default.updateView({
	          selectionInverted: event.target.checked
	        }));
	      }, type: 'checkbox', id: props.storagePrefix + 'invert_selection', name: 'eureka__invert_selection' }),
	    '\u2002Invert',
	    _react2.default.createElement(
	      'span',
	      { className: 'visually-hidden' },
	      ' Selection'
	    ),
	    '\u2003'
	  ) : _react2.default.createElement(
	    'span',
	    null,
	    '\u2003'
	  ),
	      maybeSpace = props.view.chooseMultiple ? undefined : _react2.default.createElement(
	    'span',
	    null,
	    '\u2003'
	  );
	  return _react2.default.createElement(
	    'div',
	    { className: 'eureka__choose-radio' },
	    _react2.default.createElement(
	      'fieldset',
	      null,
	      _react2.default.createElement(
	        'div',
	        { className: 'eureka__fieldset' },
	        _react2.default.createElement(
	          'legend',
	          null,
	          'Choose Items:\u2002'
	        ),
	        _react2.default.createElement('input', { onChange: function onChange(event) {
	            _store2.default.dispatch(_actions2.default.updateView({
	              chooseMultiple: false
	            }));
	          }, checked: !props.view.chooseMultiple, type: 'radio', name: props.storagePrefix + '__choose_items', id: props.storagePrefix + '__choose_item' }),
	        _react2.default.createElement(
	          'label',
	          { htmlFor: props.storagePrefix + '__choose_item' },
	          '\u2002Single\u2003'
	        ),
	        _react2.default.createElement('input', { onChange: function onChange(event) {
	            _store2.default.dispatch(_actions2.default.updateView({
	              chooseMultiple: true
	            }));
	          }, checked: props.view.chooseMultiple, type: 'radio', name: props.storagePrefix + '__choose_items', id: props.storagePrefix + '__choose_items' }),
	        _react2.default.createElement(
	          'label',
	          { htmlFor: props.storagePrefix + '__choose_items' },
	          '\u2002Multiple',
	          maybeSpace
	        )
	      )
	    ),
	    invert
	  );
	}

	exports.default = ChooseRadio;

/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	!function(e,a){ true?module.exports=a():"function"==typeof define&&define.amd?define(a):(e.ReactIntlLocaleData=e.ReactIntlLocaleData||{},e.ReactIntlLocaleData.en=a())}(this,function(){"use strict";var e=[{locale:"en",pluralRuleFunction:function(e,a){var n=String(e).split("."),l=!n[1],o=Number(n[0])==e,t=o&&n[0].slice(-1),r=o&&n[0].slice(-2);return a?1==t&&11!=r?"one":2==t&&12!=r?"two":3==t&&13!=r?"few":"other":1==e&&l?"one":"other"},fields:{year:{displayName:"year",relative:{0:"this year",1:"next year","-1":"last year"},relativeTime:{future:{one:"in {0} year",other:"in {0} years"},past:{one:"{0} year ago",other:"{0} years ago"}}},month:{displayName:"month",relative:{0:"this month",1:"next month","-1":"last month"},relativeTime:{future:{one:"in {0} month",other:"in {0} months"},past:{one:"{0} month ago",other:"{0} months ago"}}},day:{displayName:"day",relative:{0:"today",1:"tomorrow","-1":"yesterday"},relativeTime:{future:{one:"in {0} day",other:"in {0} days"},past:{one:"{0} day ago",other:"{0} days ago"}}},hour:{displayName:"hour",relativeTime:{future:{one:"in {0} hour",other:"in {0} hours"},past:{one:"{0} hour ago",other:"{0} hours ago"}}},minute:{displayName:"minute",relativeTime:{future:{one:"in {0} minute",other:"in {0} minutes"},past:{one:"{0} minute ago",other:"{0} minutes ago"}}},second:{displayName:"second",relative:{0:"now"},relativeTime:{future:{one:"in {0} second",other:"in {0} seconds"},past:{one:"{0} second ago",other:"{0} seconds ago"}}}}},{locale:"en-001",parentLocale:"en"},{locale:"en-150",parentLocale:"en-001"},{locale:"en-AG",parentLocale:"en-001"},{locale:"en-AI",parentLocale:"en-001"},{locale:"en-AS",parentLocale:"en"},{locale:"en-AT",parentLocale:"en-150"},{locale:"en-AU",parentLocale:"en-001"},{locale:"en-BB",parentLocale:"en-001"},{locale:"en-BE",parentLocale:"en-001"},{locale:"en-BI",parentLocale:"en"},{locale:"en-BM",parentLocale:"en-001"},{locale:"en-BS",parentLocale:"en-001"},{locale:"en-BW",parentLocale:"en-001"},{locale:"en-BZ",parentLocale:"en-001"},{locale:"en-CA",parentLocale:"en-001"},{locale:"en-CC",parentLocale:"en-001"},{locale:"en-CH",parentLocale:"en-150"},{locale:"en-CK",parentLocale:"en-001"},{locale:"en-CM",parentLocale:"en-001"},{locale:"en-CX",parentLocale:"en-001"},{locale:"en-CY",parentLocale:"en-001"},{locale:"en-DE",parentLocale:"en-150"},{locale:"en-DG",parentLocale:"en-001"},{locale:"en-DK",parentLocale:"en-150"},{locale:"en-DM",parentLocale:"en-001"},{locale:"en-Dsrt",pluralRuleFunction:function(e,a){return"other"},fields:{year:{displayName:"Year",relative:{0:"this year",1:"next year","-1":"last year"},relativeTime:{future:{other:"+{0} y"},past:{other:"-{0} y"}}},month:{displayName:"Month",relative:{0:"this month",1:"next month","-1":"last month"},relativeTime:{future:{other:"+{0} m"},past:{other:"-{0} m"}}},day:{displayName:"Day",relative:{0:"today",1:"tomorrow","-1":"yesterday"},relativeTime:{future:{other:"+{0} d"},past:{other:"-{0} d"}}},hour:{displayName:"Hour",relativeTime:{future:{other:"+{0} h"},past:{other:"-{0} h"}}},minute:{displayName:"Minute",relativeTime:{future:{other:"+{0} min"},past:{other:"-{0} min"}}},second:{displayName:"Second",relative:{0:"now"},relativeTime:{future:{other:"+{0} s"},past:{other:"-{0} s"}}}}},{locale:"en-ER",parentLocale:"en-001"},{locale:"en-FI",parentLocale:"en-150"},{locale:"en-FJ",parentLocale:"en-001"},{locale:"en-FK",parentLocale:"en-001"},{locale:"en-FM",parentLocale:"en-001"},{locale:"en-GB",parentLocale:"en-001"},{locale:"en-GD",parentLocale:"en-001"},{locale:"en-GG",parentLocale:"en-001"},{locale:"en-GH",parentLocale:"en-001"},{locale:"en-GI",parentLocale:"en-001"},{locale:"en-GM",parentLocale:"en-001"},{locale:"en-GU",parentLocale:"en"},{locale:"en-GY",parentLocale:"en-001"},{locale:"en-HK",parentLocale:"en-001"},{locale:"en-IE",parentLocale:"en-001"},{locale:"en-IL",parentLocale:"en-001"},{locale:"en-IM",parentLocale:"en-001"},{locale:"en-IN",parentLocale:"en-001"},{locale:"en-IO",parentLocale:"en-001"},{locale:"en-JE",parentLocale:"en-001"},{locale:"en-JM",parentLocale:"en-001"},{locale:"en-KE",parentLocale:"en-001"},{locale:"en-KI",parentLocale:"en-001"},{locale:"en-KN",parentLocale:"en-001"},{locale:"en-KY",parentLocale:"en-001"},{locale:"en-LC",parentLocale:"en-001"},{locale:"en-LR",parentLocale:"en-001"},{locale:"en-LS",parentLocale:"en-001"},{locale:"en-MG",parentLocale:"en-001"},{locale:"en-MH",parentLocale:"en"},{locale:"en-MO",parentLocale:"en-001"},{locale:"en-MP",parentLocale:"en"},{locale:"en-MS",parentLocale:"en-001"},{locale:"en-MT",parentLocale:"en-001"},{locale:"en-MU",parentLocale:"en-001"},{locale:"en-MW",parentLocale:"en-001"},{locale:"en-MY",parentLocale:"en-001"},{locale:"en-NA",parentLocale:"en-001"},{locale:"en-NF",parentLocale:"en-001"},{locale:"en-NG",parentLocale:"en-001"},{locale:"en-NL",parentLocale:"en-150"},{locale:"en-NR",parentLocale:"en-001"},{locale:"en-NU",parentLocale:"en-001"},{locale:"en-NZ",parentLocale:"en-001"},{locale:"en-PG",parentLocale:"en-001"},{locale:"en-PH",parentLocale:"en-001"},{locale:"en-PK",parentLocale:"en-001"},{locale:"en-PN",parentLocale:"en-001"},{locale:"en-PR",parentLocale:"en"},{locale:"en-PW",parentLocale:"en-001"},{locale:"en-RW",parentLocale:"en-001"},{locale:"en-SB",parentLocale:"en-001"},{locale:"en-SC",parentLocale:"en-001"},{locale:"en-SD",parentLocale:"en-001"},{locale:"en-SE",parentLocale:"en-150"},{locale:"en-SG",parentLocale:"en-001"},{locale:"en-SH",parentLocale:"en-001"},{locale:"en-SI",parentLocale:"en-150"},{locale:"en-SL",parentLocale:"en-001"},{locale:"en-SS",parentLocale:"en-001"},{locale:"en-SX",parentLocale:"en-001"},{locale:"en-SZ",parentLocale:"en-001"},{locale:"en-Shaw",pluralRuleFunction:function(e,a){return"other"},fields:{year:{displayName:"Year",relative:{0:"this year",1:"next year","-1":"last year"},relativeTime:{future:{other:"+{0} y"},past:{other:"-{0} y"}}},month:{displayName:"Month",relative:{0:"this month",1:"next month","-1":"last month"},relativeTime:{future:{other:"+{0} m"},past:{other:"-{0} m"}}},day:{displayName:"Day",relative:{0:"today",1:"tomorrow","-1":"yesterday"},relativeTime:{future:{other:"+{0} d"},past:{other:"-{0} d"}}},hour:{displayName:"Hour",relativeTime:{future:{other:"+{0} h"},past:{other:"-{0} h"}}},minute:{displayName:"Minute",relativeTime:{future:{other:"+{0} min"},past:{other:"-{0} min"}}},second:{displayName:"Second",relative:{0:"now"},relativeTime:{future:{other:"+{0} s"},past:{other:"-{0} s"}}}}},{locale:"en-TC",parentLocale:"en-001"},{locale:"en-TK",parentLocale:"en-001"},{locale:"en-TO",parentLocale:"en-001"},{locale:"en-TT",parentLocale:"en-001"},{locale:"en-TV",parentLocale:"en-001"},{locale:"en-TZ",parentLocale:"en-001"},{locale:"en-UG",parentLocale:"en-001"},{locale:"en-UM",parentLocale:"en"},{locale:"en-US",parentLocale:"en"},{locale:"en-VC",parentLocale:"en-001"},{locale:"en-VG",parentLocale:"en-001"},{locale:"en-VI",parentLocale:"en"},{locale:"en-VU",parentLocale:"en-001"},{locale:"en-WS",parentLocale:"en-001"},{locale:"en-ZA",parentLocale:"en-001"},{locale:"en-ZM",parentLocale:"en-001"},{locale:"en-ZW",parentLocale:"en-001"}];return e});


/***/ },
/* 96 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _en = __webpack_require__(97);

	var _en2 = _interopRequireDefault(_en);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	module.exports = {
	  en: _en2.default
	};

/***/ },
/* 97 */
/***/ function(module, exports) {

	module.exports = {
		"close.mediaBrowser": "Close Media Browser",
		"choose": "Choose",
		"item": "item",
		"mediaItem": "media item",
		"pluralItem": "a media item",
		"rename.item": "Rename Item{item}",
		"media": "Media",
		"name": "Name",
		"dimensions": "Dimensions",
		"fileSize": "File Size",
		"editedOn": "Edited On",
		"search.tryAnother": "Try another search",
		"contents.fetchingContents": "Hold tight while we fetch {cd}",
		"search.noResults": "Uh oh. No results found for \"{filter}\"",
		"grammar.or": "or",
		"search.clearFilter": "clear the search filter",
		"directory.appearsToBeEmpty": "Directory \"{cd}\" appears to be empty.",
		"perhapsYouWouldLikeTo": "Perhaps you'd like to",
		"upload.someFiles": "upload some files",
		"grammar.to": "to",
		"directory.set": "Set Directory",
		"directory.browse": "Browse Directory",
		"support.noVideo": "Your browser does not support the video tag.",
		"support.noAudio": "Your browser does not support the audio tag.",
		"select": "Select",
		"grammar.a": "a",
		"media.source": "Media Source",
		"modal.closeWindow": "Close {title} Modal Window",
		"cancel": "Cancel",
		"directory.cancelCreating": "creating directory {cd}",
		"create": "Create",
		"directory": "directory",
		"renamingItem": "renaming item {filename}",
		"welcome.learnMore": "Learn more",
		"filter": "Filter",
		"sortBy": "Sort by",
		"upload.files": "Upload files",
		"upload.dragFilesUploading": "Uploading files…",
		"layout.fullscreenMode": "Fullscreen Mode",
		"layout.table": "Table Layout",
		"layout.thumb": "Thumbnail Layout",
		"layout.grid": "Grid Layout",
		"layout.list": "List Layout",
		"media.browse": "Browse",
		"media.contents": "Media Content",
		"directory.create": "Create a Directory",
		"directory.createNewIn": "Create a new Directory in {cd}",
		"mediaSourceTree": "Media Source Panel",
		"close": "Close",
		"open": "Open",
		"rename": "Rename",
		"welcomeToEureka": "Welcome to Eureka. You found it.",
		"delete": "Delete",
		"in": "in",
		"file.create": "Create File",
		"contents.ofby": "contents of {cd} by filename, filesize, dimensions or even modification date",
		"contents.filterBy": "Filter contents of {cd} by filename, filesize, dimensions or even modification date",
		"file.quickCreate": "Quick Create Files",
		"rename.cannot": "Cannot rename {filename} to the same name",
		"expand": "Expand",
		"choose.item": "Choose {filename}",
		"directory.delete": "Delete Directory",
		"delete.item": "Delete {filename}",
		"deleted.item": "Deleted {filename}",
		"download": "Download",
		"download.item": "Download {filename}",
		"expand.item": "Expand {filename}",
		"directory.refresh": "Refresh Directory",
		"upload.filesTo": "Upload File to {cd}",
		"upload.createFileIn": "Create File in {cd}",
		"context.performActions": "Perform Actions such as Expand or Choose on {filename}",
		"directory.chmod": "chmod Directory",
		"layout.tabular": "Tabular Layout displays image thumbnails along with Name, Description, File Size and Edited On columns",
		"layout.thumbnail": "Thumbnail layout displays a grid of medium sized thumbnails",
		"file.openInNewTab": "Open {filename} in a new tab",
		"toggle": "Toggle",
		"pluralChoose": "item",
		"copyListofSelectedFiles": "Copy list of selected files",
		"media.sourceTree": "Media Source Panel",
		"upload.dragFilestoUpload": "Drag files here to be uploaded to {cd}"
	};

/***/ }
/******/ ])
});
;