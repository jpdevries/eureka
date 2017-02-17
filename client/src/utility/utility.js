function makeURL(str,params) {
  try {
    var url = new URL(str);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    return url;
  } catch(e) {
    var url = (str.indexOf('?') > -1) ? `${str.substr(0, str.indexOf('?'))}?` : `${str}?`;
    Object.keys(params).forEach(key => url += `${key}=${params[key]}` );
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