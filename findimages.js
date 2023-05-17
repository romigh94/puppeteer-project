const puppeteer = require('puppeteer');
const fs = require('fs');

let url

const findimages = async (newurl) => {
    url = newurl

    try {
    const browser = await puppeteer.launch({args: ['--disable-setuid-sandbox', '--no-sandbox']});
    const page = await browser.newPage();
  
    //let counter = 0;
    page.on('response', async (response) => {
      const matches = /.*\.(jpg|png|svg|gif|webp|avif)$/.exec(response.url());

      if (matches) {
        const buffer = await response.buffer()
        const fileName = matches.input.split("/").pop()
        const imageurl = matches.input
        const pathname = new URL(imageurl).pathname
        const website = new URL(imageurl).hostname
        const folder = pathname.split(fileName).slice(0, -1)
        folder[0].replace(/^https?:\/\//, "").replace(/\?/g, "")

        fs.mkdirSync(`./websites/${website}${folder}`, {recursive: true}, err => console.log(err))
        fs.writeFileSync(`./websites/${website}${folder}${fileName}`, buffer, "binary")

        //Links to images
        //console.log(matches.input)
        //console.log(pathname)
        //console.log(fileName)

      }
    });

    console.log(`Visiting ${url}`)

    await page.goto(url, { waitUntil: 'networkidle2' }); 


    await browser.close();


    } catch(err) {
      console.log(err)
    }
  }

  module.exports = {url: url, findimages}
  