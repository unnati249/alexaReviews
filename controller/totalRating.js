
const jsonfile = require('jsonfile');


const totalRating = (req, res, next) => {
    //Allows to get total ratings for each category. Meaning, how many 5*, 4*, 3* and so on 

    let stores = [
        { name: "iTunes" },
        { name: "GooglePlayStore" }
    ];

    jsonfile.readFile(process.env.FILEPATH)
        .then(data => {
            let result = getTotalRatings(data, stores)
            res.status(200).json(result);
        })
        .catch(error => {
            next(error);
        })

}

function getTotalRatings(data, stores){
    let result = [];
            stores.forEach(store => {
                let reviews = data.filter(d => d.review_source === store.name);
                let ratings = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
                reviews.forEach(review => {
                    switch (review.rating) {
                        case 1:
                            ratings[1] += 1;
                            break;
                        case 2:
                            ratings[2] += 1;
                            break;
                        case 3:
                            ratings[3] += 1;
                            break;
                        case 4:
                            ratings[4] += 1;
                            break;
                        case 5:
                            ratings[5] += 1;
                            break;
                    }
                })
                result.push({ store: store.name, totalRating: ratings })
            })
    return result;
}


module.exports = {
    totalRating
};