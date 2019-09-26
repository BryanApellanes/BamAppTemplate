import { template } from "handlebars";

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
        load: function(){
            var _this = this;
            planDetails.getPdfFileNames().then(function(data) { 
                _this.setProp("documentNames", data);              
                var dataSet = []; // create the data set to account for future changes that return objects instead of strings
                _.each(data, pdf => {
                    var row = [];
                    row.push(pdf);
                    dataSet.push(row);
                });
                documentNamesTable = $("#documentNames").DataTable({
                    data: dataSet,
                    columns: [
                        {title: "Name"}
                    ]
                });
            });

            planDetails.getPlanIds().then(function(data) {
                _this.setProp("planIds", data);
                var dataSet = [];
                _.each(data, planId => {
                    var row = [];
                    row.push(planId);
                    dataSet.push(row);
                });
                planIdsTable = $("#planIds").DataTable({
                    data: dataSet,
                    columns: [
                        {title: "Plan Ids"}
                    ]
                });
            });
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
        getPlanLinks: function(){
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
                    
                    xhr.get(header, getUrl).then(x => {
                        debugger;
                        var data = JSON.parse(x.responseText);
                        _.each(data, (d) => {
                            console.log(JSON.stringify(d));
                        })
                    });
                })
                .catch(e => console.log(e));
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
                planDocumentsPage.getPlanLinks();
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
            _.each(planDocumentsPage.prop("planIds"), planId => {
                var putUrl = this.renderSbcPutTemplate({
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