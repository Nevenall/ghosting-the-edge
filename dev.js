// there are four possible special terms
// /term/ one_slash_term
// //term// two_slash_term 
// {term} one_brace_term
// {{term}} two_brace_term

// I think spaces are disallowed. / term / is not a match

// need a good test.md

// what about /{term}/ ? that should wrap the text {term} in the 
// markup for one slash terms. 

const markers = {
   '/': 'one_slash',
   '//': 'two_slash',
   '{': 'one_brace',
   '{{': 'two_brace',

}

function plugin(options) {

   console.log(options)

   function termsTokenizer(eat, value, silent) {
      console.log(value)

      // if this.escape doens't include the special term markers then add them so we can escape these characters. But will this work for doubles?

      


      eat(value)
   }


   const Parser = this.Parser

   // Inject the tokenizer
   const inlineTokenizers = Parser.prototype.inlineTokenizers
   const inlineMethods = Parser.prototype.inlineMethods
   inlineTokenizers.terms = termsTokenizer
   inlineMethods.splice(inlineMethods.indexOf('text'), 0, 'terms')


}



module.exports = plugin