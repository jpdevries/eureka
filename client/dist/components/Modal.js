"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Modal = function Modal(props) {
  return _react2.default.createElement(
    "div",
    { className: "eureka__modal" },
    _react2.default.createElement(
      "div",
      { className: "eureka__modal-panel" },
      _react2.default.createElement(
        "h2",
        null,
        props.title
      ),
      _react2.default.cloneElement(_react2.default.Children.only(props.children), props)
    ),
    _react2.default.createElement(
      "div",
      { role: "button", tabIndex: "0",
        "aria-pressed": "false", className: "eureka__modal-scrim", onClick: props.onCancel },
      _react2.default.createElement(
        "span",
        { className: "visually-hidden" },
        "Close ",
        props.title,
        " Modal Window"
      )
    )
  );
};

exports.default = Modal;