'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DropArea = function (_Component) {
  _inherits(DropArea, _Component);

  function DropArea() {
    _classCallCheck(this, DropArea);

    return _possibleConstructorReturn(this, (DropArea.__proto__ || Object.getPrototypeOf(DropArea)).apply(this, arguments));
  }

  _createClass(DropArea, [{
    key: 'onDrop',
    value: function onDrop(files) {
      var props = this.props;
      console.log('Received files: ', files);

      var formData = new FormData();

      files.forEach(function (file) {
        formData.append('eureka__uploadFiles', file, file.name);
      });

      _store2.default.dispatch(_actions2.default.uploadFiles(props.source.currentSource, props.content.cd, formData));
    }
  }, {
    key: 'render',
    value: function render() {
      var props = this.props;
      return (//
        _react2.default.createElement(
          'div',
          { className: (props.config.storagePrefix !== undefined ? props.config.storagePrefix : 'eureka__') + 'drop-area', title: 'Drag files here to be uploaded to ' + props.content.cd },
          _react2.default.createElement(
            _reactDropzone2.default,
            { onDrop: this.onDrop.bind(this), className: (props.config.storagePrefix !== undefined ? props.config.storagePrefix : 'eureka__') + 'drop-area-zone', activeClassName: (props.config.storagePrefix !== undefined ? props.config.storagePrefix : 'eureka__') + 'drop-area-zone-active', style: {} },
            _react2.default.createElement(_Icon2.default, { icon: 'upload' })
          )
        )
      );
    }
  }]);

  return DropArea;
}(_react.Component);

exports.default = DropArea;