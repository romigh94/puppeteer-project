const puppeteer = require('puppeteer');
const fs = require('fs')


const findOgTags = async () => {

    try {

        const browser = await puppeteer.launch({args: ['--disable-setuid-sandbox', '--no-sandbox']})
        const page = await browser.newPage()
        
        let pageurl = "https://maries.se/"

        await page.goto(pageurl)
        //console.log(pageurl)

        let ogImage = await page.evaluate(() => {
            const ogImageElement = document.querySelector("head > meta[name='og:image']")
            const ogTwitterElement = document.querySelector("head > meta[name='og:twitter']")
            return ogImageElement ||ogTwitterElement ? ogImageElement.getAttribute('content') : null;
        });

        console.log(ogImage)

        const imageBuffer = await page.goto(ogImage)
        const buffer = await imageBuffer.buffer()

        const matches = /.*\.(jpg|png|svg|gif|webp|avif)$/.exec(ogImage);
        const fileName = matches.input.split("/").pop()

        fs.mkdirSync(`./ogimages`, {recursive: true}, err => console.log(err))
        fs.writeFileSync(`./ogimages/${fileName}`, buffer, "binary")

        console.log("File uploaded")

        await browser.close();

    } catch(error) {
        console.log(error)
    }
}

module.exports = {findOgTags}