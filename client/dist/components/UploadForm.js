'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _store = require('../model/store');

var _store2 = _interopRequireDefault(_store);

var _actions = require('../model/actions');

var _actions2 = _interopRequireDefault(_actions);

var _utility = require('./../utility/utility');

var _utility2 = _interopRequireDefault(_utility);

var _reactIntl = require('react-intl');

var _definedMessages = require('../i18n/definedMessages');

var _definedMessages2 = _interopRequireDefault(_definedMessages);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var classNames = require('classnames');

var UploadForm = function (_Component) {
  _inherits(UploadForm, _Component);

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

      _store2.default.dispatch(decoratedActions.uploadFiles(props.source.currentSource, props.content.cd, formData));
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var props = this.props,
          uploadFilesMessage = _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'upload.files', defaultMessage: 'Upload Files' }),
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
          { role: 'menuitem', htmlFor: 'eureka__upload-form' },
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
        _react2.default.createElement(
          'label',
          { role: 'menuitem', htmlFor: 'eureka__upload-form' },
          uploadFilesMessage,
          _react2.default.createElement(
            'span',
            { className: 'visually-hidden' },
            ' ',
            _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'grammar.to', defaultMessage: 'to' }),
            ' ',
            props.content.cd
          ),
          ':\u2002'
        ),
        _react2.default.createElement('input', { id: 'eureka__upload-form', multiple: 'multiple', name: 'eureka__uploadFiles', type: 'file', onChange: function onChange(e) {
            _this2.form.dispatchEvent(new Event("submit")); // so there is no click button they need to click
          } })
      );

      return _react2.default.createElement(
        'div',
        { className: 'eureka__upload-form' },
        form
      );
    }
  }]);

  return UploadForm;
}(_react.Component);

exports.default = UploadForm;