const puppeteer = require('puppeteer');
//const fs = require('fs')

let url

const findText = async (newurl) => {

    url = newurl

    try {

        const browser = await puppeteer.launch({args: ['--disable-setuid-sandbox', '--no-sandbox']});
        const page = await browser.newPage();
    
        console.log("Finding textcontent....")
    
        console.log(`Visiting ${url}`)
    
        await page.goto(url);
    

        const headings = await page.evaluate(() => {

            const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));


            const content = headings.map(heading => {
                const tagName = heading.tagName
                const text = heading.textContent.trim()

                const computedColorStyle = window.getComputedStyle(heading).getPropertyValue('color')

                const computedFontStyle = window.getComputedStyle(heading).getPropertyValue('font-family')


                return {
                    tagName,
                    text: text,
                    color: computedColorStyle,
                    font: computedFontStyle
                  }
            })

            
      
            return content;
            
    })

    console.log(headings)

        await browser.close()

    } catch (err) {
        console.log(err)
    }
}


module.exports = {findText}