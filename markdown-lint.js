
import remarkLint from 'remark-lint'
import preset from 'remark-preset-lint-markdown-style-guide'
import remarkLintMaximumLineLength from 'remark-lint-maximum-line-length'


export default [
   remarkLint,
   preset,
   // customize rules here
   [remarkLintMaximumLineLength, false]
]