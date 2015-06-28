/// <reference path="../ajax.d.ts" />

importScripts("includes.js");

self.addEventListener('message',function(e){
    var data = e.data;

    var ajax = new AJAX();
    ajax.get(
        data.listSourceRequestURL,
        { s: data.currentMediaSource },
        function (data) {
            (<any>self).postMessage(JSON.parse(data));
        },
        true,
        data.headers
    );
}, false);