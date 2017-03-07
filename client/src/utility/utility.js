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

exports.makeURL = makeURL;
exports.removeDuplicates = removeDuplicates;

exports.ASCENDING = ASCENDING;
exports.DESCENDING = DESCENDING;

