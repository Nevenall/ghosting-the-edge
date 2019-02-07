var unified = require('unified')
var stream = require('unified-stream')
var markdown = require('remark-parse')
var remark2rehype = require('remark-rehype')
var html = require('rehype-stringify')
var report = require('vfile-reporter')


var dev = require('./dev')
var example = require('./sub_sup')

const fs = require('fs')

var processor = unified()
   .use(markdown)
   .use(dev)
   // .use(example)
   .use(remark2rehype)
   .use(html)




// processor.process("# Title with ^superscript^ with some ^text^ after.", function(err, file) {
//    console.error(report(err || file))
//    console.log(String(file))
// })




// processor.process("# Title with {term} with some text after.", function(err, file) {
//    console.error(report(err || file))
//    console.log(String(file))
// })

// processor.process("# Title with {{term}} with some text after.", function(err, file) {
//    console.error(report(err || file))
//    console.log(String(file))
// })

// processor.process("# Title with /term/ with some text after.", function(err, file) {
//    console.error(report(err || file))
//    console.log(String(file))
// })

processor.process("# Title with //term// with some //text// after.", function(err, file) {
   console.error(report(err || file))
   console.log(String(file))
})