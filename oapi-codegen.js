const path = require('path');
const codegen = require('swagger-node-codegen');
const args = require('./cli-args');
const colors = require('colors');
const swagger = args['swagger'];
const output = args["output"];

if(!swagger || !output){
    console.log('Please specify a swagger file and output directory (will be created if it does not exist)'.red);
} else {
    console.log(`swagger: ${swagger}`.yellow);
    console.log(`output: ${output}`.yellow);
    
    codegen.generate({
        swagger: path.resolve(__dirname, swagger),
        target_dir: path.resolve(__dirname, output)
    }).then(()=> {
        console.log("done".green);
    }).catch((ex)=> {
        console.error(`Something went wrong: ${ex.message}`);
    })
}