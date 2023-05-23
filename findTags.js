const puppeteer = require('puppeteer');
const tagSchema = require('./mongoDBSchemas/tagSchema');


const findTags = async (newurl) => {
let url = newurl
    try {

        const browser = await puppeteer.launch({args: ['--disable-setuid-sandbox', '--no-sandbox']})
        const page = await browser.newPage()

        const randomized = Math.floor(Math.random() * 30000) + 1 

        console.log('before timeout')
        await new Promise(resolve => setTimeout(resolve, randomized))
        console.log(`after timeout... after ${randomized} ms`)

        console.log("Finding Tags....")
        console.log(`Visiting ${url}...`)


        await page.goto(url)

        const [title, desc] = await Promise.all([
            page.evaluate(() => document.querySelector('title').textContent),
            page.evaluate(() =>
              document.querySelector("head > meta[name='description']").getAttribute("content")
            ),
          ]);

          const pageSet = new Set();
          const descSet = new Set();
          const titleSet = new Set();

          pageSet.add(url)
          descSet.add([desc])
          titleSet.add([title])


        const updatedPage = await tagSchema.findOneAndUpdate(
            { url, title, desc },
            { $set: { url, title, desc } },
            { upsert: true }
          )
          .then(() => console.log("Tags is updated and saved in database"))
          .catch((err) => console.log(err))


        await browser.close()

    } catch(error) {
        console.log(error)
    }
}

module.exports = {findTags}