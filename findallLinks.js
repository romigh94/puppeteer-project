const puppeteer = require('puppeteer');
const linkSchema = require('./mongoDBSchemas/linkSchema')

const findallLinks = async () => {

    //Alla länkar från alla sidor 


    try {

        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        let pageurl = "https://ekospol.se" //Måste vara exakt format som dem länkarna som finns i hemsidan.

        console.log(`Visiting page: ${pageurl}`)

        await page.goto(pageurl)

        const linkSet = new Set()
        const visitedSet = new Set()

        const links = await page.$$eval('a', link => {
            return link.map(a => a.href)
        })

        linkSet.add(links)
        visitedSet.add(links)

        const results = []

        for (let insidelinks of links) {

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
                    const result = await linkSchema.findOneAndUpdate({ href: url }, { href: url }, { upsert: true }) //Will not save duplicates

                    results.push(
                        result.href
                    )
                }
            }
        }

    }


    console.log(results)

    await browser.close()


    } catch(err) {
        console.log(err)
    }
}

  module.exports = {findallLinks}