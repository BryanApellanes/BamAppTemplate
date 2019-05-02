var linkAdmin = (function(){
    function getAuthToken(){
        return $("#authToken").val();
    }

    function getAjaxConfig() {
        return {
            contentType: "application/json",
            method: "POST",
            headers: {
                "Authorization": "Bearer " + getAuthToken()
            }
        }
    }
    function _post(path, data){
        return new Promise((resolve, reject) => {
            $.ajax($.extend(getAjaxConfig(), {
                url: path,
                data: JSON.stringify(data),
                method: "POST",
                success: function(data){
                    resolve(data);
                },
                error: function(){
                    reject(arguments);
                }
            }))
        });
    }

    function _get(path, data){
        return new Promise((resolve, reject) => {
            $.ajax($.extend(getAjaxConfig(), {
                url: path,
                method: "GET",
                data: JSON.stringify(data),
                success: function(data){
                    resolve(data);
                },
                error: function(){
                    reject(arguments);
                }
            }))
        })
    }

    function _delete(path){
        return new Promise((resolve, reject) => {
            $.ajax($.extend(getAjaxConfig(), {
                url: path,
                method: "DELETE",
                success: function(){
                    resolve(arguments);
                },
                error: function(){
                    reject(arguments);
                }
            }))
        })
    }

    return {
        getPlanLinks: function(mapping) {
            var url = `${getRatesPath()}/products/medical/plans/${getServiceProviderId()}/${mapping.EffectiveYear}/${mapping.PlanId}/info/links?effectiveDate=${mapping.EffectiveDate}`;
            return _get(url);
        }
    }
})();
