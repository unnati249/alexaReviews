const jsonfile = require('jsonfile');


const searchReview = (req, res) => {

    const { review_source, rating, reviewed_date } = req.query;
    jsonfile.readFile(process.env.FILEPATH)
        .then(data => {
            let result = filterReviews(data, req.query);
            res.status(200).json(result);
        })
        .catch(error => {
            next(error)
        })

}

function filterReviews(data, queryParams){
    const { review_source, rating, reviewed_date } = queryParams;
    return  data
    .filter(d => (reviewed_date) ? d.reviewed_date === reviewed_date : true &&
        (review_source) ? d.review_source === review_source : true &&
            (rating) ? d.rating === Number(rating) : true
    )
}

module.exports = {
    searchReview
};