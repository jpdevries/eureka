'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _MediaRow = require('./MediaRow');

var _MediaRow2 = _interopRequireDefault(_MediaRow);

var _ContextMenu = require('./ContextMenu');

var _ContextMenu2 = _interopRequireDefault(_ContextMenu);

var _store = require('../model/store');

var _store2 = _interopRequireDefault(_store);

var _actions = require('../model/actions');

var _actions2 = _interopRequireDefault(_actions);

var _filesize = require('filesize');

var _filesize2 = _interopRequireDefault(_filesize);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _utility = require('../utility/utility');

var _utility2 = _interopRequireDefault(_utility);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EurekaTableTbody = function (_Component) {
  _inherits(EurekaTableTbody, _Component);

  function EurekaTableTbody(props) {
    _classCallCheck(this, EurekaTableTbody);

    var _this = _possibleConstructorReturn(this, (EurekaTableTbody.__proto__ || Object.getPrototypeOf(EurekaTableTbody)).call(this, props));

    _this.handleResize = _this.handleResizeEvent.bind(_this);
    return _this;
  }

  _createClass(EurekaTableTbody, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      try {
        window.addEventListener("resize", this.handleResize, false);
      } catch (e) {}
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      try {
        window.removeEventListener("resize", this.handleResize, false);
      } catch (e) {}
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      console.log('EurekaTableTbody componentDidMount');
      _store2.default.dispatch(_actions2.default.updateView({
        isTableScrolling: this.isScrollable(this.tbody)
      }));
    }
  }, {
    key: 'isScrollable',
    value: function isScrollable(el) {
      var y1 = el.scrollTop;
      el.scrollTop += 1;
      var y2 = el.scrollTop;
      el.scrollTop -= 1;
      var y3 = el.scrollTop;
      el.scrollTop = y1;
      var x1 = el.scrollLeft;
      el.scrollTop += 1;
      var x2 = el.scrollLeft;
      el.scrollTop -= 1;
      var x3 = el.scrollLeft;
      el.scrollLeft = x1;
      return !(y1 === y2 && y2 === y3 && x1 === x2 && x2 === x3);
    }
  }, {
    key: 'handleResizeEvent',
    value: function handleResizeEvent(event) {
      //console.log('handleResize',this,event);
      //console.log(this.isScrollable(this.tbody));
      var isScrollable = this.isScrollable(this.tbody);
      if (isScrollable === _store2.default.getState().view.isTableScrolling) return;
      _store2.default.dispatch(_actions2.default.updateView({
        isTableScrolling: isScrollable
      }));
    }
  }, {
    key: 'handleRenameStart',
    value: function handleRenameStart(item) {
      console.log('handleRenameStart', item);
    }
  }, {
    key: 'handleScroll',
    value: function handleScroll(event) {
      //console.log('handleScroll', event);
      var isScrollable = this.isScrollable(this.tbody);
      if (isScrollable === _store2.default.getState().view.isTableScrolling) return;
      _store2.default.dispatch(_actions2.default.updateView({
        isTableScrolling: isScrollable
      }));
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var props = this.props;

      function shouldHide(item) {

        try {
          //console.log('shouldHide',props.view.focusedMediaItem.absolutePath,item.absolutePath,props.view.focusedMediaItem.absolutePath !== item.absolutePath);
          return props.view.focusedMediaItem.absolutePath !== item.absolutePath;
        } catch (e) {
          //console.log('shouldHide',true);
          return true;
        }
      }

      var contents = props.content.contents;

      if (props.view.filter) {
        // filter based on filename, dimensions, date
        var filter = props.view.filter.toLowerCase();
        contents = contents.filter(function (value) {
          return value.filename.toLowerCase().includes(filter) || value.dimensions.join('x').toLowerCase().includes(filter) || new Date(value.editedOn).toLocaleString().toLowerCase().includes(filter) || new Date(value.editedOn).toLocaleString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }).toLowerCase().includes(filter) || (0, _filesize2.default)(value.fileSize, { round: 0 }).toLowerCase().includes(filter) || (0, _filesize2.default)(value.fileSize, { round: 0 }).toLowerCase().replace(/ +?/g, '').includes(filter);
        });
      }

      contents = contents.sort(function (a, b) {
        if (a[props.sort.by] === b[props.sort.by]) return 0;

        var n = void 0;

        //console.log('props.sort.by',props.sort.by,a,b);

        switch (props.sort.by) {
          case 'dimensions':
            n = a.dimensions[0] * a.dimensions[1] > b.dimensions[0] * b.dimensions[1] ? 1 : -1;
            break;

          case 'editedOn':
            n = new Date(a.editedOn).getTime() > new Date(b.editedOn).getTime() ? 1 : -1;
            break;

          default:
            n = a[props.sort.by] > b[props.sort.by] ? 1 : -1;
            break;
        }

        return props.sort.dir === _utility2.default.ASCENDING ? n : 0 - n;
      });

      var contentList = contents.length ? contents.map(function (item, index) {
        return [_react2.default.createElement(_MediaRow2.default, _extends({}, props, { renameStart: _this2.handleRenameStart, item: item, index: index, key: index, onFocus: function onFocus(event) {
            _store2.default.dispatch(_actions2.default.updateView({
              focusedMediaItem: item
            }));
          },
          onBlur: function onBlur(event) {}
        }))];
      }) : _react2.default.createElement(NoResults, props);

      return (
        //onScroll={this.handleScroll.bind(this)}
        _react2.default.createElement(
          'tbody',
          { 'aria-live': 'polite', className: (0, _classnames2.default)({ empty: !contents.length }), ref: function ref(tbody) {
              _this2.tbody = tbody;
            } },
          contentList
        )
      );
    }
  }]);

  return EurekaTableTbody;
}(_react.Component);

