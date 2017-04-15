'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _Icon = require('./Icon');

var _Icon2 = _interopRequireDefault(_Icon);

var _reactIntl = require('react-intl');

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