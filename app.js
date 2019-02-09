const str = "# Title with //term// with some //text// after."
const doubleSlash = /\/\/(.*?)\/\//;

var m = doubleSlash.exec(str)

console.log('', m)

const [matched, term] = m

var s = ''