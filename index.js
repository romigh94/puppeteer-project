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
      //console.log(matches);
      if (matches) {
        //console.log(matches[2])
        const extension = matches[1];
        const buffer = await response.buffer();
        //console.log(buffer)
        fs.writeFileSync(`images/image-${counter}.${extension}`, buffer, 'base64');
        counter += 1;
      }
    });
  
    await page.goto('https://www.bannerbear.com/blog/how-to-download-images-from-a-website-using-puppeteer/');
  
    await browser.close();
  })();


app.listen(3000, () => {
    console.log("Listening to 3000")
})