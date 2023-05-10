const express = require('express')
const app = express()
const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
  
    let counter = 0;
    page.on('response', async (response) => {
      const matches = /.*\.(jpg|png|svg|gif|webp|avif)$/.exec(response.url());

      if (matches) {
        const buffer = await response.buffer();
        const fileName = matches.input.split("/").pop()


        //console.log(result)
        fs.writeFileSync(`images/${fileName}`, buffer, 'base64');
        counter += 1;
      }
    });
  
    await page.goto('https://www.joureliten.se/');
  
    await browser.close();
  })();


app.listen(3000, () => {
    console.log("Listening to 3000")
})