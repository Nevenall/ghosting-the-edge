
 // .use(terms, [{
   //    open: '{',
   //    close: '}',
   //    element: 'span',
   //    class: 'term-1'
   // }, {
   //    open: '{{',
   //    close: '}}',
   //    element: 'span',
   //    class: 'term-2'
   // }])

// .use(containers, {
   //    default: true,
   //    custom: [{
   //       type: 'sidebar',
   //       element: 'aside',
   //       transform: function(node, config, tokenize) {
   //          node.data.hProperties = {
   //             className: config || 'left'
   //          }
   //       }
   //    }, {
   //       type: 'callout',
   //       element: 'article',
   //       transform: function(node, config, tokenize) {
   //          node.data.hProperties = {
   //             className: config || 'left'
   //          }
   //       }
   //    }, {
   //       type: 'columns',
   //       element: 'div',
   //       transform: function(node, config, tokenize) {
   //          node.data.hProperties = {
   //             className: 'columns'
   //          }
   //       }
   //    }, {
   //       type: 'quote',
   //       element: 'aside',
   //       transform: function(node, config, tokenize) {
   //          var words = tokenizeWords.parse(config)

   //          node.data.hProperties = {
   //             className: `quoted ${words.shift()}`
   //          }
   //          node.children.push({
   //             type: 'footer',
   //             data: {
   //                hName: 'footer'
   //             },
   //             children: tokenize(words.join(' '))
   //          })
   //       }
   //    }, {
   //       type: 'figure-table',
   //       element: 'figure',
   //       transform: function(node, config, tokenize) {
   //          node.data.hProperties = {
   //             className: `figure-table`
   //          }
   //          node.children.push({
   //             type: 'figcaption',
   //             data: {
   //                hName: 'figcaption'
   //             },
   //             children: tokenize(config)
   //          })
   //       }
   //    }]
   // })