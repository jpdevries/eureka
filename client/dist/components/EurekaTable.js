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
      sort: {
        by: 'filename',
        dir: _utility2.default.ASCENDING,
        renamingItem: undefined
      }
    };
    _this.decoratedActions = props.decoratedActions ? Object.assign({}, _actions2.default, props.decoratedActions) : _actions2.default;
    return _this;
  }

  _createClass(EurekaTable, [{
    key: 'onDrop',
    value: function onDrop(files) {
      var props = this.props;
      //console.log('Received files: ', files);

      var formData = new FormData();

      var decoratedActions = this.decoratedActions;

      files.forEach(function (file) {
        formData.append('eureka__uploadFiles', file, file.name);
      });

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
        return _react2.default.createElement(
          'menu',
          { key: index, hidden: 'true', type: 'context', id: 'context_menu__tbody-' + index },
          _react2.default.createElement('menuitem', { label: formatMessage(_definedMessages2.default.expandItem, {
              filename: item.filename
            }), onClick: function onClick(event) {
              document.getElementById('expand__' + _utility2.default.cssSafe(item.filename)).click();
            } }),
          _react2.default.createElement('menuitem', { label: formatMessage(_definedMessages2.default.chooseItem, {
              filename: item.filename
            }), onClick: function onClick(event) {
              document.getElementById('choose__' + _utility2.default.cssSafe(item.filename)).click();
            } }),
          _react2.default.createElement('menuitem', { label: formatMessage(_definedMessages2.default.renameItem, {
              item: item.filename
            }), onClick: function onClick(event) {
              document.getElementById((props.config.storagePrefix !== undefined ? props.config.storagePrefix : 'eureka__') + 'rename__' + _utility2.default.cssSafe(item.filename)).click();
            } }),
          _react2.default.createElement('menuitem', { label: formatMessage(_definedMessages2.default.deleteItem, {
              filename: item.filename
            }), onClick: function onClick(event) {
              _store2.default.dispatch(decoratedActions.deleteMediaItem(props.source.currentSource, item.path, props.config.headers));
            } })
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
                if (_this2.state.sort.by === 'filename') {
                  dir = dir === _utility2.default.ASCENDING ? _utility2.default.DESCENDING : _utility2.default.ASCENDING;
                }
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
        _react2.default.createElement(_EurekaTableTbody2.default, _extends({}, props, { intl: props.intl, filter: props.view.filter, content: props.content, sort: this.state.sort }))
      );

      return props.config.allowUploads && !_utility2.default.serverSideRendering ? _react2.default.createElement(
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
    }
  }]);

  return EurekaTable;
}(_react.Component);

exports.default = EurekaTable;