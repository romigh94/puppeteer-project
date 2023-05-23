const mongoose = require("mongoose")

const tagSchema = new mongoose.Schema({

    url: {type: String, required: true},
    title: {type: String, required: true},
    desc: {type: String, required: true}

})

module.exports = mongoose.model("puppeteertags", tagSchema)