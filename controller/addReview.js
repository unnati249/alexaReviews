const fs = require('fs').promises;

const addReview = (req, res, next) => {
        const { review, author, review_source, rating, title, product_name, reviewed_date } = req.body;
        readFile(process.env.FILEPATH).then((data) => {
            data.push({ review, author, review_source, rating, title, product_name, reviewed_date });
            writeFile(process.env.FILEPATH, data)
            .then((result) => {
                res.status(201).json({});
            })
        })
        .catch(err => {
            next(err);
        })
    
}

async function writeFile(filePath, data) {
    data = JSON.stringify(data);
    try{
     await fs.writeFile(filePath, data);
     return;
    }
    catch(err){
        throw new Error('error while writing to file')
    }
}

async function readFile(filePath) {
    let data = await fs.readFile(filePath);
    data = JSON.parse(data);
    return data;
}
module.exports = {
    addReview,
    readFile,
    writeFile
};

