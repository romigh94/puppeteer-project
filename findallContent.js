const linkSchema = require('./mongoDBSchemas/linkSchema')
const {url, findimages} = require('./findimages')
const {findText } = require('./findText')
const {findOgTags } = require('./findOgTags')
const {findTags } = require('./findTags')

//console.log(url)

const findallContent = async () => {

    try {
        const links = await linkSchema.find()

        for (let insidelinks of links) {

            let pageurl = insidelinks.href

            const randomized = Math.floor(Math.random() * 30000) + 1 

            console.log('before timeout')
            await new Promise(resolve => setTimeout(resolve, randomized))
            console.log(`after timeout... after ${randomized} ms`)

            await findimages(pageurl, url)
            await findText(pageurl)
            await findOgTags(pageurl)
            await findTags(pageurl)
        }

    } catch(err) {
        console.log(err)
    }
            

}


module.exports = {findallContent}