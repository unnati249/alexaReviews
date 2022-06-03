
var moment = require('moment');
const jsonfile = require('jsonfile')


const monthlyRating = (req, res, next) => {
    
    //Allows to get average monthly ratings per store.
    jsonfile.readFile(process.env.FILEPATH)
        .then(data => {
            let result = getMonthlyAverageRating(data)
            res.status(200).json(result);
        })
        .catch(error => {
            next(error);
        })

}

function getMonthlyAverageRating(data){
            let result = {};
            data.forEach(element => {
                if (!Object.keys(result).includes(element.review_source)) {
                    result[element.review_source] = {}
                }
                var momentDate = moment(element.reviewed_date, 'YYYY/MM/DD');
                var month = momentDate.format('M');
                var year = momentDate.format('Y');
                if (!Object.keys(result[element.review_source]).includes(year)) {
                    result[element.review_source][year] = {}
                }
                if (!Object.keys(result[element.review_source][year]).includes(month)) {
                    result[element.review_source][year][month] = { rating: 0 }
                    result[element.review_source][year][month]["rating"] = element.rating;
                } else {
                    result[element.review_source][year][month]["rating"] = (result[element.review_source][year][month]["rating"] + element.rating) / 2;
                }
            });
            return result;
}


module.exports = {
    monthlyRating
};