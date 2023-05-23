const puppeteer = require('puppeteer');
const linkSchema = require('./mongoDBSchemas/linkSchema')

const findallLinks = async (starturl) => {


    console.log('from all links', starturl)

    //Alla länkar från alla sidor 


    try {

        const browser = await puppeteer.launch({args: ['--disable-setuid-sandbox', '--no-sandbox']})
        const page = await browser.newPage()
        let pageurl = starturl //Måste vara exakt format som dem länkarna som finns i hemsidan.

        console.log("Finding all links...")
        console.log(`Visiting page: ${pageurl}`)

        await page.goto(pageurl)

        const linkSet = new Set()
        const visitedSet = new Set()

        const links = await page.$$eval('a', link => {
            return link.map(a => a.href)
        })

        console.log(links)

        linkSet.add(links)
        visitedSet.add(links)

        for (let insidelinks of links) {

            console.log(insidelinks)

            if (insidelinks.startsWith(pageurl)) {

                
                const randomized = Math.floor(Math.random() * 30000) + 1 

                console.log('before timeout')
                await new Promise(resolve => setTimeout(resolve, randomized))
                console.log(`after timeout... after ${randomized} ms`)
            

                if (visitedSet.has(insidelinks)) {
                    continue //Skip
                }


            visitedSet.add(insidelinks)

            console.log(`Visiting page: ${insidelinks}`)

            await page.goto(insidelinks);

            const urls = await page.$$eval(
              'a',
              links => links.map(link => link.href)
            );
          
            for (let url of urls) {

                if (url.startsWith(pageurl)) {
                    linkSet.add(url)
                    await linkSchema.findOneAndUpdate({ href: url }, { href: url }, { upsert: true }) //Will not save duplicates
                }
            }
        }

    }

    await browser.close()


    } catch(err) {
        console.log(err)
    }
}

  module.exports = {findallLinks}