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

var _Icon = require('./Icon');

var _Icon2 = _interopRequireDefault(_Icon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FileTreeSpan = function (_Component) {
  _inherits(FileTreeSpan, _Component);

  function FileTreeSpan(props) {
    _classCallCheck(this, FileTreeSpan);

    var _this = _possibleConstructorReturn(this, (FileTreeSpan.__proto__ || Object.getPrototypeOf(FileTreeSpan)).call(this, props));

    _this.state = {
      editable: false
    };
    return _this;
  }

  _createClass(FileTreeSpan, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var state = this.state,
          props = this.props,
          item = props.item;

      return _react2.default.createElement(
        'span',
        { ref: function ref(span) {
            return _this2.span = span;
          }, contentEditable: state.editable, onClick: function onClick(event) {
            event.preventDefault();
            //event.stopPropagation();
            _store2.default.dispatch(_actions2.default.updateContent({ // updates the "current directory" of the view right away
              cd: item.cd
            }));
            _store2.default.dispatch(_actions2.default.fetchDirectoryContents(props.source.currentSource, { // asyncronously fetches the directory contents from the API
              dir: item.cd
            }));
          },
          onDoubleClick: function onDoubleClick(event) {
            _this2.setState({
              editable: !state.editable
            });
            if (!state.editable) _this2.span.focus();else _this2.span.blur();
            //if(!state.editable)
          },
          onKeyDown: function onKeyDown(event) {
            console.log('onKeyDown', event, event.keyCode, event.keyCode === 13);
            if (event.keyCode === 13) {
              event.preventDefault();
              event.stopPropagation();
              event.target.blur();
            }
          }
        },
        item.name
      );
    }
  }]);

  return FileTreeSpan;
}(_react.Component);

var FileTree = function FileTree(props) {

  function listTree(tree) {
    return tree.map(function (item, index) {
      return item.children || true ? // still deciding if we need this disabled for now
      _react2.default.createElement(
        'details',
        { key: index },
        _react2.default.createElement(
          'summary',
          { contextMenu: 'context_menu__' + item.cd.replace(/^[^a-z]+|[^\w:.-]+/gi, ""), className: props.content.cd === item.cd ? 'active' : undefined },
          _react2.default.createElement(_Icon2.default, _extends({}, props, { icon: 'folder' })),
          _react2.default.createElement(_Icon2.default, _extends({}, props, { icon: 'folder-open' })),
          _react2.default.createElement(FileTreeSpan, _extends({}, props, { item: item, index: index, key: index })),
          _react2.default.createElement(
            'menu',
            { hidden: 'true', type: 'context', id: 'context_menu__' + item.cd.replace(/^[^a-z]+|[^\w:.-]+/gi, "") },
            _react2.default.createElement('menuitem', { label: 'Create Directory Here', onClick: function onClick(event) {} }),
            _react2.default.createElement('menuitem', { label: 'Chmod Directory' }),
            _react2.default.createElement('menuitem', { label: 'Rename' }),
            _react2.default.createElement('menuitem', { label: 'Refresh Directory' }),
            _react2.default.createElement('hr', null),
            _react2.default.createElement('menuitem', { label: 'Upload Files' }),
            _react2.default.createElement('menuitem', { label: 'Create Files' }),
            _react2.default.createElement('menuitem', { label: 'Quick Create Files' }),
            _react2.default.createElement('menuitem', { label: 'Delete Directory', onClick: function onClick(event) {
                _store2.default.dispatch(_actions2.default.deleteMediaItem(props.source.currentSource, item.cd));
              } })
          )
        ),
        _react2.default.createElement(
          'div',
          null,
          item.children ? listTree(item.children) : undefined
        )
      ) : _react2.default.createElement(
        'span',
        { key: index },
        item.name
      );
    });
  }

  var contentList = listTree(props.tree);

  return _react2.default.createElement(
    'nav',
    { className: 'eureka__tree' },
    contentList
  );
};

exports.default = FileTree;