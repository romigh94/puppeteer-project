const linkSchema = require('./mongoDBSchemas/linkSchema')

const getData = async () => {

const links = await linkSchema.find()

let allLinks = []

links.forEach(link => {
    //console.log(link.href)
    allLinks.push(link.href)
})
}
//console.log("All links found from MongoDB", allLinks)


module.exports = {getData}