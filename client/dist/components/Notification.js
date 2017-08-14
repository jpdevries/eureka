'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Notification = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Icon = require('./Icon');

var _Icon2 = _interopRequireDefault(_Icon);

var _reactIntl = require('react-intl');

var _mousetrap = require('mousetrap');

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