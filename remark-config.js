var unified = require('unified')
var markdown = require('remark-parse')
var remark2rehype = require('remark-rehype')
var html = require('rehype-stringify')
var terms = require('remark-terms')
var slug = require('remark-slug')


var processor = unified()
   .use(markdown)
   .use(terms)
   .use(slug)
   .use(remark2rehype)
   .use(html)














module.exports = processor