'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _store = require('../model/store');

var _store2 = _interopRequireDefault(_store);

var _actions = require('../model/actions');

var _actions2 = _interopRequireDefault(_actions);

var _utility = require('../utility/utility');

var _utility2 = _interopRequireDefault(_utility);

var _reactIntl = require('react-intl');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var MediaDirectorySelector = function MediaDirectorySelector(props) {
  var _React$createElement;

  var decoratedActions = props.decoratedActions ? Object.assign({}, _actions2.default, props.decoratedActions) : _actions2.default;

  var optgroups = props.directory.map(function (source, index) {
    // todo: rename props.directory to something that makes more sense (or combine it with the sources reducer?)
    var opts = source.directories.sort(function (a, b) {
      if (a.cd === b.cd) return 0;
      return a.cd > b.cd ? 1 : -1;
    }).map(function (directory, index) {
      //console.log(props.source.currentSource.id == source.id && props.content.cd == directory.cd, props.source.currentSource.id, source.id, props.content.cd, directory.cd);
      return _react2.default.createElement(
        'option',
        { key: index, value: source.id + '||' + directory.cd, checked: props.source.currentSource.id == source.id && props.content.cd == directory.cd },
        directory.cd
      );
    });
    return _react2.default.createElement(
      'optgroup',
      { key: index, label: source.name, 'data-source': source.id === undefined ? index : source.id },
      _react2.default.createElement(
        'option',
        { value: source.id + '||/', checked: props.content.cd == "/" && props.source.currentSource == source.id },
        './'
      ),
      opts
    );
  });

  var hiddenInput = _react2.default.createElement('input', (_React$createElement = { type: 'hidden', name: (props.config.storagePrefix !== undefined ? props.config.storagePrefix : 'eureka__') + 'mediaSourceId' }, _defineProperty(_React$createElement, 'name', (props.config.storagePrefix !== undefined ? props.config.storagePrefix : 'eureka__') + 'mediaSourceId'), _defineProperty(_React$createElement, 'value', props.config.uid), _React$createElement));
  var submit = _utility2.default.serverSideRendering ? _react2.default.createElement(
    'button',
    { type: 'submit' },
    _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'directory.set', defaultMessage: 'Set Directory' })
  ) : undefined;
  var select = _react2.default.createElement(
    'select',
    { role: 'navigation', 'aria-live': 'polite', value: props.source.currentSource + '||' + props.content.cd, name: 'eureka__media-browser_0__browsing', id: 'eureka__media-browser_0__browsing', onChange: function onChange(event) {
        var _utility$parseMediaSo = _utility2.default.parseMediaSourceOutOfCombinedPath(event.target.value, '||'),
            _utility$parseMediaSo2 = _slicedToArray(_utility$parseMediaSo, 2),
            cs = _utility$parseMediaSo2[0],
            cd = _utility$parseMediaSo2[1]; // option values are like 0||assets/img/redwoods where 0 is the media source id and assets/img/redwoods is the directory
        //console.log('YOLO',cs,cd);


        _store2.default.dispatch(decoratedActions.updateSource(cs));
        _store2.default.dispatch(decoratedActions.updateContent({ // updates the "current directory" of the view right away
          cd: cd
        }));
        _store2.default.dispatch(decoratedActions.fetchDirectoryContents(cs, { // asyncronously fetches the directory contents from the API
          path: cd
        }, props.config.headers));
      } },
    optgroups
  );
  var hiddenUploadDirectoryInput = _react2.default.createElement('input', { type: 'hidden', name: (props.config.storagePrefix !== undefined ? props.config.storagePrefix : 'eureka__') + 'upload-dir', value: props.content.cd });
  var form = _utility2.default.serverSideRendering ? _react2.default.createElement(
    'div',
    null,
    hiddenInput,
    hiddenUploadDirectoryInput,
    select,
    submit
  ) : _react2.default.createElement(
    'form',
    { action: '#' },
    hiddenInput,
    select,
    submit
  );

  return _react2.default.createElement(
    'div',
    { className: 'eureka__media-directory-selector' },
    _react2.default.createElement(
      'label',
      { htmlFor: 'eureka__media-browser_0__browsing' },
      _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'directory.browse', defaultMessage: 'Browse Directory' }),
      ':'
    ),
    '\u2002',
    form
  );
};

exports.default = MediaDirectorySelector;