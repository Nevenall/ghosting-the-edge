const report = require('vfile-reporter')

var processor = require('./markdown')
var {
   Book,
   Page
} = require('book')


const spellchecker = require('spellchecker')

var text = `

---
Title: "chapter one"
order: 1
---

# Header One

[top](#header-one)

[next](/next.md)

::: quote right dan 'the man' behlings
this is a thingz that I said that was awesome!
:::

`



spellchecker.checkSpellingAsync(text).then(function(value)  {
   console.log(JSON.stringify(value))

   var word = text.substring(value[0].start, value[0].end)
   console.log(word)

   var suggestions = spellchecker.getCorrectionsForMisspelling(word)
   console.log(JSON.stringify(suggestions))

})



processor.process(text, function(err, file) {
   console.error(report(err || file))
   // console.log(file.data.metadata)
   // console.log(String(file))
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