var entityServiceClient = (function(){
    var _ = require('lodash');

    return function(opts){
        var options = _.extend({}, opts);

        return {
            test: function() {
                console.log(`config: ${JSON.stringify(options)}`);
            }
        }
    }

})()

var window = window || {};

if(window) {
    window.entityServiceClient = entityServiceClient;
}

module.exports = entityServiceClient;