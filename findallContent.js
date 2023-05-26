const linkSchema = require('./mongoDBSchemas/linkSchema')
const {findImages} = require('./findimages')
const {findText } = require('./findText')
const {findOgTags } = require('./findOgTags')
const {findTags } = require('./findTags')
const { findFonts } = require('./findFonts')
const { findHeaders } = require('./findHeaders')

let start

const findallContent = async (url) => {

    start = url

    try {
        const links = await linkSchema.find();

        console.log(links)
    
        const filteredLinks = links.filter(link => link.href.startsWith(start))
            
            //console.log(filteredLinks)
    
        for (let filteredInsideLinks of filteredLinks) {

            await findHeaders(filteredInsideLinks.href)
            await findFonts(filteredInsideLinks.href)
            await findImages(filteredInsideLinks.href)
            await findText(filteredInsideLinks.href)
            await findOgTags(filteredInsideLinks.href)
            await findTags(filteredInsideLinks.href)
        }

        for (let insidelinks of links) {
            
            await findFonts(insidelinks.href)
            await findImages(insidelinks.href)
            await findText(insidelinks.href)
            await findOgTags(insidelinks.href)
            await findTags(insidelinks.href)
        }


    } catch(err) {
        console.log(err)
    }
            

}


module.exports = {findallContent}