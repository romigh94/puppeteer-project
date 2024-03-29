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


    const randomized = Math.floor(Math.random() * 30000) + 1 

    console.log('before timeout')
    await new Promise(resolve => setTimeout(resolve, randomized))
    console.log(`after timeout... after ${randomized} ms`)


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
        const defaultStyle = getComputedStyle(document.body)

        if (!results[tagname]) {
          results[tagname] = {}
          subResults[tagname] = 0
        }


        const count = ++subResults[tagname]
        const newTagName = count > 1 ? `.${tagname}-${count}` : tagname 

        const computedStyles = Array.from(style).reduce((obj, property) => {
          const computedValue = style.getPropertyValue(property);
          const defaultValue = defaultStyle.getPropertyValue(property);

          if (computedValue !== defaultValue) {
            obj[property] = computedValue;
          }

          return obj
        }, {})

        if (!results[newTagName]) {
          results[newTagName] = {};
        }

        results[newTagName] = computedStyles;
      });

      return { results, subResults }
    })

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

          if (existingProperties === properties) {
            return
          }

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