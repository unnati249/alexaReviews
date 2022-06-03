const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon');
chai.use(require('sinon-chai'));
const app = require("./../index");
const jsonfile = require('jsonfile')
const totalRating = require('../controller/totalRating');
const request = require('supertest');

describe("total ratings integration test", () => {
    describe("GET /totalRating", () => {
        beforeEach(() => {
            const response = [{ "review": "awesome", "author": "Unnati", "review_source": "iTunes", "rating": 3, "title": "excellent", "product_name": "Amazon Alexa", "reviewed_date": "2018-05-26T02:27:03.000Z" }];
            sinon.stub(jsonfile, "readFile").resolves(response);
        })
        it("should return 200 response", (done) => {
            const response = [
                {
                    store: 'iTunes',
                    totalRating: { '1': 0, '2': 0, '3': 1, '4': 0, '5': 0 }
                },
                {
                    store: 'GooglePlayStore',
                    totalRating: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 }
                }
            ];
            request(app)
            .get('/totalRating')
            .expect(200)
            .end(function (err, res) {
                expect(res.status).to.be.equal(200);
                if (err) return done(err);
                done();
            });
        });
        afterEach(() => {
            sinon.restore();
        })
    });
});