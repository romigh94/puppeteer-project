const mongoose = require("mongoose")

const textSchema = new mongoose.Schema({

    url: {type: String, required: true},
    tagname: {type: String, required: true},
    text: {type: String, required: true},
    font: {type: String, required: true},
    color: {type: String, required: true}

})

module.exports = mongoose.model("puppeteertexts", textSchema)