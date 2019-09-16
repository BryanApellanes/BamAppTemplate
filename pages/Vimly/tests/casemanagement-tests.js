const expect = chai.expect,
    assert = chai.assert,
    should = chai.should(),
    _ = require('lodash'),
    colors = require('colors')
    testEnv = 'proj05';    

function msg(txt) {
    console.log(txt);
}

function createTestCase(cm) {
    var caseMgmt = cm;
    return new Promise((resolve, reject) => {
        getTestData()
            .then(testApp => {
                caseMgmt
                    .createCase(testApp)
                        .then(testCase => {
                            resolve(testCase);
                        })
                        .catch(reject);
            })
            .catch(reject);
    });
}

function createTestCaseInEnvironment(env){
    return createTestCase(getCaseManagement(env));
}

function createThisManyTestCasesInEnvironment(count, env){
    var testCasePromises = [];
    for(var i = 0; i < count; i++){
        testCasePromises.push(createTestCaseInEnvironment(env));
    }
    return testCasePromises;    
}

function getCaseManagement(env){
    var caseMgmt = require('../CaseManagement/caseManagement');
    caseMgmt.setEnvironment(env);
    return caseMgmt;
}
var testEntities = null; // when hydrated {planSponsors: [], agents: [], applications: []}
var getTestEntitiesPromiseCalled = 0; // tracks the number of times the retrieval promise was entered to ensure limited calls to entity

function getTestEntities(){
    msg('getting test entities');
    if(testEntities !== null){
        msg('test entities already retrieved');
        return Promise.resolve(testEntities);
    }
    return new Promise((resolve, reject) => {
        getTestEntitiesPromiseCalled++;
        var results = {};
        msg('retrieving all plan sponsors');
        entities.retrieveAll("PlanSponsor").then(function(planSponsorResponse){
            results.planSponsors = planSponsorResponse.entities;
            msg('retrieving all agents');
            entities.retrieveAll("Agent").then(function(agentResponse){
                results.agents = agentResponse.entities;
                msg('retrieving all applications');
                entities.retrieveAll("Application").then(function(applicationResponse){
                    results.applications = applicationResponse.entities;
                    msg('resolving test entities');
                    testEntities = results;
                    resolve(results);
                }).catch(reject);
            }).catch(reject);
        }).catch(reject);
    });
}

var testData = null;
function randomNumberBetween(min, max){
   return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function pickFrom(arrayOfOptions){
    return arrayOfOptions[randomNumberBetween(0, arrayOfOptions.length)];
}

function randomString(thisLong){
    var letters = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],
        result = '';

    for(var i = 0; i < thisLong; i++){
        result += letters[randomNumberBetween(0, 25)];
    }

    return result;
}

function getTestData() { // {planSponsorId: [UUID], agentId: [UUID], applicationId: [UUID]}
    msg("getting test data");
    if(testData !== null){
        msg("test data already set");
        return Promise.resolve(testData);
    }
    return new Promise((resolve, reject) => {
        getTestEntities().then(testEntities => {

            getTestApplicationOfType('NEW').then(testApp => {
                var testApplication = testApp,
                testPlanSponsor = testEntities.planSponsors[randomNumberBetween(0, 12)],
                testAgent = testEntities.agents[randomNumberBetween(0, 12)];

                testData = {
                    planSponsorId: entities.getMeta(testPlanSponsor).id,
                    agentId: entities.getMeta(testAgent).id,
                    applicationId: entities.getMeta(testApplication).id
                }

                resolve(testData);
            })
        }).catch(reject);
    });
}

function getTestApplication(){
    return getTestApplicationOfType("NEW");
}

