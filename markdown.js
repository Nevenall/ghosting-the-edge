// base
const unified = require('unified')
const markdown = require('remark-parse')
const remark2rehype = require('remark-rehype')
const html = require('rehype-stringify')
const path = require('path')
const visit = require('unist-util-visit')

// markdown plugins
const terms = require('remark-terms')
const containers = require('remark-containers')
const sub_super = require('remark-sub-super')
const frontmatter = require('remark-frontmatter')
const parseFrontmatter = require('remark-parse-yaml')

// html plugins
const slug = require('rehype-slug')
const urls = require('rehype-urls')

var processor = unified()
   .use(markdown)

   .use(terms, {
      classes: {
         singleSlash: "game-term-1",
         doubleSlash: "game-term-2",
         singleBrace: "game-term-3",
         doubleBrace: "game-term-4"
      }
   })
   .use(containers)
   .use(sub_super)
   .use(frontmatter, {
      type: 'yaml',
      marker: '-'
   })
   .use(parseFrontmatter)
   .use(copyFrontmatter)

   .use(remark2rehype)

   .use(slug)
   .use(urls, fixupLinks)

   .use(html)



function fixupLinks(url) {
   if (url.pathname && path.extname(url.pathname) === '.md') {
      // if the link is internal to an .md file, change it to an .html file
      return url.pathname.replace('.md', '.html')
   }
   return url.href
}

function copyFrontmatter() {
   return function(ast, file) {
      visit(ast, 'yaml', item => {
         // copy parsed frontmatter to the file data
         file.data.frontmatter = item.data.parsedValue
      })
   }
}

module.exports = processor