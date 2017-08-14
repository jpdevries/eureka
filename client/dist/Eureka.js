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

var _ModalCropItemForm = require('./components/ModalCropItemForm');

var _ModalCropItemForm2 = _interopRequireDefault(_ModalCropItemForm);

var _ModalRenameItemForm = require('./components/ModalRenameItemForm');

var _ModalRenameItemForm2 = _interopRequireDefault(_ModalRenameItemForm);

var _SortContents = require('./components/SortContents');

var _SortContents2 = _interopRequireDefault(_SortContents);

var _Icon = require('./components/Icon');

var _Icon2 = _interopRequireDefault(_Icon);

var _Notification = require('./components/Notification');

var _Notification2 = _interopRequireDefault(_Notification);

var _ChooseRadio = require('./components/ChooseRadio');

var _ChooseRadio2 = _interopRequireDefault(_ChooseRadio);

var _mousetrap = require('mousetrap');

var _mousetrap2 = _interopRequireDefault(_mousetrap);

var _reactIntl = require('react-intl');

var _store = require('./model/store');

var _store2 = _interopRequireDefault(_store);

var _actions = require('./model/actions');

var _actions2 = _interopRequireDefault(_actions);

var _utility = require('./utility/utility');

var _utility2 = _interopRequireDefault(_utility);

var _definedMessages = require('./i18n/definedMessages');

var _definedMessages2 = _interopRequireDefault(_definedMessages);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var path = require('path');

var pathParse = require('path-parse');

var classNames = require('classnames');

var CREATE_DIRECTORY = 'create_directory';
var RENAME_ITEM = 'rename_item';
var CROP_ITEM = 'crop_item';

//Notification.propTypes = { initialCount: React.PropTypes.number };
//Notification.defaultProps = { initialCount: 0 };


