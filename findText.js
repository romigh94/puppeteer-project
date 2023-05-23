const puppeteer = require('puppeteer');
const textSchema = require('./mongoDBSchemas/textSchema')
//const fs = require('fs')

let url

const findText = async (newurl) => {

    url = newurl

    try {

        const browser = await puppeteer.launch({args: ['--disable-setuid-sandbox', '--no-sandbox']})
        const page = await browser.newPage()

        const randomized = Math.floor(Math.random() * 30000) + 1 

        console.log('before timeout')
        await new Promise(resolve => setTimeout(resolve, randomized))
        console.log(`after timeout... after ${randomized} ms`)
    
        console.log("Finding textcontent....")
    
        console.log(`Visiting ${url}`)
    
        await page.goto(url)
    

        const headings = await page.evaluate(() => {

            const heading = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
            const textSet = new Set()
            const results = []

            heading.forEach((heading) => {
                const tagname = heading.tagName;
                const text = heading.textContent.trim();
                const color = window.getComputedStyle(heading).getPropertyValue('color')
                const font = window.getComputedStyle(heading).getPropertyValue('font-family')
                textSet.add(text)
        
                results.push({
                  tagname: tagname,
                  text: text,
                  color: color,
                  font: font
                })
              })

              return results

            })
    
            await Promise.all(
                headings.map((heading) => {
                  return textSchema.findOneAndUpdate(
                    { url: url, tagname: heading.tagname, text: heading.text, color: heading.color, font: heading.font },
                    { $set: heading },
                    { upsert: true }
                  )
                })
              )

    await browser.close()

    } catch (err) {
        console.log(err)
    }
}


module.exports = {findText}