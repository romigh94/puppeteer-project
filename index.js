const express = require('express')
const app = express()
const mongoose = require('mongoose')
require('dotenv').config()
const {findallContent} = require('./findallContent')
const {findallLinks} = require('./findallLinks')

const myfunction = async () => {

try {
    mongoose.connect(process.env.DB_URL)
    .then(() => console.log("connected to db"))
    .catch(err => console.log(err))

    //await findallLinks()
    await findallContent()
    //await findTags()
    //await findOgTags()
    //await findContent()
    //await findallContent()

} catch(err) {
    console.log(err)
}
}

myfunction()

app.listen(3000, () => {
    console.log("Listening to 3000")
})