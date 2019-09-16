var fs = require("fs");
var _ = require("lodash");
var csvPath = './DentalPlanIds_Next.txt';
var perFile = process.argv[2];
var csvContent = fs.readFileSync(csvPath, 'utf-8'),
    csvLines = csvContent.split("\n"),
    mappings = [];

console.log(`there are ${csvLines.length} rows in the file ${csvPath}`);
var fileNumber = 0;
while(csvLines.length > 0) {
    fileNumber++;
    console.log(fileNumber);
    for(var i = 0; i < perFile; i++) {
        var line = csvLines.pop(); 
        if(!_.isUndefined(line)){                
            line = line.trim();
            if(line !== ''){
                fileName = `./DentalPlanIds_${fileNumber}.txt`;
                fs.appendFileSync(fileName, `${line}\r\n`);
                console.log(`wrote ${line} => ${fileName}`);
            }
        }   
    }
    console.log("next");
}
