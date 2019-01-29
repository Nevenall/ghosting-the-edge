var unified = require('unified')
var stream = require('unified-stream')
var markdown = require('remark-parse')
var remark2rehype = require('remark-rehype')
var html = require('rehype-stringify')

const fs = require('fs')

var processor = unified()
   .use(markdown)
   .use(remark2rehype)
   .use(html)


// or use vfile?
processor.process(fs.readFileSync("readme.md"), function(err, file) {
   if (err) {
      throw err
   }
   console.log(String(file))
})