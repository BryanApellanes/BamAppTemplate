var fs = require('fs');

var json = fs.readFileSync('../data/json/product-service-plans-cache.json', 'utf8');

var plans = JSON.parse(json);

var ids = '';
for(id in plans){
    var planId = plans[id].planId;
    console.log(planId);
    ids += `${planId}\r\n`;
}

fs.writeFileSync('../data/csv/planIds.txt', ids, 'utf8');