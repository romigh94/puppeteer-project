const puppeteer = require('puppeteer');
const fs = require('fs');

let url

const findimages = async (url) => {
    url = url

    try {
    const browser = await puppeteer.launch({args: ['--disable-setuid-sandbox', '--no-sandbox']})
    const page = await browser.newPage();

    const randomized = Math.floor(Math.random() * 30000) + 1 

    console.log('before timeout')
    await new Promise(resolve => setTimeout(resolve, randomized))
    console.log(`after timeout... after ${randomized} ms`)

    console.log("Finding all images")

    console.log(`Visiting ${url}`)
    
    page.on('response', async (response) => {

      const matches = /.*\.(jpg|png|svg|gif|webp|avif)$/.exec(response.url())

      //console.log(response.status)

        if (matches) {
          const buffer = await response.buffer()
          const fileName = matches.input.split("/").pop()
          const imageurl = matches.input
          const pathname = new URL(imageurl).pathname
          const website = new URL(url).hostname
          const folder = pathname.split(fileName).slice(0, -1)
          folder[0].replace(/^https?:\/\//, "").replace(/\?/g, "")

          fs.mkdirSync(`./images/${website}${folder}`, {recursive: true}, err => console.log(err))
          fs.writeFileSync(`./images/${website}${folder}${fileName}`, buffer, "binary")

          //Links to images
          //console.log(matches.input)
          //console.log(pathname)
          //console.log(fileName)
      
    }
    });

    await page.goto(url, { waitUntil: 'networkidle2'});

    await browser.close();


    } catch(err) {
      console.log(err)
    }
  }

  module.exports = {url: url, findimages}
  