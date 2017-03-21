'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _PathBar = require('./PathBar');

var _PathBar2 = _interopRequireDefault(_PathBar);

var _utility = require('../utility/utility');

var _utility2 = _interopRequireDefault(_utility);

var _reactTestRenderer = require('react-test-renderer');

var _reactTestRenderer2 = _interopRequireDefault(_reactTestRenderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pathParse = require('path-parse');

it('renders without crashing', function () {
  var div = document.createElement('div');

  var props = {
    config: {
      allowRename: false,
      allowDelete: false
    },
    view: {
      focusedMediaItem: {
        directory: '/',
        absoluteURL: 'cheese.jpg',
        filename: 'cheese.jpg'
      }
    }
  };

  _reactDom2.default.render(_react2.default.createElement(_PathBar2.default, props), div);
});

it('should display the correct icon based on filename extension', function () {
  var div = document.createElement('div');

  var props = {
    config: {
      allowRename: false,
      allowDelete: false
    },
    view: {
      focusedMediaItem: {
        directory: '/',
        absoluteURL: 'cheese.jpg',
        filename: 'cheese.jpg'
      }
    }
  };

  _reactDom2.default.render(_react2.default.createElement(_PathBar2.default, props), div);

  var icon = _utility2.default.getIconByExtension(pathParse(props.view.focusedMediaItem.filename).ext);

  if (!div.querySelector('use').getAttribute('xlink:href').includes('icon-' + icon)) {
    var err = 'It should display the correct icon based on the filename extension';
    console.log(err);
    throw new Error(err);
  }
});

it('summary should contain correct absolutePath', function () {
  var div = document.createElement('div');

  var props = {
    config: {
      allowRename: false,
      allowDelete: false
    },
    view: {
      focusedMediaItem: {
        directory: '/',
        absoluteURL: 'cheese.jpg',
        filename: 'cheese.jpg',
        absolutePath: '/cheese.jpg'
      }
    }
  };

  _reactDom2.default.render(_react2.default.createElement(_PathBar2.default, props), div);

  if (!div.querySelector('summary').innerHTML.includes(props.view.focusedMediaItem.absolutePath)) {
    var err = 'summary should contain correct absolutePath expects ' + props.view.focusedMediaItem.absolutePath;
    console.log(err);
    throw new Error(err);
  }
});

it('renders a snapshot', function () {
  var props = {
    config: {
      allowRename: false,
      allowDelete: false
    },
    view: {
      focusedMediaItem: {
        directory: '/',
        absoluteURL: 'cheese.jpg',
        filename: 'cheese.jpg',
        absolutePath: '/cheese.jpg'
      }
    }
  };

  var pathbar = _reactTestRenderer2.default.create(_react2.default.createElement(_PathBar2.default, props)).toJSON();
  expect(pathbar).toMatchSnapshot();
});