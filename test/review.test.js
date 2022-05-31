
const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon');
chai.use(require('sinon-chai'));
const superagent = require('superagent');
const app = require("./../index");
const jsonfile = require('jsonfile')

const review = require('../controller/review');

describe("review", () => {
    before(() => {
        const response = [{ "review": "awesome", "author": "Unnati", "review_source": "iTunes", "rating": 3, "title": "excellent", "product_name": "Amazon Alexa", "reviewed_date": "2018-05-26T02:27:03.000Z" }];
        sinon.stub(jsonfile, "readFile").resolves(response);

    })
    describe("add Review unit 201", () => {
        it("should return 201 response", async () => {
            process.env.FILEPATH = "./test.json"
            const req = mockRequest();
            const res = mockResponse();
            await review.addReview(req, res);
            expect(res.status).to.have.been.calledWith(201);
        });
    });
    describe("add Review unit 500", () => {
        it("should return 500 response", async () => {
            process.env.FILEPATH = ""
            const req = mockRequest();
            const res = mockResponse();
            const next = mockNext();
            await review.addReview(req, res, next);
            expect(next).to.have.been.calledOnce;
        });
    });
    describe("search review", () => {
        it("should return 200 response", async () => {
            const req = mockRequest();
            const res = mockResponse();
            const response = [{ "review": "awesome", "author": "Unnati", "review_source": "iTunes", "rating": 3, "title": "excellent", "product_name": "Amazon Alexa", "reviewed_date": "2018-05-26T02:27:03.000Z" }];
            await review.searchReview(req, res);
            expect(res.json).to.have.been.calledWith(response);
        });
    });
    describe("monthly Rating", () => {
        it("should return 200 response", async () => {
            const req = mockRequest();
            const res = mockResponse();
            const response = [
                { store: 'iTunes', AverageMonthlyRating: 3 },
                { store: 'GooglePlayStore', AverageMonthlyRating: NaN }
            ];
            await review.monthlyRating(req, res);
            expect(res.json).to.have.been.calledWith(response);
        });
    });
    describe("total Rating", () => {
        it("should return 200 response", async () => {
            const req = mockRequest();
            const res = mockResponse();
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
            await review.totalRating(req, res);
            expect(res.json).to.have.been.calledWith(response);
        });
    });

    describe("add Review integration", () => {
        it("should return 201 response", () => {
            process.env.FILEPATH = "./test.json"
            superagent
                .post('http://localhost:3000/review')
                .send({
                    "review": "awesome",
                    "author": "Unnati",
                    "review_source": "iTunes",
                    "rating": 3,
                    "title": "excellent",
                    "product_name": "Amazon Alexa",
                    "reviewed_date": "2018-05-26T02:27:03.000Z"
                })
                .then((res) => {
                    expect(res.status).to.equal(201);
                }).catch((err) => {
                    expect(res.status).to.equal(500);
                });
        });
    });
});

const mockNext = () => {
    return sinon.stub().returns(function () {
    })
}

const mockResponse = () => {
    const res = {};
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns(res);
    return res;
};

const mockRequest = () => {
    return {
        body: {
            "review": "awesome",
            "author": "Unnati",
            "review_source": "iTunes",
            "rating": 3,
            "title": "excellent",
            "product_name": "Amazon Alexa",
            "reviewed_date": "2018-05-26T02:27:03.000Z"
        },
        query: {
            reviewed_date: '2018-05-26T02:27:03.000Z',
            review_source: 'iTunes',
            rating: 3
        }
    };
};

