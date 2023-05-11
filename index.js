const express = require('express')
const app = express()
const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
  
    //let counter = 0;
    page.on('response', async (response) => {
      const matches = /.*\.(jpg|png|svg|gif|webp|avif)$/.exec(response.url());

      if (matches) {
        const buffer = await response.buffer();
        const fileName = matches.input.split("/").pop()
        const url = matches.input
        const pathname = new URL(url).pathname
        const folder = pathname.split(fileName).slice(0, -1)

        fs.mkdirSync(`.${folder}`, {recursive: true}, err => console.log(err))
        fs.writeFileSync(`.${folder}${fileName}`, buffer, "base64")

        //Links to images
        //console.log(matches.input)
        //console.log(pathname)
        //console.log(fileName)

      }
    });
  
    await page.goto('https://www.joureliten.se/');
  
    await browser.close();
  })();


app.listen(3000, () => {
    console.log("Listening to 3000")
})