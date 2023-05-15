const linkSchema = require('./mongoDBSchemas/linkSchema')
const fs = require('fs')
const puppeteer = require('puppeteer')
const {url, findimages} = require('./findimages')

//console.log(url)

const findallimages = async () => {


    try {
        const links = await linkSchema.find()


        for (let insidelinks of links) {

            let pageurl = insidelinks.href


            const randomized = Math.floor(Math.random() * 30000) + 1 

            console.log('before timeout')
            await new Promise(resolve => setTimeout(resolve, randomized))
            console.log(`after timeout... after ${randomized} ms`)

            await findimages(pageurl, url)


        }

        } catch(err) {
            console.log(err)
        }
            

}


module.exports = {findallimages}