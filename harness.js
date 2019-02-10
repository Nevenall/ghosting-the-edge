var processor = require('./remark-config')


processor.process("# totally a header with //doubleslash// and /singleslash/", function(err, file) {
   console.error(report(err || file))
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