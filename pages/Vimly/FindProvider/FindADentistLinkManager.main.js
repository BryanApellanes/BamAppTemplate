var findADentistLinkManager = require('./FindADentistLinkManager');
var method = process.argv[2];
var arg1 = process.argv[3];
var arg2 = process.argv[4];
var arg3 = process.argv[5];
var arg4 = process.argv[6];

findADentistLinkManager.setEnvironment("prod");
findADentistLinkManager[method](arg1, arg2, arg3, arg4);