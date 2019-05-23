var _ = require("lodash");
var obj = require("../js/bam/data/objToArray");
var findADentistLinkManager = require("../FindProvider/FindADentistLinkManager");

findADentistLinkManager.setEnvironment('prod');

if(window){
    window._ = _;
    window.findADentistLinkManager = findADentistLinkManager;
    window.obj = obj;
}

if(global){
    global._ = _;
    global.findADentistLinkManager = findADentistLinkManager;
    global.obj = obj;
}

console.log('index.js loaded');