var AJAX = (function () {
    function AJAX() {
        this.x = new XMLHttpRequest();
    }
    AJAX.prototype.send = function (method, url, data, callback, sync, headers) {
        if (sync === void 0) { sync = true; }
        if (headers === void 0) { headers = []; }
        var that = this;
        this.x.open(method, url, sync);
        this.x.onreadystatechange = function () {
            if (that.x.readyState == 4) {
                callback(this.responseText);
            }
        };
        if (method == 'POST') {
            this.x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        }
        if (headers !== undefined && headers !== null && headers.length !== undefined && headers.length) {
            for (var i = 0; i < headers.length; i++) {
                var obj = headers[i];
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        this.x.setRequestHeader(key, obj[key]);
                    }
                }
            }
        }
        this.x.send(data);
    };
    AJAX.prototype.get = function (url, data, callback, sync, headers) {
        if (sync === void 0) { sync = true; }
        if (headers === void 0) { headers = []; }
        var query = [];
        for (var key in data) {
            query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
        }
        this.send('GET', url + ((url.indexOf('?') > 0) ? '&' : '?') + query.join('&'), null, callback, sync, headers);
    };
    AJAX.prototype.post = function (url, data, callback, sync) {
        if (sync === void 0) { sync = true; }
        var query = [];
        for (var key in data) {
            query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
        }
        this.send('POST', url, query.join('&'), callback, sync, (data.headers !== undefined ? data.headers : null));
    };
    AJAX.prototype.setHeaders = function (headers) {
        var that = this;
        for (var i = 0; i < headers.length; i++) {
            var obj = headers[i];
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    this.x.setRequestHeader(key, obj[key]);
                }
            }
        }
    };
    return AJAX;
})();
//# sourceMappingURL=includes.js.map