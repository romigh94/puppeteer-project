const express = require('express')
const app = express()
const mongoose = require('mongoose')
require('dotenv').config()
const {findimages} = require('./findimages')
const {findlinks} = require('./findlinks')

try {
    mongoose.connect(process.env.DB_URL)
    .then(() => console.log("connected to db"))
    .catch(err => console.log(err))
} catch(err) {
    console.log(err)
}


findimages()
findlinks()


app.listen(3000, () => {
    console.log("Listening to 3000")
})