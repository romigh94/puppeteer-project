const mongoose = require("mongoose")

const linkSchema = new mongoose.Schema({

    href: {type: String, required: true}

})

module.exports = mongoose.model("Puppeteer", linkSchema)