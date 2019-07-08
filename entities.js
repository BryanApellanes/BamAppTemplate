var entities = (function(){
    var baseUrl = 'https://quoting-api-proj05.prod.simon365.com/entity/v1/entity',
        authToken = 'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIwNjE4YzBiNS0wYmExLTQ0NmQtOTBkZS0wNWYyOGJiY2FjMGYiLCJzdWIiOiJiZWJjYWQ4NS02NDUxLTQwNmMtYTMzZi02OWM4MjlmZWI5MzAiLCJpc3MiOiJodHRwczovL3F1b3RpbmctYXBpLXByb2owNS5wcm9kLnNpbW9uMzY1LmNvbSIsImlhdCI6MTU1OTA1NTY5OSwibmJmIjoxNTU5MDU1Mzk5LCJleHAiOjE1OTA2MTI2MjUsInNzIjpudWxsLCJ2ZXIiOjEsInR5cCI6IlNFUlZJQ0VfQUNDT1VOVCIsInJvbCI6W119.UtRyBC1rRQ95DnN1xOYiGXc1-JoVjXzUTEv97q28CT4'
        _ = require('lodash'),
        xhr = require('./xhr')({lodash: _})
        typeNameMap =  {
            "Application": "Application",
            "Case": "TaskCase",
            "Task": "TaskWorkItem"
        };    

    function getMetaProp(prop, entity) {
        if(entity[prop]) {
            return entity[prop];
        }
        if(entity[`@${prop}`]){
            return entity[`@${prop}`];
        }
    }

    function getMeta(entity) {
        return {
            id: getMetaProp("id", entity),
            type: getMetaProp("type", entity),
            schema: getMetaProp("schema", entity),
            transaction: getMetaProp("transaction", entity),
            owner: getMetaProp("owner", entity)
        }
    }

    var _headers = {
        Authorization: ""
    }

    var entities = {
        getMeta: function(entity) {
            return getMeta(entity);
        },
        setBaseUrl: function(url) {
            baseUrl = url;
        },  
        getBaseUrl: function() {
            return baseUrl;
        },
        setAuth: function(token) {
            _headers.Authorization = `Bearer ${token}`;
        },
        "new": function(typeName) {
            var val = typeName;
            if(typeNameMap[typeName]){
                val = typeNameMap[typeName];
            }
            return {
                "type": val
            }
        },      
        create: function(entity) {
            // not currently implemented since most things should go through quoting for validation and authorization
        },
        retrieve: function(type, id) {
            return new Promise((resolve, reject) => {
                xhr.get(_headers, `${baseUrl}/${type}/${id}`)
                    .then((resp) => {
                        var entity = JSON.parse(resp.responseText);
                        entity.meta = getMeta(entity);
                        entity = _.extend({}, entity, entity.meta);
                        resolve(entity);
                    })
                    .catch(reject);
            });
        },
        retrieveAll: function (typeName) {
            return new Promise((resolve, reject) => {
                xhr.get(_headers, `${baseUrl}/${typeName}`)
                    .then((resp) => {
                        resolve(JSON.parse(resp.responseText));
                    })
                    .catch(reject);
            })
        },
        update: (entity) => {
            // not currently implemented since most things should go through quoting for validation and authorization
        },
        "delete": (entity) => {
            // not currently implemented since most things should go through quoting for validation and authorization
        },
        where: (predicate) => {
            // not currently implemented since most things should go through quoting for validation and authorization
        }
    }

    entities.setAuth(authToken);
    return _.clone(entities);
})()

module.exports = entities;