var unified = require('unified')
var stream = require('unified-stream')
var markdown = require('remark-parse')
var remark2rehype = require('remark-rehype')
var html = require('rehype-stringify')
var report = require('vfile-reporter')


var dev = require('./remark-special-terms')

const fs = require('fs')

var processor = unified()
   .use(markdown)
   .use(dev)
   .use(remark2rehype)
   .use(html)


processor.process("//", function(err, file) {
   console.error(report(err || file))
   console.log(String(file))
})

processor.process("////", function(err, file) {
   console.error(report(err || file))
   console.log(String(file))
})

processor.process("{}", function(err, file) {
   console.error(report(err || file))
   console.log(String(file))
})

processor.process("{{}}", function(err, file) {
   console.error(report(err || file))
   console.log(String(file))
})


processor.process(`{term phrase with
    a new line}`, function(err, file) {
   console.error(report(err || file))
   console.log(String(file))
})

processor.process(`/term phrase with
   a new line/`, function(err, file) {
   console.error(report(err || file))
   console.log(String(file))
})



processor.process("//term/", function(err, file) {
   console.error(report(err || file))
   console.log(String(file))
})

processor.process("/term//", function(err, file) {
   console.error(report(err || file))
   console.log(String(file))
})

processor.process("{/term/}", function(err, file) {
   console.error(report(err || file))
   console.log(String(file))
})

processor.process("/{term}/", function(err, file) {
   console.error(report(err || file))
   console.log(String(file))
})