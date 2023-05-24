const puppeteer = require('puppeteer');
const fs = require('fs')
const axios = require('axios')

let url
const findOgTags = async (newurl) => {

url = newurl
const isDownloaded = new Set()

    try {

        const browser = await puppeteer.launch({args: ['--disable-setuid-sandbox', '--no-sandbox']})
        const page = await browser.newPage()

        console.log("Finding Og Tags...")

        const randomized = Math.floor(Math.random() * 30000) + 1 

        console.log('before timeout')
        await new Promise(resolve => setTimeout(resolve, randomized))
        console.log(`after timeout... after ${randomized} ms`)

        await page.goto(url)

        let ogImage = await page.evaluate(() => {
            const ogImageElement = document.querySelector("head > meta[property='og:image']")
            const ogTwitterElement = document.querySelector("head > meta[property='og:twitter']")
            return ogImageElement || ogTwitterElement ? ogImageElement.getAttribute('content') : null
        })
        
        if (!ogImage) {
            console.log("no OG image found.")
            await browser.close()
            return
        }

        const website = new URL(url).hostname
        const lastIndex = ogImage.lastIndexOf('/')
        const fileName = ogImage.substring(lastIndex + 1)
        const imagePath = `${fileName}.png`


        if (isDownloaded.has(imagePath)) {
            console.log('Image already downloaded:', imagePath)
            return;
        }


        fs.mkdirSync(`./ogimages/${website}`, {recursive: true}, err => console.log(err))

        const response = await axios.get(ogImage, { responseType: 'stream' })

        response.data.pipe(fs.createWriteStream(`./ogimages/${website}/${imagePath}`))
          .on('finish', () => {
            console.log('Image downloaded successfully!')
            isDownloaded.add(imagePath)
          })
          .on('error', err => {
            console.error('Error downloading the image:', err)
          });

        console.log("File uploaded")

        await browser.close();

    } catch(error) {
        console.log(error)
    }
}

module.exports = {findOgTags}