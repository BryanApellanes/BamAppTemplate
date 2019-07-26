require('colors');

var fs = require('fs');
var Handlebars = require('handlebars');
var args = require('./cli-args');
var name = args['name'];
var title = args['title'];
var force = args['f'];

if(name && title){
    var source = fs.readFileSync('./Templates/Pages/main.hbs', {encoding: 'utf8'});
    var template = Handlebars.compile(source);
    var dir = `./Pages/${name}`;
    var mainHtml = `${dir}/main.html`;
    var mainJs = `${dir}/main.js`;
    var readme = `${dir}/README.md`;

    if(!fs.existsSync(mainHtml) || force) {
        var result = template({Title: title, Name: name});
        if(!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        fs.writeFileSync(mainHtml, result, 'utf8');
        fs.writeFileSync(mainJs, `// ${name}`);
        fs.writeFileSync(readme, `# ${name} ${title}`);
    } else {
        console.log(`file already exists: ${mainHtml}`);
    }
} else {
    console.log('please specify /name:<name> and /title:<title>'.yellow);
}
