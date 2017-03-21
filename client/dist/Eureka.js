'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _MediaSourceSelector = require('./components/MediaSourceSelector');

var _MediaSourceSelector2 = _interopRequireDefault(_MediaSourceSelector);

var _MediaDirectorySelector = require('./components/MediaDirectorySelector');

var _MediaDirectorySelector2 = _interopRequireDefault(_MediaDirectorySelector);

var _TreeBar = require('./components/TreeBar');

var _TreeBar2 = _interopRequireDefault(_TreeBar);

var _TreeToggle = require('./components/TreeToggle');

var _TreeToggle2 = _interopRequireDefault(_TreeToggle);

var _ChooseBar = require('./components/ChooseBar');

var _ChooseBar2 = _interopRequireDefault(_ChooseBar);

var _SearchBar = require('./components/SearchBar');

var _SearchBar2 = _interopRequireDefault(_SearchBar);

var _ViewChooser = require('./components/ViewChooser');

var _ViewChooser2 = _interopRequireDefault(_ViewChooser);

var _EurekaTable = require('./components/EurekaTable');

var _EurekaTable2 = _interopRequireDefault(_EurekaTable);

var _FileTree = require('./components/FileTree');

var _FileTree2 = _interopRequireDefault(_FileTree);

var _UploadForm = require('./components/UploadForm');

var _UploadForm2 = _interopRequireDefault(_UploadForm);

var _PathBar = require('./components/PathBar');

var _PathBar2 = _interopRequireDefault(_PathBar);

var _DropArea = require('./components/DropArea');

var _DropArea2 = _interopRequireDefault(_DropArea);

var _Modal = require('./components/Modal');

var _Modal2 = _interopRequireDefault(_Modal);

var _ModalCreateDirectoryForm = require('./components/ModalCreateDirectoryForm');

var _ModalCreateDirectoryForm2 = _interopRequireDefault(_ModalCreateDirectoryForm);

var _ModalRenameItemForm = require('./components/ModalRenameItemForm');

var _ModalRenameItemForm2 = _interopRequireDefault(_ModalRenameItemForm);

var _store = require('./model/store');

var _store2 = _interopRequireDefault(_store);

var _actions = require('./model/actions');

var _actions2 = _interopRequireDefault(_actions);

var _utility = require('./utility/utility');

var _utility2 = _interopRequireDefault(_utility);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var path = require('path');

var pathParse = require('path-parse');

var CREATE_DIRECTORY = 'create_directory';
var RENAME_ITEM = 'rename_item';

