var serviceUrls = (function(){
    var _ = require("lodash");

    return function(settings){ // boilerplate
        var _settings = _.extend({
            
        }, settings);

        return {
            getRatesUrl: function() {
                if(_.isFunction(_settings.getRatesUrl)) {
                    console.info("using getRatesUrl provided by injected settings");
                    return _settings.getRatesUrl();
                }
                return "https://quoting-api-proj05.prod.simon365.com/rates/api/v1/products"
            },
            getEntityUrl: function() {
                if(_.isFunction(_settings.getEntityUrl)) {
                    console.info("using getEntityUrl provided by injected settings");
                    return _settings.getEntityUrl();
                }
                return "https://quoting-api-proj05.prod.simon365.com/entity/v1";
            },
            getQuotingUrl: function() {
                if(_.isFunction(_settings.getQuotingUrl)) {
                    console.info("using getQuotingUrl provided by injected settings");
                    return _settings.getQuotingUrl();
                }
                return "https://quoting-api-proj05.prod.simon365.com/quoting/api/v1";
            }
        }
    }        
})()

module.exports = serviceUrls;