const puppeteer = require('puppeteer')
const fs = require('fs')

let url

const findHeaders = async (newurl) => {
  url = newurl

  try {
    const browser = await puppeteer.launch({ args: ['--disable-setuid-sandbox', '--no-sandbox'] })
    const page = await browser.newPage()
    const website = new URL(url).hostname
    const appendPath = `./css/${website}/headers.css`

    console.log('Finding headers....')
    console.log(`Visiting ${url}`)

    await page.goto(url)
      
    const headings = await page.evaluate(() => {
      const heading = Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6'))
      const results = {}
      const subResults = {}

      heading.forEach((item) => {
        const tagname = item.tagName.toLowerCase()
        const style = window.getComputedStyle(item)

        if (!results[tagname]) {
          results[tagname] = {}
          subResults[tagname] = 0
        }

        const count = ++subResults[tagname];
        const newTagName = count > 1 ? `.${tagname}-${count}` : tagname 

        Array.from(style).forEach((property) => {
          const propertyName = style.getPropertyValue(property)
          if (!results[newTagName]) {
            results[newTagName] = {};
          }
          results[newTagName][property] = propertyName
        });
      });

      return { results, subResults }
    });

    const { results, subResults } = headings

    const headerEntries = Object.entries(results);
    const content = headerEntries.map(([tagname, properties]) => {
      if (tagname === 'subResults') {
        return null
      }
      const propertyEntries = Object.entries(properties)
      const propertyString = propertyEntries
        .map(([property, value]) => `${property}: ${value};`)
        .join(' ');

      return { tagname, properties: propertyString }
    }).filter(Boolean)

    fs.mkdirSync(`./css/${website}`, { recursive: true }, (err) => console.log(err))

    if (fs.existsSync(appendPath)) {
      const existingContent = fs.readFileSync(appendPath).toString()
      const exists = existingContent.split('\n');

      content.forEach(({ tagname, properties }) => {
        const filtered = exists.findIndex((line) => line.startsWith(tagname))

        if (filtered !== -1) {
          const existingLine = exists[filtered];
          const existingProperties = existingLine.split('{')[1].split('}')[0]
          const updatedProperties = `${existingProperties} ${properties}`
          exists[filtered] = `${tagname} { ${updatedProperties} }`
        } else {
          exists.push(`${tagname} { ${properties} }`)
        }
      });

      const updatedContent = exists.join('\n')
      fs.writeFileSync(appendPath, updatedContent)
    } else {
      const headerContent = content.map(({ tagname, properties }) => `${tagname} { ${properties} }`).join('\n')
      fs.writeFileSync(appendPath, headerContent)
    }

    await browser.close()
  } catch (err) {
    console.log(err)
  }
};

module.exports = { findHeaders }