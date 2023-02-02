// import markdown from './markdown.js'

var obj1 = null
const obj2 = { foo: 'baz', x: 13 }

 obj1 = { ...obj1, ...obj2 }

console.log(obj1)