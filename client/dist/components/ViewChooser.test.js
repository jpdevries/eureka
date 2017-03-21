'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _ViewChooser = require('./ViewChooser');

var _ViewChooser2 = _interopRequireDefault(_ViewChooser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var actions = require('../model/actions'),
    store = require('../model/store');

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

  _reactDom2.default.render(_react2.default.createElement(_ViewChooser2.default, props), div);
});

it('should check the radio associated with the current view mode', function () {
  var div = document.createElement('div');
  var mode = 'list';
  var props = {
    config: {
      storagePrefix: 'eureka__'
    },
    view: {
      focusedMediaItem: undefined,
      mode: mode
    }
  };

  _reactDom2.default.render(_react2.default.createElement(_ViewChooser2.default, props), div);

  if (div.querySelector('input[type="radio"]:checked').value !== mode) {
    var err = 'should check the radio associated with the current view mode';
    throw new Error(err);
  }
});

it('should update the Redux store when a view mode radio input is checked', function () {
  var div = document.createElement('div');
  var mode = 'list';
  var props = {
    config: {
      storagePrefix: 'eureka__'
    },
    view: {
      focusedMediaItem: undefined,
      mode: mode
    }
  };

  _reactDom2.default.render(_react2.default.createElement(_ViewChooser2.default, props), div);

  new Promise(function (resolve, reject) {
    var radios = div.querySelectorAll('input[type="radio"]'),
        randomRadio = radios[Math.round(Math.random() * radios.length - 1)];

    store.subscribe(function () {
      resolve(store.getState());
    });

    randomRadio.checked = true;
  }).then(function (state) {
    if (state.view.mode !== randomRadio.value) {
      var err = 'should update the Redux store when a view mode radio input is checked';
      throw new Error(err);
    }
  });
});