var planDocumentUploader = require("./planDocumentUploader");
var color = require("colors");
var arg = process.argv[2];
console.log(arg);

// local: http://localhost:2001/quoting/api/v1
// test: https://quoting-api-test.test.simon365.com/quoting/api/v1
// proj05-dev: https://quoting-api-proj05.prod.simon365.com/quoting/api/v1
//planDocumentUploader.setTokenEnvironment("test");
//planDocumentUploader.setQuotingPath('https://quoting-api-test.test.simon365.com/quoting/api/v1');
planDocumentUploader.setEnvironment('proj05');
planDocumentUploader.setDryRun(false);
planDocumentUploader.setMappingFile(`/Users/bapellanes/src/DocumentLinks/NodeJs/jedan/PlanDocuments/${arg}.csv`);
planDocumentUploader.uploadDocuments()
    .then(() => {
        console.log('done'.green);
    }).catch(e=> {
        console.log(e.toString().red);
    })