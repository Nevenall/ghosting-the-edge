var gulp = require('gulp');
var gutil = require('gulp-util');
var tap = require('gulp-tap');
var MarkdownIt = require('markdown-it');
var deflist = require('markdown-it-deflist');
var terms = require('markdown-it-special-terms');
var del = require('del');
var shell = require('gulp-shell');
var count = require('gulp-count-stat');
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
md.use(terms);

// any link to a .md resource, we will convert to a link to an .html resource
var defaultRender = md.renderer.rules.link_open || function(tokens, idx, options, env, self) {
   return self.renderToken(tokens, idx, options);
};

md.renderer.rules.link_open = function(tokens, idx, options, env, self) {
   var aIndex = tokens[idx].attrIndex('href');
   var href = tokens[idx].attrs[aIndex][1];

   if(href.endsWith(".md")) {
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
            if(resultString) {
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
         console.log(file.path);
         suggestions.forEach(element => {
            var toCount = text.substring(0, element.index + element.offset);
            var line = toCount.match(/\n/g).length;
            console.log(`${line + 1}: ${element.reason}`);
         });
      }));
});