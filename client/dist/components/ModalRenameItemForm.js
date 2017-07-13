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

var _definedMessages = require('../i18n/definedMessages');

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

      var filename = props.item.filename || props.item.name;

      var disable = false,
          sameName = false,
          label = formatMessage(_definedMessages2.default.newName),
          labelIcon = undefined;

      var cannotRenameMessage = formatMessage(_definedMessages2.default.cannotRename, {
        filename: filename
      });

      if (state.newName === (props.item.filename || props.item.name)) {
        disable = true;
        sameName = true;
        label = '' + cannotRenameMessage;
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
            console.log('submitted item');
          } },
        _react2.default.createElement(
          'label',
          { htmlFor: 'eureka__modal-panel__directory', 'aria-live': 'polite', className: (0, _classnames2.default)({
              dangerous: sameName
            }) },
          labelIcon,
          '\u2002',
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
            { className: 'growable', type: 'reset', onBlur: function onBlur(event) {
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
            { className: 'growable', type: 'submit', onBlur: function onBlur(event) {
                _this2.refs.input.focus();
              }, disabled: disable },
            'Rename ',
            _react2.default.createElement(
              'span',
              { className: 'visually-hidden' },
              ' item ',
              props.item.filename || props.item.name,
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