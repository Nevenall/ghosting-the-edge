var unified = require('unified')
var stream = require('unified-stream')
var markdown = require('remark-parse')
var dev = require('./dev')
var remark2rehype = require('remark-rehype')
var html = require('rehype-stringify')
var report = require('vfile-reporter')


var example = require('./sub_sup')

const fs = require('fs')

var processor = unified()
   .use(markdown)
   // .use(dev, {
   //    test: "hello world"
   // })
   .use(example)
   .use(remark2rehype)
   .use(html)


processor.process("# Title with ^**super**script^ with some text after.", function(err, file) {
   console.error(report(err || file))
  console.log(String(file))
})