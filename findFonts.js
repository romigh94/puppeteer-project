const puppeteer = require('puppeteer');
const fs = require('fs')


const findFonts = async (newurl) => {
let url = newurl

    try {

        const browser = await puppeteer.launch({args: ['--disable-setuid-sandbox', '--no-sandbox']})
        const page = await browser.newPage()

        const randomized = Math.floor(Math.random() * 30000) + 1 

        console.log('before timeout')
        await new Promise(resolve => setTimeout(resolve, randomized))
        console.log(`after timeout... after ${randomized} ms`)

        console.log("Finding Fontfiles....")
        console.log(`Visiting ${url}...`)
        
        page.on('response', async (response) => {

            const matches = /.*\.(ttf|otf|woff|woff2|eot)$/.exec(response.url())

            //console.log(matches)

            if (matches) {
                const buffer = await response.buffer()
                const fileName = matches.input.split("/").pop()
                const imageurl = matches.input
                const pathname = new URL(imageurl).pathname
                const website = new URL(url).hostname
                const folder = pathname.split(fileName).slice(0, -1)
                folder[0].replace(/^https?:\/\//, "").replace(/\?/g, "")

                console.log(fileName)
                fs.mkdirSync(`./fonts/${website}${folder}`, {recursive: true}, err => console.log(err))
                fs.writeFileSync(`./fonts/${website}${folder}${fileName}`, buffer)
                

            }
            
          });

        
        await page.goto(url, { waitUntil: 'networkidle2'});

        await browser.close()

    } catch(error) {
        console.log(error)
    }
}

module.exports = {findFonts}