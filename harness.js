const report = require('vfile-reporter')

var processor = require('./markdown')


processor.process(`

---
Title: "chapter one"
order: 1
---

# Header One

[top](#header-one)

[next](/next.md)

::: quote right dan 'the man' behlings
this is a thing that I said that was awesome!c
:::

`, function(err, file) {
   console.error(report(err || file))
    console.log(file.data.frontmatter)
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