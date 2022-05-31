const express = require('express');
const app = express();
const helmet = require("helmet");
app.use(helmet());

const cors = require('cors');
const options = {
    origin: '*',
    methods: ['GET', 'POST']
}
app.use(cors(options));
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT;

app.use('/', require('./routes/review'));
app.listen(PORT, console.log("Server don start for port: " + PORT))

module.exports = app;
