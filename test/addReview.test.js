
const chai = require('chai')
const expect = chai.expect;
// const should = chai.should;
const should = require('should');

const sinon = require('sinon');
chai.use(require('sinon-chai'));
const app = require("./../index");
const jsonfile = require('jsonfile')
const addReview = require('../controller/addReview');
const request = require('supertest');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const fs = require('fs').promises;
const dfs = require('fs');

describe("add review integration test", () => {
    describe("POST /review", () => {
        it("should return 201 response", (done) => {
            process.env.FILEPATH = "./test.json"
            const params = {
                "review": "awesome",
                "author": "Unnati",
                "review_source": "iTunes",
                "rating": 3,
                "title": "excellent",
                "product_name": "Amazon Alexa",
                "reviewed_date": "2018-05-26T02:27:03.000Z"
            };
            request(app)
            .post('/review')
            .send(params)
            .expect(201)
            .end(function (err, res) {
                expect(res.status).to.be.equal(201)
                if (err) done(err);
                done()
            });
        });
        it("should return 500 response", (done) => {
            process.env.FILEPATH = ""
            const params = {
                "review": "awesome",
                "author": "Unnati",
                "review_source": "iTunes",
                "rating": 3,
                "title": "excellent",
                "product_name": "Amazon Alexa",
                "reviewed_date": "2018-05-26T02:27:03.000Z"
            };
            request(app)
            .post('/review')
            .send(params)
            .expect(500)
            .end(function (err, res) {
                expect(res.status).to.be.equal(500)
                if (err) done(err);
                done()
            });
        });

        it("should give validation error return 422 response", (done) => {
            process.env.FILEPATH = "./test.json"
            const params = {
                "review": "awesome",
                "author": "Unnati",
                "review_source": "iTunes",
                "rating": 3.5,
                "title": "excellent",
                "product_name": "Amazon Alexa",
                "reviewed_date": "2018-05-26T02:27:03.000Z"
            };
            const response = { errors: [ { rating: 'notInt' }, { rating: '1 to 5' } ] }
            request(app)
            .post('/review')
            .send(params)
            .expect(422)
            .end(function (err, res) {
                console.log(typeof(res.body))
                expect(res.status).to.be.equal(422)
                expect(res.body.errors[0]['rating']).to.be.equal('notInt')
                if (err) done(err);
                done()
            });
        });
       
    });
});

describe("add review unit testing",() => {

    it('function writeFile', async () => {
        let fsWritefileStub = sinon.stub(fs,"writeFile").resolves();
        let jsonSpy = sinon.spy(JSON, "stringify");

        process.env.FILEPATH = "./test.json"
        const params = {
                    "review": "awesome",
                    "author": "Unnati",
                    "review_source": "iTunes",
                    "rating": 3,
                    "title": "excellent",
                    "product_name": "Amazon Alexa",
                    "reviewed_date": "2018-05-26T02:27:03.000Z"
                };
        await addReview.writeFile(process.env.FILEPATH, params);
        expect(jsonSpy).to.be.calledOnce;
        expect(fsWritefileStub).to.be.calledOnce;
    })
    it('function writeFile error', async () => {
        let fsWritefileStub = sinon.stub(fs,"writeFile").rejects();
        let jsonSpy = sinon.spy(JSON, "stringify");
        process.env.FILEPATH = "./test.json"
        const params = {
                    "review": "awesome",
                    "author": "Unnati",
                    "review_source": "iTunes",
                    "rating": 3,
                    "title": "excellent",
                    "product_name": "Amazon Alexa",
                    "reviewed_date": "2018-05-26T02:27:03.000Z"
                };
                try{
                    await addReview.writeFile(process.env.FILEPATH, params);
                }
                catch(err){
                    console.log(err.message)
                    expect(err.message).to.be.equal('error while writing to file');
                    expect(fsWritefileStub).to.be.calledOnce;
                }
    })
    it('function readFile', async () => {
        process.env.FILEPATH = "./test.json"
        let data = dfs.readFileSync(process.env.FILEPATH);
        let fsReadfileStub = sinon.stub(fs,"readFile").resolves(data.toString());
        let jsonSpy = sinon.spy(JSON, "parse");

        let response = await addReview.readFile(process.env.FILEPATH);
        expect(jsonSpy).to.be.calledOnce;
        expect(fsReadfileStub).to.be.calledOnce;
        expect(JSON.stringify(response)).to.be.equal(data.toString());
    })
    afterEach(() => {
        sinon.restore();
    })
})




