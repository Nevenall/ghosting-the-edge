// base
import { unified } from 'unified'
import parse from 'remark-parse'
import remark2rehype from 'remark-rehype'
import format from 'rehype-format'
import html from 'rehype-stringify'

import path from 'path'
import { visit } from 'unist-util-visit'

// markdown plugins
import directive from 'remark-directive'
import frontmatter from 'remark-frontmatter'
import parseFrontmatter from 'remark-parse-yaml'
import supersub from 'remark-supersub'
import { toc } from 'mdast-util-toc'
import remarkTextr from 'remark-textr'

import lint from './markdown-lint.js'

// html plugins
import slug from 'rehype-slug'
import urls from 'rehype-urls'
import autolink from 'rehype-autolink-headings'

// textr plugins
// does basic typography substitution, " -> “ for example. 
import typographicBase from 'typographic-base'

const markdown = unified()
   .use(parse)

   // markdown plugins
   .use(lint)
   .use(supersub)
   .use(directive)
   .use(defaultDirective)
   .use(frontmatter, 'yaml')
   .use(parseFrontmatter)
   .use(copyFrontmatter)
   .use(tableOfContents)
   .use(remarkTextr, { plugins: [typographicBase] })

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

// a basic transform for directive nodes. It turns a directive name into an html tag, and adds any attributes that are declared. 
function defaultDirective() {
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
      let table = toc(tree)
      // is there a way we can expose this data to gulp? 
      // 
   }
}

export default markdown