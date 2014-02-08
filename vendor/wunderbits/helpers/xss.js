define([

  '../WBSingleton'

], function (WBSingleton, undefined) {

  'use strict';

  return WBSingleton.extend({

    clean: function (string) {

      string || (string = '');
      string = string.replace(/&/g, '&amp;')
                     .replace(/</g, '&lt;')
                     .replace(/>/g, '&gt;')
                     .replace(/"/g, '&quot;')
                     .replace(/'/g, '&#x27;')
                     .replace(/\//g, '&#x2F;');

      return string;
    },

    reverseClean: function (string) {

      string || (string = '');
      string = string.replace(/\%/g, '&#37;');

      string = decodeURIComponent(string);

      return string.replace(/&amp;/g, '&')
                   .replace(/&lt;/g, '<')
                   .replace(/&gt;/g, '>')
                   .replace(/&quot;/g, '"')
                   .replace(/&#39;/g, '\'')
                   .replace(/&#x27;/g, '\'')
                   .replace(/&#x2F;/g, '\/')
                   .replace(/&#37;/g, '%');
    }
  });
});