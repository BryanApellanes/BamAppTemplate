require('colors');

var fs = require('fs');
var Handlebars = require('handlebars');
var args = require('./cli-args');
var name = args['name'];
var title = args['title'];
var force = args['f'];

if(name && title){
    var mainSrc = fs.readFileSync('./Templates/Tools/main.hbs', {encoding: 'utf8'});
    var testSrc = fs.readFileSync('./Templates/Pages/Tools/test.js.hbs', {encoding: 'utf8'});
    var mainTemplate = Handlebars.compile(mainSrc);
    var testTemplate = Handlebars.compile(testSrc);
    var dir = `./Pages/Tools/${name}`;
    var mainHtml = `${dir}/main.html`;
    var mainJs = `${dir}/main.js`;
    var testJs = `${dir}/tests.js`;
    var readme = `${dir}/README.md`;

    if(!fs.existsSync(mainHtml) || force) {
        var mainContent = mainTemplate({Title: title, Name: name});
        var testContent = testTemplate({Title: title, Name: name});
        if(!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        fs.writeFileSync(mainHtml, mainContent, 'utf8');
        fs.writeFileSync(mainJs, `// ${name}
require('./tests.js');
`);
        fs.writeFileSync(readme, `# ${name} ${title}`);
        fs.writeFileSync(testJs, testContent);
    } else {
        console.log(`file already exists: ${mainHtml}`);
    }
} else {
    console.log('please specify /name:<name> and /title:<title>'.yellow);
}
