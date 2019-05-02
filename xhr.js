let xhr = (function(){
    var _ = _,
        xhrCtor = null;

    function createXhr(verb, headers, path){
        var xhr = new xhrCtor();
        xhr.open(verb, path);
        for(var header in headers){
            xhr.setRequestHeader(header, headers[header]);
        }
        return xhr;
    }

    function doBodyVerb(_settings, verb, data, headers, path){
        if(_.isString(headers) && _.isUndefined(path)){
            path = headers;
            headers = _settings.headers;
        }
        headers = _.extend(_settings.headers, headers);    
        return new Promise((resolve, reject) => {
            var xhr = createXhr(verb, headers, path);
            xhr.onreadystatechange = function() {
                if(this.readyState == 4) {
                    if(this.status >= 200 && this.status <= 299){
                        resolve(xhr);
                    }else {
                        reject(xhr);
                    }
                }
            },
            xhr.send(JSON.stringify(data));
        })
    }

    function doVerb(_settings, verb, headers, path) {
        if(_.isString(headers) && _.isUndefined(path)){
            path = headers;
            headers = _settings.headers;
        }
        headers = _.extend(_settings.headers, headers);
        return new Promise((resolve, reject) => {
            var xhr = createXhr(verb, headers, path);
            xhr.onreadystatechange = function() {
                if(this.readyState == 4) {
                    if(this.status >= 200 && this.status <= 299){
                        resolve(xhr);
                    }else {
                        reject(xhr);
                    }
                }
            },
            xhr.send();
        })
    }

    return function(settings){        
        if(settings.lodash){
            _ = settings.lodash;
        }
        if(typeof XMLHttpRequest !== 'undefined'){
            xhrCtor = XMLHttpRequest;
        }
        if(settings.XMLHttpRequest){
            xhrCtor = settings.XMLHttpRequest;
        }
        if(xhrCtor === null) {
            xhrCtor = require("xmlhttprequest").XMLHttpRequest;
        }

        var _settings = _.extend(settings, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        
        return {
            get: (headers, path) => {
                return doVerb(_settings, "GET", headers, path);
            },
            delete: (headers, path) => {
                return doVerb(_settings, "DELETE", headers, path);   
            },
            post: (data, headers, path) => {
                return doBodyVerb(_settings, "POST", data, headers, path);
            },
            put: (data, headers, path) => {
                return doBodyVerb(_settings, "PUT", data, headers, path);
            },
            patch: (data, headers, path) => {
                return doBodyVerb(_settings, "PATCH", data, headers, path);
            }
        }
    } 
})()

module.exports = xhr;