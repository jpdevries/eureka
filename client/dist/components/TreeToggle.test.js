'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _TreeToggle = require('./TreeToggle');

var _TreeToggle2 = _interopRequireDefault(_TreeToggle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

it('renders without crashing', function () {
  var div = document.createElement('div');
  //props.view.sourceTreeOpen}
  _reactDom2.default.render(_react2.default.createElement(_TreeToggle2.default, { view: {
      sourceTreeOpen: true
    } }), div);
});

it('should prompt user to open the tree when the tree is closed', function () {
  var div = document.createElement('div');
  //props.view.sourceTreeOpen}
  _reactDom2.default.render(_react2.default.createElement(_TreeToggle2.default, { view: {
      sourceTreeOpen: false
    } }), div);

  if (!div.innerHTML.includes('Open ')) {
    var err = 'Tree toggle button should prompt users to open the three when the tree is closed';
    console.log(err);
    throw new Error(err);
  }
});

it('should prompt user to close the tree when the tree is open', function () {
  var div = document.createElement('div');
  //props.view.sourceTreeOpen}
  _reactDom2.default.render(_react2.default.createElement(_TreeToggle2.default, { view: {
      sourceTreeOpen: true
    } }), div);

  if (!div.innerHTML.includes('Close ')) {
    var err = 'Tree toggle button should prompt users to close the three when the tree is open';
    console.log(err);
    throw new Error(err);
  }
});

it('should contain the aria-controls attribute', function () {
  var div = document.createElement('div');
  //props.view.sourceTreeOpen}
  _reactDom2.default.render(_react2.default.createElement(_TreeToggle2.default, { view: {
      sourceTreeOpen: true
    } }), div);

  if (!div.querySelector('#eureka__tree-toggle__button').hasAttribute('aria-controls')) {
    var err = 'Tree toggle button should contain the aria-controls attribute';
    console.log(err);
    throw new Error(err);
  }
});

it('should contain the aria-expanded attribute', function () {
  var div = document.createElement('div');
  //props.view.sourceTreeOpen}
  _reactDom2.default.render(_react2.default.createElement(_TreeToggle2.default, { view: {
      sourceTreeOpen: true
    } }), div);

  if (!div.querySelector('#eureka__tree-toggle__button').hasAttribute('aria-expanded')) {
    var err = 'Tree toggle button should contain the aria-expanded attribute';
    console.log(err);
    throw new Error(err);
  }
});

it('should have an aria-expanded attribute based on sourceTreeOpen', function () {
  var div = document.createElement('div');
  //props.view.sourceTreeOpen}
  _reactDom2.default.render(_react2.default.createElement(_TreeToggle2.default, { view: {
      sourceTreeOpen: true
    } }), div);

  if (!(div.querySelector('#eureka__tree-toggle__button').getAttribute('aria-expanded') == "true" ? true : false)) {
    var err = 'Should have an aria-expanded attribute of true';
    console.log(err);
    throw new Error(err);
  }
});