var CaseManagement = (function(){
        entities = require('../../entities'),
        environments = require('../../environments'),
        _ = require("lodash"),
        xhr = require('../../xhr')({lodash: _}), 
        currentSettings = environments.getSettings('local'),
        quotingPath = currentSettings.quotingPath,
        casemanagementPath = `${quotingPath}/casemanagement`;        
    
    var _headers = {
        Authorization: ""
    }

    function getHeaders(){
        return _.extend({}, _headers, {Authorization: `Bearer ${currentSettings.token}`});
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
                xhr.post(entity, getHeaders(), path)
                    .then(x => {
                        var result = JSON.parse(x.responseText);
                        resolve(result);
                    })
                    .catch(reject);
            });
        },
        assignCase: function(caseId, taskUserInfo){
            return new Promise((resolve, reject) => {
                var path = `${getCaseManagementEntityPath("cases")}/${caseId}/assignment`;
                console.log(`assignCase: ${path}`);
                xhr.post(taskUserInfo, getHeaders(), path)
                    .then(x => {
                        var result = JSON.parse(x.responseText);
                        resolve(result);
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
                xhr.get(getHeaders(), path)
                    .then(x => {
                        var result = JSON.parse(x.responseText);
                        resolve(result);
                    })
                    .catch(reject);
            })
        },
        createTask: (caseId, entity) => {
            return new Promise((resolve, reject) => {
                var path = getCaseTaskPath(caseId);
                console.log(`createTask: ${path}`);
                xhr.post(entity, getHeaders(), path)
                    .then(x => {
                        var result = JSON.parse(x.responseText);
                        resolve(result);
                    })
                    .catch(reject);
            })
        }
    };
})()

module.exports = CaseManagement;