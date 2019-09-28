
var fs = require('fs');
var _ = require('lodash');
var fileName = "2020MedicalPlans.json";

require('colors');

var json = fs.readFileSync(`./${fileName}`, 'utf8');

var medicalPlans = JSON.parse(json);
_.each(medicalPlans, plan => console.log(`${plan.planId} - ${plan.planName} - ${JSON.stringify(plan.planDetails.links, null, 2)}`));


var sbcLinksToUpdate = [];
var bgLinksToUpdate = [];
_.each(medicalPlans, plan => {
    if(plan.planDetails.links){
        _.each(plan.planDetails.links, link => {
            if(link.type == "DOCUMENT"){
                if(link.subType =="DOCUMENT_SBC"){
                    sbcLinksToUpdate.push(_.extend({planId: plan.planId}, link));
                }
                if(link.subType == "DOCUMENT_BENEFIT_GRID"){
                    bgLinksToUpdate.push(_.extend({planId: plan.planId}, link));
                }
            }
        })
    }
});

console.log(`There are ${medicalPlans.length} medical plans in the file ${fileName}`.yellow);
console.log(`There are ${sbcLinksToUpdate.length} sbc links that need to be updated`.yellow);
console.log(`There are ${bgLinksToUpdate.length} benefits grid links that need to be updated`.yellow);

fs.writeFileSync('./linksTofix.json', JSON.stringify(sbcLinksToUpdate, null, 2), 'utf8');

_.each(sbcLinksToUpdate, link => console.log(JSON.stringify(link, null, 2).blue));

var linksToFix = JSON.parse(fs.readFileSync('./linksToFix.json'));
var fixedLinks = [];
var storageRootOld = 's3://quoting.prod.prod.simon365.com/sbc/';
var storageRootNew = 's3://quoting.prod.prod.simon365.com/sbc/2020-01-01/';
_.each(linksToFix, link => {
    var fixed = _.clone(link);
    fixed.link = fixed.link.replace(storageRootOld, storageRootNew);
    var planId = fixed.planId;
    delete fixed.planId;
    fixedLinks.push({planId: planId, link: fixed});
})

fs.writeFileSync('./fixedLinks.json', JSON.stringify(fixedLinks, null, 2), 'utf8');
console.log(`There are ${fixedLinks.length} fixed links`.yellow);

var putUrls = [];
// /products/medical/plans/3d9c7c71-4860-496e-8880-bbbe0f830b4d/2020/49316MN1070001/info/links/4fc6caf7-0794-3d4a-af5d-8554aa788dfe?effectiveDate=2020-01-01
_.each(fixedLinks, fixedLink => {
    putUrls.push({ 
        url: `/products/medical/plans/3d9c7c71-4860-496e-8880-bbbe0f830b4d/2020/${fixedLink.planId}/info/links/${fixedLink.link.id}?effectiveDate=2020-01-01`,
        link: fixedLink.link
    });
});

fs.writeFileSync('./putUrls.json', JSON.stringify(putUrls, null, 2), 'utf8');
