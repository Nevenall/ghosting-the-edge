// base
import { unified } from 'unified'
import parse from 'remark-parse'
import remark2rehype from 'remark-rehype'
import format from 'rehype-format'
import html from 'rehype-stringify'
import { h } from 'hastscript'

import path from 'path'
import { visit } from 'unist-util-visit'
import { toHtml } from 'hast-util-to-html'
import { toHast } from 'mdast-util-to-hast'

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
// Remove the typographicCurrency plugin because it does weird stuff like yer=>﷼ 
var currencyIndex = typographicBase.mws.findIndex(func => func.name === 'typographicCurrency')
if (currencyIndex > 0) {
   typographicBase.mws.splice(currencyIndex, 1)
}

const markdown =
   unified()
      .use(parse)

      // markdown plugins
      .use(supersub)
      .use(directive)
      .use(defaultDirective)
      .use(writeDirectives)
      .use(frontmatter, 'yaml')
      .use(parseFrontmatter)
      .use(copyFrontmatter)
      .use(tableOfContents)
      .use(remarkTextr, { locale: 'en-us', plugins: [typographicBase] })
      .use(lint)

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
         Object.assign(file.data, { metadata: item.data.parsedValue })
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
      let data = node.data || (node.data = {})
      let hast = h(node.name, node.attributes)
      data.hName = hast.tagName
      data.hProperties = hast.properties
   }
}

function writeDirectives() {
   return transform
   function transform(tree) {
      visit(tree, ['textDirective', 'leafDirective', 'containerDirective'], ondirective)
   }

   function ondirective(node) {
      let data = node.data || (node.data = {})
      switch (node.name) {
         case 'sidebar':
            sidebarDirective(node, data)
            break
         case 'callout':
            calloutDirective(node, data)
            break
         case 'columns':
            columnsDirective(node, data)
            break
         case 'fate':
            fateDirective(node, data)
            break
         case 'aspect':
            aspectDirective(node, data)
            break
         case 'quote':
            quoteDirective(node, data)
            break
         case 'figure-table':
            figureTableDirective(node, data)
            break
         default:
            break;
      }


      function sidebarDirective(node, data) {
         let hast = h('aside', node.attributes)
         data.hName = hast.tagName
         data.hProperties = hast.properties
      }

      function calloutDirective(node, data) {
         let hast = h('article', node.attributes)
         data.hName = hast.tagName
         data.hProperties = hast.properties
      }

      function columnsDirective(node, data) {
         let hast = h('div', { class: 'columns' })
         data.hName = hast.tagName
         data.hProperties = hast.properties
      }

      function fateDirective(node, data) {
         let hast = h('span', { class: 'fate-icon' })
         data.hName = hast.tagName
         data.hProperties = hast.properties
      }

      function aspectDirective(node, data) {
         let hast = h('span', { class: 'aspect' })
         data.hName = hast.tagName
         data.hProperties = hast.properties
      }

      function quoteDirective(node, data) {
         let aside = h('aside', node.attributes || { class: '' })
         data.hName = aside.tagName
         // add a classname of 'quoted' to the start
         aside.properties.className.unshift('quoted')
         data.hProperties = aside.properties

         // find the attribution, it'll be a child with directiveLabel = true
         // move it to the end and tell rehype to make it a footer
         let attribution = node.children.find(el => el.data.directiveLabel === true)
         if (attribution) {
            let index = node.children.indexOf(attribution)
            node.children.push(node.children.splice(index, 1)[0])
            attribution.data.hName = 'footer'
         }
      }

      function figureTableDirective(node, data) {
         let aside = h('aside', node.attributes || { class: '' })
         data.hName = aside.tagName
         // add a classname of 'quoted' to the start
         aside.properties.className.unshift('figure-table')
         data.hProperties = aside.properties

         // find the caption, it'll be a child with directiveLabel = true
         // move it to the end and tell rehype to make it a ficaption
         let caption = node.children.find(el => el.data.directiveLabel === true)
         if (caption) {
            let index = node.children.indexOf(caption)
            node.children.push(node.children.splice(index, 1)[0])
            caption.data.hName = 'figcaption'
         }
      }

   }

}

function tableOfContents() {
   return transform

   function transform(tree, file) {
      let table = toc(tree)
      let list = []

      // skip files without headers
      if (table.map != null) {
         // we'll have to reach into children : text nodes to find the values to use for the title of the link
         // we care about type='listItem' nodes
         // type='list'
         //    type='listItem'
         //       type='paragraph'
         //          type='link' url='#anchor'
         //             type='text' value='title'
         //       type='list'
         //          type='listItem'
         //          type='listItem'
         //          type='listItem'
         //    type='listItem'  // these are the list items we need to work on. 

         let recurse = function (node, curr, list) {
            if (node.type === 'list') {
               // this is when we know there will be children for current node
               // which means the current node's child list becomes the new context
               // The top level is a special case
               if (curr != null) {
                  list = curr.children
               }
            }
            if (node.type === 'listItem') {
               // Start a new child
               curr = { url: '', title: '', children: [] }
            }
            if (node.type === 'link') {
               curr.url = node.url
               let hast = toHast(node)
               curr.title = toHtml(hast.children)
               list.push(curr)
            }
            // mdast nodes may not have a children property
            for (const child of node?.children ?? []) {
               recurse(child, curr, list)
            }
         }

         recurse(table.map, null, list)
      }
      // console.log(JSON.stringify(list, null, '  '))
      Object.assign(file.data, { toc: list })
   }
}

export default markdown