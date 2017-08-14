'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDropzone = require('react-dropzone');

var _reactDropzone2 = _interopRequireDefault(_reactDropzone);

var _store = require('../model/store');

var _store2 = _interopRequireDefault(_store);

var _actions = require('../model/actions');

var _actions2 = _interopRequireDefault(_actions);

var _Icon = require('./Icon');

var _Icon2 = _interopRequireDefault(_Icon);

var _reactIntl = require('react-intl');

var _definedMessages = require('../i18n/definedMessages');

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
          pastImageFromClipboardMessage = formatMessage(_definedMessages2.default.pastImageFromClipboardMessage, {}),
          dragFilesToBeUploadedToMessage = props.view.isUploading ? formatMessage(_definedMessages2.default.dragFilesUploading, {
        cd: props.content.cd
      }) : formatMessage(_definedMessages2.default.dragFilesToBeUploadedTo, {
        cd: props.content.cd
      });

      return _react2.default.createElement(
        'div',
        { tabIndex: '0', 'aria-label': pastImageFromClipboardMessage, className: (props.config.storagePrefix !== undefined ? props.config.storagePrefix : 'eureka__') + 'drop-area', title: dragFilesToBeUploadedToMessage },
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