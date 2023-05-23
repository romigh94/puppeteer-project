const express = require('express')
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();

const { findallContent } = require('./findallContent');
const { findallLinks } = require('./findallLinks');
const {getData} = require('./getData')

const startUrl = 'https://ekospol.se';

const index = async () => {

try {
    mongoose.connect(process.env.DB_URL)
        .then(() => {
            console.log('Connected to the database')
        })
        .catch(err => console.log(err))

        
        //Ifall man vill kolla på datan på terminalen
        //await getData()
        
        
        //await findallLinks(startUrl)
        await findallContent(startUrl)

} catch (err) {
    console.log(err);
}
}

index()

app.listen(3000, () => {
    console.log('Listening on port 3000');
});