const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon');
chai.use(require('sinon-chai'));
const app = require("./../index");
const jsonfile = require('jsonfile')
const searchReview = require('../controller/searchReview');
const request = require('supertest');

describe("review", () => {
    
    describe("search review", () => {
        describe("integration test", () => {
            beforeEach(() => {
                const response = [{ "review": "awesome", "author": "Unnati", "review_source": "iTunes", "rating": 3, "title": "excellent", "product_name": "Amazon Alexa", "reviewed_date": "2018-05-26T02:27:03.000Z" }];
                sinon.stub(jsonfile, "readFile").resolves(response);
            })
            it("POST /search", (done) => {
                process.env.FILEPATH = "./test.json"
                const response = [{ "review": "awesome", "author": "Unnati", "review_source": "iTunes", "rating": 3, "title": "excellent", "product_name": "Amazon Alexa", "reviewed_date": "2018-05-26T02:27:03.000Z" }];
                request(app)
                .get("/search")
                .query({ reviewed_date : '2018-05-26T02:27:03.000Z', review_source:'iTunes', rating:3 })
                .expect(200)
                .end(function (err, res) {
                    expect(res.status).to.be.equal(200)
                        if (err) return done(err);
                        return done();
                    });
            });
            afterEach(() => {
                sinon.restore();
            })
        });
    });
    
    
});

