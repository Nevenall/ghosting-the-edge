const {
   parallel,
   series,
   src,
   dest
} = require('gulp')

const del = require('delete')
const tap = require('gulp-tap')
const rename = require('gulp-rename')
const shell = require('gulp-shell')
const stats = require('gulp-count-stat')

const markdown = require('./markdown')

const markdownLint = require('markdownlint')
const writeGood = require('write-good')

const source = ['**/*.md', '!node_modules/**', '!tools/**']
const destination = 'html/'
const destinationGlob = 'html/**'
const publishTarget = "c:/temp/forkandwrite"

function build() {
   return src(source)
      .pipe(tap((file) => {
         var result = markdown.render(file.contents.toString())
         file.contents = Buffer.from(result)
      }))
      .pipe(rename({
         extname: ".html"
      }))
      .pipe(dest(destination))
}

function clean(callback) {
   del(destinationGlob, callback)
   callback()
}

function publish() {
   console.log(`publishing to ${publishTarget}`)
   return src(destinationGlob)
      .pipe(dest(publishTarget))
}

function spelling() {
   return src(source)
      .pipe(shell(['echo "<%= file.path %>"', 'OddSpell "<%= file.path %>"']))
}

function count() {
   return src(source)
      .pipe(stats())
}

function lint() {
   return src(source)
      .pipe(tap((file) => {
         markdownLint({
            files: [file.path],
            config: {
               default: true,
               "line-length": false
            }
         }, function(err, result) {
            var resultString = (result || "").toString();
            if (resultString) {
               console.log(resultString);
            }
         });
      }))
}

function prose() {
   return src(source)
      .pipe(tap((file, t) => {
         var text = file.contents.toString();
         var suggestions = writeGood(text);
         console.log(`"${file.path}"`);
         suggestions.forEach(element => {
            var toCount = text.substring(0, element.index + element.offset);
            var line = toCount.match(/\n/g).length;
            var column = toCount.substring(toCount.lastIndexOf('\n'), element.index).length;
            console.log(`${line + 1}:${column}  ${element.reason}`);
         });
      }));
}

exports.build = series(clean, build)
exports.publish = series(build, publish)
exports.spelling = spelling
exports.count = count
exports.lint = lint
exports.prose = prose
exports.default = series(clean, build)