function getTestApplicationOfType(applicationType){
    // valid types
    // QUOTE  <-- there may not be any of these in the first 25 results returned
    // NEW
    // RENEWAL_AS_IS
    // QUOTE_RENEWAL_WITH_CHANGE
    // QUOTE_MIDYEAR_CHANGE
    // QUOTE_SEGMENT_CHANGE
    // APPLICATION_RENEWAL_WITH_CHANGE
    // APPLICATION_MIDYEAR_CHANGE
    // APPLICATION_SEGMENT_CHANGE
    // APPLICATION_RENEWAL_PLAN_ONLY_CHANGE
    return new Promise((resolve, reject) => {
        getTestEntities()
            .then(testEntities => {
                _.map(testEntities.applications, (entity) =>{
                    console.log(`${entity.applicationType}\r\n`);
                })
                var appsOfType = _.filter(testEntities.applications, (entity) => entity.applicationType === applicationType),
                    testApplication = _.first(appsOfType);

                console.log(`*** test application of type ${applicationType} ***`);
                console.log(JSON.stringify(testApplication, null, 2));
                console.log(`*** / test application of type ${applicationType} ***`);
                resolve(testApplication);
            })
            .catch(reject);
    });
}

describe("the test tools", function(){
    it("should be able to get test entities", function(done){
        getTestEntities().then(function(results) {
            console.log(`there are ${results.planSponsors.length} plan sponsors`);
            console.log(`there are ${results.agents.length} agents`);
            console.log(`there are ${results.applications.length} applications`);
            done();
        });
    }).timeout(60000);

    it("should use the existing results", function(done){
        getTestEntities().then(function(results){
            expect(getTestEntitiesPromiseCalled).to.equal(1);
            done();
        });
    });

    it("should get application of specified type", function(done) {
        getTestApplicationOfType('NEW')
            .then(app => {
                expect(app).to.not.be.null;
                expect(app).to.not.be.undefined;
                expect(app.applicationType).to.equal("NEW");
                done();
            })
            .catch(e => {
                throw e;
            });
    }).timeout(60000);
})

