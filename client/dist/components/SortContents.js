'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _reactIntl = require('react-intl');

var _definedMessages = require('../i18n/definedMessages');

var _definedMessages2 = _interopRequireDefault(_definedMessages);

var _utility = require('../utility/utility');

var _utility2 = _interopRequireDefault(_utility);

var _store = require('../model/store');

var _store2 = _interopRequireDefault(_store);

var _actions = require('../model/actions');

var _actions2 = _interopRequireDefault(_actions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SortContents = function SortContents(props) {
  var _props$intl = props.intl,
      formatMessage = _props$intl.formatMessage,
      formatDate = _props$intl.formatDate;

  var optionNameMessage = 'Name',
      optionDimensionsMessage = 'Dimensions',
      optionFilesizeMessage = 'File Size',
      optionEditedOnMessage = 'Edited On';

  //console.log('props.sort', props.sort);


  return _react2.default.createElement(
    'form',
    { className: 'eureka__sort-select' },
    _react2.default.createElement(
      'label',
      { htmlFor: 'eureka__sort-select' },
      _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'sortBy', defaultMessage: 'Sort by' }),
      ':'
    ),
    _react2.default.createElement(
      'select',
      { value: props.sort.by, name: 'eureka__sort-select', id: 'eureka__sort-select', onChange: function onChange(event) {
          _store2.default.dispatch(_actions2.default.updateView({
            sort: Object.assign({}, props.view.sort, {
              by: event.target.value
            })
          }));
        } },
      _react2.default.createElement(
        'option',
        { value: 'filename' },
        optionNameMessage
      ),
      _react2.default.createElement(
        'option',
        { value: 'dimensions' },
        optionDimensionsMessage
      ),
      _react2.default.createElement(
        'option',
        { value: 'fileSize' },
        optionFilesizeMessage
      ),
      _react2.default.createElement(
        'option',
        { value: 'editedOn' },
        optionEditedOnMessage
      )
    ),
    _react2.default.createElement(
      'label',
      { htmlFor: 'eureka__sort-direction' },
      'Sort Direction:'
    ),
    _react2.default.createElement(
      'select',
      { value: props.sort.dir, name: 'eureka__sort-direction', id: 'eureka__sort-direction', onChange: function onChange(event) {
          _store2.default.dispatch(_actions2.default.updateView({
            sort: Object.assign({}, props.view.sort, {
              dir: event.target.value
            })
          }));
        } },
      _react2.default.createElement(
        'option',
        { checked: props.sort.dir == _utility2.default.ASCENDING, value: _utility2.default.ASCENDING },
        'Ascending'
      ),
      _react2.default.createElement(
        'option',
        { checked: props.sort.dir == _utility2.default.DESCENDING, value: _utility2.default.DESCENDING },
        'Descending'
      )
    )
  );
};

exports.default = SortContents;