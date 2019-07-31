var cliArgs = (function(){
    var parsedArgs = {};

    for(var i = 0; i < process.argv.length; i++){
        var arg = process.argv[i];
        var nameValue = arg.split(':');
        if(nameValue.length === 1){
            if(nameValue[0].startsWith("/")){
                var name = nameValue.toString();
                name = name.substring(1, name.length);
                parsedArgs[name] = true;
            } else {
                parsedArgs[arg] = true;
            }
        } else if(nameValue.length === 2) {
            var name = nameValue[0];
            if(name.startsWith("/")) {
                name = name.substring(1, name.length);
            }
            parsedArgs[name] = nameValue[1].replace(/_/g, ' ');
        }
    }

    var result = {
        parsed: parsedArgs
    };
    for(var argName in parsedArgs){
        result[argName] = parsedArgs[argName];
    }
    return result;
})()

module.exports = cliArgs;