var Eureka = function (_Component) {
  _inherits(Eureka, _Component);

  /*static propTypes = {
    intl: PropTypes.object.isRequired,
  }*/

  function Eureka(props) {
    _classCallCheck(this, Eureka);

    var _this = _possibleConstructorReturn(this, (Eureka.__proto__ || Object.getPrototypeOf(Eureka)).call(this, props));

    _initialiseProps.call(_this);

    _this.state = {
      modalOpen: false,
      currentModal: undefined,
      renamingItem: undefined,
      notifications: [],
      stickyNotifications: true
    };

    _this.decoratedActions = props.decoratedActions ? Object.assign({}, _actions2.default, props.decoratedActions) : _actions2.default;
    console.log('this.decoratedActions', _this.decoratedActions);
    return _this;
  }

  _createClass(Eureka, [{
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.removeKeyboardListeners();
    }
  }, {
    key: 'componentWillUpdate',
    value: function componentWillUpdate(nextProps, nextState) {
      try {
        //console.log('nextProps.notifications', nextProps.notifications);
        var unarchivedNotifications = nextProps.notifications.filter(function (notification) {
          return !notification.archived;
        });
        //console.log('unarchivedNotifications', unarchivedNotifications);
        //console.log('nextProps.notifications[0].sticky', unarchivedNotifications[0].sticky);
        //console.log('does it', this.state.stickyNotifications === unarchivedNotifications[0].sticky, this.state.stickyNotifications, unarchivedNotifications[0].sticky);
        if (this.state.stickyNotifications === unarchivedNotifications[0].sticky) return;

        this.setState({
          stickyNotifications: unarchivedNotifications[0].sticky
        });
      } catch (e) {}
    }

    /*notificationsTick = () => {
       console.log('notificationsTick!');
      try {
        this.setState({
          notifications: this.state.notifications.shift()
        })
      } catch(e) {}
    }*/

  }, {
    key: 'assignKeyboardListeners',


    /*handleKeyboardDeselect = (event) => {
      console.log('handleKeyboardDeselect');
      const toUncheck = this.getEurekaRoot().querySelectorAll('.eureka__td-media input[type="checkbox"]:checked');
      console.log('toUncheck', toUncheck);
      for(let i = 0; i < toUncheck.length; i++) {
        toUncheck[i].click();
      }
       store.dispatch(actions.updateContent({
        chosenMediaItems: [],
        chosenMediaItemsInverted: []
      }));
    }*/

    value: function assignKeyboardListeners() {
      _mousetrap2.default.bind(['ctrl+;'], this.toggleSourceTreeOpen);
      _mousetrap2.default.bind(['ctrl+alt+1', 'ctrl+alt+2', 'ctrl+alt+3', 'ctrl+alt+4'], this.handleKeyboardChangeView);
      _mousetrap2.default.bind(['alt+0', 'alt+1', 'alt+2', 'alt+3', 'alt+4', 'alt+5', 'alt+6', 'alt+7', 'alt+8', 'alt+9'], this.handleKeyboardChangeSource);
      _mousetrap2.default.bind(['ctrl+u'], this.handleKeyboardUpload);
      _mousetrap2.default.bind(['ctrl+n'], this.handleKeyboardCreateDirectory);
      _mousetrap2.default.bind(['ctrl+f'], this.handleKeyboardFilter);
      _mousetrap2.default.bind(['alt+up'], this.handleKeyboardSortAscending);
      _mousetrap2.default.bind(['alt+down'], this.handleKeyboardSortDescending);

      _mousetrap2.default.bind(['alt+n'], this.handleKeyboardSortName);
      _mousetrap2.default.bind(['alt+d'], this.handleKeyboardSortDimensions);
      _mousetrap2.default.bind(['alt+f'], this.handleKeyboardSortFileSize);
      _mousetrap2.default.bind(['alt+e'], this.handleKeyboardSortEditedOn);

      _mousetrap2.default.bind(['alt+s'], this.handleKeyboardChooseSingle);
      _mousetrap2.default.bind(['alt+m'], this.handleKeyboardChooseMultiple);
      _mousetrap2.default.bind(['alt+i'], this.handleKeyboardToggleInvertSelection);
      _mousetrap2.default.bind(['alt+z'], this.handleKeyboardDeselect);

      if (this.props.config.handlers && this.props.config.handlers.createFile) _mousetrap2.default.bind(['ctrl+shift+n'], this.handleKeyboardCreateFile);
    }
  }, {
    key: 'removeKeyboardListeners',
    value: function removeKeyboardListeners() {
      _mousetrap2.default.unbind(['ctrl+;'], this.toggleSourceTreeOpen);
      _mousetrap2.default.unbind(['ctrl+alt+1', 'ctrl+alt+2', 'ctrl+alt+3', 'ctrl+alt+4'], this.handleKeyboardChangeView);
      _mousetrap2.default.unbind(['alt+0', 'alt+1', 'alt+2', 'alt+3', 'alt+4', 'alt+5', 'alt+6', 'alt+7', 'alt+8', 'alt+9'], this.handleKeyboardChangeSource);
      _mousetrap2.default.unbind(['ctrl+u'], this.handleKeyboardUpload);
      _mousetrap2.default.unbind(['ctrl+n'], this.handleKeyboardCreateDirectory);
      _mousetrap2.default.unbind(['ctrl+f'], this.handleKeyboardFilter);
      _mousetrap2.default.unbind(['alt+up'], this.handleKeyboardSortAscending);
      _mousetrap2.default.unbind(['alt+down'], this.handleKeyboardSortDescending);

      _mousetrap2.default.unbind(['alt+n'], this.handleKeyboardSortName);
      _mousetrap2.default.unbind(['alt+d'], this.handleKeyboardSortDimensions);
      _mousetrap2.default.unbind(['alt+f'], this.handleKeyboardSortFileSize);
      _mousetrap2.default.unbind(['alt+e'], this.handleKeyboardSortEditedOn);

      _mousetrap2.default.unbind(['alt+s'], this.handleKeyboardChooseSingle);
      _mousetrap2.default.unbind(['alt+m'], this.handleKeyboardChooseMultiple);
      _mousetrap2.default.unbind(['alt+i'], this.handleKeyboardToggleInvertSelection);
      _mousetrap2.default.unbind(['alt+z'], this.handleKeyboardDeselect);

      if (this.props.config.handlers && this.props.config.handlers.createFile) _mousetrap2.default.unbind(['ctrl+shift+n'], this.handleKeyboardCreateFile);
    }
  }, {
    key: 'getEurekaRoot',
    value: function getEurekaRoot() {
      try {
        return event.target.closest('.eureka-root');
      } catch (e) {
        return document.querySelector('.eureka-root');
      }
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      var props = this.props,
          decoratedActions = this.decoratedActions,
          _props$intl = props.intl,
          formatMessage = _props$intl.formatMessage,
          formatPlural = _props$intl.formatPlural;


      console.log('decoratedActions', decoratedActions);

      this.assignKeyboardListeners();

      _store2.default.dispatch(decoratedActions.fetchMediaSources(props.config.headers)).then(function () {
        // hit the server and get the media sources
        //console.log('got media sources fetching source tree for', this.props.source.sources[0].id);
        _store2.default.dispatch(decoratedActions.updateSourceTree(_this2.props.source.currentSource || _this2.props.source.sources[0].id), props.config.headers).then(function (content) {
          // then hit server for the directory tree of the first (default) media source
          var props = _this2.props;

          _store2.default.dispatch(decoratedActions.updateContent({ // updates the "current directory" of the view right away
            cd: props.content.cd
          }));
          _store2.default.dispatch(decoratedActions.fetchDirectoryContents(props.source.currentSource, { // asyncronously fetches the directory contents from the API
            path: props.content.cd
          }, props.config.headers));

          if (props.view.intervals.fetchDirectoryContents !== undefined && props.view.intervals.fetchDirectoryContents > 0) {
            setInterval(function () {
              // every so often hit the server and update the displayed contents of the current directory
              var state = _store2.default.getState();
              var props = _this2.props;

              _store2.default.dispatch(decoratedActions.updateContent({ // updates the "current directory" of the view right away
                cd: props.content.cd
              }));
              _store2.default.dispatch(decoratedActions.fetchDirectoryContents(props.source.currentSource, { // asyncronously fetches the directory contents from the API
                path: props.content.cd
              }, props.config.headers));
            }, props.view.intervals.fetchDirectoryContents);
          }

          if (props.view.intervals.updateSourceTree !== undefined && props.view.intervals.updateSourceTree > 0) {
            // hit the server and get the (top-level-ish) directory tree of the current source
            setInterval(function () {
              console.log('updating source tree');
              _store2.default.dispatch(decoratedActions.updateSourceTree(props.source.currentSource, props.config.headers));
            }, props.view.intervals.updateSourceTree);
          }
        });

        if (props.config.alwaysWelcome || props.config.welcome && localStorage.getItem(props.storagePrefix + 'welcome') !== 'false') {
          (function () {
            var wecomeToEurekaMessage = formatMessage(_definedMessages2.default.welcomeToEureka);
            setTimeout(function () {
              //message, notificationType, learnMore, dismissAfter, sticky = true
              _store2.default.dispatch(_actions2.default.notify(wecomeToEurekaMessage, undefined, props.config.learnMore, false, false));
              localStorage.setItem(props.storagePrefix + 'welcome', 'false');
            }, 420);
          })();
        }
      });

      document.body.addEventListener('keyup', function (event) {
        var key = event.keyCode || event.charCode || 0;
        //console.log(key);
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
      //console.log('onCreateDirectory');
      this.setState({
        modalOpen: true,
        currentModal: CREATE_DIRECTORY
      });
    }
  }, {
    key: 'onModalCancel',
    value: function onModalCancel(event) {
      _store2.default.dispatch(_actions2.default.updateView({
        isCropping: false
      }));
      try {
        event.preventDefault();
      } catch (e) {}
      //console.log('onModalCancel');
      this.setState({
        modalOpen: false,
        currentModal: undefined
      });
    }
  }, {
    key: 'onModalSubmit',
    value: function onModalSubmit(createDirectory) {
      var _this3 = this;

      var decoratedActions = this.decoratedActions;
      var props = this.props;
      //event.preventDefault();
      //console.log('onModalSubmit',createDirectory);

      switch (this.state.currentModal) {
        case CREATE_DIRECTORY:
          console.log(_store2.default.getState().content.cd, path.join(_store2.default.getState().content.cd, 'foo'));
          _store2.default.dispatch(decoratedActions.createDirectory(_store2.default.getState().source.currentSource, path.join(_store2.default.getState().content.cd, createDirectory))).then(function () {
            _this3.setState({
              modalOpen: false,
              currentModal: undefined
            });
          }).then(function () {
            _store2.default.dispatch(decoratedActions.fetchDirectoryContents(props.source.currentSource, { // asyncronously fetches the directory contents from the API
              path: _store2.default.getState().content.cd
            }, props.config.headers));
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

      var props = this.props;
      console.log('onRenameItemModalSubmit!!!', newName, item);
      //console.log(item);
      var decoratedActions = this.decoratedActions;
      var dir = function () {
        try {
          // this is weird webpack isn't including the parse method with the Node path module
          return path.parse(item.path || item.cd).dir;
        } catch (e) {
          //console.log('oh crap', item.path);
          console.log(e);
          return pathParse(item.path || item.cd).dir;
        }
      }();

      var renameItem = item.filename ? decoratedActions.renameItem : decoratedActions.renameDirectory;

      _store2.default.dispatch(renameItem(this.props.source.currentSource, item.path || item.cd, newName, this.props.config.headers)).then(function (results) {
        if (!item.filename) {
          console.log(dir);
          /*store.dispatch(decoratedActions.updateContent({contents:results.contents.filter((file) => (
            file.filename
          ))}));*/
          /*store.dispatch(decoratedActions.updateSourceTree(this.props.source.currentSource, this.props.config.headers)).then((content) => {
            console.log(content);
          })*/
          /*store.dispatch(decoratedActions.updateContent({ // updates the "current directory" of the view right away
            cd: item.cd
          }));*/
          console.log('fetching, ' + dir);
          _store2.default.dispatch(decoratedActions.fetchDirectoryContents(props.source.currentSource, { // asyncronously fetches the directory contents from the API
            path: dir
          }, props.config.headers)).then(function () {
            console.log('all done', props.content.cd, item, newName);
            if (props.content.cd === item.cd) {
              console.log('they equal', path.join(dir, newName));
              _store2.default.dispatch(decoratedActions.updateContent({
                cd: path.join(dir, newName)
              }));

              _store2.default.dispatch(decoratedActions.fetchDirectoryContents(props.source.currentSource, { // asyncronously fetches the directory contents from the API
                path: path.join(dir, newName)
              }, props.config.headers));

              _store2.default.dispatch(decoratedActions.updateSourceTree(props.source.currentSource, props.config.headers));

              /*if(results.contents !== undefined) store.dispatch(decoratedActions.updateContent({contents:results.contents.filter((file) => (
                file.filename
              ))}));*/
            }
          });
        } else {
          console.log('updating contents with result contents');
          if (results.contents !== undefined) _store2.default.dispatch(decoratedActions.updateContent({ contents: results.contents.filter(function (file) {
              return file.filename;
            }) }));
        }

        _this4.setState({
          renamingItem: undefined,
          modalOpen: false,
          currentModal: undefined
        });
      });
    }
  }, {
    key: 'onCropItemModalSubmit',
    value: function onCropItemModalSubmit(item) {
      console.log('onCropItemModalSubmit', item);
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
    key: 'onCropItem',
    value: function onCropItem(item) {
      this.setState({
        renamingItem: item,
        modalOpen: true,
        currentModal: CROP_ITEM
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this5 = this;

      var props = this.props,
          state = this.state,
          modalOpen = false,
          _props$intl2 = this.props.intl,
          formatMessage = _props$intl2.formatMessage,
          formatDate = _props$intl2.formatDate,
          createDirectoryMessage = formatMessage(_definedMessages2.default.directory),
          renameItemMessage = formatMessage(_definedMessages2.default.renameItem, {
        item: state.renamingItem ? ' ' + state.renamingItem.filename : ''
      }),
          cropItemMessage = formatMessage(_definedMessages2.default.cropItem, {
        item: ' '
      }),
          croppingItemMessage = formatMessage(_definedMessages2.default.croppingItem, {
        item: function () {
          try {
            return props.view.focusedMediaItem.filename;
          } catch (e) {
            return undefined;
          }
        }()
      });

      //console.log('state.notifications', state.notifications);

      var modal = function () {
        if (state.modalOpen) {
          switch (state.currentModal) {
            case CREATE_DIRECTORY:
              return _react2.default.createElement(
                _Modal2.default,
                _extends({ onCancel: _this5.onModalCancel.bind(_this5), onSubmit: _this5.onModalSubmit.bind(_this5), title: createDirectoryMessage }, props),
                _react2.default.createElement(_ModalCreateDirectoryForm2.default, props)
              );
              break;

            case RENAME_ITEM:
              return _react2.default.createElement(
                _Modal2.default,
                _extends({ onCancel: _this5.onModalCancel.bind(_this5), onSubmit: _this5.onRenameItemModalSubmit.bind(_this5), title: renameItemMessage }, props),
                _react2.default.createElement(_ModalRenameItemForm2.default, _extends({}, props, { item: state.renamingItem }))
              );
              break;

            case CROP_ITEM:
              return _react2.default.createElement(
                _Modal2.default,
                _extends({ className: 'eureka__greedy eureka__crop-modal', showSpinner: props.view.isCropping, onCancel: _this5.onModalCancel.bind(_this5), onSubmit: _this5.onCropItemModalSubmit.bind(_this5), title: croppingItemMessage }, props),
                _react2.default.createElement(_ModalCropItemForm2.default, _extends({}, props, { item: props.view.focusedMediaItem }))
              );
              break;

            default:
              return undefined;
              break;
          }
        }
        //(state.modalOpen) ? <Modal onCancel={this.onModalCancel.bind(this)} onSubmit={this.onModalSubmit.bind(this)} title="Create Directory" {...props}><ModalCreateDirectoryForm {...props} /></Modal> : undefined
      }();

      var dropArea = props.config.allowUploads && props.config.doDragNDrop ? _react2.default.createElement(_DropArea2.default, props) : undefined;

      var pathbrowser = !_utility2.default.serverSideRendering ? _react2.default.createElement(
        'div',
        { hidden: !props.view.sourceTreeOpen, 'aria-hidden': !props.view.sourceTreeOpen, id: 'eureka__pathbrowser', className: 'eureka__pathbrowser' },
        _react2.default.createElement(_MediaSourceSelector2.default, props),
        _react2.default.createElement(_FileTree2.default, _extends({}, props, { onCreateDirectory: this.onCreateDirectory.bind(this), onRenameItem: this.onRenameItem.bind(this) })),
        dropArea,
        _react2.default.createElement(_TreeBar2.default, _extends({ onCreateDirectory: this.onCreateDirectory.bind(this) }, props))
      ) : undefined;

      var mediaDirectorySelector = !props.view.sourceTreeOpen ? _react2.default.createElement(_MediaDirectorySelector2.default, props) : undefined;

      var uploadForm = !props.view.sourceTreeOpen && props.config.allowUploads ? _react2.default.createElement(_UploadForm2.default, props) : undefined;

      var pathBar = props.view.focusedMediaItem ? _react2.default.createElement(_PathBar2.default, props) : undefined;

      var unarchivedNotifications = this.props.notifications ? this.props.notifications.filter(function (notification) {
        return !notification.archived;
      }) : [];

      var notificationMessage = function () {
        try {
          return unarchivedNotifications[0];
        } catch (e) {
          return undefined;
        }
      }();

      var notification = notificationMessage ? _react2.default.createElement(_Notification2.default, _extends({ key: notificationMessage.id, onDismiss: this.handleNotificationDismissed }, notificationMessage, props)) : undefined;

      var shouldDisplayChooseBar = function () {
        try {
          if (props.config.callbacks.choose) return true;
        } catch (e) {
          return false;
        }
      }();

      var treeToggle = !_utility2.default.serverSideRendering ? _react2.default.createElement(_TreeToggle2.default, props) : undefined;
      var viewChooser = !_utility2.default.serverSideRendering ? _react2.default.createElement(_ViewChooser2.default, props) : undefined;
      var chooseBar = shouldDisplayChooseBar ? _react2.default.createElement(_ChooseBar2.default, _extends({ ariaHidden: state.modalOpen }, props)) : undefined;
      var enlargeFocusedRows = props.view.enlargeFocusedRows ? ' eureka__enlarge-focused-rows' : '';
      var chooseMultipleClass = props.view.chooseMultiple ? ' eureka__choose-multiple' : '';
      var searchBar = !_utility2.default.serverSideRendering ? _react2.default.createElement(_SearchBar2.default, props) : undefined;
      var serverSideClass = _utility2.default.serverSideRendering ? ' eureka__server-side' : '';
      var chooseRadio = props.config.allowChooseMultiple && !_utility2.default.serverSideRendering ? _react2.default.createElement(_ChooseRadio2.default, { config: props.config, view: props.view, content: props.content, storagePrefix: props.storagePrefix }) : undefined;
      var sortContentsSelector = !_utility2.default.serverSideRendering ? _react2.default.createElement(_SortContents2.default, _extends({}, props, { sort: props.view.sort })) : undefined;
      var formDiv = _react2.default.createElement(
        'div',
        { 'aria-hidden': state.modalOpen, className: classNames({
            "eureka__browse-content": true,
            "eureka__uploading": props.view.isUploading
          }) },
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
                  _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'media.browse', defaultMessage: 'Browse' }),
                  ' '
                ),
                _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'media.contents', defaultMessage: 'Media Content' })
              ),
              chooseRadio,
              searchBar
            ),
            _react2.default.createElement(
              'div',
              { role: 'menubar', className: 'eureka__tree-toggle' },
              treeToggle,
              mediaDirectorySelector,
              sortContentsSelector,
              uploadForm,
              viewChooser
            )
          ),
          _react2.default.createElement(
            'div',
            { className: 'eureka__table-wrapper' },
            _react2.default.createElement(_EurekaTable2.default, _extends({ view: props.view }, props, { decoratedActions: props.decoratedActions, source: props.source, content: props.content, config: props.config, onCropItem: this.onCropItem.bind(this), onRenameItem: this.onRenameItem.bind(this), onSubmit: this.onRenameItemModalSubmit.bind(this) }))
          )
        )
      );

      return _utility2.default.serverSideRendering ? _react2.default.createElement(
        'form',
        { lang: props.lang || undefined, method: 'POST', action: props.config.basePath, encType: 'multipart/form-data', className: 'eureka eureka__view-mode__' + props.view.mode + enlargeFocusedRows + serverSideClass },
        formDiv,
        pathBar,
        chooseBar,
        modal
      ) : _react2.default.createElement(
        'div',
        { onPaste: function onPaste(event) {
            if (event.clipboardData) {
              var items = event.clipboardData.items;
              if (!items || event.target.matches('input') || event.target.matches('textarea')) return;

              //access data directly
              for (var i = 0; i < items.length; i++) {
                if (items[i].type.indexOf("image") !== -1) {
                  //image
                  var blob = items[i].getAsFile();

                  var formData = new FormData();
                  var decoratedActions = props.decoratedActions ? Object.assign({}, _actions2.default, props.decoratedActions) : _actions2.default;
                  formData.append('eureka__uploadFiles', blob, 'paste-image.' + new Date().getTime() + '.png');
                  _store2.default.dispatch(decoratedActions.uploadFiles(props.source.currentSource, props.content.cd, formData, props.config.headers));
                }
              }
            }
          }, lang: props.lang || undefined, className: 'eureka eureka__view-mode__' + props.view.mode + chooseMultipleClass + enlargeFocusedRows + serverSideClass },
        _react2.default.createElement(
          'div',
          { className: classNames({
              "eureka__sticky-bar": this.state.stickyNotifications
            }), 'aria-live': 'assertive', 'aria-relevant': 'additions', 'aria-atomic': 'true', onClick: function onClick(event) {
              event.currentTarget.querySelector('button').click();
            } },
          notification
        ),
        formDiv,
        pathBar,
        chooseBar,
        modal
      );
    }
  }]);

  return Eureka;
}(_react.Component);

