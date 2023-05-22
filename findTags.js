const puppeteer = require('puppeteer');
const tagSchema = require('./mongoDBSchemas/tagSchema');


const findTags = async (newurl) => {
let url = newurl
    try {

        const browser = await puppeteer.launch({args: ['--disable-setuid-sandbox', '--no-sandbox']})
        const page = await browser.newPage()

        console.log("Finding Tags....")

        await page.goto(url)

        let title = await page.evaluate(() => document.querySelector('title').textContent)

        let desc = await page.evaluate(() => {
            return document.querySelector("head > meta[name='description']").getAttribute("content");
        });

        const pageSet = new Set()
        const descSet = new Set()
        const titleSet = new Set()

        pageSet.add(url)
        descSet.add(desc)
        titleSet.add(title)


        const updatedPage = await tagSchema.findOneAndUpdate(
            {},
            { $set: { url: url, title: title, desc: desc } }
        );

        console.log('Tags updated:', updatedPage);

        await browser.close();

    } catch(error) {
        console.log(error)
    }
}

module.exports = {findTags}