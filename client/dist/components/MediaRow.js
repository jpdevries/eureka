'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _filesize = require('filesize');

var _filesize2 = _interopRequireDefault(_filesize);

var _ContextMenu = require('./ContextMenu');

var _ContextMenu2 = _interopRequireDefault(_ContextMenu);

var _store = require('../model/store');

var _store2 = _interopRequireDefault(_store);

var _actions = require('../model/actions');

var _actions2 = _interopRequireDefault(_actions);

var _utility = require('./../utility/utility');

var _utility2 = _interopRequireDefault(_utility);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _Icon = require('./Icon');

var _Icon2 = _interopRequireDefault(_Icon);

var _mousetrap = require('mousetrap');

var _mousetrap2 = _interopRequireDefault(_mousetrap);

var _reactIntl = require('react-intl');

var _definedMessages = require('../i18n/definedMessages');

var _definedMessages2 = _interopRequireDefault(_definedMessages);

var _reactTapEventPlugin = require('react-tap-event-plugin');

var _reactTapEventPlugin2 = _interopRequireDefault(_reactTapEventPlugin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var pathParse = require('path-parse');

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
      var props = this.props;
      this.assignKeyboardListeners();
      if (props.content.chosenMediaItemsInverted.includes(props.item)) {
        this.setState({
          chooseChecked: true
        });
      }
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
        _react2.default.createElement('input', { value: 'chosen', 'aria-label': 'Choose ' + item.filename, type: 'checkbox', name: 'eureka__chose_multiple', id: checkboxId, key: 'eureka__choose_multiple_' + _utility2.default.cssSafe(props.item.filename) + '__' + (this.state.chooseChecked ? 'checked' : ''), checked: this.state.chooseChecked, onChange: function onChange(event) {
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