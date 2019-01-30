var unified = require('unified')
var stream = require('unified-stream')
var markdown = require('remark-parse')
var dev = require('./dev')
var remark2rehype = require('remark-rehype')
var html = require('rehype-stringify')
var report = require('vfile-reporter')

const fs = require('fs')

var processor = unified()
   .use(markdown)
   .use(dev, {
      test: "hello world"
   })
   .use(remark2rehype)
   .use(html)


processor.process(fs.readFileSync("readme.md"), function(err, file) {
   console.error(report(err || file))
  // console.log(String(file))
})