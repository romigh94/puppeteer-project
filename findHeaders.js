    const puppeteer = require('puppeteer');
    const fs = require('fs');

    let url
    
    const findHeaders = async (newurl) => {

    url = newurl

      try {
        const browser = await puppeteer.launch({ args: ['--disable-setuid-sandbox', '--no-sandbox'] })
        const page = await browser.newPage();
        const website = new URL(url).hostname;
        const appendPath = `./css/${website}/headers.css`
    
        console.log('Finding headers....')
        console.log(`Visiting ${url}`)

        await page.goto(url);
    
        const headings = await page.evaluate(() => {
          const heading = Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6'))
          const results = {};
    
          heading.forEach((item) => {
            const tagname = item.tagName.toLowerCase()
            const style = window.getComputedStyle(item)
    
            if (!results[tagname]) {
              results[tagname] = {}
            }
    
            Array.from(style).forEach((property) => {
                 
              const properties = style.getPropertyValue(property)
              results[tagname][property] = properties;
            })
          })
    
          return results;
        })
    
        const headerEntries = Object.entries(headings);
        const content = headerEntries.map(([tagname, styles]) => {
            const existingProperties = styles || {}
            const properties = Object.entries(existingProperties)
                .map(([property, value]) => `${property}: ${value};`)
                .join(' ');
    
          return { tagname, properties };
        });
    
        fs.mkdirSync(`./css/${website}`, { recursive: true }, (err) => console.log(err))
    
        if (fs.existsSync(appendPath)) {
          const existingContent = fs.readFileSync(appendPath).toString()
          const exists = existingContent.split('\n')
    
          content.forEach(({ tagname, properties }) => {
            const filtered = exists.findIndex((line) => line.startsWith(tagname))
    
            if (filtered !== -1) {
                const existingLine = exists[filtered]
                const existingProperties = existingLine.split('{')[1].split('}')[0] // Extract existing properties
                const updatedProperties = `${existingProperties} ${properties}` // Merge existing and new properties
                exists[filtered] = `${tagname} { ${updatedProperties} }`; // Update the existing line with merged properties
            } else {
              exists.push(`${tagname} { ${properties} }`)
            }
          })
    
          const updatedContent = exists.join('\n')
          fs.writeFileSync(appendPath, updatedContent)
        } else {
          const headerContent = content.map(({ tagname, properties }) => `${tagname} { ${properties} }`).join('\n')
          fs.writeFileSync(appendPath, headerContent)
        }
    
        await browser.close();
      } catch (err) {
        console.log(err);
      }
    };
    
    module.exports = { findHeaders };