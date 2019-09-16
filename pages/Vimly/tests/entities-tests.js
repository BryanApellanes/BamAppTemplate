const testEnv = "local";

const expect = chai.expect,
    assert = chai.assert,
    should = chai.should(),
    _ = require('lodash');    

describe("entity client", function(){
    var entities = require('../entities');
    it("should retrieve all applications", function(done) {
        entities.retrieveAll("Application")
            .then(queryResponse => {
                console.log(JSON.stringify(queryResponse.metadata, null, 2));
                expect(queryResponse.entities.length >= 1).to.be.true;

                _.each(queryResponse.entities, (entity, i) => {
                    //console.log(JSON.stringify(entity, null, 2));
                });
                done();
            })
    })

    it("should be able to get application by id", function(done) {
        entities.retrieveAll("Application")
            .then(qr => {
                var first = qr.entities[0],
                    meta = entities.getMeta(first);
                
                expect(meta.id).to.not.be.null;

                entities.retrieve("Application", meta.id).then(app => {

                    expect(app.id).to.equal(meta.id);
                    console.log(`retrieved application ${app.friendlyId} successfullly`);

                    done();
                })
            })
    })

    it("should be able to get plan sponsors", function(done){
        entities.retrieveAll("PlanSponsor")
            .then(qr => {
                var first = qr.entities[0],
                    meta = entities.getMeta(first);

                expect(meta.id).to.not.be.null;

                entities.retrieve("PlanSponsor", meta.id).then(planSponsor => {

                    console.log("*** plan sponsor");
                    console.log(JSON.stringify(planSponsor, null, 2));
                    console.log("*** / plansponsor");
                    expect(planSponsor.id).to.equal(meta.id);

                    done();
                })
            })
    })
})