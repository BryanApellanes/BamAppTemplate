var planDocumentUploader = (function(){
    var _ = require("lodash"),
        fs = require("fs"),
        path = require("path"),
        svcUrls = require("../serviceUrls"),
        colors = require("colors"),
        XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest,
        mappingCsv = "/c/bam/src/Demo/NodeJs/jedan/PlanDocuments/DocumentMapping.csv",
        pdfRoot = "/Users/bapellanes/.bam/content/apps/bamapp/pages/Vimly/PlanDocuments/2020/PDFs",
        quotingPath = "http://localhost:2001/quoting/api/v1",
        serviceProviderId = "3d9c7c71-4860-496e-8880-bbbe0f830b4d",     
        prodToken = "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJkNWJlZTI3NS1iMWJlLTQwNGUtYjZlZS04MjlkNTI3YTlmZWMiLCJzdWIiOiJiZWJjYWQ4NS02NDUxLTQwNmMtYTMzZi02OWM4MjlmZWI5MzAiLCJpc3MiOiJodHRwczovL3F1b3RpbmctYXBpLnByb2Quc2ltb24zNjUuY29tIiwiaWF0IjoxNTY5MzM3MjQxLCJuYmYiOjE1NjkzMDEyNDEsImV4cCI6MTYwMDg5NDE2Nywic3MiOm51bGwsInZlciI6MSwibWt0IjoiIiwidHlwIjoiU0VSVklDRV9BQ0NPVU5UIiwicm9sIjpbXX0.K5foHE5crLJ1SvMiOu-jGGRklzBBf9U9J4Zp2O7yVeg",
        proj05Token = "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI1MzQxYTg5ZS01ODIzLTQzNWEtODMwMC1iODBiZTA0ZWU4ZDEiLCJzdWIiOiJiZWJjYWQ4NS02NDUxLTQwNmMtYTMzZi02OWM4MjlmZWI5MzAiLCJpc3MiOiJodHRwczovL3F1b3RpbmctYXBpLXByb2owNS5wcm9kLnNpbW9uMzY1LmNvbSIsImlhdCI6MTU0NzE0NzQzNCwibmJmIjoxNTQ3MTQ3MTM0LCJleHAiOjE1Nzg3MDQzNjAsInNzIjpudWxsLCJ2ZXIiOjEsInR5cCI6IlNFUlZJQ0VfQUNDT1VOVCIsInJvbCI6W119.CD7lRMXD8glyH8yZHfUKoNLQjcctcKi-YeJstgjvHbE",
        testToken = "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI0ZTQ4OGY5Mi03NDdkLTQ0YzMtOTUzMS1lYTc5NmQ1NDhkNzMiLCJzdWIiOiJiZWJjYWQ4NS02NDUxLTQwNmMtYTMzZi02OWM4MjlmZWI5MzAiLCJpc3MiOiJodHRwczovL3F1b3RpbmctYXBpLXRlc3QudGVzdC5zaW1vbjM2NS5jb20iLCJpYXQiOjE1NDcyMjY1NzgsIm5iZiI6MTU0NzIyNjI3OCwiZXhwIjoxNTc4NzgzNTA0LCJzcyI6bnVsbCwidmVyIjoxLCJ0eXAiOiJTRVJWSUNFX0FDQ09VTlQiLCJyb2wiOltdfQ.gkPc23_Osk31aI-Zpi9w_gkk5ZU4uZO0xATCVdOfajw",
        //localToken = "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI3NGM1ODZjMS0xY2I0LTQ0YmQtYjQ0MC01YzNhZmI0MTEwOWQiLCJzdWIiOiI3ODFkZTU2YS00Y2ViLTQxYjgtOGNkZS0yOTJlODU0YTZiYmIiLCJpc3MiOiJodHRwczovL3F1b3RpbmctYXBpLXByb2owNS5wcm9kLnNpbW9uMzY1LmNvbSIsImlhdCI6MTU2ODgzNTE4MywibmJmIjoxNTY4ODM0ODgzLCJleHAiOjE2MDAzOTIxMDksInNzIjpudWxsLCJ2ZXIiOjEsIm1rdCI6IiIsInR5cCI6IlNFUlZJQ0VfQUNDT1VOVCIsInJvbCI6W119.bPjgOjA4yi-VubT_8t6tXJe7Pip-gl4rh2rKpqPHBvM",        
        // 
        localToken = "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJkNWJlZTI3NS1iMWJlLTQwNGUtYjZlZS04MjlkNTI3YTlmZWMiLCJzdWIiOiJiZWJjYWQ4NS02NDUxLTQwNmMtYTMzZi02OWM4MjlmZWI5MzAiLCJpc3MiOiJodHRwczovL3F1b3RpbmctYXBpLnByb2Quc2ltb24zNjUuY29tIiwiaWF0IjoxNTY5MzM3MjQxLCJuYmYiOjE1NjkzMDEyNDEsImV4cCI6MTYwMDg5NDE2Nywic3MiOm51bGwsInZlciI6MSwibWt0IjoiIiwidHlwIjoiU0VSVklDRV9BQ0NPVU5UIiwicm9sIjpbXX0.K5foHE5crLJ1SvMiOu-jGGRklzBBf9U9J4Zp2O7yVeg",
        authToken = localToken,
        tokens = {
            proj05: proj05Token,
            local: localToken,
            test: testToken,
            prod: prodToken
        },
        quotingPaths = {
            proj05: "https://quoting-api-proj05.prod.simon365.com/quoting/api/v1",
            test: "https://quoting-api-test.test.simon365.com/quoting/api/v1",
            local: "http://localhost:2001/quoting/api/v1",
            prod: "https://quoting-api.prod.simon365.com/quoting/api/v1"
        }
        
        dryRun = true;

    return {
        setDryRun: function(val) {
            dryRun = val;
        },
        getDryRun: function() {
            return dryRun;
        },
        setTokenEnvironment: function(name) {
            if(tokens[name]) {
                authToken = tokens[name];
            }else {
                throw new Error(`invalid environment specified ${name}`);
            }
        },
        getAuthorizationToken: function() {
            return authToken;
        },
        getDefaultCsvPath: function() {
            return mappingCsv;
        },
        setQuotingPath: function(path) {
            quotingPath = path;
        },
        getQuotingPath: function() {
            return quotingPath;
        },
        setMappingFile: function(csvPath) {
            mappingCsv = csvPath;
        },
        getMappingFile: function() {
            return mappingCsv;
        },
        setEnvironment: function(envName) {
            this.setTokenEnvironment(envName);
            if(quotingPaths[envName]){
                this.setQuotingPath(quotingPaths[envName]);
            }else {
                throw new Error(`invalid environment name specified: ${envName}`);
            }
        },
        /**
         * load the csv mapping and return an array of {fileName: string, planId: string, effectiveDate: string('YYYY-MM-DD') }
         * 
         * @param {*} csvPath path to the mapping csv file or undefined, default is "/c/bam/src/Demo/NodeJs/jedan/PlanDocuments/DocumentMapping.csv"
         */
        loadMappingCsv: function(csvPath) {
            if(_.isUndefined(csvPath)) {
                csvPath = mappingCsv;
            }
            var csvContent = fs.readFileSync(csvPath, 'utf-8'),
                csvLines = csvContent.split("\n"),
                mappings = [];            
            
            console.log(`there are ${csvLines.length} rows in the file ${csvPath}`);
            for(var i = 0; i < csvLines.length; i++) {
                var line = csvLines[i];
                var split = line.split(',');
                if(split.length == 3) {
                    mappings.push({fileName: split[0].trim(), planId: split[1].trim(), effectiveDate: split[2].trim()});
                }
            }
            return mappings;
        },
        setPdfRoot: function(value) {
            pdfRoot = value;
        },
        getPdfRoot: function() {
            return pdfRoot;
        },
        pdfExists: function(pdfName) {
            if(!pdfName.endsWith(".pdf")) {
                pdfName = `${pdfName}.pdf`;
            }
            var filePath = path.join(pdfRoot, pdfName);
            return fs.existsSync(filePath);
        },
        getPdfPath: function(pdfName) {
            if(!pdfName.endsWith(".pdf")) {
                pdfName = `${pdfName}.pdf`;
            }
            return path.join(pdfRoot, pdfName);
        },
        validateCsv: function(csvPath){
            var mappings = this.loadMappingCsv(csvPath),
                allGood = true;
            if(mappings.length === 0) {
                console.log(`no mappings found in ${csvPath}`.red);
                return false;
            }
            for(var i = 0; i < mappings.length; i++) {
                var mapping = mappings[i];
                if(!this.pdfExists(mapping.fileName)) {
                    console.log(`${mapping.fileName} does not exist`.yellow);
                    allGood = false;
                }
            }
            if(allGood) {
                console.log("all good".green);
            }
            return allGood;
        },
        uploadDocument: function(docType, filePath, planId, effectiveDate) {
            if(docType !== "sbc" && docType !== "benefitsGrid") {
                throw new Error(`invalid docType specified: ${docType}`);
            }
            var authToken = this.getAuthorizationToken();
            return new Promise((resolve, reject) => {
                var postUrl = `${quotingPath}/files/${serviceProviderId}/${docType}?planId=${planId}&effectiveDate=${effectiveDate}&updateLink=True`;
                var parameters = {
                    docType: docType,
                    filePath: filePath,
                    planId: planId,
                    effectiveDate: effectiveDate
                }
                if(this.getDryRun()) {
                    var message = `dry run: ${JSON.stringify(parameters, null, 2)}`;
                    if(parameters.docType === "sbc") {
                        console.info(message.cyan);
                    }
                    if(parameters.docType === "benefitsGrid") {
                        console.info(message.bgCyan);
                    }
                    parameters.successful = true;
                    parameters.quotingPath = quotingPath;                    
                    resolve(JSON.stringify(parameters));
                    return;
                }
                console.log(filePath.yellow);
                if(!fs.existsSync(filePath)){
                    var msg = `${filePath} doesn't exist`;
                    console.log(msg.red);
                    reject(msg);
                    fs.appendFileSync('./missingfiles.txt', filePath + '\r\n');
                    return;
                }
                var unirest = require("unirest");
                unirest.post(postUrl)
                    .headers({
                        "Content-Type": 'multipart/form-data',
                        "Authorization": `Bearer ${authToken}`
                    })
                    .attach("file", filePath)
                    .end(function(response) {                        
                        response.body.uploaderInfo = {
                            quotingPath: quotingPath                            
                        }
                        if(response.code >= 200 && response.code <= 299){                            
                            resolve(JSON.stringify(response.body, null, 2));
                            console.log(`yay ${filePath} - ${planId} ${effectiveDate} (${new Date().toLocaleTimeString()})`.green);
                        } else {
                            reject(JSON.stringify(response.body, null, 2));
                            console.log(`sadness ${filePath} - ${planId} ${effectiveDate} (${new Date().toLocaleTimeString()})`.red);
                        }
                    })
            });            
        },
        uploadSbc: function(filePath, planId, effectiveDate) {
            return this.uploadDocument("sbc", filePath, planId, effectiveDate);
        },
        uploadBenefitsGrid: function(filePath, planId, effectiveDate) {
            return this.uploadDocument("benefitsGrid", filePath, planId, effectiveDate);
        },
        uploadDocuments: async function() {
                var mappings = this.loadMappingCsv();
                var promises = [];
                
                function sleep(ms) {
                    return new Promise(resolve => setTimeout(resolve, ms));
                }
                while(mappings.length > 0){
                    var go = false;
                    var current = mappings.pop();
                    var pdfPath = this.getPdfPath(current.fileName);
                    if(current.fileName.toLowerCase().endsWith("sbc")) {                        
                        this.uploadSbc(pdfPath, current.planId, current.effectiveDate)
                            .then((result) => {
                                console.log(result);
                                go = true;
                            })
                            .catch(e => {
                                console.log(e);
                                go = true;
                            })
                    } else {
                        this.uploadBenefitsGrid(pdfPath, current.planId, current.effectiveDate)
                            .then((result) => {
                                console.log(result);
                                go = true;
                            })
                            .catch(e => {
                                console.log(e);
                                go = true;
                            })
                    }
                    while(!go){
                        await sleep(1300);
                    }
                }
        }
    }
})()

module.exports = planDocumentUploader;