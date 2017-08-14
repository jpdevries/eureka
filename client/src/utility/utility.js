import React from 'react';

const ASCENDING = 'ascending';
const DESCENDING = 'descending';

function makeURL(str,params) {
  //console.log('makeURL', str, params);
  try {
    var url = new URL(str, window.location.origin); // #janky note: probably need to variabilize baseUrl
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    return url;
  } catch(e) {
    console.log(e);
    var url = (str.indexOf('?') > -1) ? `${str.substr(0, str.indexOf('?'))}?` : `${str}?`;
    let ps = [];
    Object.keys(params).forEach(key => ps.push(`${key}=${params[key]}`) );
    url += ps.join('&');
    return url;
  }
}

const dblTouchTapMaxDelay = 300;
let latestTouchTap = {
  time: 0,
  target: null,
}

function isDblTouchTap(event) {
  const touchTap = {
    time: new Date().getTime(),
    target: event.currentTarget,
  }
  const isFastDblTouchTap = (
    touchTap.target === latestTouchTap.target &&
    touchTap.time - latestTouchTap.time < dblTouchTapMaxDelay
  )
  latestTouchTap = touchTap
  return isFastDblTouchTap
}

function removeDuplicates(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
}

function cssSafe(value) {
  value = typeof value === 'string' ? value : '';
  return value.replace(/[^a-z0-9]/g, function(s) {
    var c = s.charCodeAt(0);
    if (c == 32) return '-';
    if (c >= 65 && c <= 90) return s.toLowerCase();
    return '__' + ('000' + c.toString(16)).slice(-4);
  });
};

function wordBreaksEvery(str,n = 8) {
  var ret = [];
  var i;
  var len;

  for(i = 0, len = str.length; i < len; i += n) {
     ret.push(str.substr(i, n))
  }

  return ret.map((value) => (
    [value, (<wbr />)]
  ));

}

function getIconByExtension(ext) {
  switch(ext) {
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

function parseMediaSourceOutOfCombinedPath(path, delimeter = '||') {
  const [cs, ...cd_] = path.split(delimeter),
  cd = cd_.join('||');

  return [cs, cd];
}

function contentSort(props, a, b) {
  if(a[props.sort.by] === b[props.sort.by]) return 0;

  let n;

  //console.log('props.sort.by',props.sort.by,a,b);

  switch(props.sort.by) {
    case 'dimensions':
    try {
      n = a.dimensions[0] * a.dimensions[1] > b.dimensions[0] * b.dimensions[1] ? 1 : -1;
    } catch (e) {
      console.log(e);
    }
    break;

    case 'editedOn':
    n = new Date(a.editedOn).getTime() > new Date(b.editedOn).getTime() ? 1 : -1;
    break;

    default:
    n = (a[props.sort.by] > b[props.sort.by]) ? 1 : -1;
    break;
  }

  return (props.sort.dir === ASCENDING) ? n : 0-n;
}

exports.contentSort = contentSort;

exports.serverSideRendering = (function(){
  try {
    return !(document !== undefined)
  } catch(e) {
    return true;
  }
})();

/*function notify(message, options = {
  //icon: 'http://localhost:3000/assets/img/src/png/trash-o.png'
}) {
  // Let's check if the browser supports notifications
  if (!("Notification" in window)) {
    //alert(message);
  }

  // Let's check whether notification permissions have already been granted
  else if (Notification.permission === "granted") {
    // If it's okay let's create a notification
    var notification = new Notification(message, options);
  }

  // Otherwise, we need to ask the user for permission
  else if (Notification.permission !== "denied") {
    Notification.requestPermission(function (permission) {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        var notification = new Notification(message, options);
      } else {
        alert(message);
      }
    });
  }

  // At last, if the user has denied notifications, and you
  // want to be respectful there is no need to bother them any more.
}*/

function runPrefixMethod(obj, method) {
    console.log('runPrefixMethod');
    var pfx = ["webkit", "moz", "ms", "o", ""];
    var p = 0, m, t;
    while (p < pfx.length && !obj[m]) {
        m = method;
        if (pfx[p] == "") {
            m = m.substr(0,1).toLowerCase() + m.substr(1);
        }
        m = pfx[p] + m;
        t = typeof obj[m];
        if (t != "undefined") {
            pfx = [pfx[p]];
            return (t == "function" ? obj[m]() : obj[m]);
        }
        p++;
    }
}

exports.parseMediaSourceOutOfCombinedPath = parseMediaSourceOutOfCombinedPath;

exports.getIconByExtension = getIconByExtension;

exports.makeURL = makeURL;
exports.removeDuplicates = removeDuplicates;

exports.ASCENDING = ASCENDING;
exports.DESCENDING = DESCENDING;

exports.cssSafe = cssSafe;

exports.isDblTouchTap = isDblTouchTap;

exports.wordBreaksEvery = wordBreaksEvery;

//exports.notify = notify;

exports.runPrefixMethod = runPrefixMethod;

exports.DANGEROUS = 'dangerous';
