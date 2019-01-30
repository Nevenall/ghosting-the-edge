const visit = require('unist-util-visit')

const attacher = () => transform


const transform = (tree) => {
   const vistor = (node) => {
      console.log(node)
   }
   visit(tree, 'paragraph', vistor)
}

exports.default = attacher