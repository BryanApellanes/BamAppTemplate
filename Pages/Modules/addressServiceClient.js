var addressServiceClient = (function(){
    var environments = require('../../environments'),
        _ = require('lodash'),
        xhr = require('../../xhr')({lodash: _});

    environments.setCurrent('proj05');

    return {
        setEnvironment: function(envName) {
            environments.setCurrent(envName);
        },
        getEnvironment: function(){
            return environments.getCurrent();
        },
        getCounties: function(countryCode){
            var uri = `${environments.getAddressPath()}/address/list/provinces?country=${countryCode}`;
            return new Promise((resolve, reject) => {
                xhr.get(environments.getAuthorizationHeader(), uri)
                    .then(xhr => {
                        resolve(JSON.parse(xhr.response));
                    })
                    .catch(e => reject(e));
            });
        }
    }
})()

module.exports = addressServiceClient;