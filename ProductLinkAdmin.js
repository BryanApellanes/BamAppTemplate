var productlinkadmin = (function(){
    var Handlebars = require('handlebars');
    var linkManager = require('./FindProvider/FindADentistLinkManager');
    linkManager.setEnvironment('prod');

    return {
        test: function(){
            alert('yay');
        },
        getProductInfoLinks: function(planId, effectiveYear, effectiveMonth){
            return linkManager.getProductInfoLinks(planId, effectiveYear, effectiveMonth);
        }      
    }
})()

if(window){
    window.productlinkadmin = productlinkadmin;
}
module.exports = productlinkadmin;