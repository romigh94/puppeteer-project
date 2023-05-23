const linkSchema = require('./mongoDBSchemas/linkSchema')
const {url, findimages} = require('./findimages')
const {findText } = require('./findText')
const {findOgTags } = require('./findOgTags')
const {findTags } = require('./findTags')

//console.log(url)

let start


const findallContent = async (url) => {

    start = url

    try {
        const links = await linkSchema.find();
    
        const filteredLinks = links.filter(link => link.href.startsWith(start))
            
            console.log(filteredLinks)
    
        for (let filteredInsideLinks of filteredLinks) {

            await findimages(filteredInsideLinks.href)
            await findText(filteredInsideLinks.href)
            await findOgTags(filteredInsideLinks.href)
            await findTags(filteredInsideLinks.href)
        }

        for (let insidelinks of links) {

            await findimages(insidelinks.href)
            await findText(insidelinks.href)
            await findOgTags(insidelinks.href)
            await findTags(insidelinks.href)
        }




    } catch(err) {
        console.log(err)
    }
            

}


module.exports = {findallContent}