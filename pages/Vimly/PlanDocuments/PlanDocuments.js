$(document).ready(function(){
    var DEFAULT_PLANID = "49316MN1070001";
    var envs = environments; // see main

    var props = {};

    // {{rates_path}}/products/medical/plans/3d9c7c71-4860-496e-8880-bbbe0f830b4d/2020/49316MN1070001/info/links?effectiveDate=2020-01-01
    var planDocumentsPage = {
        setProp: function(name, val){
            props[name] = val;
        },
        getProp: function(name) {
            return props[name] || null;
        },
        prop: function(name, val){
            if(val){
                this.setProp(name, val);
                return this;
            }
            return this.getProp(name);
        },
        dataTable: function(tableName){
            return this.prop(`${tableName}_table`);
        },
        deselect: function(tableName){
            this.dataTable(tableName).rows().deselect();
        },
        populateTable: function(tableId, dataPromise){
            return new Promise((resolve, reject) =>
            {
                var _this = this;
                if(!_.isString(tableId)){
                    throw new Error("tableId must be a string");
                }
                if(!_.isFunction(dataPromise)){
                    throw new Error("dataPromise must be a function that returns a promise and resolves to data in the shape of the specified tableId");
                }
                if(!tableId.startsWith("#")){
                    tableId = `#${tableId}`;
                }
                dataPromise()
                    .then(function(data){
                        var tableName = tableId.substring(1),
                            columns = [];

                        if(data.length > 0){
                            for(var prop in data[0]){
                                columns.push({title: prop});
                            }
                        
                            var arrayOfArrays = [];
                            _.each(data, item => arrayOfArrays.push(obj.toArray(item))); // obj is `require`d by main.js
                            _this.prop(`${tableName}_data`, data);
                            var existingTable = _this.prop(`${tableName}_table`);
                            if(existingTable){
                                existingTable.destroy();
                            }
                            
                            _this.prop(`${tableName}_table`, $(tableId).DataTable({
                                select: {
                                    style: 'single'
                                },
                                data: arrayOfArrays,
                                columns: columns
                            }));
                        }
                        resolve(data);
                    })
                    .catch(reject);
            });
        },
        load: function(){
            var _this = this;
            return new Promise((resolve, reject) => {
                try {
                    var promises = [];
                    promises.push(this.populateTable("#documents", planDetails.getPdfFileNames));
                    promises.push(this.populateTable("#plans", planDetails.getPlanIds));
                    promises.push(this.populateTable("#links", () => Promise.resolve([{"Id": "", "Plan Id": "", "Effective Date": "", "Title": "", "Link Type": "", "Storage Location": ""}])));
                    Promise.all(promises).then(results => resolve(_this));
                } catch(e) {
                    reject(e);
                }
            });
        },
        onRowSelected: function(tableName, dataHandler) {
            var _this = this,
                tblName = tableName;

            if(!_.isFunction(dataHandler)){
                dataHandler = (dataArray) => {};
            }
            this.dataTable(tblName)
                .on("select", function(ev, dt, type, indexes) {
                    if(type === 'row') {
                        var data = dt.rows(indexes).data();
                        dataHandler(data);
                    }
                });
        },
        ratesPath: function getRatesPath(){
            return envs.getRatesPath();
        },
        quotingPath: function getQuotingPath(){
            return envs.getQuotingPath();
        },
        planMonth: function(month){
            return this.prop("planMonth", month);
        },
        planIds: function(ids){
            return this.prop("planIds", id);
        },
        planYear: function(year){
            return this.prop("planYear", year);
        },
        getPlanLinks: function(planId, planYear, planMonth) {
            return new Promise((resolve, reject) => {
                var selectedEnv = $("#vimlyEnv option:selected").text(); 
                envs.setCurrent(selectedEnv);                        
                envs.getAuthorizationHeader(selectedEnv)
                    .then(header => {
                            var ratesPath = planDocumentsPage.ratesPath(),
                                xhr = bam.xhr(),
                                effective = effectiveDate.from({year: planYear, month: planMonth});
            
                        var getUrl = `${ratesPath}/products/medical/plans/3d9c7c71-4860-496e-8880-bbbe0f830b4d/${effective.getYear()}/${planId}/info/links?effectiveDate=${effective.getYear()}-${effective.getMonth()}-01`;
                        
                        xhr.get(header, getUrl)
                            .then(x => {
                                var links = JSON.parse(x.responseText);
                                _.each(links, link => {
                                    link.planId = planId,
                                    link.planYear = planYear,
                                    link.planMonth = planMonth
                                });
                                resolve(links);
                            })
                            .catch(reject);
                    })
                    .catch(reject);
            })
        },
        getAuthorizationHeader: function(){
            var selectedEnv = $("#vimlyEnv option:selected").text(); 
            envs.setCurrent(selectedEnv);                        
            return envs.getAuthorizationHeader(selectedEnv);
        },  
        /**
         * Update the link for a specified plan.
         * @param {*} planId The id of the plan whose link is updated.
         * @param {*} effectiveDate Either a javascript date object representing the desired effective date or an object with month, date and year
         * properties defined.  Values should be integers to ensure proper formatting.
         * @param {*} link 
         */    
        updateLink: function(planId, effectiveDate, link){
            /**
             * shape of link
            {
                "id": "24107e86-7ac5-3462-b4ca-39b310e887bc",
                "title": "49316MN1070022-00_SBC.pdf",
                "link": "s3://quoting.prod.prod.simon365.com/sbc/2020-01-01/49316MN1070022/49316MN1070022-00_SBC.pdf",
                "type": "DOCUMENT",
                "subType": "DOCUMENT_SBC"
            }
             */
            var effective = window.effectiveDate.from(effectiveDate);
            return new Promise((resolve, reject) => {
                var ratesPath = planDocumentsPage.ratesPath();
                var putUrl = `${ratesPath}/products/medical/plans/3d9c7c71-4860-496e-8880-bbbe0f830b4d/2020/${planId}/info/links/${link.id}?effectiveDate=${effective.getYear()}-${effective.getMonth()}-${effective.getDate()}`;
                this.getAuthorizationHeader()
                    .then(authHeader => {
                        bam.xhr().put(JSON.stringify(link), authHeader, putUrl)
                            .then(x => {
                                var data = JSON.parse(x.responseText);
                                resolve(data);
                            })
                            .catch(reject);
                    })
            });
        },
        clearMessages: function(){
            $("#messages").val("");
        },
        printMessage: function(msg, append){
            if(!append){
                this.clearMessages();
            }
            var currentOutput = $("#messages").val() || '';
            $("#messages").val((currentOutput + '\r\n' + msg).trim());
        },
        loadLinks: function(planId, planYear) {
            var _this = this,
                promises = [];
            for(var planMonth = 1; planMonth <= 12; planMonth++) {
                promises.push(_this.getPlanLinks(planId, planYear, planMonth));
            }
            Promise.all(promises).then(arrayOfArrays => {
                var links = [];
                _.each(arrayOfArrays, arr => _.each(arr, link => links.push(createLinkRowData(link))));
                _this.populateTable("links", () => Promise.resolve(links));
            });                        
        },
        attachEventHandlers: function(){
            var _this = this,
                linksColumns = ["id", "planId", "effectiveDate", "title", "linkType", "storageLocation"];
            this.onRowSelected("plans", (planIds) => {
                var planYear = $("#planYear").val() || 2020;
                $("#planId").val(planIds[0]);
                _this.loadLinks(planIds[0], planYear);
            });
            this.onRowSelected("links", (cellValues) => {
                var link = rowToObj(linksColumns, cellValues[0]);  
                $("#linkId").val(link.id);            
                $("#linkPlanId").val(link.planId);
                $("#linkEffectiveDate").val(link.effectiveDate);
                $("#linkTitle").val(link.title);
                $("#linkType").val(link.linkType);
                $("#linkStorageLocation").val(link.storageLocation);
            });
            $("#loadPlanLinksButton").off("click").on("click", function(){
                var planId = $("#planId").val(),
                    planYear = $("#planYear").val() || 2020;
                _this.deselect("plans");
                if(planId.trim() === '') {
                    _this.printMessage("Please specify a plan id");
                    $("#planId").focus();
                    return;
                }
                _this.loadLinks(planId, planYear);
            });
            $("#updateLinkButton").off("click").on("click", function(){
                var link = getLinkFromInput();
                _this.updateLink($("#linkPlanId").val(), $("#linkEffectiveDate").val(), link);
            });
        },
        test:function(msg){
            this.printMessage(msg);
        }
    }

    function createLinkRowData(link){
        return {
            "Link Id": link.id,
            "Plan Id": link.planId,
            "Effective": effectiveDate.from({year: link.planYear, month: link.planMonth, date: 1}).value(),
            "Title": link.title,
            "Type": link.subType,
            "S3 Path": link.link
        }
    }

    function rowToObj(columnNames, rowArray){
        var result = {};
        for(var i = 0; i < columnNames.length; i++){
            result[columnNames[i]] = rowArray[i];
        }
        return result;
    }

    function getLinkFromInput(){
        /**
         *             {
                "id": "24107e86-7ac5-3462-b4ca-39b310e887bc",
                "title": "49316MN1070022-00_SBC.pdf",
                "link": "s3://quoting.prod.prod.simon365.com/sbc/2020-01-01/49316MN1070022/49316MN1070022-00_SBC.pdf",
                "type": "DOCUMENT",
                "subType": "DOCUMENT_SBC"
            }
         */
        return {
            id: $("#linkId").val(),
            title: $("#linkTitle").val(),
            link: $("#linkStorageLocation").val(),
            type: "DOCUMENT",
            subType: $("#linkType").val()
        }
    }

    planDocumentsPage
        .load()
        .then(() => planDocumentsPage.attachEventHandlers());

    window.planDocumentPage = planDocumentsPage;
    window.planDocs = planDocumentsPage;
})