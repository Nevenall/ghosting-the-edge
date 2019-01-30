const visit = require('unist-util-visit')

const attacher = (options) => {
   return transform
}

const transform = (tree, file) => {

   console.log(file)


   const vistor = (node) => {
      console.log(node)
   }
   visit(tree, null, vistor)
}

module.exports = attacher