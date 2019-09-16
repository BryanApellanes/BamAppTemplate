var CaseManagement = (function(){
        entities = require('../entities'),
        environments = require('../environments'),
        _ = require("lodash"),
        xhr = require('../../../js/bam/system/xhr')({lodash: _}), 
        currentSettings = environments.getSettings('local'),
        quotingPath = currentSettings.quotingPath,
        casemanagementPath = `${quotingPath}/casemanagement`;        
    
    var _headers = {
        Authorization: ""
    }

    function getHeaders(env){                
        return new Promise((resolve, reject) => { 
            environments.getAuthorizationHeader(env)
                .then(authHeader => {
                    resolve(_.extendWith({}, _headers, authHeader));
                })
                .catch(reject);
        });
    }

    function getCaseManagementEntityPath(typeName){
        return `${casemanagementPath}/${typeName}`;
    }

    function getCaseTaskPath(caseId){
        return `${casemanagementPath}/cases/${caseId}/tasks`
    }

    return {
        setEnvironment: function(env) {
            currentSettings = environments.getSettings(env);
            quotingPath = currentSettings.quotingPath;
            casemanagementPath = `${quotingPath}/casemanagement`;
        },
        getSettings: function(){
            return currentSettings;
        },
        "new": (typeName) => {
            return entities.new(typeName);
        },
        createCase: (entity) => {
            return new Promise((resolve, reject) => {
                var path = getCaseManagementEntityPath("cases");
                console.log(`createCase: ${path}`);
                getHeaders()
                    .then(headers => {
                        xhr.post(entity, headers, path)
                            .then(x => {
                                var result = JSON.parse(x.responseText);
                                resolve(result);
                            })
                            .catch(reject);
                    })
                    .catch(reject);
            });
        },
        retrieveCase: (caseId) => {
            return new Promise((resolve, reject) => {
                var path = `${getCaseManagementEntityPath("cases")}/${caseId}`;
                console.log(`retrieveCase: ${path}`);
                getHeaders()
                    .then(headers => {
                        xhr.get(headers, path)
                            .then(x => {
                                var result = JSON.parse(x.responseText);
                                resolve(result);
                            })
                    })
                    .catch(reject);
            });
        },
        updateCase: (entity) => {
            return new Promise((resolve, reject) => {
                var path = `${getCaseManagementEntityPath("cases")}/${entity.id}`;
                console.log(`updateCase: ${path}`);
                getHeaders()
                    .then(headers => {
                        xhr.put(entity, headers, path)
                            .then(x => {
                                var result = JSON.parse(x.responseText);
                                resolve(result);
                            })
                            .catch(reject);
                    })
                    .catch(reject);
            });
        },
        assignCase: function(caseId, taskUserInfo){
            return new Promise((resolve, reject) => {
                var path = `${getCaseManagementEntityPath("cases")}/${caseId}/assignment`;
                console.log(`assignCase: ${path}`);
                getHeaders()
                    .then(headers => {
                        xhr.post(taskUserInfo, headers, path)
                            .then(x => {
                                var result = JSON.parse(x.responseText);
                                resolve(result);
                            })
                            .catch(reject);
                    })
                    .catch(reject);
            })
        },
        filterCases: function(filters) {
            var queryString = '?',
                first = true;

            for(var prop in filters){
                var ampersand = first ? '' : '&';
                queryString += `${ampersand}filter=${prop}=${filters[prop]}`;
                first = false;
            }
            return new Promise((resolve, reject) => {
                var path = `${getCaseManagementEntityPath("cases")}${queryString}`;
                console.log(`filterCases: ${path}`);
                getHeaders()
                    .then(headers => {
                        xhr.get(headers, path)
                            .then(x => {
                                var result = JSON.parse(x.responseText);
                                resolve(result);
                            })
                            .catch(reject);
                    })
            })
        },
        createTask: (caseId, entity) => {
            return new Promise((resolve, reject) => {
                var path = getCaseTaskPath(caseId);
                console.log(`createTask: ${path}`);
                getHeaders()
                    .then(headers => {
                        xhr.post(entity, getHeaders(), path)
                            .then(x => {
                                var result = JSON.parse(x.responseText);
                                resolve(result);
                            })
                            .catch(reject);
                    })
            })
        }
    };
})()

module.exports = CaseManagement;