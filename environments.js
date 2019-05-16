var environments = (function(){
    serviceProviderId = "3d9c7c71-4860-496e-8880-bbbe0f830b4d",
    proj05Token = "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI1MzQxYTg5ZS01ODIzLTQzNWEtODMwMC1iODBiZTA0ZWU4ZDEiLCJzdWIiOiJiZWJjYWQ4NS02NDUxLTQwNmMtYTMzZi02OWM4MjlmZWI5MzAiLCJpc3MiOiJodHRwczovL3F1b3RpbmctYXBpLXByb2owNS5wcm9kLnNpbW9uMzY1LmNvbSIsImlhdCI6MTU0NzE0NzQzNCwibmJmIjoxNTQ3MTQ3MTM0LCJleHAiOjE1Nzg3MDQzNjAsInNzIjpudWxsLCJ2ZXIiOjEsInR5cCI6IlNFUlZJQ0VfQUNDT1VOVCIsInJvbCI6W119.CD7lRMXD8glyH8yZHfUKoNLQjcctcKi-YeJstgjvHbE";
    testToken = "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI0ZTQ4OGY5Mi03NDdkLTQ0YzMtOTUzMS1lYTc5NmQ1NDhkNzMiLCJzdWIiOiJiZWJjYWQ4NS02NDUxLTQwNmMtYTMzZi02OWM4MjlmZWI5MzAiLCJpc3MiOiJodHRwczovL3F1b3RpbmctYXBpLXRlc3QudGVzdC5zaW1vbjM2NS5jb20iLCJpYXQiOjE1NDcyMjY1NzgsIm5iZiI6MTU0NzIyNjI3OCwiZXhwIjoxNTc4NzgzNTA0LCJzcyI6bnVsbCwidmVyIjoxLCJ0eXAiOiJTRVJWSUNFX0FDQ09VTlQiLCJyb2wiOltdfQ.gkPc23_Osk31aI-Zpi9w_gkk5ZU4uZO0xATCVdOfajw";
    localToken = "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIyZTkwZjY4Yi1mOTExLTQxNTctYWJmMS0yOTRmMWM1NzBjMmEiLCJzdWIiOiJiZWJjYWQ4NS02NDUxLTQwNmMtYTMzZi02OWM4MjlmZWI5MzAiLCJpc3MiOiJodHRwczovL3F1b3RpbmctYXBpLXRlc3QudGVzdC5zaW1vbjM2NS5jb20iLCJpYXQiOjE1NDcxNTA5MzAsIm5iZiI6MTU0NzE1MDYzMCwiZXhwIjoxNTc4NzA3ODU2LCJzcyI6bnVsbCwidmVyIjoxLCJ0eXAiOiJTRVJWSUNFX0FDQ09VTlQiLCJyb2wiOltdfQ.9cU4-8D-3XDMQix7c40rqtkabVa5--U9p71LH6sM6ck";
    prodToken = "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJmNTY1Y2EzMi1kZWZhLTQzZGQtYjBjOC00ZGNjNzFlODVhYTMiLCJzdWIiOiJiZWJjYWQ4NS02NDUxLTQwNmMtYTMzZi02OWM4MjlmZWI5MzAiLCJpc3MiOiJodHRwczovL3F1b3RpbmctYXBpLnByb2Quc2ltb24zNjUuY29tIiwiaWF0IjoxNTU2NTY2OTczLCJuYmYiOjE1NTY1MzA5NzMsImV4cCI6MTU4ODEyMzg5OSwic3MiOm51bGwsInZlciI6MSwidHlwIjoiU0VSVklDRV9BQ0NPVU5UIiwicm9sIjpbXX0.hc3wt7d27gow_lm3jnexFJg777C3y04oMqxphi18THw";
    authToken = localToken,
    tokens = {
        proj05: proj05Token,
        local: localToken,
        test: testToken,
        prod: prodToken
    },
    quotingPaths = {
        proj05: "https://quoting-api-proj05.prod.simon365.com/quoting/api/v1",
        test: "https://quoting-api-test.test.simon365.com/quoting/api/v1",
        local: "http://localhost:2001/quoting/api/v1",
        prod: "https://quoting-api.prod.simon365.com/quoting/api/v1"
    },  
    ratesPaths = {
        proj05: "https://quoting-api-proj05.prod.simon365.com/rates/api/v1",
        test: "https://quoting-api-test.test.simon365.com/rates/api/v1/products",
        local: "http://localhost:10080/rates/api/v1",
        prod: "https://quoting-api.prod.simon365.com/rates/api/v1"
    },  
    defaultSvcProviderId = '3d9c7c71-4860-496e-8880-bbbe0f830b4d';

    var current = {
        env: "local",
        token: tokens.local,
        quotingPath: quotingPaths.local,
        ratesPath: ratesPaths.local,
        serviceProviderId: defaultSvcProviderId
    }

    return {
        isValidEnv: function(env) {
            if(!quotingPaths[env]){
                console.log(`Unable to determine QUOTING path for specified env: ${env}`.red);
                return false;
            }
            if(!ratesPaths[env]){
                console.log(`Unable to determine RATES path for the specified env: ${env}`.red);
                return false;
            }
            if(!tokens[env]){
                console.log(`Unable to determine TOKEN for specified env: ${env}`.red);
                return false;
            }
            return true;
        },
        setCurrent: function(env){    
            if(!this.isValidEnv(env)) {
                throw new Error(`Invalid env ${env}`);
            }        
            current.env = env;
            current.token = tokens[env];
            current.quotingPath = quotingPaths[env];
            current.ratesPath = ratesPaths[env];            
        },    
        getCurrent: function() {
            return current;
        },
        getRatesPath: function(){
            console.log(`getRatesPath: environment currently set to ${current.env}`);
            return current.ratesPath;
        },
        getQuotingPath: function(){
            console.log(`getQuotingPath: environment currently set to ${current.env}`);
            return current.quotingPath;
        },
        getToken: function() {
            console.log(`getToken: environment currently set to ${current.env}`);
            return current.token;
        }        
    }
})()

module.exports = environments;