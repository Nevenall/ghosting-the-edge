import gulp from 'gulp'
let { parallel, series, src, dest } = gulp

import { deleteAsync as del } from 'del'
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

import { paramCase } from "change-case"


import glob from 'fast-glob'
import git from 'simple-git'
import min from 'minimist'
import fetch from 'node-fetch'

const title = 'Ghosting the Edge'

const sourceGlob = ['src/**/*.md']
const assetsGlob = ['src/assets/**']
const destination = 'html/'
const destinationGlob = 'html/**'
const publishTarget = "C:/src/gulp-bookshelf/src/book"


var chapters = []

function render() {
   return src(sourceGlob).pipe(through.obj(function (vinyl, encoding, callback) {
      if (vinyl.isBuffer()) {
         var vfile = convert(vinyl)
         markdown.process(vfile)
            .then(parsed => {
               logWarnings(parsed)
               vinyl.contents = Buffer.from(parsed.value, encoding)
               // copy the custom data from the parsed markdown file to the subsequent gulp file
               vinyl.data = { ...vinyl.data, ...parsed.data }
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
         // prefer values from frontmatter for page properties
         let tlHeader = vinyl?.data?.toc?.length > 0 ? vinyl.data.toc[0].title : null
         chapters.push({
            // use metadata title, or the title of the top level header, or vinyl.stem
            // title: vinyl?.data?.metadata?.title  || vinyl.stem,
            title: vinyl?.data?.metadata?.title || tlHeader || vinyl.stem,
            path: vinyl?.data?.metadata?.path || `/${paramCase(vinyl.stem)}`,
            order: vinyl?.data?.metadata?.order !== undefined ? vinyl.data.metadata.order : chapters.length + 1,
            file: path.relative('html', vinyl.path),
            toc: vinyl?.data?.toc
         })

         callback(null, vinyl)
      }))

   function logWarnings(parsed) {
      parsed.messages.forEach(msg => {
         console.log(`'${parsed.path}' ${msg.location.start.line},${msg.location.start.column},${msg.location.end.line || msg.location.start.line},${msg.location.end.column || msg.location.start.column} ${msg.reason}`)
      })
   }
}

async function writeBook(cb) {
   chapters.sort((a, b) => a.order - b.order)

   var str = `${chapters.map((chapter, idx) => `import Chapter${idx} from './${chapter.file}'`).join('\n')}
export default [
${chapters.map((chapter, idx) => `   { title: '${chapter.title}', path: '${chapter.path}', chapter: Chapter${idx}, toc: ${JSON.stringify(chapter.toc)} },`).join('\n')}
]`

   await fs.writeFile('html/book.js', str)
   cb()
}

function assets() {
   return src(assetsGlob).pipe(dest(destination + "/assets"))
}

async function clean(cb) {
   await del(destinationGlob)
   cb()
}

function publish() {
   log.info(`publishing to ${publishTarget}`)
   return src(destinationGlob)
      .pipe(dest(publishTarget))
}

function spelling() {
   var options = min(process.argv.slice(2), { string: 'file' })

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
   return src(sourceGlob).pipe(stats())
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
   var options = min(process.argv.slice(2), { string: 'm' })

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
   count as count,
   prose as prose,
   clean as clean,
   render as render,
   check as check,
   save as save,
   build as default
}