var Eureka = function (_Component) {
  _inherits(Eureka, _Component);

  function Eureka(props) {
    _classCallCheck(this, Eureka);

    var _this = _possibleConstructorReturn(this, (Eureka.__proto__ || Object.getPrototypeOf(Eureka)).call(this, props));

    _this.state = {
      modalOpen: false,
      currentModal: undefined,
      renamingItem: undefined
    };
    return _this;
  }

  _createClass(Eureka, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      _store2.default.dispatch(_actions2.default.fetchMediaSources()).then(function () {
        // hit the server and get the media sources
        _store2.default.dispatch(_actions2.default.updateSourceTree(_this2.props.source.sources[0].id)).then(function (content) {
          // then hit server for the directory tree of the first (default) media source
          var props = _this2.props;

          _store2.default.dispatch(_actions2.default.updateContent({ // updates the "current directory" of the view right away
            cd: props.content.cd
          }));
          _store2.default.dispatch(_actions2.default.fetchDirectoryContents(props.source.currentSource, { // asyncronously fetches the directory contents from the API
            dir: props.content.cd
          }));

          if (props.view.intervals.fetchDirectoryContents !== undefined && props.view.intervals.fetchDirectoryContents > 0) {
            setInterval(function () {
              // every so often hit the server and update the displayed contents of the current directory
              var state = _store2.default.getState();
              var props = _this2.props;

              _store2.default.dispatch(_actions2.default.updateContent({ // updates the "current directory" of the view right away
                cd: props.content.cd
              }));
              _store2.default.dispatch(_actions2.default.fetchDirectoryContents(props.source.currentSource, { // asyncronously fetches the directory contents from the API
                dir: props.content.cd
              }));
            }, props.view.intervals.fetchDirectoryContents);
          }

          if (props.view.intervals.updateSourceTree !== undefined && props.view.intervals.updateSourceTree > 0) {
            // hit the server and get the (top-level-ish) directory tree of the current source
            setInterval(function () {
              _store2.default.dispatch(_actions2.default.updateSourceTree(props.source.currentSource));
            }, props.view.intervals.updateSourceTree);
          }
        });
      });

      document.body.addEventListener('keyup', function (event) {
        var key = event.keyCode || event.charCode || 0;
        console.log(key);
        switch (key) {
          case 27:
            // Escape
            _this2.setState({
              modalOpen: false,
              currentModal: undefined
            });
            break;
        }
      });
    }
  }, {
    key: 'onCreateDirectory',
    value: function onCreateDirectory() {
      console.log('onCreateDirectory');
      this.setState({
        modalOpen: true,
        currentModal: CREATE_DIRECTORY
      });
    }
  }, {
    key: 'onModalCancel',
    value: function onModalCancel(event) {
      event.preventDefault();
      console.log('onModalCancel');
      this.setState({
        modalOpen: false,
        currentModal: undefined
      });
    }
  }, {
    key: 'onModalSubmit',
    value: function onModalSubmit(createDirectory) {
      var _this3 = this;

      var props = this.props;
      event.preventDefault();
      console.log('onModalSubmit', createDirectory);

      switch (this.state.currentModal) {
        case CREATE_DIRECTORY:
          console.log(_store2.default.getState().content.cd, path.join(_store2.default.getState().content.cd, 'foo'));
          _store2.default.dispatch(_actions2.default.createDirectory(_store2.default.getState().source.currentSource, path.join(_store2.default.getState().content.cd, createDirectory))).then(function () {
            _this3.setState({
              modalOpen: false,
              currentModal: undefined
            });
          }).then(function () {
            _store2.default.dispatch(_actions2.default.fetchDirectoryContents(props.source.currentSource, { // asyncronously fetches the directory contents from the API
              dir: _store2.default.getState().content.cd
            }));
          });
          break;

        case RENAME_ITEM:
          console.log();
          break;
      }
    }
  }, {
    key: 'onRenameItemModalSubmit',
    value: function onRenameItemModalSubmit(newName, item) {
      var _this4 = this;

      console.log('onRenameItemModalSubmit!!!', newName, item);
      console.log(item.absolutePath);
      var dir = function () {
        try {
          // this is bullshit webpack isn't including the parse method with the Node path module
          return path.parse(item.absolutePath).dir;
        } catch (e) {
          console.log('oh crap', item.absolutePath);
          console.log(e);
          return pathParse(item.absolutePath).dir;
        }
      }();

      _store2.default.dispatch(_actions2.default.renameItem(this.props.source.currentSource, item.absolutePath, newName)).then(function (results) {
        console.log('results!!!', results);
        _store2.default.dispatch(_actions2.default.updateContent({ contents: results.contents.filter(function (file) {
            return file.filename;
          }) }));
        _this4.setState({
          renamingItem: undefined,
          modalOpen: false,
          currentModal: undefined
        });
      });
    }
  }, {
    key: 'onRenameItem',
    value: function onRenameItem(item) {
      console.log('onRenameItem', item);
      this.setState({
        renamingItem: item,
        modalOpen: true,
        currentModal: RENAME_ITEM
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this5 = this;

      var props = this.props;
      var state = this.state;
      var modalOpen = false;

      var modal = function () {
        if (state.modalOpen) {
          switch (state.currentModal) {
            case CREATE_DIRECTORY:
              return _react2.default.createElement(
                _Modal2.default,
                _extends({ onCancel: _this5.onModalCancel.bind(_this5), onSubmit: _this5.onModalSubmit.bind(_this5), title: 'Create Directory' }, props),
                _react2.default.createElement(_ModalCreateDirectoryForm2.default, props)
              );
              break;

            case RENAME_ITEM:
              return _react2.default.createElement(
                _Modal2.default,
                _extends({ onCancel: _this5.onModalCancel.bind(_this5), onSubmit: _this5.onRenameItemModalSubmit.bind(_this5), title: 'Rename Item ' + state.renamingItem.filename }, props),
                _react2.default.createElement(_ModalRenameItemForm2.default, _extends({}, props, { item: state.renamingItem }))
              );
              break;

            default:
              return undefined;
              break;
          }
        }
        //(state.modalOpen) ? <Modal onCancel={this.onModalCancel.bind(this)} onSubmit={this.onModalSubmit.bind(this)} title="Create Directory" {...props}><ModalCreateDirectoryForm {...props} /></Modal> : undefined
      }();

      var dropArea = props.config.allowUploads ? _react2.default.createElement(_DropArea2.default, props) : undefined;

      var pathbrowser = props.view.sourceTreeOpen && !_utility2.default.serverSideRendering ? _react2.default.createElement(
        'div',
        { id: 'eureka__pathbrowser', className: 'eureka__pathbrowser' },
        _react2.default.createElement(_MediaSourceSelector2.default, props),
        _react2.default.createElement(_FileTree2.default, props),
        dropArea,
        _react2.default.createElement(_TreeBar2.default, _extends({ onCreateDirectory: this.onCreateDirectory.bind(this) }, props))
      ) : undefined;

      var mediaDirectorySelector = !props.view.sourceTreeOpen ? _react2.default.createElement(_MediaDirectorySelector2.default, props) : undefined;

      var uploadForm = !props.view.sourceTreeOpen && props.config.allowUploads ? _react2.default.createElement(_UploadForm2.default, props) : undefined;

      var pathBar = props.view.focusedMediaItem ? _react2.default.createElement(_PathBar2.default, props) : undefined;

      var treeToggle = !_utility2.default.serverSideRendering ? _react2.default.createElement(_TreeToggle2.default, props) : undefined;
      var viewChooser = !_utility2.default.serverSideRendering ? _react2.default.createElement(_ViewChooser2.default, props) : undefined;
      var chooseBar = _react2.default.createElement(_ChooseBar2.default, _extends({ ariaHidden: state.modalOpen }, props));
      var enlargeFocusedRows = props.view.enlargeFocusedRows ? ' eureka__enlarge-focused-rows' : '';
      var searchBar = !_utility2.default.serverSideRendering ? _react2.default.createElement(_SearchBar2.default, props) : undefined;
      var serverSideClass = _utility2.default.serverSideRendering ? ' eureka__server-side' : '';
      var formDiv = _react2.default.createElement(
        'div',
        { 'aria-hidden': state.modalOpen, className: 'eureka__browse-content' },
        pathbrowser,
        _react2.default.createElement(
          'div',
          { className: 'eureka__stage' },
          _react2.default.createElement(
            'div',
            { className: 'eureka__stage__filter-view' },
            _react2.default.createElement(
              'header',
              null,
              _react2.default.createElement(
                'h2',
                null,
                _react2.default.createElement(
                  'span',
                  { className: 'visually-hidden' },
                  'Browse '
                ),
                'Media Content'
              ),
              searchBar
            ),
            _react2.default.createElement(
              'div',
              { className: 'eureka__tree-toggle' },
              treeToggle,
              mediaDirectorySelector,
              uploadForm,
              viewChooser
            )
          ),
          _react2.default.createElement(
            'div',
            { className: 'eureka__table-wrapper' },
            _react2.default.createElement(_EurekaTable2.default, _extends({}, props, { onRenameItem: this.onRenameItem.bind(this), onSubmit: this.onRenameItemModalSubmit.bind(this) }))
          )
        )
      );

      return _utility2.default.serverSideRendering ? _react2.default.createElement(
        'form',
        { method: 'POST', action: props.config.basePath, encType: 'multipart/form-data', className: 'eureka eureka__view-mode__' + props.view.mode + enlargeFocusedRows + serverSideClass },
        formDiv,
        pathBar,
        chooseBar,
        modal
      ) : _react2.default.createElement(
        'div',
        { className: 'eureka eureka__view-mode__' + props.view.mode + enlargeFocusedRows + serverSideClass },
        formDiv,
        pathBar,
        chooseBar,
        modal
      );
    }
  }]);

  return Eureka;
}(_react.Component);

exports.default = Eureka;