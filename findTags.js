const puppeteer = require('puppeteer');
const tagSchema = require('./mongoDBSchemas/tagSchema');


const findTags = async () => {

    try {

    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    let pageurl = "https://joureliten.se"

    await page.goto(pageurl)

    let title = await page.evaluate(() => document.querySelector('title').textContent)

    let desc = await page.evaluate(() => {
        return document.querySelector("head > meta[name='description']").getAttribute("content");
    });

    console.log("TITLE:", title, "DESCRIPTION:", desc)

    const pageSet = new Set()
    const descSet = new Set()
    const titleSet = new Set()

    pageSet.add(pageurl)
    descSet.add(desc)
    titleSet.add(title)


    const updatedPage = await tagSchema.findOneAndUpdate(
        {},
        { $set: { url: pageurl, title: title, desc: desc } }
      );

    console.log('Tags updated:', updatedPage);



    } catch(error) {
        console.log(error)
    }
}

module.exports = {findTags}