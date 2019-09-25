var environments = (function(){
    var _ = require('lodash');

    var quotingPaths = {
            proj05: "https://quoting-api-proj05.prod.simon365.com/quoting/api/v1",
            test: "https://quoting-api-test.test.simon365.com/quoting/api/v1",
            local: "http://localhost:2001/quoting/api/v1",
            prod: "https://quoting-api.prod.simon365.com/quoting/api/v1"
        },  
        ratesPaths = {
            proj05: "https://quoting-api-proj05.prod.simon365.com/rates/api/v1",
            test: "https://quoting-api-test.test.simon365.com/rates/api/v1",
            local: "http://localhost:10080/rates/api/v1",
            prod: "https://quoting-api.prod.simon365.com/rates/api/v1"
        },  
        addressPaths = { // all the same 
            proj05: "https://quoting-api-proj05.prod.simon365.com/address/v1",
            test: "https://quoting-api-proj05.prod.simon365.com/address/v1",
            local: "https://quoting-api-proj05.prod.simon365.com/address/v1",
            prod: "https://quoting-api-proj05.prod.simon365.com/address/v1"
        },
        identityPaths = {
            proj05: "https://quoting-api-proj05.prod.simon365.com/identity/api/v1/service",
            local: "http://localhost:8080/identity/api/v1/service",
            prod: "https://quoting-api.prod.simon365.com/identity/api/vi/service"
        },
        tokenPaths = {
            proj05: "https://quoting-api-proj05.prod.simon365.com/identity/api/test/token?id=bebcad85-6451-406c-a33f-69c829feb930",
            test: "https://quoting-api-test.test.simon365.com/identity/api/test/token?id=bebcad85-6451-406c-a33f-69c829feb930",
            local: "https://quoting-api-proj05.prod.simon365.com/identity/api/test/token?id=bebcad85-6451-406c-a33f-69c829feb930",
            prod: "https://quoting-api.prod.simon365.com/identity/api/test/token?id=bebcad85-6451-406c-a33f-69c829feb930"
        }

        defaultSvcProviderId = '3d9c7c71-4860-496e-8880-bbbe0f830b4d';

    function getToken(env) {
        var xhr = require('../../js/bam/system/xhr')({lodash: _});
        return new Promise((resolve, reject) => {
            xhr.get({}, tokenPaths[env])
                .then(result => {
                    resolve(JSON.parse(result.responseText).access_token);
                })
                .catch(reject);
        });
    }

    var current = {
        env: "local",
        quotingPath: quotingPaths.local,
        ratesPath: ratesPaths.local,
        addressPath: addressPaths.local,
        identityPath: identityPaths.local,
        serviceProviderId: defaultSvcProviderId
    }

    return {
        isValidEnv: function(env) {
            if(!quotingPaths[env]){
                console.log(`Unable to determine QUOTING path for specified env: ${env}`.red);
                return false;
            }
            if(!ratesPaths[env]){
                console.log(`Unable to determine RATES path for the specified env: ${env}`.red);
                return false;
            }
            return true;
        },
        setCurrent: function(env){    
            if(!this.isValidEnv(env)) {
                throw new Error(`Invalid env ${env}`);
            }        
            current.env = env;
            current.quotingPath = quotingPaths[env];
            current.addressPath = addressPaths[env];
            current.identityPath = identityPaths[env];
            current.ratesPath = ratesPaths[env];            
        },    
        getCurrent: function() {
            return current;
        },
        getSettings: function(env) {            
            if(!this.isValidEnv(env)) {
                throw new Error(`invalid env ${env}`);
            }
            return {
                env: env,
                quotingPath: quotingPaths[env],
                addressPath: quotingPaths[env],
                ratesPath: ratesPaths[env],
                identityPath: identityPaths[env],
                serviceProviderId: defaultSvcProviderId
            }
        },
        getRatesPath: function(){
            console.log(`getRatesPath: environment currently set to ${current.env}`);
            return current.ratesPath;
        },
        getQuotingPath: function(){
            console.log(`getQuotingPath: environment currently set to ${current.env}`);
            return current.quotingPath;
        },
        getIdentityPath: function() {
            return current.identityPath;
        },
        getAddressPath: function(){
            console.log(`getAdddressPath: environment currently set to ${current.env}`);
            return current.addressPath;
        },
        getToken: function() {
            console.log(`getToken: environment currently set to ${current.env}`);
            return current.token;
        },
        refreshToken: function(){
            console.log(`refreshToken: environment currently set to ${current.env}`);
            return getToken(current.env);
        },
        getAuthorizationHeader: function(env){
            var env = env || current.env;
            return new Promise((resolve, reject) => {
                getToken(current.env)
                    .then(token => {
                        resolve({
                            "Authorization": token
                        })
                        
                    }).catch(reject);;
            });    
        }
    }
})()

module.exports = environments;