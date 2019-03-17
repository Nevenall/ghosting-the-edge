const {
   parallel,
   series,
   src,
   dest
} = require('gulp')
const del = require('delete')
const through2 = require('through2');
const rename = require('gulp-rename')
const stats = require('gulp-count-stat')
const log = require('fancy-log')
const convert = require('convert-vinyl-to-vfile')

const markdown = require('./markdown')

const writeGood = require('write-good')
const spellchecker = require('spellchecker')

const path = require('path')
const fs = require('fs')

const {
   Book,
   Page
} = require('book')

const git = require('gulp-git')
const min = require('minimist')

const title = 'Title of this Book'

const sourceGlob = ['src/**/*.md']
const assetsGlob = ['src/assets/**']
const destination = 'html/'
const destinationGlob = 'html/**'
const publishTarget = "publish/"

var book = null

function render() {
   book = new Book(title, path.resolve(destination))

   return src(sourceGlob)
      .pipe(through2.obj(function(vinyl, _, callback) {
         if (vinyl.isBuffer()) {
            var vfile = convert(vinyl)

            markdown.process(vfile, function(err, parsed) {
               var contents

               if (err) {
                  return callback(new Error(err))
               }

               logWarnings(parsed)
               contents = parsed.contents

               /* istanbul ignore else - There aren’t any unified compilers
                * that output buffers, but this logic is here to keep allow them
                * (and binary files) to pass through untouched. */
               if (typeof contents === 'string') {
                  contents = Buffer.from(contents, 'utf8')
               }

               vinyl.contents = contents

               if (parsed.data.metadata) {
                  // record the original .md file path
                  vinyl.pageData = parsed.data.metadata
               } else {
                  vinyl.pageData = {
                     name: vinyl.stem,
                     order: book.allPages.length + 1
                  }
               }
               vinyl.pageData.sourcePath = parsed.path

               callback(null, vinyl)
            })
         }
      }))
      .pipe(rename({
         extname: ".html"
      }))
      .pipe(dest(destination))
      .pipe(through2.obj(function(vinyl, _, callback) {
         if (vinyl.pageData) {
            let page = new Page(vinyl.pageData.title, vinyl.path, vinyl.pageData.order)
            page.data = vinyl.pageData
            book.addPage(page)
         }

         callback(null, vinyl)
      }))

   function logWarnings(parsed) {
      parsed.messages.forEach(msg => {
         console.log(`'${parsed.path}' ${msg.location.start.line},${msg.location.start.column},${msg.location.end.line||msg.location.start.line},${msg.location.end.column||msg.location.start.column} ${msg.reason}`)
      })
   }
}

function writeBook(callback) {
   // todo - write out a list of pages in order so that consuming apps can construct a book object?
   // could also write an export for each page 
   fs.writeFile("html/book.js", `module.exports = ${JSON.stringify(book,null,3)}`, err => {
      if (err) throw err
      log.info(`wrote book.js`)
   })
   callback()
}

function assets() {
   return src(assetsGlob).pipe(dest(destination + "/assets"))
}

function clean(callback) {
   return del(destinationGlob, callback)
}

function publish() {
   log.info(`publishing to ${publishTarget}`)
   return src(destinationGlob)
      .pipe(dest(publishTarget))
}

function spelling() {
   return src(sourceGlob)
      .pipe(through2.obj(function(file, _, callback) {
         if (file.isBuffer()) {
            file.contents.toString().split("\n").forEach((line, idx) => {
               let misspellings = spellchecker.checkSpelling(line)
               misspellings.forEach(err => {
                  let word = line.substring(err.start, err.end)
                  let suggestions = spellchecker.getCorrectionsForMisspelling(word)
                  console.log(`'${file.path}' ${idx + 1}:${err.start + 1} ${word} -> ${suggestions.join(' ')}`)
               })
            })
            callback(null, file)
         }
      }))
}

function count() {
   return src(sourceGlob)
      .pipe(stats())
}

function prose() {
   return src(sourceGlob)
      .pipe(through2.obj(function(file, _, callback) {
         if (file.isBuffer()) {
            file.contents.toString().split("\n").forEach((line, idx) => {
               let suggestions = writeGood(line)
               suggestions.forEach(sug => {
                  console.log(`'${file.path}' ${idx + 1}:${sug.index + 1}:${sug.offset + sug.index + 1} ${sug.reason}`)
               })
            })
            callback(null, file)
         }
      }))
}

function save() {
   var options = min(process.argv.slice(2), {
      string: 'm'
   });

   if (!options.m) {
      options.m = 'page edits'
   }

   var addtional = `{todo: Add interesting data: time, location, weather, word count}`

   return src(sourceGlob)
      //.pipe(git.add())

      .pipe(git.commit([options.m, addtional], {
         multiline: true,
         disableMessageRequirement: true
      }))
}

const build = series(clean, render, writeBook, assets)

exports.build = build
exports.publish = series(build, publish)
exports.spelling = spelling
exports.spell = spelling
exports.count = count
exports.prose = prose
exports.render = render
exports.check = series(spelling, prose, render, count)
exports.save = save
exports.default = build