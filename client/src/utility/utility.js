import React from 'react';

const ASCENDING = 'ascending';
const DESCENDING = 'descending';

function makeURL(str,params) {
  console.log('makeURL', str, params);
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

function removeDuplicates(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
}

function cssSafe (value) {
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

exports.makeURL = makeURL;
exports.removeDuplicates = removeDuplicates;

exports.ASCENDING = ASCENDING;
exports.DESCENDING = DESCENDING;

exports.cssSafe = cssSafe;

exports.wordBreaksEvery = wordBreaksEvery;
