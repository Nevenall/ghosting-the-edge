
import remarkLint from 'remark-lint'
import preset from 'remark-preset-lint-markdown-style-guide'




export default [
   remarkLint,
   preset,

  // can redefine rules here, or in packages.json
]



// module.exports.plugins = [
//    require('remark-lint'),

//    // http://www.cirosantilli.com/markdown-style-guide/#file-extension
//    [require('remark-lint-file-extension'), 'md'],

//    // http://www.cirosantilli.com/markdown-style-guide/#file-name
//    require('remark-lint-no-file-name-mixed-case'),
//    require('remark-lint-no-file-name-articles'),
//    require('remark-lint-no-file-name-irregular-characters'),
//    require('remark-lint-no-file-name-consecutive-dashes'),
//    require('remark-lint-no-file-name-outer-dashes'),

//    // http://www.cirosantilli.com/markdown-style-guide/#newlines
//    // http://www.cirosantilli.com/markdown-style-guide/#empty-lines-around-lists
//    // http://www.cirosantilli.com/markdown-style-guide/#tables
//    require('remark-lint-no-consecutive-blank-lines'),

//    // http://www.cirosantilli.com/markdown-style-guide/#spaces-after-sentences.
//    // Not enforced, cannot be done properly without false positives, if you
//    // want this, use remark-retext and retext-sentence-spacing.

//    // http://www.cirosantilli.com/markdown-style-guide/#dollar-signs-in-shell-code
//    require('remark-lint-no-shell-dollars'),

//    // http://www.cirosantilli.com/markdown-style-guide/#what-to-mark-as-code.
//    // This is a tip, not a rule.

//    // http://www.cirosantilli.com/markdown-style-guide/#spelling-and-grammar.
//    // Spelling is not in the scope of remark-lint.  If you want this,
//    // use remark-retext and retext-spell.

//    // http://www.cirosantilli.com/markdown-style-guide/#line-breaks
//    require('remark-lint-hard-break-spaces'),

//    // http://www.cirosantilli.com/markdown-style-guide/#headers
//    [require('remark-lint-heading-style'), 'atx'],
//    require('remark-lint-heading-increment'),
//    require('remark-lint-no-duplicate-headings'),

//    // http://www.cirosantilli.com/markdown-style-guide/#top-level-header
//    require('remark-lint-no-multiple-toplevel-headings'),

//    // http://www.cirosantilli.com/markdown-style-guide/#header-case.
//    // Heading case isn’t tested yet: new rules to fix this are ok though!

//    // http://www.cirosantilli.com/markdown-style-guide/#end-of-a-header.
//    // Cannot be checked?

//    // http://www.cirosantilli.com/markdown-style-guide/#header-length
//    require('remark-lint-maximum-heading-length'),

//    // http://www.cirosantilli.com/markdown-style-guide/#punctuation-at-the-end-of-headers
//    [require('remark-lint-no-heading-punctuation'), ':.'],

//    // http://www.cirosantilli.com/markdown-style-guide/#header-synonyms.
//    // Cannot be checked?

//    // http://www.cirosantilli.com/markdown-style-guide/#blockquotes
//    [require('remark-lint-blockquote-indentation'), 2],
//    require('remark-lint-no-blockquote-without-marker'),

//    // http://www.cirosantilli.com/markdown-style-guide/#unordered
//    [require('remark-lint-unordered-list-marker-style'), '-'],

//    // http://www.cirosantilli.com/markdown-style-guide/#ordered
//    [require('remark-lint-ordered-list-marker-style'), '.'],
//    [require('remark-lint-ordered-list-marker-value'), 'one'],

//    // http://www.cirosantilli.com/markdown-style-guide/#spaces-after-list-marker
//    [require('remark-lint-list-item-indent'), 'mixed'],

//    // http://www.cirosantilli.com/markdown-style-guide/#indentation-of-content-inside-lists
//    require('remark-lint-list-item-content-indent'),

//    // http://www.cirosantilli.com/markdown-style-guide/#empty-lines-inside-lists
//    require('remark-lint-list-item-spacing'),

//    // http://www.cirosantilli.com/markdown-style-guide/#case-of-first-letter-of-list-item
//    // Not checked.

//    // http://www.cirosantilli.com/markdown-style-guide/#punctuation-at-the-end-of-list-items.
//    // Not checked.

//    // http://www.cirosantilli.com/markdown-style-guide/#definition-lists.
//    // Not checked.

//    // http://www.cirosantilli.com/markdown-style-guide/#code-blocks
//    [require('remark-lint-code-block-style'), 'fenced'],
//    [require('remark-lint-fenced-code-flag'), { allowEmpty: false }],
//    [require('remark-lint-fenced-code-marker'), '`'],

//    // http://www.cirosantilli.com/markdown-style-guide/#horizontal-rules
//    [require('remark-lint-rule-style'), '---'],

//    // http://www.cirosantilli.com/markdown-style-guide/#tables
//    require('remark-lint-no-table-indentation'),
//    //   require('remark-lint-table-pipes'),
//    //   require('remark-lint-table-pipe-alignment'),
//    //   [require('remark-lint-table-cell-padding'), 'padded'],

//    // http://www.cirosantilli.com/markdown-style-guide/#separate-consecutive-elements.
//    // Not checked.

//    // http://www.cirosantilli.com/markdown-style-guide/#span-elements
//    require('remark-lint-no-inline-padding'),

//    // http://www.cirosantilli.com/markdown-style-guide/#reference-style-links
//    require('remark-lint-no-shortcut-reference-image'),
//    require('remark-lint-no-shortcut-reference-link'),
//    require('remark-lint-final-definition'),
//    require('remark-lint-definition-case'),
//    require('remark-lint-definition-spacing'),

//    // http://www.cirosantilli.com/markdown-style-guide/#single-or-double-quote-titles
//    [require('remark-lint-link-title-style'), '"'],

//    // http://www.cirosantilli.com/markdown-style-guide/#bold
//    [require('remark-lint-strong-marker'), '*'],

//    // http://www.cirosantilli.com/markdown-style-guide/#italic
//    [require('remark-lint-emphasis-marker'), '*'],

//    // http://www.cirosantilli.com/markdown-style-guide/#uppercase-for-emphasis.
//    // Not checked.

//    // http://www.cirosantilli.com/markdown-style-guide/#emphasis-vs-headers
//    require('remark-lint-no-emphasis-as-heading'),

//    // http://www.cirosantilli.com/markdown-style-guide/#automatic-links-without-angle-brackets
//    require('remark-lint-no-literal-urls'),

//    // http://www.cirosantilli.com/markdown-style-guide/#content-of-automatic-links
//    require('remark-lint-no-auto-link-without-protocol')

//    // http://www.cirosantilli.com/markdown-style-guide/#email-automatic-links.
//    // Not checked.
// ]