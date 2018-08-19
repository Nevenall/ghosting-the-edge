const MarkdownIt = require('markdown-it')
const deflist = require('markdown-it-deflist')
const terms = require('markdown-it-special-terms')
const anchors = require('markdown-it-anchor')
const containers = require('markdown-it-container')
const tables = require('markdown-it-multimd-table')

var md = new MarkdownIt({
   html: true,
   xhtmlOut: true,
   breaks: true,
   typographer: true,
   linkify: true
})

md.use(deflist)
md.use(terms, {
   open_1: '<span class="game-term">',
   close_1: "</span>",
   open_2: '<span class="aspect">',
   close_2: "</span>",
   open_3: '<span class="fate-font">',
   close_3: "</span>"
})
md.use(anchors)
md.use(tables)


// Containers
md.use(containers, 'sidebar', {
   validate: function(params) {
      return params.match(/\s*sidebar\s*/i)
   },

   render: function(tokens, idx) {
      var m = tokens[idx].info.match(/\s*sidebar\s(left|right)?/i)
      if (tokens[idx].nesting === 1) {
         if (m) {
            return `<aside class="${m[1]}">\n`
         } else {
            return '<aside>\n'
         }
      } else {
         return "</aside>\n"
      }
   }
})

md.use(containers, 'callout', {
   validate: function(params) {
      return params.match(/\s*callout\s*/i)
   },

   render: function(tokens, idx) {
      var m = tokens[idx].info.match(/\s*callout\s(left|right)?/i)
      if (tokens[idx].nesting === 1) {
         if (m) {
            return `<article class="${m[1]}">\n`
         } else {
            return '<article>\n'
         }
      } else {
         return "</article>\n"
      }
   }
})

md.use(containers, 'stat-block', {
   validate: function(params) {
      return params.match(/\s*stat-block\s*/i)
   },

   render: function(tokens, idx) {
      var m = tokens[idx].info.match(/\s*stat-block\s(left|right)?/i)
      if (tokens[idx].nesting === 1) {
         if (m) {
            return `<article class="stat-block ${m[1]}">\n`
         } else {
            return '<article class="stat-block">\n'
         }
      } else {
         return "</article>\n"
      }
   }
})

md.use(containers, 'quote', {
   validate: function(params) {
      return params.match(/\s*quote\s*/i)
   },

   render: function(tokens, idx) {
      var m = tokens[idx].info.match(/\s*quote\s+(left|right)?\s(.*)/i)
      if (tokens[idx].nesting === 1) {
         if (m) {
            return `<aside class="quoted ${m[1]}">\n<footer>${m[2]}</footer>\n`
         } else {
            return '<aside class="quoted">\n'
         }
      } else {
         return `</aside>\n`
      }
   }
})

md.use(containers, 'table', {
   validate: function(params) {
      return params.match(/\s*table\s*/i)
   },

   render: function(tokens, idx) {
      var m = tokens[idx].info.match(/\s*table\s+(.*)/i)
      if (tokens[idx].nesting === 1) {
         if (m) {
            return `<figure class="figure-table">\n<figcaption>${md.render(m[1])}</figcaption>\n`
         } else {
            return '<figure class="figure-table">\n'
         }
      } else {
         return "</figure>\n"
      }
   }
})

md.use(containers, 'columns', {
   validate: function(params) {
      return params.match(/\s*columns\s*/i)
   },

   render: function(tokens, idx) {
      var m = tokens[idx].info.match(/\s*columns\s*/i)
      if (tokens[idx].nesting === 1) {
         if (m) {
            return `<div class="columns">\n`
         } else {
            return '<div class="columns">\n'
         }
      } else {
         return "</div>\n"
      }
   }
})


// any link to a .md resource, we will convert to a link to an .html resource
// links with \ will be converted to /
var defaultRender = md.renderer.rules.link_open || function(tokens, idx, options, env, self) {
   return self.renderToken(tokens, idx, options)
}

md.renderer.rules.link_open = function(tokens, idx, options, env, self) {
   var aIndex = tokens[idx].attrIndex('href')
   var href = tokens[idx].attrs[aIndex][1]

   tokens[idx].attrs[aIndex][1] = href.replace('\\', '/')

   if (href.endsWith(".md")) {
      tokens[idx].attrs[aIndex][1] = href.replace(".md", ".html")
   }

   // pass token to default renderer.
   return defaultRender(tokens, idx, options, env, self)
}


module.exports = md