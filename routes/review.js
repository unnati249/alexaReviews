const express = require('express');
const { addReview} = require('../controller/addReview');
const { searchReview} = require('../controller/searchReview');
const { monthlyRating} = require('../controller/monthlyRating');
const { totalRating} = require('../controller/totalRating');

const router = express.Router();
const { addReviewValidationRules, searchReviewValidationRules, validate } = require('../validation/validation');

router.post('/review', addReviewValidationRules(), validate, addReview);
router.get('/search', searchReviewValidationRules(), validate, searchReview);
router.get('/monthlyRating', monthlyRating);
router.get('/totalRating', totalRating);
module.exports = router;