// base
import { unified } from 'unified'
import parse from 'remark-parse'
import remark2rehype from 'remark-rehype'
import format from 'rehype-format'
import html from 'rehype-stringify'

import path from 'path'
import { visit } from 'unist-util-visit'

// markdown plugins
import terms from 'remark-terms'
import containers from 'remark-containers'
import directive from 'remark-directive'
import frontmatter from 'remark-frontmatter'
import parseFrontmatter from 'remark-parse-yaml'

import lint from './markdown-lint.js'

// html plugins
import slug from 'rehype-slug'
import urls from 'rehype-urls'
import document from 'rehype-document'

const markdown = unified()
   .use(parse)

   // markdown plugins
   .use(lint)
   // .use(terms, [{
   //    open: '{',
   //    close: '}',
   //    element: 'span',
   //    class: 'term-1'
   // }, {
   //    open: '{{',
   //    close: '}}',
   //    element: 'span',
   //    class: 'term-2'
   // }])
   .use(directive )
   .use(htmlDirective)
   
   // .use(containers, {
   //    default: true,
   //    custom: [{
   //       type: 'sidebar',
   //       element: 'aside',
   //       transform: function(node, config, tokenize) {
   //          node.data.hProperties = {
   //             className: config || 'left'
   //          }
   //       }
   //    }, {
   //       type: 'callout',
   //       element: 'article',
   //       transform: function(node, config, tokenize) {
   //          node.data.hProperties = {
   //             className: config || 'left'
   //          }
   //       }
   //    }, {
   //       type: 'columns',
   //       element: 'div',
   //       transform: function(node, config, tokenize) {
   //          node.data.hProperties = {
   //             className: 'columns'
   //          }
   //       }
   //    }, {
   //       type: 'quote',
   //       element: 'aside',
   //       transform: function(node, config, tokenize) {
   //          var words = tokenizeWords.parse(config)

   //          node.data.hProperties = {
   //             className: `quoted ${words.shift()}`
   //          }
   //          node.children.push({
   //             type: 'footer',
   //             data: {
   //                hName: 'footer'
   //             },
   //             children: tokenize(words.join(' '))
   //          })
   //       }
   //    }, {
   //       type: 'figure-table',
   //       element: 'figure',
   //       transform: function(node, config, tokenize) {
   //          node.data.hProperties = {
   //             className: `figure-table`
   //          }
   //          node.children.push({
   //             type: 'figcaption',
   //             data: {
   //                hName: 'figcaption'
   //             },
   //             children: tokenize(config)
   //          })
   //       }
   //    }]
   // })
   .use(frontmatter, {
      type: 'yaml',
      marker: '-'
   })
   .use(parseFrontmatter)
   .use(copyFrontmatter)

   // html plugins
   .use(remark2rehype)
   .use(slug)
   .use(urls, fixupLinks)
   // .use(document)

   .use(format)
   .use(html)

function fixupLinks(url) {
   if (url.pathname && path.extname(url.pathname) === '.md') {
      // if the link is internal to an .md file, change it to an .html file
      return url.pathname.replace('.md', '.html')
   }
   return url.href
}

function copyFrontmatter() {
   return function (ast, file) {
      visit(ast, 'yaml', item => {
         // copy parsed frontmatter to the file data
         file.data.metadata = item.data.parsedValue
      })
   }
}

function htmlDirective() {
   return transform

   function transform(tree) {
      visit(tree, ['textDirective', 'leafDirective', 'containerDirective'], ondirective)
   }

   function ondirective(node) {
      var data = node.data || (node.data = {})
      var hast = h(node.name, node.attributes)

      data.hName = hast.tagName
      data.hProperties = hast.properties
   }
}

export default markdown