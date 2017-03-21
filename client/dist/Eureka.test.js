'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _Eureka = require('./Eureka');

var _Eureka2 = _interopRequireDefault(_Eureka);

var _redux = require('redux');

var _reactRedux = require('react-redux');

var _reactTestRenderer = require('react-test-renderer');

var _reactTestRenderer2 = _interopRequireDefault(_reactTestRenderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var actions = require('./model/actions'),
    store = require('./model/store'),
    initialConfig = store.getState();

function getEurekaProvider() {
  var props = {},
      EurekaController = (0, _reactRedux.connect)(function (state, props) {
    // todo list
    return {
      content: state.content,
      view: state.view,
      tree: state.tree,
      source: state.source,
      directory: state.directory,
      fetched: state.fetched,
      config: state.config
    };
  })(_Eureka2.default);

  return _react2.default.createElement(
    _reactRedux.Provider,
    { store: store },
    _react2.default.createElement(EurekaController, null)
  );
}

it('renders without crashing', function () {
  var div = document.createElement('div'),
      Provider = getEurekaProvider();
  _reactDom2.default.render(Provider, div);
});

it('should support storagePrefix configuration through props', function () {
  var div = document.createElement('div');
  var props = {
    storagePrefix: 'yolo__'
  };

  var config = store.getState().config;
  store.dispatch(actions.updateConfig(props));
  var Provider = getEurekaProvider();

  _reactDom2.default.render(Provider, div);

  if (!div.innerHTML.includes(props.storagePrefix)) {
    var err = 'Rendered markup should contain storage prefix: ' + props.storagePrefix;
    console.log(err);
    throw new Error(err);
  }
});

it('supports view mode configuration through props', function () {
  // set the store back to how it was apparently this persists through tests?
  store.dispatch(actions.updateConfig(Object.assign({}, initialConfig, {})));

  var div = document.createElement('div');
  var props = {
    mode: 'list'
  };

  store.dispatch(actions.updateConfig(props));

  var Provider = getEurekaProvider();

  _reactDom2.default.render(Provider, div);

  //console.log(div.innerHTML);

  if (div.querySelector('input[name="eureka__view"]:checked').value !== props.mode) {
    throw new Error('Mode attribute should initially check associated view radio input. Expected ' + props.mode);
  }
});

it('should remove upload form if allowUploads is set to false', function () {
  var div = document.createElement('div');
  var props = {
    allowUploads: false
  };

  store.dispatch(actions.updateConfig(props));

  var Provider = getEurekaProvider();
  _reactDom2.default.render(Provider, div);

  //console.log(div.querySelector('eureka__upload-form'));

  if (div.querySelector('#eureka__upload-form')) {
    var err = '#eureka__upload-form should be null if allowUploads is set to false';
    console.log(err);
    throw new Error(err);
  }
});

it('should not remove upload form if allowUploads is not set to false', function () {
  var div = document.createElement('div');
  var props = {
    allowUploads: true
  };

  store.dispatch(actions.updateConfig(props));

  var Provider = getEurekaProvider();
  _reactDom2.default.render(Provider, div);

  //console.log(div.querySelector('eureka__upload-form'));

  if (!div.querySelector('#eureka__upload-form')) {
    var err = '#eureka__upload-form should not be null if allowUploads is not set to false';
    console.log(err);
    throw new Error(err);
  }
});

it('should hide media source panel if treeHidden is set to true', function () {
  var div = document.createElement('div');
  var props = {
    treeHidden: true
  };

  store.dispatch(actions.updateConfig(props));

  var Provider = getEurekaProvider();
  _reactDom2.default.render(Provider, div);

  if (div.querySelector('#eureka__pathbrowser')) {
    var err = '$eureka__pathbrowser should not be present in the DOM if treeHidden is set to true';
    console.log(err);
    throw new Error(err);
  }
});

it('should not hide media source panel if treeHidden is not set to true', function () {
  var div = document.createElement('div');
  var props = {
    treeHidden: false
  };

  store.dispatch(actions.updateConfig(props));

  var Provider = getEurekaProvider();
  _reactDom2.default.render(Provider, div);

  if (!div.querySelector('#eureka__pathbrowser')) {
    var err = '$eureka__pathbrowser should be present in the DOM if treeHidden is not set to true';
    console.log(err);
    throw new Error(err);
  }
});

it('should remove upload features from media source tree if allowUploads is set to false', function () {
  var div = document.createElement('div');
  var props = {
    allowUploads: false,
    treeHidden: false
  };

  store.dispatch(actions.updateConfig(props));

  var Provider = getEurekaProvider();
  _reactDom2.default.render(Provider, div);

  if (div.querySelector('.eureka__drop-area')) {
    var err = '.eureka__drop-area should be null if allowUploads is set to false';
    console.log(err);
    throw new Error(err);
  }
});

it('should not remove upload features from media source tree if allowUploads is not set to false', function () {
  var div = document.createElement('div');
  var props = {
    allowUploads: true,
    treeHidden: false,
    storagePrefix: 'eureka__'
  };

  store.dispatch(actions.updateConfig(props));

  var Provider = getEurekaProvider();
  _reactDom2.default.render(Provider, div);

  //console.log(div.outerHTML);

  //console.log('YOLO!!!!', store.getState().config.storagePrefix)

  if (!div.querySelector('.eureka__drop-area')) {
    var err = '.eureka__drop-area should be null if allowUploads is set to false';
    throw new Error(err);
  }
});

it('should not remove upload features from media source tree if allowUploads is not set to false', function () {
  var div = document.createElement('div');
  var props = {
    allowUploads: true,
    treeHidden: false
  };

  store.dispatch(actions.updateConfig(props));

  var Provider = getEurekaProvider();
  _reactDom2.default.render(Provider, div);

  if (!div.querySelector('.eureka__drop-area')) {
    var err = '.eureka__drop-area should be null if allowUploads is set to false';
    throw new Error(err);
  }
});