var _ = require('lodash'),
    xhr = require('./xhr')({lodash: _})
    token = 'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIwNjE4YzBiNS0wYmExLTQ0NmQtOTBkZS0wNWYyOGJiY2FjMGYiLCJzdWIiOiJiZWJjYWQ4NS02NDUxLTQwNmMtYTMzZi02OWM4MjlmZWI5MzAiLCJpc3MiOiJodHRwczovL3F1b3RpbmctYXBpLXByb2owNS5wcm9kLnNpbW9uMzY1LmNvbSIsImlhdCI6MTU1OTA1NTY5OSwibmJmIjoxNTU5MDU1Mzk5LCJleHAiOjE1OTA2MTI2MjUsInNzIjpudWxsLCJ2ZXIiOjEsInR5cCI6IlNFUlZJQ0VfQUNDT1VOVCIsInJvbCI6W119.UtRyBC1rRQ95DnN1xOYiGXc1-JoVjXzUTEv97q28CT4';

xhr.get({
            Authorization: `Bearer ${token}`
        }, "https://quoting-api-proj05.prod.simon365.com/entity/v1/entity/Application")
        .then(data=> {
            console.log(JSON.stringify(data));
        })