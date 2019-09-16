const testEnv = "local";

const expect = chai.expect,
    should = chai.should();
    _ = require('lodash'),
    caseMgmt = require('./caseManagement'),
    environments = require("../environments");

describe("The Case Management tests", function(){
    it("should run", function(){
        chai.expect(true).to.equal(true);
    });
});

require('../tests/casemanagement-tests');

require('../tests/entities-tests');


