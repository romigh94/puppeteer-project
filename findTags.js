const puppeteer = require('puppeteer');


const findTags = async () => {

    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    let pageurl = "https://ekospol.se"

    await page.goto(pageurl)

    await page.evaluate()

    const metatags = await page.$$eval('content', content => {
        return content.map(title => title.innerHTML)
    })

    console.log(metatags)
}

module.exports = {findTags}