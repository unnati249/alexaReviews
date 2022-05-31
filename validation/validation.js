const { body, validationResult, query } = require('express-validator')
const addReviewValidationRules = () => {
    return [
        body('review').notEmpty().withMessage("notEmpty").matches('^[A-Za-z0-9 ]+$').withMessage("alphanumeric").trim().escape(),
        body('author').notEmpty().withMessage("notEmpty").matches('^[A-Za-z0-9 ]+$').withMessage("alphanumeric").trim().escape(),
        body('review_source').notEmpty().withMessage("notEmpty").isIn(['iTunes', 'GooglePlayStore']).withMessage("either iTunes or GooglePlayStore").trim().escape(),
        body('rating').notEmpty().withMessage("notEmpty").isInt().withMessage("notInt").matches('^[1-5]$').withMessage("1 to 5"),
        body('title').notEmpty().withMessage("notEmpty").matches('^[A-Za-z0-9 ]+$').withMessage("alphanumeric").trim().escape(),
        body('product_name').notEmpty().withMessage("notEmpty").isIn(['Amazon Alexa']).withMessage("only alexa").matches('^[A-Za-z0-9 ]+$').withMessage("alpha").trim().escape(),
        body('reviewed_date').notEmpty().withMessage("notEmpty").matches('^[A-Za-z0-9:.-]+$').withMessage("alphanumeric").toDate().trim().escape()
    ]
}


const searchReviewValidationRules = () => {
    return [
        query('review_source').notEmpty().withMessage("notEmpty").isIn(['iTunes', 'GooglePlayStore']).withMessage("either iTunes or GooglePlayStore").trim().escape(),
        query('rating').notEmpty().withMessage("notEmpty").isInt().withMessage("notInt").matches('^[1-5]$').withMessage("1 to 5"),
        query('reviewed_date').notEmpty().withMessage("notEmpty").matches('^[A-Za-z0-9:.-]+$').withMessage("alphanumeric").toDate().trim().escape()
    ]
}

const validate = (req, res, next) => {

    const errors = validationResult(req)
    if (errors.isEmpty()) {
        return next()
    }
    const extractedErrors = []
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

    return res.status(422).json({
        errors: extractedErrors,
    })
}

module.exports = {
    addReviewValidationRules,
    searchReviewValidationRules,
    validate
}