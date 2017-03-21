'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _ChooseBar = require('./ChooseBar');

var _ChooseBar2 = _interopRequireDefault(_ChooseBar);

var _reactTestRenderer = require('react-test-renderer');

var _reactTestRenderer2 = _interopRequireDefault(_reactTestRenderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

it('renders without crashing', function () {
  var div = document.createElement('div');

  var props = {
    config: {
      storagePrefix: 'eureka__'
    },
    view: {
      focusedMediaItem: undefined
    }
  };

  _reactDom2.default.render(_react2.default.createElement(_ChooseBar2.default, props), div);
});

it('choose button of Virtual DOM should be initially disabled if focused media item is undefined', function () {
  var div = document.createElement('div');

  var props = {
    config: {
      storagePrefix: 'eureka__'
    },
    view: {
      focusedMediaItem: undefined
    }
  };

  _reactDom2.default.render(_react2.default.createElement(_ChooseBar2.default, props), div);

  if (!div.querySelector('#' + props.config.storagePrefix + 'choose-button').hasAttribute('disabled')) {
    var err = 'choose button of Virtual DOM should be initially disabled if focused media item is undefined';
    throw new Error(err);
  }
});

it('choose button of Virtual DOM should not be initially disabled if focused media item is defined', function () {
  var div = document.createElement('div');

  var props = {
    config: {
      storagePrefix: 'eureka__'
    },
    view: {
      focusedMediaItem: {
        filename: 'foo.jpg'
      }
    }
  };

  _reactDom2.default.render(_react2.default.createElement(_ChooseBar2.default, props), div);

  if (div.querySelector('#' + props.config.storagePrefix + 'choose-button').hasAttribute('disabled')) {
    var err = 'choose button of Virtual DOM should not be initially disabled if focused media item is defined';
    throw new Error(err);
  }
});

it('renders a snapshot', function () {
  var props = {
    config: {
      storagePrefix: 'eureka__'
    },
    view: {
      focusedMediaItem: {
        filename: 'foo.jpg'
      }
    }
  };

  var chooseBar = _reactTestRenderer2.default.create(_react2.default.createElement(_ChooseBar2.default, props)).toJSON();
  expect(chooseBar).toMatchSnapshot();
});