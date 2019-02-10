var a = ['a', 'b', 'c']



a.splice(a.indexOf('b'), 0, 'b2')
a.splice(a.indexOf('b'), 0, 'b3')

console.log("", a)