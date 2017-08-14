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

var _Icon = require('./Icon');

var _Icon2 = _interopRequireDefault(_Icon);

var _reactIntl = require('react-intl');

var _definedMessages = require('../i18n/definedMessages');

var _definedMessages2 = _interopRequireDefault(_definedMessages);

var _reactMasonryComponent = require('react-masonry-component');

var _reactMasonryComponent2 = _interopRequireDefault(_reactMasonryComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EurekaTableTbody = function (_PureComponent) {
  _inherits(EurekaTableTbody, _PureComponent);

  function EurekaTableTbody(props) {
    _classCallCheck(this, EurekaTableTbody);

    var _this = _possibleConstructorReturn(this, (EurekaTableTbody.__proto__ || Object.getPrototypeOf(EurekaTableTbody)).call(this, props));

    _this.state = {
      focusedMediaItem: undefined,
      filter: undefined
    };

    //this.handleResize = this.handleResizeEvent.bind(this);
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

    /*componentDidMount() {
      //console.log('EurekaTableTbody componentDidMount');
      store.dispatch(actions.updateView({
        isTableScrolling: this.isScrollable(this.tbody)
      }));
    }*/

    /*isScrollable(el) {
      const y1 = el.scrollTop;
      el.scrollTop+=1;
      const y2 = el.scrollTop;
      el.scrollTop-=1;
      const y3 = el.scrollTop;
      el.scrollTop = y1;
      const x1 = el.scrollLeft;
      el.scrollTop+=1;
      const x2 = el.scrollLeft;
      el.scrollTop-=1;
      const x3 = el.scrollLeft;
      el.scrollLeft = x1;
      return !(y1 === y2 && y2 === y3 && x1 === x2 && x2 === x3);
    }
     handleResizeEvent(event) {
      const isScrollable = this.isScrollable(this.tbody);
      if(isScrollable === store.getState().view.isTableScrolling) return;
      store.dispatch(actions.updateView({
        isTableScrolling:isScrollable
      }));
    }*/

  }, {
    key: 'handleRenameStart',
    value: function handleRenameStart(item) {
      console.log('handleRenameStart', item);
    }

    /*handleScroll(event) {
      const isScrollable = this.isScrollable(this.tbody);
      if(isScrollable === store.getState().view.isTableScrolling) return;
      store.dispatch(actions.updateView({
        isTableScrolling: isScrollable
      }));
    }*/

  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      return true;
      console.log(this.props, this.state);
      if (nextProps.view.filter || !nextProps.view.filter && this.props.view.filter) return true;
      if (nextProps.view.sort !== this.props.view.sort) return true;
      if (nextProps.view.chooseMultiple !== this.props.view.chooseMultiple) return true;
      try {
        //console.log('shouldComponentUpdate', (this.state.focusedMediaItem.path !== nextProps.view.focusedMediaItem.path), this.state.focusedMediaItem.path, nextProps.view.focusedMediaItem.path);
        //if((this.state.focusedMediaItem.path !== nextProps.view.focusedMediaItem.path)) return true; // #janky SLOOOOW
      } catch (e) {}
      //console.log(this.props.contents[0], nextProps.contents[0]);
      return !(this.props.contents === nextProps.contents);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      //console.log('rendering EurekaTableTbody');
      var props = this.props,
          state = this.state;

      //console.log('render EurekaTableTbody');

      function shouldHide(item) {

        try {
          //console.log('shouldHide',props.view.focusedMediaItem.path,item.path,props.view.focusedMediaItem.path !== item.path);
          return props.view.focusedMediaItem.path !== item.path;
        } catch (e) {
          //console.log('shouldHide',true);
          return true;
        }
      }

      var contents = props.contents;

      if (props.filter) {
        (function () {
          // filter based on filename, dimensions, date
          var filter = props.view.filter.toLowerCase();
          contents = contents.filter(function (value) {
            var editedOnDate = new Date(value.editedOn);
            //console.log('value', value);
            //return value.filename.toLowerCase().includes(filter);
            return value.filename.toLowerCase().includes(filter) || function () {
              try {
                return value.dimensions.join('x');
              } catch (e) {
                return '';
              }
            }().toLowerCase().includes(filter) || value.localString.toLowerCase().includes(filter) || value.localStringVerbose.toLowerCase().includes(filter) || value.fileSizeHumanReadable.toLowerCase().includes(filter) || value.fileSizeHumanReadable.toLowerCase().replace(/ +?/g, '').includes(filter);
          });
        })();
      }

      /*const sortContents = true;
      contents = contents.sort((a,b) => {
        if(a[props.sort.by] === b[props.sort.by]) return 0;
         let n;
         //console.log('props.sort.by',props.sort.by,a,b);
         switch(props.sort.by) {
          case 'dimensions':
          n = a.dimensions[0] * a.dimensions[1] > b.dimensions[0] * b.dimensions[1] ? 1 : -1;
          break;
           case 'editedOn':
          n = new Date(a.editedOn).getTime() > new Date(b.editedOn).getTime() ? 1 : -1;
          break;
           default:
          n = (a[props.sort.by] > b[props.sort.by]) ? 1 : -1;
          break;
        }
         return (props.sort.dir === utility.ASCENDING) ? n : 0-n;
      });*/

      var contentList = contents.length ? contents.map(function (item, index) {
        return [_react2.default.createElement(_MediaRow2.default, _extends({ key: _utility2.default.cssSafe(item.filename) }, props, { intl: props.intl, focusedMediaItem: props.view.focusedMediaItem, renameStart: _this2.handleRenameStart, item: item, index: index, onFocus: function onFocus(event) {

            /*this.setState({
              focusedMediaItem: item
            })*/
            _store2.default.dispatch(_actions2.default.updateView({
              focusedMediaItem: item
            }));
          },
          onBlur: function onBlur(event) {}
        }))];
      }) : _react2.default.createElement(NoResults, props);

      if (props.view.mode == 'masonry') {
        return (
          //onScroll={this.handleScroll.bind(this)}
          _react2.default.createElement(
            _reactMasonryComponent2.default,
            {
              elementType: 'tbody' // default 'div'
              , options: {
                transitionDuration: 240
                //fitWidth: true
              } // default {}
              , disableImagesLoaded: false // default false
              , updateOnEachImageLoad: true // default false and works only if disableImagesLoaded is false
              , role: 'rowgroup', 'aria-live': 'polite', className: (0, _classnames2.default)({ empty: !contents.length }), ref: function ref(tbody) {
                _this2.tbody = tbody;
              }
            },
            contentList
          )
        );
      }

      return (
        //onScroll={this.handleScroll.bind(this)}
        _react2.default.createElement(
          'tbody',
          { role: 'rowgroup', 'aria-live': 'polite', className: (0, _classnames2.default)({ empty: !contents.length }), ref: function ref(tbody) {
              _this2.tbody = tbody;
            } },
          contentList
        )
      );
    }
  }]);

  return EurekaTableTbody;
}(_react.PureComponent);

