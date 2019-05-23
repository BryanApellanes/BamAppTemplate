var findADentistLinkManager = (function(){
    var _ = require("lodash"),
        fs = require("fs"),
        path = require("path"),
        colors = require("colors"),
        xhr = require('../xhr')({lodash: _}),
        threading = require('../threading'),
        serviceProviderId = "3d9c7c71-4860-496e-8880-bbbe0f830b4d",
        environments = require('../environments'),
        linkInfo = {
            type: 'WEBSITE',
            title: 'Find A Dentist',
            subType: 'LINK_FIND_PROVIDER_DENTAL',
            link: 'https://mn.ourdentalcoverage.com/find-a-dentist/#/'
        }

        return {
            readIds: function(fileNum){
                var planIds = this.getPlanIdsFromFile("Dental_All_Plans_PROD_UNIQUE_PLANID_2019.csv");
                console.log(`2019 plan id count: ${planIds.length}`);
            },
            setEnvironment: function(env) {                
                environments.setCurrent(env);
                console.log(`setting environment to: ${env}`);
            },
            checkPlan: function(planId, year, month){
                console.log(`checking plan ${planId} for month = ${month}, year = ${year}`);
                if(_.isUndefined(year) || _.isNaN(year)) {
                    year = '2019';
                }
                return this.getProductInfoLinks(planId, year, month)
                    .then(data=> {
                        if(data.links.length == 0){
                            console.log(`Bad 2019: ${data.planId}`.red);
                        }else {
                            console.log(`Good 2019: ${data.planId}`.green);
                            console.log(JSON.stringify(data.links).green);
                            _.each(data.links, link => this.logLink(link));
                        }
                    })
                    .catch(e=> console.log(e));
            },
            addAllNotFoundLinks: async function(topFileCount){
                for(var i = 0; i <= topFileCount; i++){
                    await this.addNotFoundLinks(i);
                }
            },
            addNotFoundLinks: async function(fileNum) {
                var notFoundFileDir = './LinkNotFoundPlans/';
                var files = fs.readdirSync(notFoundFileDir);
                var done = [];
                for(var i = 0; i < files.length; i++){
                    var file = files[i];
                    if(!done.includes(file) && file.startsWith(`${fileNum}-`)){
                        console.log(file.bgBlue);
                        var fileContent = fs.readFileSync(`${notFoundFileDir}${file}`, 'utf8');
                        var lines = fileContent.split('\n');
                        for (var i = 0; i < lines.length; i++) {
                            var line = lines[i].trim();
                            if(line !== ''){
                                console.log(line.cyan);
                                var args = line.split(' ');
                                await this.addLink(args[0].trim(), args[1].trim(), args[2].trim());
                            }
                        }
                    }                    
                    done.push(file);
                }
            },
            addLink: async function(planId, year, month) {
                return this.addFindADentistLink(planId, year, month).then(response => console.log(JSON.stringify(response)));
            },
            addAllLinks: async function(fileNum, year) {
                for(var mo = 1; mo <= 12; mo++){
                    var month = mo < 10 ? `0${mo}` : mo.toString();
                    await this.addLinks(fileNum, year, month);
                }
            },
            addLinks: async function(fileNum, year, month){
                console.log(`doing file number ${fileNum} ${month}`.cyan);
                var path = require('path');
                var fullPath = path.resolve(`./DentalPlanIds/DentalPlanIds_${fileNum}.txt`);
                var planIds = fs.readFileSync(fullPath, 'utf-8');
                var planIdArray = planIds.split("\n");

                var the = this;
                while(planIdArray.length > 0) {
                    var next = false;
                    var planId = planIdArray.pop().trim();
                    if(planId !== '') {
                        console.log(planId);
                        await this.addFindADentistLink(planId, year, month).then(response=> {
                            console.log(JSON.stringify(response));
                            next = true;
                        })
                    }
                    threading.sleepUntil(30, ()=> next);
                }
            },      
            checkAllPlans: async function(fromFileNum, toFileNum, year) {
                if(!year){
                    year = '2019';
                }
                var from = parseInt(fromFileNum);
                var to = parseInt(toFileNum);
                for(var i = from; i <= to; i++){
                    for(var mo = 1; mo <= 12; mo++){
                        var month = mo < 10 ? `0${mo}` : mo.toString();
                        console.log(`checking file ${i} for month ${month}`.blue);
                        await this.checkPlans(i, year, month);
                        threading.sleep(5000);
                    }
                    threading.sleep(5000);
                }
            },
            checkPlans: async function(fileNum, year, month) {
                var path = require('path');
                var fullPath = path.resolve(`./DentalPlanIds/DentalPlanIds_${fileNum}.txt`);
                var planIdsContent = fs.readFileSync(fullPath, 'utf-8');
                var planIds = planIdsContent.split("\n");
                var mo = month ? month: '08';
                console.log(`there are ${planIds.length} unique planIds in ${fullPath}`);
                
                for(var i = 0; i < planIds.length; i++) {
                    var planId = planIds[i].trim();
                    if(planId !== ''){
                        var next = false;
                        console.log(`-- ${planId.bgBlue}`);
                        await this.getProductInfoLinks(planId, year, mo)
                            .then(data=> {
                                var color = 'red';
                                var linkFound = false;
                                var line = `${data.planId} ${year} ${month}\r\n`;
                                if(data.links.length == 0){
                                    console.log(`fileNum ${fileNum} ${line[color]}`);
                                }else {                                    
                                    for(var i = 0; i < data.links.length; i++) {
                                        var linkInfo = data.links[i];  
                                        if(linkInfo.subType === 'LINK_FIND_PROVIDER_DENTAL') {
                                            color= 'green';
                                            linkFound = true;
                                            break;
                                        }
                                    }
                                    console.log(`fileNum ${fileNum} ${line[color]}`);
                                    _.each(data.links, link => this.logLink(link));
                                }

                                if(!linkFound){
                                    var filePath = `./LinkNotFoundPlans/${fileNum}-${year}-${month}`;
                                    if(fs.existsSync(filePath)){                                        
                                        var fileContent = fs.readFileSync(filePath, 'utf8');
                                        if(!fileContent.includes(line)){
                                            fs.appendFileSync(filePath, line, 'utf8');
                                        }else{
                                            console.log(`already captured ${line}`.yellow);
                                        }
                                    } else {
                                        fs.appendFileSync(filePath, line, 'utf8');
                                    }
                                }
                                next = true;
                            })
                            .catch(e=> {
                                console.log(e);
                                next = true;
                            });
                        threading.sleepUntil(750, () => next);
                        console.log(`-- // ${planId.bgBlue}\r\n\r\n`);
                    }
                }
            },
            writePlanIds: function(csvFilePath){
                var planIds = this.getPlanIdsFromFile(csvFilePath);
                for(var i = 0; i < planIds.length; i++){
                    fs.appendFileSync("./planids.txt", `${planIds[i]}\r\n`);
                }
            },
            test: function(number){
                var planIds = fs.readSync(`./DentalPlanIds_${number}.csv`)
            },
            addFindADentistLink: async function(planId, effectiveYear, effectiveMonth) {
                console.log(`adding planId=${planId}, effectiveYear=${effectiveYear}, effectiveMonth=${effectiveMonth}`);
                return this.postProductInfoLink(linkInfo, planId, effectiveYear, effectiveMonth);
            },
            postProductInfoLink: function(productInfoLink, planId, effectiveYear, effectiveMonth) {
                return new Promise((resolve, reject) => {
                    //var url = `https://quoting-api.prod.simon365.com/rates/api/v1/products/dental/3d9c7c71-4860-496e-8880-bbbe0f830b4d/plans/${planId.trim()}/info/links?effectiveDate=${effectiveYear}-${effectiveMonth}-01`;
                    var url = `${this.getRatesPath()}/products/dental/${serviceProviderId}/plans/${planId.trim()}/info/links?effectiveDate=${effectiveYear}-${effectiveMonth}-01`;

                    xhr.post(productInfoLink, this.getAuthHeader(), url)
                        .then(r => {
                            var response = JSON.parse(r.responseText);
                            resolve(response);
                        })
                        .catch(e => {
                            console.log(JSON.stringify(e));
                            reject(e);
                        })
                })
            },
            getProductInfoLinks: function(planId, effectiveYear, effectiveMonth) {
                return new Promise((resolve, reject) => {
                    //var url = `https://quoting-api.prod.simon365.com/rates/api/v1/products/dental/3d9c7c71-4860-496e-8880-bbbe0f830b4d/plans/${planId.trim()}/info/links?effectiveDate=${effectiveYear}-${effectiveMonth}-01`;
                    var url = `${this.getRatesPath()}/products/dental/${serviceProviderId}/plans/${planId.trim()}/info/links?effectiveDate=${effectiveYear}-${effectiveMonth}-01`;

                    console.log(`GetProductInfoLinks: ${url}`);

                    xhr.get(this.getAuthHeader(), url)
                        .then(r => {
                            var response = JSON.parse(r.responseText);
                            resolve({planId: planId, year: effectiveYear, month: effectiveMonth, links: response});
                        })
                        .catch(e=> {
                            reject(e);
                        })
                });
            },
            deleteLink: function(planId, effectiveYear, effectiveMonth, linkId){
                return new Promise((resolve, reject) => {
                    var url = `${this.getRatesPath()}/products/medical/plans/${serviceProviderId}/${effectiveYear}/${planId}/info/links/${linkId}?effectiveDate=${effectiveYear}-${effectiveMonth}-01`;

                    console.log(`DeleteProductInfoLink: ${url}`);

                    xhr.delete(this.getAuthHeader(), url)
                        .then(r=> {                            
                            resolve({});
                        })
                        .catch(e => {
                            reject(e);
                        })
                })
            },
            getPlanIdsFromFile: function(filePath){
                console.log('reading file ' + filePath);
                var csvContent = fs.readFileSync(filePath, 'utf-8');
                var csvLines = csvContent.split('\n');
                
                console.log(`there are ${csvLines.length} lines`);
                var planIds = [];
                for(var i = 0; i < csvLines.length; i++){
                    var line = csvLines.pop();
                    if(!_.isUndefined(line)){
                        line = line.trim();
                        if(line !== '') {
                            var vals = line.split(',');
                            var planId = vals[6];
                            if(!_.includes(planIds, planId)){
                                planIds.push(planId);
                            }
                        }
                    }
                }
                return planIds;
            },
            getAuthHeader: function() {                
                return {
                    Authorization: `Bearer ${environments.getToken()}`
                }
            },
            getQuotingPath: function() {
                return environments.getQuotingPath();
            },
            getRatesPath: function() {
                return environments.getRatesPath();
            },
            logLink: function(link) {
                console.log(`***`);
                console.log(`\tid: ${link.id}`);
                console.log(`\ttitle: ${link.title}`);
                console.log(`\tlink: ${link.link}`);
                console.log(`\ttype: ${link.type}`);
                console.log(`\tsubType: ${link.subType}`);
            }
        }
})()

module.exports = findADentistLinkManager;