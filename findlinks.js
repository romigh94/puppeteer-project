const puppeteer = require('puppeteer');
const linkSchema = require('./mongoDBSchemas/linkSchema')
//const fs = require('fs');


const findlinks = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    let pageurl = "https://www.joureliten.se"  
    await page.goto(pageurl);

    const linkSet = new Set();
    const links = await page.$$eval('a', link => {
        return link.map(a => a.href)
    });


    for (const href of links) {
        linkSet.add(href)
        await linkSchema.findOneAndUpdate({ href: href }, { href: href }, { upsert: true });
    }
    
  
    await browser.close();
  }

  module.exports = {findlinks}