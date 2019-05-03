var args = require('./cli-args');

for(arg in args.parsed){
    console.log(`${arg} = ${args.parsed[arg]}`);
}

for(arg in args){
    console.log(`${arg} = ${args[arg]}`);
}