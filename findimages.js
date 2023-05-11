const puppeteer = require('puppeteer');
const fs = require('fs');

const findimages = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    let pageurl = "https://www.joureliten.se"
    const url = pageurl.replace(/^https?\:\/\//i, "");

  
    //let counter = 0;
    page.on('response', async (response) => {
      const matches = /.*\.(jpg|png|svg|gif|webp|avif)$/.exec(response.url());

      if (matches) {
        const buffer = await response.buffer()
        const fileName = matches.input.split("/").pop()
        const imageurl = matches.input
        const pathname = new URL(imageurl).pathname
        const folder = pathname.split(fileName).slice(0, -1)


        fs.mkdirSync(`./websites/${url}${folder}`, {recursive: true}, err => console.log(err))
        fs.writeFileSync(`./websites/${url}${folder}${fileName}`, buffer, "base64")


        //Uppgifter

        // Få in det i en databas. 
        //NoSQL
        
        //Undersöka möjligheten att köra en enkel databas. Ute efter att man hostar den själv.





        //Links to images
        //console.log(matches.input)
        //console.log(pathname)
        //console.log(fileName)

      }
    });
  
    await page.goto(pageurl);
  
    await browser.close();
  }

  module.exports = {findimages}