var _initialiseProps = function _initialiseProps() {
  var _this6 = this;

  this.handleKeyboardFilter = function (event) {
    //console.log('handleKeyboardFilter', event);
    var root = _this6.getEurekaRoot();
    try {
      root.querySelector('input[name="eureka__filter"]').focus();
    } catch (e) {}
  };

  this.handleKeyboardSortAscending = function (event) {
    event.preventDefault();
    _store2.default.dispatch(_actions2.default.updateView({
      sort: {
        dir: _utility2.default.ASCENDING
      }
    }));
  };

  this.handleNotificationDismissed = function (id) {
    //console.log(`notification ${id} dismiessed`)
    _store2.default.dispatch(_actions2.default.archiveNotification(id));
  };

  this.handleKeyboardSortDescending = function (event) {
    event.preventDefault();
    _store2.default.dispatch(_actions2.default.updateView({
      sort: {
        dir: _utility2.default.DESCENDING
      }
    }));
  };

  this.handleKeyboardSortName = function (event) {
    _store2.default.dispatch(_actions2.default.updateView({
      sort: {
        by: 'filename'
      }
    }));
  };

  this.handleKeyboardSortDimensions = function (event) {
    _store2.default.dispatch(_actions2.default.updateView({
      sort: {
        by: 'dimensions'
      }
    }));
  };

  this.handleKeyboardSortFileSize = function (event) {
    _store2.default.dispatch(_actions2.default.updateView({
      sort: {
        by: 'fileSize'
      }
    }));
  };

  this.handleKeyboardSortEditedOn = function (event) {
    _store2.default.dispatch(_actions2.default.updateView({
      sort: {
        by: 'editedOn'
      }
    }));
  };

  this.handleKeyboardChooseSingle = function (event) {
    _store2.default.dispatch(_actions2.default.updateView({
      chooseMultiple: false
    }));
  };

  this.handleKeyboardChooseMultiple = function (event) {
    _store2.default.dispatch(_actions2.default.updateView({
      chooseMultiple: true
    }));
  };

  this.handleKeyboardToggleInvertSelection = function (event) {
    if (!_this6.props.view.chooseMultiple) return;
    _store2.default.dispatch(_actions2.default.updateView({
      selectionInverted: !_this6.props.view.selectionInverted
    }));
  };

  this.handleKeyboardDeselect = function (event) {
    console.log('handleKeyboardDeselect');

    _store2.default.dispatch(_actions2.default.deselectAll());
  };

  this.toggleSourceTreeOpen = function (event) {
    _store2.default.dispatch(_this6.decoratedActions.updateView({
      sourceTreeOpen: !_this6.props.view.sourceTreeOpen
    }));
  };

  this.handleKeyboardCreateDirectory = function (event) {
    //console.log('handleKeyboardCreateDirectory', event);
    _this6.onCreateDirectory();
  };

  this.handleKeyboardCreateFile = function (event) {
    //console.log('handleKeyboardCreateFile', event);
    try {
      var createFileHander = _this6.props.config.handlers.createFile(_this6.props.source.currentSource, _this6.props.content.cd);
      if (createFileHander.onClick) createFileHander.onClick(_this6.props.source.currentSource, _this6.props.content.cd);else window.open(createFileHander.href);
    } catch (e) {}
  };

  this.handleKeyboardUpload = function (event) {
    //console.log('handleKeyboardUpload', event);
    var root = _this6.getEurekaRoot();

    try {
      root.querySelector('.eureka__drop-area-zone').click();
    } catch (e) {
      root.querySelector('input[name="eureka__uploadFiles"]').click();
    }
  };

  this.handleKeyboardChangeSource = function (event) {
    //console.log('handleKeyboardChangeSource', event);
    var props = _this6.props,
        state = _store2.default.getState(),
        decoratedActions = _this6.decoratedActions,
        sources = state.source.sources;

    var matchedSource = void 0;
    sources.map(function (source) {
      if (('Digit' + source.id).toLowerCase() == event.code.toLowerCase()) matchedSource = source;
    });
    if (matchedSource) {
      props.dispatch(decoratedActions.updateSource(matchedSource.id));
      props.dispatch(decoratedActions.updateSourceTree(matchedSource.id, props.config.headers));
    }
  };

  this.handleKeyboardChangeView = function (event) {
    //console.log('handleKeyboardChangeView', event);
    switch (event.key) {
      case '1':
        _store2.default.dispatch(_this6.decoratedActions.updateView({
          mode: 'table'
        }));
        break;

      case '2':
        _store2.default.dispatch(_this6.decoratedActions.updateView({
          mode: 'thumb'
        }));
        break;

      case '3':
        _store2.default.dispatch(_this6.decoratedActions.updateView({
          mode: 'grid'
        }));
        break;

      case '4':
        _store2.default.dispatch(_this6.decoratedActions.updateView({
          mode: 'list'
        }));
        break;
    }
  };
};

exports.default = Eureka;