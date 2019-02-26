const report = require('vfile-reporter')

var processor = require('./markdown')
var {
   Book,
   Page
} = require('book')

var book = require('./html/book')


processor.process(`

---
Title: "chapter one"
order: 1
---

# Header One

[top](#header-one)

[next](/next.md)

::: quote right dan 'the man' behlings
this is a thing that I said that was awesome!
:::

`, function(err, file) {
   console.error(report(err || file))
   console.log(file.data.metadata)
   console.log(String(file))
})




// processor.process("//", function(err, file) {
//    console.error(report(err || file))
//    console.log(String(file))
// })

// processor.process("////", function(err, file) {
//    console.error(report(err || file))
//    console.log(String(file))
// })

// processor.process("{}", function(err, file) {
//    console.error(report(err || file))
//    console.log(String(file))
// })

// processor.process("{{}}", function(err, file) {
//    console.error(report(err || file))
//    console.log(String(file))
// })


// processor.process(`{term phrase with
//     a new line}`, function(err, file) {
//    console.error(report(err || file))
//    console.log(String(file))
// })

// processor.process(`/term phrase with
//    a new line/`, function(err, file) {
//    console.error(report(err || file))
//    console.log(String(file))
// })



// processor.process("//term/", function(err, file) {
//    console.error(report(err || file))
//    console.log(String(file))
// })

// processor.process("/term//", function(err, file) {
//    console.error(report(err || file))
//    console.log(String(file))
// })

// processor.process("{/term/}", function(err, file) {
//    console.error(report(err || file))
//    console.log(String(file))
// })

// processor.process("/{term}/", function(err, file) {
//    console.error(report(err || file))
//    console.log(String(file))
// })