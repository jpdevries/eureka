/// <reference path="../ajax.d.ts" />
importScripts("includes.js");
self.addEventListener('message', function (e) {
    var data = e.data;
    var ajax = new AJAX();
    ajax.get(data.listSourcesRequestURL, {}, function (data) {
        self.postMessage(JSON.parse(data));
    }, true, data.headers);
}, false);
//# sourceMappingURL=listsources.js.map