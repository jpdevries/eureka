'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _ContextMenu = require('./ContextMenu');

var _ContextMenu2 = _interopRequireDefault(_ContextMenu);

var _utility = require('../utility/utility');

var _reactTestRenderer = require('react-test-renderer');

var _reactTestRenderer2 = _interopRequireDefault(_reactTestRenderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

it('renders without crashing', function () {
  var tr = document.createElement('tr');
  var item = {
    filename: 'sky.jpg'
  };
  //props.view.sourceTreeOpen}
  _reactDom2.default.render(_react2.default.createElement(_ContextMenu2.default, { config: {
      allowRename: true,
      allowDelete: true,
      storagePrefix: 'eureka__'
    }, item: item, hidden: false }), tr);
});

it('should contain a delete button if allowDelete is true', function () {
  var tr = document.createElement('tr');
  var item = {
    filename: 'sky.jpg'
  };
  //props.view.sourceTreeOpen}
  _reactDom2.default.render(_react2.default.createElement(_ContextMenu2.default, { config: {
      allowRename: true,
      allowDelete: true,
      storagePrefix: 'eureka__'
    }, item: item, hidden: false }), tr);

  if (!tr.querySelector('#eureka__delete__' + (0, _utility.cssSafe)(item.filename))) {
    var err = 'it should contain a delete button if allowDelete is true';
    console.log(err);
    throw new Error(err);
  }
});

it('should not contain a delete button if allowDelete is not true', function () {
  var tr = document.createElement('tr');
  var item = {
    filename: 'sky.jpg'
  };
  //props.view.sourceTreeOpen}
  _reactDom2.default.render(_react2.default.createElement(_ContextMenu2.default, { config: {
      allowRename: true,
      allowDelete: false,
      storagePrefix: 'eureka__'
    }, item: item, hidden: false }), tr);

  if (tr.querySelector('#eureka__delete__' + (0, _utility.cssSafe)(item.filename))) {
    var err = 'it should not contain a delete button if allowDelete is not true';
    console.log(err);
    throw new Error(err);
  }
});

it('should contain a rename button if allowRename is true', function () {
  var tr = document.createElement('tr');
  var item = {
    filename: 'sky.jpg'
  };
  //props.view.sourceTreeOpen}
  _reactDom2.default.render(_react2.default.createElement(_ContextMenu2.default, { config: {
      allowRename: true,
      allowDelete: true,
      storagePrefix: 'eureka__'
    }, item: item, hidden: false }), tr);

  if (!tr.querySelector('#eureka__rename__' + (0, _utility.cssSafe)(item.filename))) {
    var err = 'it should contain a rename button if allowRename is true';
    console.log(err);
    throw new Error(err);
  }
});

it('should not contain a rename button if allowRename is not true', function () {
  var tr = document.createElement('tr');
  var item = {
    filename: 'sky.jpg'
  };
  //props.view.sourceTreeOpen}
  _reactDom2.default.render(_react2.default.createElement(_ContextMenu2.default, { config: {
      allowRename: false,
      allowDelete: true,
      storagePrefix: 'eureka__'
    }, item: item, hidden: false }), tr);

  if (tr.querySelector('#eureka__rename__' + (0, _utility.cssSafe)(item.filename))) {
    var err = 'it should not contain a rename button if allowRename is not true';
    console.log(err);
    throw new Error(err);
  }
});

it('should be semantically hidden if hidden is true', function () {
  var tr = document.createElement('tr');
  var item = {
    filename: 'sky.jpg'
  };
  //props.view.sourceTreeOpen}
  _reactDom2.default.render(_react2.default.createElement(_ContextMenu2.default, { config: {
      allowRename: false,
      allowDelete: true,
      storagePrefix: 'eureka__'
    }, item: item, hidden: true }), tr);

  if (!tr.querySelector('td').hasAttribute('hidden')) {
    var err = 'it should be semantically hidden if hidden is not true';
    console.log(err);
    throw new Error(err);
  }
});

it('should not be semantically hidden if hidden is not true', function () {
  var tr = document.createElement('tr');
  var item = {
    filename: 'sky.jpg'
  };
  //props.view.sourceTreeOpen}
  _reactDom2.default.render(_react2.default.createElement(_ContextMenu2.default, { config: {
      allowRename: false,
      allowDelete: true,
      storagePrefix: 'eureka__'
    }, item: item, hidden: false }), tr);

  if (tr.querySelector('td').hasAttribute('hidden')) {
    var err = 'it should be semantically hidden if hidden is not true';
    console.log(err);
    throw new Error(err);
  }
});

it('renders a snapshot', function () {
  var item = {
    filename: 'sky.jpg'
  },
      icon = _reactTestRenderer2.default.create(_react2.default.createElement(_ContextMenu2.default, { config: {
      allowRename: false,
      allowDelete: true,
      storagePrefix: 'eureka__'
    }, item: item, hidden: false })).toJSON();

  expect(icon).toMatchSnapshot();
});