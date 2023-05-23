const linkSchema = require('./mongoDBSchemas/linkSchema')
const tagSchema = require('./mongoDBSchemas/tagSchema')
const textSchema = require('./mongoDBSchemas/textSchema')


const getData = async () => {

    try {
        
        await linkSchema.find()
        await tagSchema.find()
        await textSchema.find() 
    
    } catch (err) {
        console.log(err)
    }

}


module.exports = {getData}