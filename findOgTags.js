const puppeteer = require('puppeteer');
const fs = require('fs')

let url
const findOgTags = async (newurl) => {

url = newurl

    try {

        const browser = await puppeteer.launch({args: ['--disable-setuid-sandbox', '--no-sandbox']})
        const page = await browser.newPage()

        console.log("Finding Og Tags...")
        
        let pageurl = "https://soderrorjouren.se/"

        await page.goto(pageurl)
        //console.log(pageurl)

        let ogImage = await page.evaluate(() => {
            const ogImageElement = document.querySelector("head > meta[property='og:image']")
            const ogTwitterElement = document.querySelector("head > meta[property='og:twitter']")
            return ogImageElement || ogTwitterElement ? ogImageElement.getAttribute('content') : null;
        });
        

        if (!ogImage) {
            console.log("no OG image found.")
            await browser.close()
            return
        }

        console.log(ogImage)

        const imageBuffer = await page.goto(ogImage)
        const buffer = await imageBuffer.buffer()

        const matches = /.*\.(jpg|png|svg|gif|webp|avif)$/.exec(ogImage);
        const fileName = matches.input.split("/").pop()
        const folder = pageurl.replace(/^https?:\/\//, "").replace(/\?/g, "")

        
        //const imageurl = matches.input
        //const website = new URL(imageurl).hostname


        fs.mkdirSync(`./ogimages/${folder}`, {recursive: true}, err => console.log(err))
        fs.writeFileSync(`./ogimages/${folder}/${fileName}`, buffer, "binary")

        console.log("File uploaded")

        await browser.close();

    } catch(error) {
        console.log(error)
    }
}

module.exports = {findOgTags}