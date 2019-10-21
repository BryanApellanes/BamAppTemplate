var _ = require('lodash'),
    xhr = require('./xhr')({lodash: _})
    

xhr.get({
            Authorization: `Bearer ${token}`
        }, "https://quoting-api-proj05.prod.simon365.com/entity/v1/entity/Application")
        .then(data=> {
            console.log(JSON.stringify(data));
        })

// testing change again