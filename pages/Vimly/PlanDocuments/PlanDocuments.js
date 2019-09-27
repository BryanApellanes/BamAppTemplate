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
        populateTable: function(tableId, dataPromise){
            var _this = this;
            if(!_.isString(tableId)){
                throw new Error("tableId must be a string");
            }
            if(!_.isFunction(dataPromise)){
                throw new Error("dataPromise must be a function that retuns a promise and resolves to data in the shape of the spcified tableId");
            }
            if(!tableId.startsWith("#")){
                tableId = `#${tableId}`;
            }
            dataPromise().then(function(data){
                var tableName = tableId.substring(1),
                    columns = [];

                if(data.length > 0){
                    for(var prop in data[0]){
                        columns.push({title: prop});
                    }
                }
                var arrayOfArrays = [];
                _.each(data, item => arrayOfArrays.push(obj.toArray(item)));
                _this.setProp(`${tableName}_data`, data);
                _this.setProp(`${tableName}_table`, $(tableId).DataTable({
                    select: true,
                    data: arrayOfArrays,
                    columns: columns
                }))
            })
        },
        load: function(){
            this.populateTable("#documentNames", planDetails.getPdfFileNames);
            this.populateTable("#planIds", planDetails.getPlanIds);
        },
        ratesPath: function getRatesPath(){
            return envs.getRatesPath();
        },
        quotingPath: function getQuotingPath(){
            return envs.getQuotingPath();
        },
        planId: function getPlanId(){
            return $("#planId").val() || '';
        },
        planYear: function getPlanYear(){
            return $("#planYear").val() || '';
        },
        planMonth: function getPlanMonth(){
            return $("#planMonth").val() || '';
        },
        getSelectedPlanLinks: function(){
            return new Promise((resolve, reject) => {

                var selectedEnv = $("#vimlyEnv option:selected").text(); 
                envs.setCurrent(selectedEnv);                        
                envs.getAuthorizationHeader(selectedEnv)
                    .then(header => {
                            var ratesPath = planDocumentsPage.ratesPath(),
                            planId = planDocumentsPage.planId(),
                            planYear = planDocumentsPage.planYear(),
                            planMonth = planDocumentsPage.planMonth(),
                            xhr = bam.xhr();
            
                        var getUrl = `${ratesPath}/products/medical/plans/3d9c7c71-4860-496e-8880-bbbe0f830b4d/${planYear}/${planId}/info/links?effectiveDate=${planYear}-${planMonth}-01`;
                        
                        xhr.get(header, getUrl)
                            .then(x => {
                                var data = JSON.parse(x.responseText);
                                resolve(data);
                            })
                            .catch(reject);
                    })
                    .catch(reject);
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
        runAdHocScript: function(){
            var scriptText = $("#adHocScript").val();
            eval(scriptText);
        },
        attachEventHandlers: function(){
            $("#planLinksSearchButton").off('click').on('click', function(){
                planDocumentsPage.getSelectedPlanLinks();
            });   
            $("#adHocScriptRunButton").off('click').on('click', function(){
                planDocumentsPage.runAdHocScript();
            });
        },
        getLinkUpdateUrl: function(options){
            var opts = _.extend({}, {
                quotingPath: this.getQuotingPath(),
                planId: DEFAULT_PLANID,

            }, options);

        },
        test:function(msg){
            this.printMessage(msg);
        },
        getSbcPutTemplate: function(){
            var propName = "sbcPutTemplate";
            var sbcPutTemplate = this.prop(propName);
            if(!sbcPutTemplate) {
                var templateSource = $("#sbcLinkPutTemplate").val();
                sbcPutTemplate = handlebars.compile(templateSource);
                this.prop(propName, sbcPutTemplate);
            }
            return sbcPutTemplate;
        },
        renderSbcPutTemplate: function(model){
            return this.getSbcPutTemplate()(model);
        },
        renderPutLinks: function(){
            var selectedEnv = $("#vimlyEnv option:selected").text(); 
            envs.setCurrent(selectedEnv);  
            var quotingPath = envs.getQuotingPath();
            _.each(planDocumentsPage.prop("planIds"), planId => {
                var putUrl = this.renderSbcPutTemplate({
                    quotingPath: quotingPath,
                    planId: planId,
                    effectiveYear: this.planYear(),
                    effectiveMonth: this.planMonth()
                })
            });
        }
    }

    planDocumentsPage.load();
    planDocumentsPage.attachEventHandlers();

    window.planDocumentPage = planDocumentsPage;
    window.planDocs = planDocumentsPage;
})