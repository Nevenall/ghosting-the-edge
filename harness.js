const report = require('vfile-reporter')

var processor = require('./remark-config')


processor.process(`

---
Title: "chapter one"
order: 1
---

# Header One

[top](#header-one)

[next](/next.md)

one | two | three
----|-----|---
a   | b   | c

`, function(err, file) {
   console.error(report(err || file))
   console.log("", file.data.frontmatter)
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