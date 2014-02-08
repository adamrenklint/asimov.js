define([
  './tokenizer'
], function (Tokenizer, undefined) {

  'use strict';

  return Tokenizer.extend({

    'validateTLD': true,
    'invalidLeadingChars': /[#=@&]/,
    'validationRegExp': /^[^\s@=]+@[^\.\s@]+(\.[^\.\s@]+)+$/,
    'extractionRegExp': /[a-z0-9][\/\(\)\{\}\[\]\-\.\+\w]*@[a-z0-9][\/\(\)\{\}\[\]\-\.\+\w]*\.[a-z]{2,6}/ig,

    'createLink': function (email) {
      var link = document.createElement('a');
      link.className = 'email linkout';
      link.target = '_blank';
      link.href = 'mailto:' + email;
      link.textContent = email;
      return link;
    },

    'isValidEmail': function (email) {
      return this.isValidMatch(email);
    },

    'extractEmails': function (text) {
      return this.extractTokens(text);
    }

  });
});
