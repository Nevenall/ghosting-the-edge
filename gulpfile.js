import gulp from 'gulp'
let { parallel, series, src, dest } = gulp

import del from 'delete'
import through from 'through2'
import rename from 'gulp-rename'
import stats from 'gulp-count-stat'
import log from 'fancy-log'
import convert from 'convert-vinyl-to-vfile'

import markdown from './markdown.js'

import writeGood from 'write-good'
import spellchecker from 'spellchecker'

import path from 'path'
import fs from 'fs/promises'

import { Book, Page } from 'book'

import glob from 'fast-glob'
import git from 'simple-git'
import min from 'minimist'
import fetch from 'node-fetch'

const title = 'Title of this Book'

const sourceGlob = ['src/**/*.md']
const assetsGlob = ['src/assets/**']
const destination = 'html/'
const destinationGlob = 'html/**'
const publishTarget = "publish/"

var book = null

// todo - remark-smartypants to do "" transforms. Or remark-textr `does that same thing
// todo - remark-toc for a table of contents, maybe use it to generate a full menu
// wiki link can do handy internal page links

function render() {
   book = new Book(title, path.resolve(destination))
   return src(sourceGlob).pipe(through.obj(function (vinyl, encoding, callback) {
      if (vinyl.isBuffer()) {
         var vfile = convert(vinyl)
         markdown.process(vfile).then(parsed => {
            logWarnings(parsed)
            vinyl.contents = Buffer.from(parsed.value, encoding)
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
         }, error => {
            return callback(new Error(error))
         })
      }
   }))
      .pipe(rename({
         extname: ".html"
      }))
      .pipe(dest(destination))
      .pipe(through.obj(function (vinyl, encoding, callback) {
         if (vinyl.pageData) {
            let page = new Page(vinyl.pageData.title, path.relative(book.root, vinyl.path), vinyl.pageData.order)
            page.data = vinyl.pageData
            book.addPage(page)
         }
         callback(null, vinyl)
      }))

   function logWarnings(parsed) {
      parsed.messages.forEach(msg => {
         console.log(`'${parsed.path}' ${msg.location.start.line},${msg.location.start.column},${msg.location.end.line || msg.location.start.line},${msg.location.end.column || msg.location.start.column} ${msg.reason}`)
      })
   }
}

async function writeBook() {
   // todo - write out a list of pages in order so that consuming apps can construct a book object?
   // could also write an export for each page 
   try {
      await fs.writeFile('html/book.js', `module.exports = ${JSON.stringify(book, null, 3)}`)
   } catch (err) {
      await Promise.reject(err)
   }
   await Promise.resolve()
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

   var options = min(process.argv.slice(2), {
      string: 'file'
   })

   //todo - now we have a --file arg we can send a specific file to the task
   console.log(options.file)

   return src(sourceGlob)
      .pipe(through.obj(function (file, _, callback) {
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
      .pipe(through.obj(function (file, _, callback) {
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

async function save(callback) {
   var options = min(process.argv.slice(2), {
      string: 'm'
   })

   if (!options.m) {
      options.m = 'page edits'
   }

   // todo - we'll add interesting stuff to the additional data like location and weather and word count. 
   // maybe location as json? 
   // other hand, do I really want my exact location on every commit to a public repo? 
   // var location = await getLocation()
   // var additional = `LatLong: ${location.Latitude},${location.Longitude} Altitude: ${location.Altitude} Address: ${location.address}`
   var additional = ``

   const files = await glob.async(sourceGlob)

   git.commit([options.m, additional], files, {}, (err, data) => {
      if (err) {
         callback(err)
      }
      console.log(JSON.stringify(data, null, 2))
      callback()
   })

}

async function getLocation() {
   var ret = {}

   let ps = new Shell({
      executionPolicy: 'Bypass',
      noProfile: true
   })

   await ps.addCommand('./geolocation.ps1')

   ret = await ps.invoke()
   ret = JSON.parse(ret.replace(/\bNaN\b/g, 'null'))
   ps.dispose()


   const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${ret.Latitude},${ret.Longitude}&key=${process.env.google_api}`

   const loc = await (await fetch(url)).json()
   ret.address = (loc.results[0] || {
      formatted_address: ''
   }).formatted_address
   return ret
}

let build = series(clean, render, writeBook, assets)
let publishEx = series(build, publish)
let check = series(spelling, prose, render, count)

export {
   build as build,
   publishEx as publish,
   spelling as spelling,
   spelling as spell,
   count as count,
   prose as prose,
   render as render,
   check as check,
   save as save,
   build as default
}

