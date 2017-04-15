'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

var ASCENDING = 'ascending';
var DESCENDING = 'descending';

function makeURL(str, params) {
  //console.log('makeURL', str, params);
  try {
    var url = new URL(str, window.location.origin); // #janky note: probably need to variabilize baseUrl
    Object.keys(params).forEach(function (key) {
      return url.searchParams.append(key, params[key]);
    });
    return url;
  } catch (e) {
    var url;

    var _ret = function () {
      console.log(e);
      url = str.indexOf('?') > -1 ? str.substr(0, str.indexOf('?')) + '?' : str + '?';

      var ps = [];
      Object.keys(params).forEach(function (key) {
        return ps.push(key + '=' + params[key]);
      });
      url += ps.join('&');
      return {
        v: url
      };
    }();

    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
  }
}

function removeDuplicates(myArr, prop) {
  return myArr.filter(function (obj, pos, arr) {
    return arr.map(function (mapObj) {
      return mapObj[prop];
    }).indexOf(obj[prop]) === pos;
  });
}

function cssSafe(value) {
  value = typeof value === 'string' ? value : '';
  return value.replace(/[^a-z0-9]/g, function (s) {
    var c = s.charCodeAt(0);
    if (c == 32) return '-';
    if (c >= 65 && c <= 90) return s.toLowerCase();
    return '__' + ('000' + c.toString(16)).slice(-4);
  });
};

function wordBreaksEvery(str) {
  var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 8;

  var ret = [];
  var i;
  var len;

  for (i = 0, len = str.length; i < len; i += n) {
    ret.push(str.substr(i, n));
  }

  return ret.map(function (value) {
    return [value, _react2.default.createElement('wbr', null)];
  });
}

function getIconByExtension(ext) {
  switch (ext) {
    case '.jpg':
    case '.jpeg':
    case '.gif':
    case '.png':
    case '.png8':
    case '.png24':
    case '.svg':
    case '.bmp':
    case '.tiff':
      return "file-image-o";
      break;

    case ".pdf":
      return "file-pdf-o";
      break;

    case ".zip":
    case ".tar":
      return "file-archive-o";
      break;

    case ".ppt":
    case ".pot":
    case ".pps":
      return "file-powerpoint-o";
      break;

    case ".doc":
    case ".dot":
    case ".wbk":
    case ".docx":
    case ".docm":
    case ".dotx":
    case ".dotm":
    case ".docb":
      return "file-word-o";
      break;

    case ".xls":
    case ".xlt":
    case ".xlm":
    case ".xlsx":
    case ".xlsm":
    case ".xltx":
    case ".xltm":
    case ".xlsb":
    case ".xla":
    case ".xlam":
    case ".xll":
    case ".xlw":
      return "file-excel-o";
      break;

    case ".txt":
    case ".rtf":
      return "file-text-o";
      break;

    case ".js":
    case ".json":
    case ".html":
    case ".htm":
    case ".css":
    case ".scss":
      return "file-code-o";
      break;

    case '.mp3':
    case '.wav':
    case '.ogg':
    case '.flac':
      return "file-audio-o";
      break;

    case '.webm':
    case '.wbm':
    case '.mp4':
    case '.mov':
      return "file-video-o";
      break;

    default:
      return "file-image-o";
      break;
  }
}

function parseMediaSourceOutOfCombinedPath(path) {
  var delimeter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '||';

  var _path$split = path.split(delimeter),
      _path$split2 = _toArray(_path$split),
      cs = _path$split2[0],
      cd_ = _path$split2.slice(1),
      cd = cd_.join('||');

  return [cs, cd];
}

function contentSort(props, a, b) {
  if (a[props.sort.by] === b[props.sort.by]) return 0;

  var n = void 0;

  //console.log('props.sort.by',props.sort.by,a,b);

  switch (props.sort.by) {
    case 'dimensions':
      n = a.dimensions[0] * a.dimensions[1] > b.dimensions[0] * b.dimensions[1] ? 1 : -1;
      break;

    case 'editedOn':
      n = new Date(a.editedOn).getTime() > new Date(b.editedOn).getTime() ? 1 : -1;
      break;

    default:
      n = a[props.sort.by] > b[props.sort.by] ? 1 : -1;
      break;
  }

  return props.sort.dir === ASCENDING ? n : 0 - n;
}

exports.contentSort = contentSort;

exports.serverSideRendering = function () {
  try {
    return !(document !== undefined);
  } catch (e) {
    return true;
  }
}();

exports.parseMediaSourceOutOfCombinedPath = parseMediaSourceOutOfCombinedPath;

exports.getIconByExtension = getIconByExtension;

exports.makeURL = makeURL;
exports.removeDuplicates = removeDuplicates;

exports.ASCENDING = ASCENDING;
exports.DESCENDING = DESCENDING;

exports.cssSafe = cssSafe;

exports.wordBreaksEvery = wordBreaksEvery;