const linkSchema = require('./mongoDBSchemas/linkSchema')
const tagSchema = require('./mongoDBSchemas/tagSchema')
const textSchema = require('./mongoDBSchemas/textSchema')


const getData = async () => {

    try {

        const links = await linkSchema.find()
        const tags = await tagSchema.find()
        const texts = await textSchema.find()
        
        console.log(links)
        console.log(tags)
        console.log(texts)
    
    } catch (err) {
        console.log(err)
    }

}


module.exports = {getData}