function NoResults(props) {
  var searchTryAnother = _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'search.tryAnother', defaultMessage: 'Try another search' });

  if (props.view.fetchingContents) {
    return _react2.default.createElement(
      'tr',
      { role: 'row' },
      _react2.default.createElement(
        'td',
        { role: 'presentation', colSpan: '5', className: 'comfortable' },
        _react2.default.createElement(
          'p',
          { className: 'alert-info eureka__notice', 'aria-live': 'assertive' },
          _react2.default.createElement(
            'span',
            { className: 'spinner' },
            _react2.default.createElement(_Icon2.default, _extends({}, props, { icon: 'circle-o-notch' }))
          ),
          _react2.default.createElement('br', null),
          _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'contents.fetchingContents', defaultMessage: 'Hold tight while we fetch {cd}', values: {
              cd: props.content.cd
            } })
        )
      )
    );
  }

  return props.view.filter ? _react2.default.createElement(
    'tr',
    { role: 'row' },
    _react2.default.createElement(
      'td',
      { role: 'presentation', colSpan: '5', className: 'comfortable' },
      _react2.default.createElement(
        'p',
        { className: 'alert-info eureka__notice', 'aria-live': 'assertive' },
        _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'search.noResults', defaultMessage: 'Uh oh. No results found for "{filter}"', values: {
            filter: props.view.filter
          } }),
        '. ',
        _react2.default.createElement(
          'a',
          { href: '#eureka__filter', onClick: function onClick(event) {
              event.preventDefault();
              document.getElementById('eureka__filter').focus();
            } },
          searchTryAnother
        ),
        ' ',
        _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'grammar.or', defaultMessage: 'or' }),
        ' ',
        _react2.default.createElement(
          'a',
          { href: '#eureka__filter', onClick: function onClick(event) {
              event.preventDefault();
              _store2.default.dispatch(_actions2.default.updateView({
                filter: undefined
              }));
              document.getElementById('eureka__filter').value = '';
            } },
          _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'search.clearFilter', defaultMessage: 'clear the search\xA0filter' })
        ),
        '.'
      )
    )
  ) : _react2.default.createElement(
    'tr',
    { role: 'row' },
    _react2.default.createElement(
      'td',
      { role: 'presentation', colSpan: '5', className: 'comfortable' },
      _react2.default.createElement(
        'p',
        { className: 'alert-info eureka__notice', 'aria-live': 'assertive' },
        _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'directory.appearsToBeEmpty', defaultMessage: 'Directory "{cd}" appears to be empty.', values: {
            cd: props.content.cd
          } }),
        _react2.default.createElement('br', null),
        _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'perhapsYouWouldLikeTo', defaultMessage: 'Perhaps you\'d like to' }),
        ' ',
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
          _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'upload.someFiles', defaultMessage: 'upload some files' }),
          _react2.default.createElement(
            'span',
            { className: 'visually-hidden' },
            ' ',
            _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'grammar.to', defaultMessage: 'to' }),
            ' ',
            props.content.cd
          )
        ),
        '?'
      )
    )
  );
}

exports.default = EurekaTableTbody;