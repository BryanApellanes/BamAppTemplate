var expect = chai.expect,
    addressSvc = require("./addressServiceClient.js.js"),
    findADentistLinkMgr = require('../../../FindProvider/FindADentistLinkManager'),
    _ = require('lodash');

describe("the test", function(){
    it("should run", function(){
        chai.expect(true).to.equal(true);
    });
});

describe("Address service", function(){
    it("can get counties", function(done) {        
        addressSvc.getCounties("US")
            .then((provinceResponse) => {
                console.log(JSON.stringify(provinceResponse));
                expect(_.isArray(provinceResponse.provinceList)).to.equal(true);
                done();
            })
            .catch(e => {
                throw e;      
                done();
            });
    })
})

describe("find a dentist link manager", function(){
    it("can check a plan by id and effective year and month", function(done){
        findADentistLinkMgr.checkPlan('H2E8WB43678232', '2019', '08')
            .then(()=> {
                done();
            });
    })
})