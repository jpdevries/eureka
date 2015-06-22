/* http://stackoverflow.com/a/18078705/4671250 */
class AJAX {
    private x:XMLHttpRequest;

    constructor() {
        this.x = new XMLHttpRequest();
    }
    //send(method:any, url:string, data:any, callback:any, sync:boolean = true, headers = []) {
    send(method:any, url:string, data:any, callback:any, sync:boolean = true, headers = []) {
        var that = this; 
        this.x.open(method, url, sync);
        this.x.onreadystatechange = function() {
            if (that.x.readyState == 4) {
                callback(this.responseText);
            }
        };
        if (method == 'POST') {
            this.x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        }

        if (headers !== undefined && headers !== null && headers.length !== undefined && headers.length) {
            for(var i = 0; i < headers.length; i++) {
                var obj = headers[i];
                for (var key in obj) {
                  if (obj.hasOwnProperty(key)) {
                      this.x.setRequestHeader(key,obj[key]);
                  }
                }
            }
        }
        
        this.x.send(data)
    }
    //get(url:string, data:any, callback:any, sync:boolean = true, headers = []) {
    get(url:string, data:any, callback:any, sync:boolean = true, headers = []) {
        var query = [];
        for (var key in data) {
            query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
        }
        
        this.send('GET', url + ((url.indexOf('?') > 0) ? '&' : '?') + query.join('&'), null, callback, sync, headers);
    }
    post(url:string, data:any, callback:any, sync:boolean = true) {
        var query = [];
        for (var key in data) {
            query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
        }
        //    send(method:any, url:string, data:any, callback:any, sync:boolean = true, headers = []) {
        this.send('POST', url, query.join('&'), callback, sync, (data.headers !== undefined ? data.headers : null))
    }
    setHeaders(headers) {
        var that = this;
        
        for(var i = 0; i < headers.length; i++) {
            var obj = headers[i];
            for (var key in obj) {
              if (obj.hasOwnProperty(key)) {
                  this.x.setRequestHeader(key,obj[key]);
              }
            }
        }
    }
}