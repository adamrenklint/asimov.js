define([
  './tokenizer'
], function (Tokenizer, undefined) {

  'use strict';

  var protoRegexp = /^((ht|f)tps?)?:\/\//;

  return Tokenizer.extend({

    'validateTLD': true,
    'invalidLeadingChars': /[#@\.\/\\]/,
    'validationRegExp': /^((ht|f)tps?:\/\/)?([\w\-\.]+\.(\w{2,6}))(:\d+)?/,
    'extractionRegExp': /(?:(?:ht|f)tps?:\/\/)?(?:[\w\-\.]+\.(?:[a-z]{2,6}))(?::\d+)?(?:\/[\S]*|\b)/g,

    'createLink': function (url) {

      var link = document.createElement('a');
      link.className = 'linkout';

      // open non-wunderlist urls in a new tab/window
      // TODO: move this check out of wunderbits
      if (url.indexOf('wunderlist.com/#') < 0) {
        link.target = '_blank';
      }

      // if the url is missing protocol, default to http
      var href = url;
      protoRegexp.test(href) || (href = 'http://' + href);
      link.href = href;

      // TODO: bring back the max length thingy
      link.textContent = url;
      return link;
    },

    'extractLinks': function (text) {
      return this.extractTokens(text);
    }
  });
});