function NoResults(props) {
  return props.view.filter ? _react2.default.createElement(
    'tr',
    { role: 'row' },
    _react2.default.createElement(
      'td',
      { role: 'presentation', colSpan: '5', className: 'comfortable' },
      _react2.default.createElement(
        'p',
        { className: 'alert-info eureka__notice', 'aria-live': 'assertive' },
        'Uh oh. No results found for "',
        props.view.filter,
        '". ',
        _react2.default.createElement(
          'a',
          { href: '#eureka__filter', onClick: function onClick(event) {
              event.preventDefault();
              document.getElementById('eureka__filter').focus();
            } },
          'Try another search'
        ),
        ' or ',
        _react2.default.createElement(
          'a',
          { href: '#eureka__filter', onClick: function onClick(event) {
              event.preventDefault();
              _store2.default.dispatch(_actions2.default.updateView({
                filter: undefined
              }));
              document.getElementById('eureka__filter').value = '';
            } },
          'clear the search\xA0filter'
        ),
        '.'
      )
    )
  ) : _react2.default.createElement(
    'tr',
    null,
    _react2.default.createElement(
      'td',
      { role: 'presentation', colSpan: '5', className: 'comfortable' },
      _react2.default.createElement(
        'p',
        { className: 'alert-info eureka__notice', 'aria-live': 'assertive' },
        'Directory "',
        props.content.cd,
        '" appears to be empty.',
        _react2.default.createElement('br', null),
        'Perhaps you\'d like to ',
        _react2.default.createElement(
          'a',
          { href: '#eureka__upload-form', onClick: function onClick(event) {
              event.preventDefault();
              //document.getElementById('eureka__upload-form').focus();

              try {
                // wont work if the sidebar is closed
                document.getElementById('eureka__upload-form').click();
              } catch (e) {
                document.querySelector('.eureka__drop-area-zone').click();
              }
            } },
          'upload some files',
          _react2.default.createElement(
            'span',
            { className: 'visually-hidden' },
            ' to ',
            props.content.cd
          )
        ),
        '?'
      )
    )
  );
}

exports.default = EurekaTableTbody;