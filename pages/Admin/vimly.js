
var vimly = {
    environments: require('../Vimly/environments.js'),
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
    }
};

module.exports = vimly;

if(undefined !== window){
    window.vimly = vimly;
}