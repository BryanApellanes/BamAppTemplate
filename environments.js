var environments = (function(){
    var serviceProviderId = "3d9c7c71-4860-496e-8880-bbbe0f830b4d",
        proj05Token = "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIwNjE4YzBiNS0wYmExLTQ0NmQtOTBkZS0wNWYyOGJiY2FjMGYiLCJzdWIiOiJiZWJjYWQ4NS02NDUxLTQwNmMtYTMzZi02OWM4MjlmZWI5MzAiLCJpc3MiOiJodHRwczovL3F1b3RpbmctYXBpLXByb2owNS5wcm9kLnNpbW9uMzY1LmNvbSIsImlhdCI6MTU1OTA1NTY5OSwibmJmIjoxNTU5MDU1Mzk5LCJleHAiOjE1OTA2MTI2MjUsInNzIjpudWxsLCJ2ZXIiOjEsInR5cCI6IlNFUlZJQ0VfQUNDT1VOVCIsInJvbCI6W119.UtRyBC1rRQ95DnN1xOYiGXc1-JoVjXzUTEv97q28CT4",//"eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJlYTkyOTFlYi0wY2FhLTRmMjItODI3My03ZjlkZTU5MGE1OWUiLCJzdWIiOiJiZWJjYWQ4NS02NDUxLTQwNmMtYTMzZi02OWM4MjlmZWI5MzAiLCJpc3MiOiJodHRwczovL3F1b3RpbmctYXBpLXByb2owNS5wcm9kLnNpbW9uMzY1LmNvbSIsImlhdCI6MTU1NTQyNjUxMywibmJmIjoxNTU1NDI2MjEzLCJleHAiOjE1ODY5ODM0MzksInNzIjpudWxsLCJ2ZXIiOjEsInR5cCI6IlNFUlZJQ0VfQUNDT1VOVCIsInJvbCI6W119.3bw8aZBBSgyFkjzIvFeyBJFDX1D_Sp1t9TVwFQR-kNU",
        testToken = "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI0ZTQ4OGY5Mi03NDdkLTQ0YzMtOTUzMS1lYTc5NmQ1NDhkNzMiLCJzdWIiOiJiZWJjYWQ4NS02NDUxLTQwNmMtYTMzZi02OWM4MjlmZWI5MzAiLCJpc3MiOiJodHRwczovL3F1b3RpbmctYXBpLXRlc3QudGVzdC5zaW1vbjM2NS5jb20iLCJpYXQiOjE1NDcyMjY1NzgsIm5iZiI6MTU0NzIyNjI3OCwiZXhwIjoxNTc4NzgzNTA0LCJzcyI6bnVsbCwidmVyIjoxLCJ0eXAiOiJTRVJWSUNFX0FDQ09VTlQiLCJyb2wiOltdfQ.gkPc23_Osk31aI-Zpi9w_gkk5ZU4uZO0xATCVdOfajw",
        localToken = "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI0N2RjY2I5ZC04ZmZkLTQzMWUtOTRiNC01Y2VjMzhkZjIxZmYiLCJzdWIiOiJiZWJjYWQ4NS02NDUxLTQwNmMtYTMzZi02OWM4MjlmZWI5MzAiLCJpc3MiOiJodHRwczovL3F1b3RpbmctYXBpLXByb2owNS5wcm9kLnNpbW9uMzY1LmNvbSIsImlhdCI6MTU1OTgzMTAzNSwibmJmIjoxNTU5ODMwNzM1LCJleHAiOjE1OTEzODc5NjEsInNzIjpudWxsLCJ2ZXIiOjEsInR5cCI6IlNFUlZJQ0VfQUNDT1VOVCIsInJvbCI6W119.wwJWh6CqW7yRi_DPt0XZQLhCHBkpJ9KKiyrpHrsj7G0",
        prodToken = "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJmNTY1Y2EzMi1kZWZhLTQzZGQtYjBjOC00ZGNjNzFlODVhYTMiLCJzdWIiOiJiZWJjYWQ4NS02NDUxLTQwNmMtYTMzZi02OWM4MjlmZWI5MzAiLCJpc3MiOiJodHRwczovL3F1b3RpbmctYXBpLnByb2Quc2ltb24zNjUuY29tIiwiaWF0IjoxNTU2NTY2OTczLCJuYmYiOjE1NTY1MzA5NzMsImV4cCI6MTU4ODEyMzg5OSwic3MiOm51bGwsInZlciI6MSwidHlwIjoiU0VSVklDRV9BQ0NPVU5UIiwicm9sIjpbXX0.hc3wt7d27gow_lm3jnexFJg777C3y04oMqxphi18THw",
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
            test: "https://quoting-api-test.test.simon365.com/rates/api/v1",
            local: "http://localhost:10080/rates/api/v1",
            prod: "https://quoting-api.prod.simon365.com/rates/api/v1"
        },  
        addressPaths = { // all the same 
            proj05: "https://quoting-api-proj05.prod.simon365.com/address/v1",
            test: "https://quoting-api-proj05.prod.simon365.com/address/v1",
            local: "https://quoting-api-proj05.prod.simon365.com/address/v1",
            prod: "https://quoting-api-proj05.prod.simon365.com/address/v1"
        }

        defaultSvcProviderId = '3d9c7c71-4860-496e-8880-bbbe0f830b4d';

    var current = {
        env: "local",
        token: tokens.local,
        quotingPath: quotingPaths.local,
        ratesPath: ratesPaths.local,
        addressPath: addressPaths.local,
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
            current.addressPath = addressPaths[env];
            current.ratesPath = ratesPaths[env];            
        },    
        getCurrent: function() {
            return current;
        },
        getSettings: function(env) {            
            if(!this.isValidEnv(env)) {
                throw new Error(`invalid env ${env}`);
            }
            return {
                env: env,
                token: tokens[env],
                quotingPath: quotingPaths[env],
                addressPath: quotingPaths[env],
                ratesPath: ratesPaths[env],
                serviceProviderId: defaultSvcProviderId
            }
        },
        getRatesPath: function(){
            console.log(`getRatesPath: environment currently set to ${current.env}`);
            return current.ratesPath;
        },
        getQuotingPath: function(){
            console.log(`getQuotingPath: environment currently set to ${current.env}`);
            return current.quotingPath;
        },
        getAddressPath: function(){
            console.log(`getAdddressPath: environment currently set to ${current.env}`);
            return current.addressPath;
        },
        getToken: function() {
            console.log(`getToken: environment currently set to ${current.env}`);
            return current.token;
        },
        getAuthorizationHeader: function(){
            return {
                "Authorization": `Bearer ${current.token}`
            };
        }       
    }
})()

module.exports = environments;