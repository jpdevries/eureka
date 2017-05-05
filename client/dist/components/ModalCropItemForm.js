'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _Icon = require('./Icon');

var _Icon2 = _interopRequireDefault(_Icon);

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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var pathParse = require('path-parse');

var CropperJS = function () {
  try {
    return require('react-cropperjs');
  } catch (e) {
    return undefined;
  }
}();

var SAVE_AS = 'save_as';

var ModalCropItemForm = function (_Component) {
  _inherits(ModalCropItemForm, _Component);

  function ModalCropItemForm(props) {
    _classCallCheck(this, ModalCropItemForm);

    var _this = _possibleConstructorReturn(this, (ModalCropItemForm.__proto__ || Object.getPrototypeOf(ModalCropItemForm)).call(this, props));

    _initialiseProps.call(_this);

    _this.state = {
      disabled: false,
      crop: {},
      guides: true,
      dragMode: 'crop',
      cropData: undefined,
      showFormControls: props.view.showAdvControls,
      mode: undefined,
      saveAs: undefined,
      saveAsPlaceholder: undefined,
      doSaveAs: false,
      saveAsDirty: true,
      cropAspectRatio: props.view.rememberAspectRatio && props.view.cropAspectRatio !== undefined ? props.view.cropAspectRatio : NaN
      //rememberAspectRatio:false
    };

    _this.decoratedActions = props.decoratedActions ? Object.assign({}, _actions2.default, props.decoratedActions) : _actions2.default;

    return _this;
  }

  _createClass(ModalCropItemForm, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _pathParse = pathParse(this.props.item.filename),
          name = _pathParse.name,
          ext = _pathParse.ext;

      this.name = name;
      this.ext = ext;
      //this.refs.input.focus(); // simulate HTML5 autofocus

      this.saveAsPlaceholder = name + '_crop' + ext;
      this.setState({
        saveAs: this.saveAsPlaceholder,
        saveAsPlaceholder: this.saveAsPlaceholder
      });

      this.img = document.querySelector('tr[id="' + _utility2.default.cssSafe(this.props.item.filename) + '"]').querySelector('img');
      this.modal = document.querySelector('.eureka__crop-modal');
    }
  }, {
    key: 'componentWillUpdate',
    value: function componentWillUpdate() {
      //this.setDownloadDataURL();
      /**/
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      //this.cropper.destroy();
    }
  }, {
    key: '_crop',
    value: function _crop(event) {
      // image in dataUrl
      console.log(event.detail);
      var saveAsPlaceholder = this.name + '_crop' + Math.round(event.detail.width) + 'x' + Math.round(event.detail.height) + this.ext;
      this.setState({
        crop: event.detail,
        cropData: this.cropper.getData(),
        saveAsPlaceholder: this.name + '_crop' + Math.round(event.detail.width) + 'x' + Math.round(event.detail.height) + this.ext,
        saveAs: this.state.saveAsDirty ? saveAsPlaceholder : this.state.saveAs
      });
      //this.img.setAttribute('src', this.cropper.getCroppedCanvas().toDataURL());


      //ctx.filter = 'blur(5px)';
      //console.log(this.cropper.getCroppedCanvas().toDataURL());
    }
  }, {
    key: 'setDownloadDataURL',
    value: function setDownloadDataURL() {
      var _this2 = this;

      var canvas = this.cropper.getCroppedCanvas();
      var mimeType = undefined;

      switch (pathParse(this.props.item.filename).ext) {
        case '.jpg':
        case '.jpeg':
          mimeType = 'image/jpeg';
          break;
      }
      canvas.toBlob(function (blob) {
        _this2.setState({
          //dataURL: this.cropper.getCroppedCanvas().toDataURL(mimeType).toString()
          dataURL: window.URL.createObjectURL(blob),
          cropData: _this2.cropper.getData()
        });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this,
          _React$createElement;

      //console.log('ModalCropitemForm render')
      var state = this.state;
      var props = this.props;

      var formatMessage = props.intl.formatMessage;
      var saveAsBtn = this.state.mode !== SAVE_AS ? _react2.default.createElement(
        'button',
        { type: 'submit', onClick: function onClick(event) {
            _this3.setState({
              'mode': SAVE_AS,
              doSaveAs: true
            });
            //this.saveAsName.focus();
          }, disabled: false },
        _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'cropAs', defaultMessage: 'Crop As\u2026' })
      ) : undefined;
      var cropBtn = _react2.default.createElement(
        'button',
        { type: 'submit', onBlur: function onBlur(event) {// <span className="spinner"><Icon {...props} icon="circle-o-notch" /></span>
            //this.refs.input.focus();
          }, disabled: false },
        _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'crop', defaultMessage: 'Crop' })
      );
      var saveAsForm = this.state.mode === SAVE_AS ? _react2.default.createElement(
        'div',
        { className: 'eureka__crop-as' },
        _react2.default.createElement(
          'div',
          { className: 'flex-bar' },
          _react2.default.createElement(
            'label',
            { htmlFor: 'eureka__crop-save-as-name' },
            _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'saveAs', defaultMessage: 'Save As' })
          ),
          _react2.default.createElement('input', { onFocus: function onFocus(event) {
              event.target.setSelectionRange(0, event.target.value.length);
            }, autoFocus: true, ref: function ref(saveAsName) {
              return _this3.saveAsName = saveAsName;
            }, id: 'eureka__crop-save-as-name', name: 'eureka__crop-save-as-name', style: { width: 'auto' }, type: 'text', placeholder: this.state.saveAsPlaceholder, value: this.state.saveAs, onChange: function onChange(event) {
              _this3.setState({
                saveAs: event.target.value,
                saveAsDirty: false
              });
            } }),
          _react2.default.createElement(
            'div',
            { className: 'eureka__crop-save-as-checkbox' },
            _react2.default.createElement('input', { 'aria-label': formatMessage(_definedMessages2.default.saveAsItem, { item: this.state.saveAs }), type: 'checkbox', id: 'eureka__crop-save-as', name: 'eureka__crop-save-as', checked: this.state.doSaveAs, onChange: function onChange(event) {
                _this3.setState({
                  doSaveAs: event.target.checked
                });
              } })
          )
        )
      ) : undefined;
      /*
      <label htmlFor="eureka__crop-scaleX">scaleX <input id="eureka__crop-scaleX" name="scaleX" type="number" size="5" min="0" step=".25" value={(this.state.crop.scaleX)} onChange={(event) => {
        this.cropper.setData(Object.assign({}, this.state.crop, {
          scaleX: parseFloat(event.target.value)
        }));
      }} /> </label>
      <label htmlFor="eureka__crop-scaleY">scaleY <input id="eureka__crop-scaleY" name="scaleY" type="number" size="5" min="0" step=".25" value={(this.state.crop.scaleY)} onChange={(event) => {
        this.cropper.setData(Object.assign({}, this.state.crop, {
          scaleY: parseFloat(event.target.value)
        }));
      }} /> </label>
      */

      return _react2.default.createElement(
        'div',
        { onChange: function onChange(event) {
            _this3.setDownloadDataURL();
          } },
        _react2.default.createElement(
          'label',
          { htmlFor: 'eureka__crop_show-adv-controls' },
          _react2.default.createElement('input', { id: 'eureka__crop_show-adv-controls', name: 'eureka__crop_show-adv-controls', type: 'checkbox', onChange: function onChange(event) {
              _this3.setState({
                showFormControls: event.target.checked
              });
              _store2.default.dispatch(_actions2.default.updateView({
                showAdvControls: event.target.checked
              }));
            }, checked: this.state.showFormControls, value: 'yes' }),
          '\u2002',
          _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'showAdvControls', defaultMessage: 'Show Advanced Controls' })
        ),
        _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(CropperJS, {
            data: this.state.cropData,
            key: 'cropper_' + (this.state.guides ? 'guides' : '') + '_' + this.state.dragMode,
            ref: function ref(cropper) {
              _this3.cropper = cropper;
            },
            src: props.view.focusedMediaItem.absoluteURL,
            style: { height: window.innerHeight - 300, width: '100%' }
            // Cropper.js options
            , aspectRatio: this.state.cropAspectRatio,
            guides: this.state.guides,
            dragMode: this.state.dragMode,
            crop: this._crop.bind(this),
            cropend: this.cropend,
            ready: this.ready,
            zoomOnWheel: props.config.zoomOnWheel
          })
        ),
        _react2.default.createElement(
          'div',
          { className: 'balanced flex-bar', hidden: !this.state.showFormControls },
          _react2.default.createElement(
            'form',
            null,
            _react2.default.createElement(
              'fieldset',
              null,
              _react2.default.createElement(
                'legend',
                { className: 'visually-hidden' },
                _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'dragMode', defaultMessage: 'Drag Mode' })
              ),
              _react2.default.createElement(
                'div',
                { className: 'icon-bar flex-bar' },
                _react2.default.createElement('input', { onChange: function onChange(event) {
                    _this3.setState({
                      dragMode: event.target.value,
                      cropData: _this3.cropper.getData()
                    });
                  }, id: 'eureka__crop-drag-mode-move', name: 'eureka__crop-drag-mode', className: 'visually-hidden', type: 'radio', value: 'move', checked: this.state.dragMode == 'move' }),
                _react2.default.createElement(
                  'label',
                  { htmlFor: 'eureka__crop-drag-mode-move', className: 'button', title: formatMessage(_definedMessages2.default['cropMove']) },
                  _react2.default.createElement(
                    'span',
                    { className: 'visually-hidden' },
                    _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'crop.move', defaultMessage: 'Move' })
                  ),
                  _react2.default.createElement(_Icon2.default, _extends({}, props, { icon: 'arrows' }))
                ),
                _react2.default.createElement('input', { onChange: function onChange(event) {
                    _this3.setState({
                      dragMode: event.target.value,
                      cropData: _this3.cropper.getData()
                    });
                  }, id: 'eureka__crop-drag-mode-crop', name: 'eureka__crop-drag-mode', className: 'visually-hidden', type: 'radio', value: 'crop', checked: this.state.dragMode == 'crop' }),
                _react2.default.createElement(
                  'label',
                  { htmlFor: 'eureka__crop-drag-mode-crop', className: 'button', title: formatMessage(_definedMessages2.default['crop']) },
                  _react2.default.createElement(
                    'span',
                    { className: 'visually-hidden' },
                    _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'crop', defaultMessage: 'Crop' })
                  ),
                  _react2.default.createElement(_Icon2.default, _extends({}, props, { icon: 'crop' }))
                )
              )
            )
          ),
          _react2.default.createElement(
            'div',
            { className: 'icon-bar flex-bar' },
            _react2.default.createElement(
              'button',
              { 'aria-pressed': this.state.guides, onClick: function onClick(event) {
                  _this3.setState({
                    guides: !_this3.state.guides,
                    cropData: _this3.cropper.getData()
                  });
                }, title: formatMessage(_definedMessages2.default['cropToggleGuides']) },
              _react2.default.createElement(
                'span',
                { className: 'visually-hidden' },
                _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'crop.showGuides', defaultMessage: 'Show Guides' })
              ),
              _react2.default.createElement(_Icon2.default, _extends({}, props, { icon: 'table' }))
            )
          ),
          _react2.default.createElement(
            'div',
            { className: 'icon-bar flex-bar' },
            _react2.default.createElement(
              'button',
              { onClick: function onClick(event) {
                  _this3.cropper.zoom(.1);
                }, title: formatMessage(_definedMessages2.default['cropZoomIn']) },
              _react2.default.createElement(
                'span',
                { className: 'visually-hidden' },
                _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'crop.zoomIn', defaultMessage: 'Zoom In' })
              ),
              _react2.default.createElement(_Icon2.default, _extends({}, props, { icon: 'search-plus' }))
            ),
            _react2.default.createElement(
              'button',
              { onClick: function onClick(event) {
                  _this3.cropper.zoom(-.1);
                }, title: formatMessage(_definedMessages2.default['cropZoomOut']) },
              _react2.default.createElement(
                'span',
                { className: 'visually-hidden' },
                _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'crop.zoomOut', defaultMessage: 'Zoom Out' })
              ),
              _react2.default.createElement(_Icon2.default, _extends({}, props, { icon: 'search-minus' }))
            )
          ),
          _react2.default.createElement(
            'div',
            { className: 'icon-bar flex-bar' },
            _react2.default.createElement(
              'button',
              { onClick: function onClick(event) {
                  _this3.cropper.move(-1, 0);
                }, title: formatMessage(_definedMessages2.default['cropMoveLeft']) },
              _react2.default.createElement(
                'span',
                { className: 'visually-hidden' },
                _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'crop.moveLeft', defaultMessage: 'Move Left' })
              ),
              _react2.default.createElement(_Icon2.default, _extends({}, props, { icon: 'arrow-left' }))
            ),
            _react2.default.createElement(
              'button',
              { onClick: function onClick(event) {
                  _this3.cropper.move(1, 0);
                }, title: formatMessage(_definedMessages2.default['cropMoveRight']) },
              _react2.default.createElement(
                'span',
                { className: 'visually-hidden' },
                _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'crop.moveRight', defaultMessage: 'Move Right' })
              ),
              _react2.default.createElement(_Icon2.default, _extends({}, props, { icon: 'arrow-right' }))
            ),
            _react2.default.createElement(
              'button',
              { onClick: function onClick(event) {
                  _this3.cropper.move(0, 1);
                }, title: formatMessage(_definedMessages2.default['cropMoveUp']) },
              _react2.default.createElement(
                'span',
                { className: 'visually-hidden' },
                _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'crop.moveUp', defaultMessage: 'Move Up' })
              ),
              _react2.default.createElement(_Icon2.default, _extends({}, props, { icon: 'arrow-up' }))
            ),
            _react2.default.createElement(
              'button',
              { onClick: function onClick(event) {
                  _this3.cropper.move(0, -1);
                }, title: formatMessage(_definedMessages2.default['cropMoveDown']) },
              _react2.default.createElement(
                'span',
                { className: 'visually-hidden' },
                _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'crop.moveDown', defaultMessage: 'Move Down' })
              ),
              _react2.default.createElement(_Icon2.default, _extends({}, props, { icon: 'arrow-down' }))
            )
          ),
          _react2.default.createElement(
            'div',
            { className: 'icon-bar flex-bar' },
            _react2.default.createElement(
              'a',
              { href: this.state.dataURL, className: 'button', download: props.item.filename, title: formatMessage(_definedMessages2.default['cropDownload']) },
              _react2.default.createElement(
                'span',
                { className: 'visually-hidden' },
                _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'crop.download', defaultMessage: 'Download Cropped Image' })
              ),
              _react2.default.createElement(_Icon2.default, _extends({}, props, { icon: 'download' }))
            ),
            _react2.default.createElement(
              'form',
              { className: 'button', ref: function ref(imageUploadForm) {
                  _this3.imageUploadForm = imageUploadForm;
                }, onSubmit: function onSubmit(event) {
                  event.preventDefault();

                  var files = _this3.uploadFile.files;
                  var file = void 0;
                  var uploadedImageURL = void 0;

                  var URL = window.URL || window.webkitURL;

                  if (files && files.length) {
                    file = files[0];
                    uploadedImageURL = URL.createObjectURL(file);
                    _this3.cropper.replace(uploadedImageURL);
                    //URL.revokeObjectURL(uploadedImageURL);
                  }

                  _this3.setState({
                    uploadedImageURL: uploadedImageURL,
                    cropData: _this3.cropper.getData()
                  });
                } },
              _react2.default.createElement(
                'label',
                { htmlFor: 'eureka__crop-upload-file', title: formatMessage(_definedMessages2.default['cropUploadImage']) },
                _react2.default.createElement(_Icon2.default, _extends({}, props, { icon: 'upload' })),
                _react2.default.createElement(
                  'span',
                  { className: 'visually-hidden' },
                  _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'crop.uploadImage', defaultMessage: 'Upload Image' })
                )
              ),
              _react2.default.createElement('input', { required: true, className: (0, _classnames2.default)({
                  'visually-hidden': props.config.autoSubmitForms
                }), onChange: props.config.autoSubmitForms ? function (event) {
                  _this3.submitButton.click();
                } : undefined, ref: function ref(uploadFile) {
                  _this3.uploadFile = uploadFile;
                }, type: 'file', multiple: 'multiple', name: 'eureka__crop-upload-file', id: 'eureka__crop-upload-file' }),
              _react2.default.createElement(
                'button',
                { hidden: props.config.autoSubmitForms, ref: function ref(submitButton) {
                    _this3.submitButton = submitButton;
                  }, type: 'submit' },
                _react2.default.createElement(
                  'span',
                  { className: 'visually-hidden' },
                  _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'crop.uploadImage', defaultMessage: 'Upload Image' })
                )
              )
            )
          )
        ),
        _react2.default.createElement(
          'form',
          { onReset: function onReset(event) {
              _this3.setDownloadDataURL();
            }, onSubmit: this.onSubmit },
          _react2.default.createElement(
            'div',
            { hidden: !this.state.showFormControls, className: 'wrappable flex-bar' },
            _react2.default.createElement(
              'fieldset',
              { className: 'eureka__crop-bounding-box' },
              _react2.default.createElement(
                'details',
                { open: true },
                _react2.default.createElement(
                  'summary',
                  null,
                  _react2.default.createElement(
                    'legend',
                    null,
                    _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'crop.boundingBox', defaultMessage: 'Bounding Box (px)' })
                  )
                ),
                _react2.default.createElement(
                  'div',
                  null,
                  _react2.default.createElement(
                    'label',
                    { htmlFor: 'eureka__crop-x' },
                    _react2.default.createElement(
                      'span',
                      { className: 'visually-hidden' },
                      _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'crop.X', defaultMessage: 'X' })
                    ),
                    ' ',
                    _react2.default.createElement('input', { id: 'eureka__crop-x', name: 'x', type: 'number', size: '5', value: Math.round(this.state.crop.x), onChange: function onChange(event) {
                        //this.cropper.moveTo(this.state.crop.x, this.state.crop.y)
                        _this3.cropper.setData(Object.assign({}, _this3.state.crop, {
                          x: parseInt(event.target.value)
                        }));
                      } }),
                    ' '
                  ),
                  _react2.default.createElement(
                    'label',
                    { htmlFor: 'eureka__crop-y' },
                    _react2.default.createElement(
                      'span',
                      { className: 'visually-hidden' },
                      _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'crop.Y', defaultMessage: 'Y' })
                    ),
                    ' ',
                    _react2.default.createElement('input', { id: 'eureka__crop-y', name: 'y', type: 'number', size: '5', value: Math.round(this.state.crop.y), onChange: function onChange(event) {
                        _this3.cropper.setData(Object.assign({}, _this3.state.crop, {
                          y: parseInt(event.target.value)
                        }));
                      } }),
                    ' '
                  ),
                  _react2.default.createElement(
                    'label',
                    { htmlFor: 'eureka__crop-width' },
                    _react2.default.createElement(
                      'span',
                      { className: 'visually-hidden' },
                      _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'crop.width', defaultMessage: 'Width' })
                    ),
                    ' ',
                    _react2.default.createElement('input', { id: 'eureka__crop-width', name: 'width', type: 'number', size: '5', value: Math.round(this.state.crop.width), onChange: function onChange(event) {
                        _this3.cropper.setData(Object.assign({}, _this3.state.crop, {
                          width: parseInt(event.target.value)
                        }));
                      } }),
                    ' '
                  ),
                  _react2.default.createElement(
                    'label',
                    { htmlFor: 'eureka__crop-height' },
                    _react2.default.createElement(
                      'span',
                      { className: 'visually-hidden' },
                      _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'crop.height', defaultMessage: 'Height' })
                    ),
                    ' ',
                    _react2.default.createElement('input', { id: 'eureka__crop-height', name: 'height', type: 'number', size: '5', value: Math.round(this.state.crop.height), onChange: function onChange(event) {
                        _this3.cropper.setData(Object.assign({}, _this3.state.crop, {
                          height: parseInt(event.target.value)
                        }));
                      } }),
                    ' '
                  )
                )
              )
            ),
            _react2.default.createElement(
              'fieldset',
              { className: 'eureka__crop-bounding-box' },
              _react2.default.createElement(
                'details',
                { open: true },
                _react2.default.createElement(
                  'summary',
                  null,
                  _react2.default.createElement(
                    'legend',
                    { id: 'eureka__crop-aspect-ratio-label' },
                    _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'crop.aspectRatio', defaultMessage: 'Aspect Ratio' })
                  )
                ),
                _react2.default.createElement(
                  'div',
                  null,
                  _react2.default.createElement(
                    'select',
                    { value: this.state.cropAspectRatio, 'aria-labelledby': 'eureka__crop-aspect-ratio-label', name: 'eureka__crop-aspect-ratio', id: 'eureka__crop-aspect-ratio', onChange: function onChange(event) {
                        _this3.cropper.setAspectRatio(event.target.value ? parseFloat(event.target.value) : NaN);
                        _this3.setState({
                          cropAspectRatio: event.target.value
                        });
                        if (_this3.props.view.rememberAspectRatio && _this3.props.view.cropAspectRatio != event.target.value) _store2.default.dispatch(_actions2.default.updateView({
                          cropAspectRatio: event.target.value
                        }));
                      } },
                    _react2.default.createElement(
                      'option',
                      { value: '' },
                      _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'crop.free', defaultMessage: 'Free' })
                    ),
                    _react2.default.createElement(
                      'option',
                      { value: 16 / 9 },
                      '16:9'
                    ),
                    _react2.default.createElement(
                      'option',
                      { value: 4 / 3 },
                      '4:3'
                    ),
                    _react2.default.createElement(
                      'option',
                      { value: 1 },
                      '1:1'
                    ),
                    _react2.default.createElement(
                      'option',
                      { value: 2 / 3 },
                      '2:3'
                    )
                  ),
                  _react2.default.createElement(
                    'label',
                    { htmlFor: 'eureka__crop-aspect-ratio-remember' },
                    _react2.default.createElement('input', { type: 'checkbox', id: 'eureka__crop-aspect-ratio-remember', name: 'eureka__crop-aspect-ratio-remember', checked: this.props.view.rememberAspectRatio, onChange: function onChange(event) {
                        _store2.default.dispatch(_actions2.default.updateView({
                          rememberAspectRatio: event.target.checked,
                          cropAspectRatio: event.target.checked ? _this3.state.cropAspectRatio : _this3.props.view.cropAspectRatio
                        }));
                      } }),
                    '\u2002',
                    _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'rememberAspectRatio', defaultMessage: 'Remember Ratio' })
                  )
                )
              )
            ),
            _react2.default.createElement(
              'fieldset',
              { className: 'eureka__crop-bounding-box' },
              _react2.default.createElement(
                'details',
                { open: true },
                _react2.default.createElement(
                  'summary',
                  null,
                  _react2.default.createElement(
                    'legend',
                    null,
                    _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'crop.scaleRotate', defaultMessage: 'Scale & Rotate' })
                  )
                ),
                _react2.default.createElement(
                  'div',
                  null,
                  _react2.default.createElement(
                    'label',
                    { htmlFor: 'eureka__crop-rotate' },
                    _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'crop.rotate', defaultMessage: 'Rotate' })
                  ),
                  _react2.default.createElement('input', (_React$createElement = { list: 'eureka__crop-rotate-list', id: 'eureka__crop-rotate', name: 'rotate', type: 'range', min: '-180', max: '180', step: '1', value: '0' }, _defineProperty(_React$createElement, 'value', Math.round(this.state.crop.rotate)), _defineProperty(_React$createElement, 'onChange', function onChange(event) {
                    _this3.cropper.setData(Object.assign({}, _this3.state.crop, {
                      rotate: parseInt(event.target.value)
                    }));
                  }), _React$createElement)),
                  _react2.default.createElement(
                    'label',
                    { htmlFor: 'eureka__crop-scale' },
                    _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'crop.scale', defaultMessage: 'Scale' }),
                    ' ',
                    _react2.default.createElement('input', { id: 'eureka__crop-scale', name: 'scale', type: 'number', size: '5', min: '0', step: '.125', value: this.state.crop.scaleX, onChange: function onChange(event) {
                        _this3.cropper.setData(Object.assign({}, _this3.state.crop, {
                          scaleX: parseFloat(event.target.value),
                          scaleY: parseFloat(event.target.value)
                        }));
                      } }),
                    ' '
                  ),
                  _react2.default.createElement(
                    'datalist',
                    { id: 'eureka__crop-rotate-list' },
                    _react2.default.createElement('option', { value: '-180' }),
                    _react2.default.createElement('option', { value: '-90' }),
                    _react2.default.createElement('option', { value: '0' }),
                    _react2.default.createElement('option', { value: '90' }),
                    _react2.default.createElement('option', { value: '180' })
                  )
                )
              )
            )
          ),
          _react2.default.createElement(
            'div',
            { className: 'eureka__button-bar flex-bar' },
            _react2.default.createElement(
              'button',
              { onBlur: function onBlur(event) {
                  if (state.createDirectory) return;
                  _this3.refs.input.focus();
                }, onClick: props.onCancel },
              _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'cancel', defaultMessage: 'Cancel' }),
              ' ',
              _react2.default.createElement(
                'span',
                { className: 'visually-hidden' },
                ' ',
                _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'directory.cancelCreating', defaultMessage: 'Cancel creating directory {cd}', value: {
                    cd: state.createDirectory
                  }, values: {
                    state: state
                  } })
              )
            ),
            _react2.default.createElement(
              'button',
              { className: 'dangerous', hidden: !this.state.showFormControls, type: 'reset', onClick: function onClick(event) {
                  _this3.cropper.reset();
                } },
              _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'reset', defaultMessage: 'Reset' }),
              ' '
            ),
            saveAsBtn,
            saveAsForm,
            cropBtn
          )
        )
      );
    }
  }]);

  return ModalCropItemForm;
}(_react.Component);

