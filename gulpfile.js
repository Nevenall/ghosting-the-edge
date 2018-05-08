const gulp = require('gulp');
const gutil = require('gulp-util');
const tap = require('gulp-tap');
const shell = require('gulp-shell');

const count = require('gulp-count-stat');

const del = require('del');

const MarkdownIt = require('markdown-it');
const deflist = require('markdown-it-deflist');
const terms = require('markdown-it-special-terms');
const anchors = require('markdown-it-anchor');
const containers = require('markdown-it-container');

const markdownLint = require('markdownlint');

const prose = require('write-good');


var md = new MarkdownIt({
   html: true,
   xhtmlOut: true,
   breaks: true,
   typographer: true,
   linkify: true
});

md.use(deflist);
md.use(terms, {
   open_1: '<span class="game-term">',
   close_1: "</span>",
   open_2: '<span class="aspect">',
   close_2: "</span>",
   // open_3: "<div class='stat-block'>",
   // close_3: "</div>"
});
md.use(anchors);

md.use(containers, 'aside', {
   validate: function(params) {
      return params.match(/\s*aside\s*/i);
   },

   render: function(tokens, idx) {
      var m = tokens[idx].info.match(/\s*aside\s+(.*)/i);
      if (tokens[idx].nesting === 1) {
         if (m) {
            return `<aside class="${m[1]}">\n`;
         } else {
            return '<aside>\n';
         }
      } else {
         return "</aside>\n"
      }
   }
});

md.use(containers, 'article', {
   validate: function(params) {
      return params.match(/\s*article\s*/i);
   },

   render: function(tokens, idx) {
      var m = tokens[idx].info.match(/\s*article\s+(.*)/i);
      if (tokens[idx].nesting === 1) {
         if (m) {
            return `<article class="${m[1]}">\n`;
         } else {
            return '<article>\n';
         }
      } else {
         return "</article>\n"
      }
   }
});

md.use(containers, 'figure', {
   validate: function(params) {
      return params.match(/\s*figure\s*/i);
   },

   render: function(tokens, idx) {
      var m = tokens[idx].info.match(/\s*figure\s+(.*)/i);
      if (tokens[idx].nesting === 1) {
         if (m) {
            return `<figure>\n<figcaption>${md.render(m[1])}</figcaption>\n`;
         } else {
            return '<figure>\n';
         }
      } else {
         return "</figure>\n"
      }
   }
});

// any link to a .md resource, we will convert to a link to an .html resource
// links with \ will be converted to /
var defaultRender = md.renderer.rules.link_open || function(tokens, idx, options, env, self) {
   return self.renderToken(tokens, idx, options);
};

md.renderer.rules.link_open = function(tokens, idx, options, env, self) {
   var aIndex = tokens[idx].attrIndex('href');
   var href = tokens[idx].attrs[aIndex][1];

   tokens[idx].attrs[aIndex][1] = href.replace('\\', '/');

   if (href.endsWith(".md")) {
      tokens[idx].attrs[aIndex][1] = href.replace(".md", ".html");
   }

   // pass token to default renderer.
   return defaultRender(tokens, idx, options, env, self);
};



const source = ['**/*.md', '!node_modules/**', '!tools/**'];

gulp.task('clean', function() {
   return del('html/**');
});

gulp.task('build', ['clean'], function() {
   return gulp.src(source)
      .pipe(tap((file) => {
         var result = md.render(file.contents.toString());
         file.contents = new Buffer(result);
         file.path = gutil.replaceExtension(file.path, '.html');
         return;
      }))
      .pipe(gulp.dest('./html'));
});

gulp.task('copy', ['build'], function() {
   console.log("copying to c:/src/BookShelf-GhostingTheEdge/src/pages");
   return gulp.src('html/**').pipe(gulp.dest("c:/src/BookShelf-GhostingTheEdge/src/pages"));
});

gulp.task('spelling', function() {
   return gulp.src(source)
      .pipe(shell(['echo "<%= file.path %>"', 'OddSpell "<%= file.path %>"']));
});

gulp.task('count', function() {
   return gulp.src(source)
      .pipe(count());
});

// vale and markdown lint will probably need different problem matchers.
gulp.task('lint', function() {
   return gulp.src(source)
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
      }));
});

gulp.task('prose', function() {
   return gulp.src(source)
      .pipe(tap((file, t) => {
         var text = file.contents.toString();
         var suggestions = prose(text);
         console.log(`"${file.path}"`);
         suggestions.forEach(element => {
            var toCount = text.substring(0, element.index + element.offset);
            var line = toCount.match(/\n/g).length;
            var column = toCount.substring(toCount.lastIndexOf('\n'), element.index).length;
            console.log(`${line + 1}:${column}  ${element.reason}`);
         });
      }));
});