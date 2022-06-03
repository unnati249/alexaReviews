
const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon');
chai.use(require('sinon-chai'));
const app = require("./../index");
const jsonfile = require('jsonfile')
const monthlyRating = require('../controller/monthlyRating');
const request = require('supertest');


describe("monthly rating", () => {
    describe("integration test", () => {

    beforeEach(() => {
        process.env.FILEPATH = "./test.json"
        const response = [{ "review": "awesome", "author": "Unnati", "review_source": "iTunes", "rating": 3, "title": "excellent", "product_name": "Amazon Alexa", "reviewed_date": "2018-05-26T02:27:03.000Z" }];
        sinon.stub(jsonfile, "readFile").resolves(response);
    })
    it("POST /monthlyRating", (done) => {
        const response = [
            { store: 'iTunes', AverageMonthlyRating: 3 },
            { store: 'GooglePlayStore', AverageMonthlyRating: NaN }
        ];
        request(app)
                .get('/monthlyRating')
                .expect(200)
                .end(function (err, res) {
                    expect(res.status).to.be.equal(200)
                    if (err) return done(err);
                    done();
                });
    });
    afterEach(() => {
        sinon.restore();
    })
});
    
});