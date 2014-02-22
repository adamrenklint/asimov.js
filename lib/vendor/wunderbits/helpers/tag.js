define([
  './tokenizer'
], function (Tokenizer, undefined) {

  'use strict';

  return Tokenizer.extend({

    'invalidLeadingChars': /[\w\/\?=&]/,
    'validationRegExp': /^#[^\s$#]+/,
    'extractionRegExp': /#[^\s$#]+/g,
    'validateTLD': false,

    'createLink': function (tag) {
      var link = document.createElement('a');
      link.className = 'hash linkout';

      if(tag === '#bug') {
        link.className += ' hash-bug';
      } else if(tag === '#in-qa') {
        link.className += ' hash-qa';
      } else if(tag === '#in-review') {
        link.className += ' hash-review';
      }

      link.href = '#/search/' + encodeURIComponent(tag);
      link.textContent = tag;
      return link;
    }
  });
});