describe("case management client", function(){

    async function getTestEntity(typeName) {
        const entities = require('../entities');
        var queryResponse = await entities.retrieveAll(typeName);
        return queryResponse.entities[0];
    }

    it("should be able to set env", function(done){
        var caseMgmt = getCaseManagement("proj05");
        caseMgmt.setEnvironment("local");
        var settings = caseMgmt.getSettings();
        expect(settings.env).to.equal("local");
        
        caseMgmt.setEnvironment('proj05');
        settings = caseMgmt.getSettings();
        expect(settings.env).to.equal('proj05');

        expect(settings.quotingPath).to.equal("https://quoting-api-proj05.prod.simon365.com/quoting/api/v1");

        done();
    })

    it("should be able to get test data", function(done){
        getTestData().then(data => {
            expect(data).to.not.be.null;
            expect(data.planSponsorId).to.not.be.null;
            expect(data.agentId).to.not.be.null;
            expect(data.applicationId).to.not.be.null;

            console.log(`*** test data ***\r\n${JSON.stringify(data)}`);
            done();
        })
    })

    it("should be able to create a new Case", function(done) {
        var caseMgmt = getCaseManagement(testEnv);

        getTestEntities().then(testEntities => {
            var testApplication = testEntities.applications[0],
                testPlanSponsor = testEntities.planSponsors[0],
                testAgent = testEntities.agents[0];

            console.log(`creating a case for application ${testApplication.friendlyId}`);
            var app = {
                planSponsorId: entities.getMeta(testPlanSponsor).id,
                agentId: entities.getMeta(testAgent).id,
                applicationId: entities.getMeta(testApplication).id
            };
            console.log(JSON.stringify(app, null, 2));
            caseMgmt
                .createCase(app).then(newCase => {
                    console.log(`created new case ${JSON.stringify(newCase, null, 2)}`);
                    var caseMeta = entities.getMeta(newCase);
                    console.log(`**** new case created ****\r\n${JSON.stringify(caseMeta, null, 2)}`);
                    done();
                })
                .catch(e => console.log(e));           
        });
    }).timeout(10000);

    it("should be able to update an existing Case", function(done){
        var caseMgmt = getCaseManagement(testEnv);

        createTestCase(caseMgmt).then(testCase => {
            var meta = entities.getMeta(testCase);
            console.log(JSON.stringify(testCase, null, 2));
            

            done();
        })
    }).timeout(6000);

    it("should be able to create a new Task", function(done){
        var _caseMgmt = getCaseManagement(testEnv);

        createTestCase(_caseMgmt).then(testCase => {
            var caseMeta = entities.getMeta(testCase);
            console.log(JSON.stringify(caseMeta, null, 2));
            
            caseMgmt.createTask(caseMeta.id, {
                title: "This is a test task",
                body: "this is the body"
            })
            .then(task=> {
                expect(task).to.not.be.null;
                var taskMeta = entities.getMeta(task);
                expect(taskMeta.id).to.not.be.null;
                expect(taskMeta.owner).to.be.an("array");
                expect(taskMeta.owner.length > 0).to.be.true;
                expect(_.includes(taskMeta.owner, `/v1/entity/TaskCase/${caseMeta.id}`)).to.be.true;
                console.log(JSON.stringify(task, null, 2));
                done();
            })
            .catch(e=>{
                throw e;
                done();
            })
        });
    })

    it("should be able to assign a Case", function(done){
        createTestCaseInEnvironment(testEnv).then(testCase => {
            var caseMeta = entities.getMeta(testCase);
            console.log(" *** assign case test (case meta)");
            console.log(JSON.stringify(caseMeta, null, 2));
            console.log(" *** / assign  case test (case meta)");
            caseMgmt.assignCase(caseMeta.id, {name: "Test Assignee"}).then(result=> {
                console.log("*** assigned case ***");
                console.log(JSON.stringify(result, null, 2));
                expect(result).to.not.be.null;
                expect(result).to.have.property('assignment');
                expect(result.assignment).to.be.an('array');
                expect(result.assignment.length > 0).to.be.true;
                console.log("*** / assigned case ***");
                done();
            })
        })
    }).timeout(10000);

// User can filter cases by assignee (actor)
    it("should be able to filter cases by assigned to", function(done) {
        var _caseMgmt = getCaseManagement(testEnv),
            testCasePromisess = createThisManyTestCasesInEnvironment(6, testEnv);

        Promise.all(testCasePromisess).then(testCases => {
            expect(testCases.length).to.equal(6);            
            // assign one of the cases to a random name
            var testCase = pickFrom(testCases), 
                caseMeta = entities.getMeta(testCase),
                testUser = {name: randomString(8)};

            _caseMgmt.assignCase(caseMeta.id, testUser)
                .then(taskCase => {
                    console.log(taskCase);
                    // filter for specified random name
                    _caseMgmt.filterCases({'assignedTo/name': testUser.name})
                        .then(caseResults => {
                            console.log(caseResults);
                            expect(caseResults.entities).to.be.an('array');
                            var firstCase = caseResults.entities[0];
                            expect(firstCase.assignment).to.be.an('array');
                            expect(firstCase.assignment[0].assignedTo.name).to.equal(testUser.name);
                            done();
                        });                    
                }).catch((e) => {
                    assert.fail(e);
                })            
        })
    }).timeout(10000);

// User can filter cases by type 
    it("should be able to filter cases by type", function(done) {
        var testCasePromises = createThisManyTestCasesInEnvironment(6, testEnv);

        Promise.all(testCasePromises).then(testCases => {
            expect(testCases.length).to.equal(6);

            // -- case types
            // APPLICATION_REVIEW
            // RENEWAL_REVIEW
            // ACTUARY_TASK
            // CUSTOMER_SERVICE
            // SUPPORT

            // 
            done();
        })

    }).timeout(10000);

// User can filter cases by start date/time 

// User can filter cases by status 

// User can filter cases by last modified by date/time 

// User can select multiple filters at once 

    it("should be able to sort cases by caseId", function(){

    })
});