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
import supersub from 'remark-supersub'
import { toc } from 'mdast-util-toc'

import lint from './markdown-lint.js'

// html plugins
import slug from 'rehype-slug'
import urls from 'rehype-urls'
import autolink from 'rehype-autolink-headings'

const markdown = unified()
   .use(parse)

   // markdown plugins
   .use(lint)
   .use(supersub)
   .use(directive)
   .use(htmlDirective)
   .use(frontmatter, 'yaml')
   .use(parseFrontmatter)
   .use(copyFrontmatter)
   .use(tableOfContents)

   // html plugins
   .use(remark2rehype)
   .use(slug)
   .use(autolink)
   .use(urls, fixupLinks)

   // post process
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

function tableOfContents() {
   return transform

   function transform(tree) {
      // todo - might be easier to manually generate the data we want from this. 
      // 
      let table = toc(tree)
      console.log(JSON.stringify(table, null, 3))
   }
}

export default markdown