'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _store = require('../model/store');

var _store2 = _interopRequireDefault(_store);

var _actions = require('../model/actions');

var _actions2 = _interopRequireDefault(_actions);

var _EurekaTableTbody = require('./EurekaTableTbody');

var _EurekaTableTbody2 = _interopRequireDefault(_EurekaTableTbody);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _reactDropzone = require('react-dropzone');

var _reactDropzone2 = _interopRequireDefault(_reactDropzone);

var _Icon = require('./Icon');

var _Icon2 = _interopRequireDefault(_Icon);

var _utility = require('../utility/utility');

var _utility2 = _interopRequireDefault(_utility);

var _reactIntl = require('react-intl');

var _definedMessages = require('../i18n/definedMessages');

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
      contents: [],
      sort: {
        by: 'filename',
        dir: _utility2.default.ASCENDING,
        renamingItem: undefined
      }
    };
    _this.decoratedActions = props.decoratedActions ? Object.assign({}, _actions2.default, props.decoratedActions) : _actions2.default;
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
      var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.state;

      //console.log('sorting contents', state.sort);
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

          default:
            n = a[state.sort.by] > b[state.sort.by] ? 1 : -1;
            break;
        }

        return state.sort.dir === _utility2.default.ASCENDING ? n : 0 - n;
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

      return false;
    }
  }, {
    key: 'componentWillUpdate',
    value: function componentWillUpdate(nextProps, nextState) {
      //console.log(this.props, this.state);
      if (this.state.sort !== nextState.sort) {
        this.setState({
          contents: this.sortContents(nextProps.content.contents, nextState)
        });
      } else if (nextProps.content.contents !== this.state.contents) this.setState({
        contents: nextProps.content.contents
      });
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
      var _this2 = this,
          _React$createElement2,
          _React$createElement3,
          _React$createElement4,
          _React$createElement5,
          _React$createElement6;

      var props = this.props,
          state = this.state,
          formatMessage = props.intl.formatMessage;

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
            a.setAttribute('download', 'yolo.txt');
            a.href = item.absoluteURL;
            a.href = 'http://localhost:3000/yolo.txt';
            a.innerHTML = 'YOLO';
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
            _react2.default.createElement(
              'th',
              _defineProperty({ role: 'rowheader', scope: 'col' }, 'role', 'columnheader'),
              _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'media', defaultMessage: 'Media' })
            ),
            _react2.default.createElement(
              'th',
              (_React$createElement2 = { role: 'rowheader', scope: 'col' }, _defineProperty(_React$createElement2, 'role', 'columnheader'), _defineProperty(_React$createElement2, 'onClick', function onClick(event) {
                var dir = _this2.state.sort.dir;
                //console.log("this.state.sort.by === 'filename'", this.state.sort.by === 'filename', dir);
                if (_this2.state.sort.by === 'filename') {
                  dir = dir === _utility2.default.ASCENDING ? _utility2.default.DESCENDING : _utility2.default.ASCENDING;
                }
                //console.log('dir',dir);
                _this2.setState({
                  sort: {
                    by: 'filename',
                    dir: dir
                  }
                });
              }), _React$createElement2),
              _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'name', defaultMessage: 'Name' }),
              '\u2002',
              !_utility2.default.serverSideRendering ? _react2.default.createElement(_Icon2.default, _extends({}, props, { icon: 'sort' })) : undefined
            ),
            _react2.default.createElement(
              'th',
              (_React$createElement3 = { role: 'rowheader', scope: 'col' }, _defineProperty(_React$createElement3, 'role', 'columnheader'), _defineProperty(_React$createElement3, 'className', 'visually-hidden'), _React$createElement3),
              'Actions'
            ),
            _react2.default.createElement(
              'th',
              (_React$createElement4 = { role: 'rowheader', scope: 'col' }, _defineProperty(_React$createElement4, 'role', 'columnheader'), _defineProperty(_React$createElement4, 'onClick', function onClick(event) {
                var dir = _this2.state.sort.dir;
                if (_this2.state.sort.by === 'dimensions') {
                  dir = dir === _utility2.default.ASCENDING ? _utility2.default.DESCENDING : _utility2.default.ASCENDING;
                }
                _this2.setState({
                  sort: {
                    by: 'dimensions',
                    dir: dir
                  }
                });
              }), _React$createElement4),
              _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'dimensions', defaultMessage: 'Dimensions' }),
              '\u2002',
              !_utility2.default.serverSideRendering ? _react2.default.createElement(_Icon2.default, _extends({}, props, { icon: 'sort' })) : undefined
            ),
            _react2.default.createElement(
              'th',
              (_React$createElement5 = { role: 'rowheader', scope: 'col' }, _defineProperty(_React$createElement5, 'role', 'columnheader'), _defineProperty(_React$createElement5, 'onClick', function onClick(event) {
                var dir = _this2.state.sort.dir;
                if (_this2.state.sort.by === 'fileSize') {
                  dir = dir === _utility2.default.ASCENDING ? _utility2.default.DESCENDING : _utility2.default.ASCENDING;
                }
                _this2.setState({
                  sort: {
                    by: 'fileSize',
                    dir: dir
                  }
                });
              }), _React$createElement5),
              _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'fileSize', defaultMessage: 'File Size' }),
              '\u2002',
              !_utility2.default.serverSideRendering ? _react2.default.createElement(_Icon2.default, _extends({}, props, { icon: 'sort' })) : undefined
            ),
            _react2.default.createElement(
              'th',
              (_React$createElement6 = { role: 'rowheader', scope: 'col' }, _defineProperty(_React$createElement6, 'role', 'columnheader'), _defineProperty(_React$createElement6, 'onClick', function onClick(event) {
                var dir = _this2.state.sort.dir;
                if (_this2.state.sort.by === 'editedOn') {
                  dir = dir === _utility2.default.ASCENDING ? _utility2.default.DESCENDING : _utility2.default.ASCENDING;
                }
                _this2.setState({
                  sort: {
                    by: 'editedOn',
                    dir: dir
                  }
                });
              }), _React$createElement6),
              _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'editedOn', defaultMessage: 'Edited On' }),
              '\u2002',
              !_utility2.default.serverSideRendering ? _react2.default.createElement(_Icon2.default, _extends({}, props, { icon: 'sort' })) : undefined
            )
          )
        ),
        _react2.default.createElement(_EurekaTableTbody2.default, _extends({}, props, { intl: props.intl, filter: props.view.filter, content: props.content, contents: state.contents, sort: this.state.sort }))
      );

      return props.config.allowUploads && !_utility2.default.serverSideRendering ? _react2.default.createElement(
        _reactDropzone2.default,
        { onDrop: this.onDrop.bind(this), disableClick: true, style: {} },
        table,
        html5ContextMenus
      ) : _react2.default.createElement(
        'div',
        null,
        table
      );
    }
  }]);

  return EurekaTable;
}(_react.Component);

exports.default = EurekaTable;