var _initialiseProps = function _initialiseProps() {
  var _this4 = this;

  this.cropend = function (event) {
    console.log('cropend');
    _this4.setDownloadDataURL();
    //document.querySelector('.eureka__crop-modal a[download]').setAttribute('href', this.cropper.getCroppedCanvas().toDataURL());
  };

  this.ready = function (event) {
    //console.log('ready');
    _this4.setDownloadDataURL();

    if (_this4.state.uploadedImageURL) {
      URL.revokeObjectURL(_this4.state.uploadedImageURL);
      _this4.setState({
        uploadedImageURL: undefined,
        cropData: _this4.cropper.getData()
      });
    }
  };

  this.onSubmit = function (event) {
    var props = _this4.props;
    event.preventDefault();

    _store2.default.dispatch(_actions2.default.updateView({
      isCropping: true
    }));
    _this4.setState({ disabled: true });

    var canvas = _this4.cropper.getCroppedCanvas();
    //this.img.setAttribute('src', this.cropper.getCroppedCanvas().toDataURL());
    //store.dispatch(decoratedActions.uploadFiles(props.source.currentSource, props.content.cd, formData, props.config.headers))

    canvas.toBlob(function (blob) {
      var formData = new FormData();
      formData.append('eureka__uploadFiles', blob, _this4.state.doSaveAs ? _this4.state.saveAs : _this4.props.item.filename);

      _store2.default.dispatch(_this4.decoratedActions.uploadFiles(props.source.currentSource, props.content.cd, formData, props.config.headers)).then(function () {
        if (!_this4.state.doSaveAs) _this4.img.setAttribute('src', _this4.cropper.getCroppedCanvas().toDataURL());
        _store2.default.dispatch(_actions2.default.updateContent({ // fetch new stuff from server, will trigger a re-render if needed
          cd: props.content.cd
        }));
        props.onCancel(); // all done, close the model
      }).catch(function (err) {
        return console.log(err);
      });
    });
  };
};

exports.default = ModalCropItemForm;