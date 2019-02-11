// base
var unified = require('unified')
var markdown = require('remark-parse')
var remark2rehype = require('remark-rehype')
var html = require('rehype-stringify')

// markdown expansions
var terms = require('remark-terms')
var slug = require('remark-slug')
var sub_super = require('remark-sub-super')
var frontmatter = require('remark-frontmatter')


var processor = unified()
   .use(markdown)

   .use(terms)
   .use(slug)
   .use(sub_super)
   .use(frontmatter, {type: 'yaml', marker: '-'})

   .use(remark2rehype)
   .use(html)






module.exports = processor