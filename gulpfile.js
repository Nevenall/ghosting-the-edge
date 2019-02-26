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
const linter = require('remark-lint')
const writeGood = require('write-good')
const spellchecker = require('node-spellchecker')

const path = require('path')
const fs = require('fs')
const {
   Book,
   Page
} = require('book')

const sourceGlob = ['src/**/*.md']
const assetsGlob = ['src/assets/**']
const destination = 'html/'
const destinationGlob = 'html/**'
const publishTarget = "publish/"

var book = null

function render(callback) {
   book = new Book('Temporary Title', path.resolve(destination))

   return src(sourceGlob)
      .pipe(through2.obj(function(vinyl, _, callback) {
         if (vinyl.isStream()) {
            return callback(new PluginError(name, 'Streaming not supported'))
         }

         if (vinyl.isBuffer()) {
            var vfile = convert(vinyl)

            markdown.process(vfile, function(err, parsed) {
               var contents

               if (err) {
                  return callback(new PluginError(name, err || 'Unsuccessful running'))
               }

               contents = parsed.contents

               /* istanbul ignore else - There aren’t any unified compilers
                * that output buffers, but this logic is here to keep allow them
                * (and binary files) to pass through untouched. */
               if (typeof contents === 'string') {
                  contents = Buffer.from(contents, 'utf8')
               }

               vinyl.contents = contents

               var fm = parsed.data.metadata
               fm.sourcePath = parsed.path
               vinyl.metadata = fm

               callback(null, vinyl)
            })
         }
      }))
      .pipe(rename({
         extname: ".html"
      }))
      .pipe(dest(destination))
      .pipe(through2.obj(function(vinyl, _, callback) {
         vinyl.metadata.path = vinyl.path
         book.addPage(new Page(vinyl.metadata.title, vinyl.metadata.path, vinyl.metadata.order))
         callback(null, vinyl)
      }))

}

function makeBook(callback) {

   // take frontmatter and make a book obj out of it
   // minus the file contents themselves
   // then save that to the html dir so we can import it
   // in the bookshelf instance
   // can make the book class a git repo that this and bookshelf can npm i
   // to share the code. 
   // Write this instance of Book to the dest in a way that can be moduled

   fs.writeFile("html/book.js", `module.exports = ${JSON.stringify(book)}`, err => {
      console.log("done")
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
      .pipe(shell(['echo "<%= file.path %>"', 'OddSpell "<%= file.path %>"']))
}

function count() {
   return src(sourceGlob)
      .pipe(stats())
}

function lint(callback) {
   return src(sourceGlob)

      .pipe(through2.obj(function(file, _, callback) {

         markdownLint({
            files: [file.path],
            config: {
               default: true,
               "line-length": false
            }
         }, function(err, result) {
            var resultString = (result || "").toString()
            if (resultString) {
               console.log(resultString)
            }
         });

         callback(null, file)
      }))


}

function prose(callback) {
   return src(sourceGlob)
      .pipe(through2.obj(function(file, _, callback) {
         var text = file.contents.toString();
         var suggestions = writeGood(text);
         console.log(`"${file.path}"`);
         suggestions.forEach(element => {
            var toCount = text.substring(0, element.index + element.offset);
            var line = toCount.match(/\n/g).length;
            var column = toCount.substring(toCount.lastIndexOf('\n'), element.index).length;
            console.log(`${line + 1}:${column}  ${element.reason}`);
         });

         callback(null, file)
      }))
}


const build = series(clean, render, makeBook, assets)

exports.build = build
exports.publish = series(build, publish)
exports.spelling = spelling
exports.count = count
exports.lint = lint
exports.prose = prose
exports.render = render
exports.default = build