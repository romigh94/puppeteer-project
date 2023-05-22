const express = require('express')
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();

const { findallContent } = require('./findallContent');
const { findallLinks } = require('./findallLinks');

const startUrl = 'https://ekospol.se';

try {
    mongoose.connect(process.env.DB_URL)
        .then(() => {
            console.log('Connected to the database');
            start();
        })
        .catch(err => console.log(err));
} catch (err) {
    console.log(err);
}

const start = async () => {
    await findallContent(startUrl);
};

app.listen(3000, () => {
    console.log('Listening on port 3000');
});