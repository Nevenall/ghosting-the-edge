// data model for a book and it's contents
'use strict'

var rawPages = require.context('./pages', true)

class Book {
   // pages is an array of Page objects
   constructor(title, pages) {
      this.title = title
      this.allPages = pages
      this.sections = []
      this.pages = []
      this.frontPage = new Page("FrontPage", "./README.html", `<h2>${title}</h2>`)

      pages.forEach(page => {

         if (page.path.toLowerCase() === "./readme.html") {
            this.frontPage = page
         }

         var parts = page.path.split("/")
         if (parts.length < 2) {
            // no op
         } else if (parts.length == 2) {
            this.pages.push(page)
         } else {
            var sectionParts = parts.splice(1, parts.length - 2)
            var currentSections = this.sections
            var current = null
            sectionParts.forEach(newSection => {
               current = currentSections.find(s => s.name === newSection)
               if (current == null) {
                  current = new Section(newSection)
                  currentSections.push(current)
               }
               currentSections = current.sections
            })
            current.pages.push(page)
         }
      })
   }
}

class Section {
   constructor(name) {
      this.name = name
      this.pages = []
      this.sections = []
   }
}

// represents a page in the book
class Page {
   //name, full path of the page in the form ./folder/pagename.html, contents of the page
   constructor(name, path, content) {
      this.name = name
      this.path = path
      this.content = content
   }
}

var pageOrder = {
   "title": "BookShelf",
   "pages": [{
      "name": "Introduction",
      "path": "./README.html"
   }]
}

var pages = pageOrder.pages.map((p) => {
   return new Page(p.name, p.path, rawPages(p.path))
})

var thisBook = new Book(pageOrder.title, pages)

export default thisBook