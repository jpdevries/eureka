'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _TreeBar = require('./TreeBar');

var _TreeBar2 = _interopRequireDefault(_TreeBar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

it('renders without crashing', function () {
  var div = document.createElement('div');

  var props = {
    config: {
      allowUploads: true
    },
    content: {
      cd: './',
      contents: []
    }
  };

  _reactDom2.default.render(_react2.default.createElement(_TreeBar2.default, props), div);
});

it('should render an upload button if allowUploads is set to true', function () {
  var div = document.createElement('div');

  var props = {
    config: {
      allowUploads: true
    },
    content: {
      cd: './',
      contents: []
    }
  };

  _reactDom2.default.render(_react2.default.createElement(_TreeBar2.default, props), div);

  if (!div.querySelector('svg.icon-upload')) {
    var err = 'it should render an upload button if allowUploads is set to true';
    throw new Error(err);
  }
});

it('should not render an upload button if allowUploads is not set to true', function () {
  var div = document.createElement('div');

  var props = {
    config: {
      allowUploads: false
    },
    content: {
      cd: './',
      contents: []
    }
  };

  _reactDom2.default.render(_react2.default.createElement(_TreeBar2.default, props), div);

  if (div.querySelector('svg.icon-upload')) {
    var err = 'it should render an upload button if allowUploads is set to true';
    throw new Error(err);
  }
});