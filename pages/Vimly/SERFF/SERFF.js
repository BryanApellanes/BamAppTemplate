$(document).ready(function(){
    var envs = require('../environments.js'),
        dataTableTools = require('../../../js/bam/ui/dataTableTools.js'),
        costShareVarianceProperties = [
            "hiosPlanId",
            "planVariantMarketingName",
            "inNetworkIndividualDeductible",
            "inNetworkFamilyDeductible",
            "outOfNetworkIndividualDeductible",
            "outOfNetworkFamilyDeductible",
            "inNetworkIndividualMaxOutOfPocket",
            "inNetworkFamilyMaxOutOfPocket",
            "outOfNetworkIndividualMaxOutOfPocket",
            "outOfNetworkFamilyMaxOutOfPocket",
            "defaultCoinsurance",
            "coPaymentPCP",
            "coPaymentOfficeVisit",
            "hsaEligible",
            "planId",
            "planVariant"
        ]

    function getAuthHeader(){
        var selectedEnv = $("#vimlyEnv option:selected").text(); 
        envs.setCurrent(selectedEnv);
        return envs.getAuthorizationHeader(selectedEnv);        
    }

    function getRatesPath(){
        var selectedEnv = $("#vimlyEnv option:selected").text(); 
        envs.setCurrent(selectedEnv);
        return envs.getRatesPath();
    }

    function getCostShareVarianceFromInputs(){
        var result = {};
        _.each(costShareVarianceProperties, (prop) => {
            var inputFieldset = $("#costShareVarianceInputs");
            result[prop] = $(`[name=${prop}]`, inputFieldset).val()
        })
        return result;
    }

    function getEffectiveYear() {
        return $("#effectiveYear").val() || new Date().getFullYear() + 1;
    }

    var serffPage = {
        load: function(){
            $("#effectiveYear").val(new Date().getFullYear() + 1);
            this
                .loadCostShareVarianceData()
                .then(this.attachEventHandlers);
        },
        updateCostShareVariance: function(costShareVariance, effectiveYear) {
            var ratesPath = getRatesPath(),
                xhr = bam.xhr(),
                putUrl = `${ratesPath}/products/serff/3d9c7c71-4860-496e-8880-bbbe0f830b4d/${effectiveYear}/costsharevariance/${costShareVariance.planId}`;

                return new Promise((resolve, reject) => {
                    getAuthHeader().then(header => {
                        delete costShareVariance.planId;
                        delete costShareVariance.planVariant;
                        xhr
                            .put(JSON.stringify(costShareVariance), header, putUrl)
                            .then(resolve)
                            .catch(reject);
                    })
                });
        },
        deleteCostShareVariance: function(costShareVariance, effectiveYear){
            var ratesPath = getRatesPath(),
                xhr = bam.xhr(),
                deleteUrl = `${ratesPath}/products/serff/3d9c7c71-4860-496e-8880-bbbe0f830b4d/${effectiveYear}/costsharevariance/${costShareVariance.planId}`;

                return new Promise((resolve, reject) => {
                    getAuthHeader().then(header => {
                        xhr
                            .delete(header, deleteUrl)
                            .then(resolve)
                            .catch(reject);
                    })
                });
        },
        attachEventHandlers: function(){
            var _this = this;

            dataTableTools.onRowSelected("costShareVarianceTable", (data) => {
                var obj = dataTableTools.rowToObj(costShareVarianceProperties, data[0]);
                for(var prop in obj){
                    var inputFieldset = $("#costShareVarianceInputs");
                    $(`[name=${prop}]`, inputFieldset).val(obj[prop]);
                }
            });

            $("#reloadButton").off("click").on("click", function(e){
                serffPage.loadCostShareVarianceData();
            });

            $("#updateButton").off("click").on("click", function(e){
                var data = getCostShareVarianceFromInputs();
                serffPage.updateCostShareVariance(data, getEffectiveYear()).then(serffPage.loadCostShareVarianceData);
            });

            $("#deleteButton").off("click").on("click", function(e) {
                var data = getCostShareVarianceFromInputs();
                serffPage.deleteCostShareVariance(data, getEffectiveYear()).then(serffPage.loadCostShareVarianceData);
            });
        },
        loadCostShareVarianceData: function(){
            return dataTableTools.populateTable("costShareVarianceTable", serffPage.getCostShareVarianceData, {
                inNetworkIndividualDeductible: {
                    width: "1000px"
                }
            });
        },
        getCostShareVarianceData: function(effectiveYear){
            effectiveYear = effectiveYear || new Date().getFullYear() + 1;
            return new Promise((resolve, reject) => {
                getAuthHeader()
                    .then(header => {
                        var ratesPath = envs.getRatesPath(),
                            xhr = bam.xhr();
                        
                        var getUrl = `${ratesPath}/products/serff/3d9c7c71-4860-496e-8880-bbbe0f830b4d/${effectiveYear}/costsharevariance`;

                        xhr.get(header, getUrl)
                            .then(x => {
                                resolve(JSON.parse(x.responseText));
                            })
                            .catch(reject);
                    })
                    .catch(reject);
            });
        }
    }

    serffPage.load();

    window.serffPage = serffPage;
})