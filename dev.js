// there are four possible special terms
// /term/ one_slash_term
// //term// two_slash_term 
// {term} one_brace_term
// {{term}} two_brace_term

// I think spaces are disallowed. / term / is not a match

// need a good test.md

// what about /{term}/ ? that should wrap the text {term} in the 
// markup for one slash terms. 


const doubleSlash = /\/\/(.*?)\/\//gm;

function plugin(options) {

   // console.log(options)

   function termsTokenizer(eat, value, silent) {
      // console.log(value)

      // if this.escape doens't include the special term markers then add them so we can escape these characters. But will this work for doubles?
      // todo - find matches and eat them
      // match doubles first, 
      // can we eat mutliples?

      var m = doubleSlash.exec(value)
      if (m) {
         eat
         const [match, term] = m

         eat(match)({
            type: 'double_slash',
            term: term,
            children: [{
               type: 'text',
               value: term
            }],
            data: {
               hName: 'double_slash'
            }
            //todo - might have children if we continue to parse terms, but I don't think we do.
            // children: [
            //    {type:'text'}
            // ]
         })
      }


   }


   const Parser = this.Parser

   // Inject the tokenizer
   const inlineTokenizers = Parser.prototype.inlineTokenizers
   const inlineMethods = Parser.prototype.inlineMethods
   inlineTokenizers.terms = termsTokenizer
   inlineMethods.splice(inlineMethods.indexOf('text'), 0, 'terms')


}

module.exports = plugin