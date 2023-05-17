const express = require('express')
const app = express()
const mongoose = require('mongoose')
require('dotenv').config()
const {findallimages} = require('./findallImages')
const {findallLinks} = require('./findallLinks')
const {findTags} = require('./findTags')
const {findOgTags} = require('./findOgTags')

const myfunction = async () => {


try {
    mongoose.connect(process.env.DB_URL)
    .then(() => console.log("connected to db"))
    .catch(err => console.log(err))

    await findallimages()
    await findallLinks()
    await findTags()
    await findOgTags()

} catch(err) {
    console.log(err)
}
}

myfunction()

app.listen(3000, () => {
    console.log("Listening to 3000")
})