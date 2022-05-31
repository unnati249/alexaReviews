const jsonfile = require('jsonfile')
const file = process.env.FILEPATH;
const fs = require('fs').promises;

const addReview = async (req, res, next) => {
    try {
        const { review, author, review_source, rating, title, product_name, reviewed_date } = req.body;
        const data = await readFile(process.env.FILEPATH);
        data.push({ review, author, review_source, rating, title, product_name, reviewed_date });
        await writeFile(process.env.FILEPATH, data);
        res.status(201);
    } catch (error) {
        next(error);
    }
}

const searchReview = (req, res, next) => {

    const { review_source, rating, reviewed_date } = req.query;
    return jsonfile.readFile(file)
        .then(data => {
            let result = data
                .filter(d => (reviewed_date) ? d.reviewed_date === reviewed_date : true &&
                    (review_source) ? d.review_source === review_source : true &&
                        (rating) ? d.rating === Number(rating) : true
                )
            res.json(result);

        })
        .catch(error => {
            next(error);
        })

}

const monthlyRating = (req, res, next) => {
    const stores = [
        { name: "iTunes" },
        { name: "GooglePlayStore" }
    ];
    //Allows to get average monthly ratings per store.
    return jsonfile.readFile(file)
        .then(data => {
            let result = [];
            stores.forEach(store => {
                let reviews = data.filter(d => d.review_source === store.name);
                let rating = 0;
                let count = 0;
                reviews.forEach(review => {
                    rating += review.rating
                    count++;
                })
                result.push({ store: store.name, AverageMonthlyRating: Math.floor(rating / count) })
            })
            res.json(result);
        })
        .catch(error => {
            next(error);
        })

}

const totalRating = (req, res, next) => {
    //Allows to get total ratings for each category. Meaning, how many 5*, 4*, 3* and so on 

    let stores = [
        { name: "iTunes" },
        { name: "GooglePlayStore" }
    ];

    return jsonfile.readFile(file)
        .then(data => {
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
            res.json(result);
        })
        .catch(error => {
            next(error);
        })

}

async function writeFile(filePath, data) {
    data = JSON.stringify(data);
    await fs.writeFile(filePath, data);
    return;
}

async function readFile(filePath) {
    let data = await fs.readFile(filePath);
    data = JSON.parse(data);
    return data;
}
module.exports = {
    addReview,
    searchReview,
    monthlyRating,
    totalRating,
    readFile,
    writeFile
};

