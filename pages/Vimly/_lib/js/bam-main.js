/**
 * A browserfiable main entry into bamjs
 */

module.exports = (function(){

    return function(bamRootPath){
        var colors = require("colors"),
            path = require("path"),    
            jsdom = require('jsdom'),
            bamRoot = bamRootPath;
        
        const { JSDOM } = jsdom;
        const jsDomObj = new JSDOM(``);
        
        if(typeof global === 'undefined'){
            console.log('global not defined; instantiating as object'.yellow);
            global = {};
        }
        
        if(typeof window === 'undefined'){
            console.log('window not defined; setting');
            window = jsDomObj.window;
        }
        
        if(typeof document === 'udnefined'){
            console.log('document not defined; setting');
            document = window.document;
        }
        
        var jQuery = require("jquery");
        
        global.document = document;
        global.jQuery = jQuery;
        
        function bamRequire(subPath, globalName){
            var fullPath = path.join(bamRoot, subPath);
            console.log(`bamRequire: ${path}`.yellow);
            var module = require(fullPath);
            if(typeof global !== 'undefined' && globalName){
                global[globalName] = module;
            }
            return module;
        }
        
        window.qi = bamRequire("/data/qi.js", "qi");
        window.sdo = bamRequire("/data/sdo.js", "sdo");
        window.dao = bamRequire("/data/dao.js", "dao");
        window.bam = bamRequire("/bam.js", "bam")({});
    }
})();
