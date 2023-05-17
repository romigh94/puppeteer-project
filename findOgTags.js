const puppeteer = require('puppeteer');
const fs = require('fs')


const findOgTags = async () => {

    try {

        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        
        let pageurl = "https://www.maries.se/blogg/vad-ar-egentligen-grejen-med-kollektivavtal/"

        await page.goto(pageurl)

        let ogImage = await page.evaluate(() => {
            const ogImageElement = document.querySelector("head > meta[name='og:image']")
            const ogTwitterElement = document.querySelector("head > meta[name='og:twitter]")
            return ogImageElement || ogTwitterElement ? ogImageElement.getAttribute('content') : null;
        });

        const imageBuffer = await page.goto(ogImage)
        const buffer = await imageBuffer.buffer()

        const matches = /.*\.(jpg|png|svg|gif|webp|avif)$/.exec(ogImage);
        const fileName = matches.input.split("/").pop()
        const imageurl = matches.input 
        console.log(imageurl)

        fs.mkdirSync(`./ogimages`, {recursive: true}, err => console.log(err))
        fs.writeFileSync(`./ogimages/${fileName}`, buffer, "binary")

        console.log("Working")

        await browser.close();

    } catch(error) {
        console.log(error)
    }
}

module.exports = {findOgTags}