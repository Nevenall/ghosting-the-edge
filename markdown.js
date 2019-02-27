// base
const unified = require('unified')
const remark = require('remark')
const parse = require('remark-parse')
const remark2rehype = require('remark-rehype')
const format = require('rehype-format')
const html = require('rehype-stringify')
const path = require('path')
const visit = require('unist-util-visit')
const tokenizeWords = require('space-separated-tokens')

// markdown plugins
const terms = require('remark-terms')
const containers = require('remark-containers')
const sub_super = require('remark-sub-super')
const frontmatter = require('remark-frontmatter')
const parseFrontmatter = require('remark-parse-yaml')
const guide = require('remark-preset-lint-markdown-style-guide')

// html plugins
const slug = require('rehype-slug')
const urls = require('rehype-urls')

const markdown = unified()
   .use(parse)

   .use(terms, {
      classes: {
         singleSlash: "game-term-1",
         doubleSlash: "game-term-2",
         singleBrace: "game-term-3",
         doubleBrace: "game-term-4"
      }
   })
   .use(containers, {
      default: true,
      custom: [{
         type: 'sidebar',
         element: 'aside',
         transform: function(node, config, tokenize) {
            node.data.hProperties = {
               className: config || 'left'
            }
         }
      }, {
         type: 'callout',
         element: 'article',
         transform: function(node, config, tokenize) {
            node.data.hProperties = {
               className: config || 'left'
            }
         }
      }, {
         type: 'columns',
         element: 'div',
         transform: function(node, config, tokenize) {
            node.data.hProperties = {
               className: columns
            }
         }
      }, {
         type: 'quote',
         element: 'aside',
         transform: function(node, config, tokenize) {
            var words = tokenizeWords.parse(config)

            node.data.hProperties = {
               className: `quoted ${words.shift()}`
            }
            node.children.push({
               type: 'footer',
               data: {
                  hName: 'footer'
               },
               children: tokenize(words.join(' '))
            })
         }
      }, {
         type: 'figure-table',
         element: 'figure',
         transform: function(node, config, tokenize) {
            node.data.hProperties = {
               className: `figure-table`
            }
            node.children.push({
               type: 'figcaption',
               data: {
                  hName: 'figcaption'
               },
               children: tokenize(config)
            })
         }
      }]
   })
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

   .use(format)
   .use(html)


const linter = remark()
   .use(guide)


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
         file.data.metadata = item.data.parsedValue
      })
   }
}

module.exports = {
   markdown,
   linter
}