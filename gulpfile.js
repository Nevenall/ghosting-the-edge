const {
   parallel,
   series,
   src,
   dest
} = require('gulp')

const del = require('delete')
const through2 = require('through2');

const rename = require('gulp-rename')
const shell = require('gulp-shell')
const stats = require('gulp-count-stat')
const log = require('fancy-log')

const markdown = require('./markdown')

const markdownLint = require('markdownlint')
const writeGood = require('write-good')

const source = ['src/**/*.md']

const assetsPath = ['assets/**']

const destination = 'html/'
const destinationGlob = 'html/**'

const publishTarget = "c:/temp/forkandwrite/src/pages"


function render(callback) {
   return src(source)
      // inline plugin
      .pipe(through2.obj(function(file, _, callback) {
         if (file.isBuffer()) {
            var result = markdown.render(file.contents.toString())
            file.contents = Buffer.from(result)
         }
         callback(null, file)
      }))
      .pipe(rename({
         extname: ".html"
      }))
      .pipe(dest(destination))
}


function assets() {
   return src(assetsPath).pipe(dest(destination + "/assets"))
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
   return src(source)
      .pipe(shell(['echo "<%= file.path %>"', 'OddSpell "<%= file.path %>"']))
}

function count() {
   return src(source)
      .pipe(stats())
}

function lint(callback) {
   return src(source)

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
   return src(source)
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


const build = series(clean, render, assets)

exports.build = build
exports.publish = series(build, publish)
exports.spelling = spelling
exports.count = count
exports.lint = lint
exports.prose = prose
exports.render = render
exports.default = build