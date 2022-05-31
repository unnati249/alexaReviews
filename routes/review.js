const express = require('express');
const { addReview, searchReview, monthlyRating, totalRating } = require('../controller/review');
const router = express.Router();
const { addReviewValidationRules, searchReviewValidationRules, validate } = require('../validation/validation');

router.post('/review', addReviewValidationRules(), validate, addReview);
router.get('/search', searchReviewValidationRules(), validate, searchReview);
router.get('/monthlyRating', monthlyRating);
router.get('/totalRating', totalRating);
module.exports = router;