define([
  '../WBSingleton'
], function (WBSingleton, undefined) {

  'use strict';

  return WBSingleton.extend({

    'parseQueryString': function (qs, params) {

      var tokens = qs.split('&');
      var token;
      var i = tokens.length + 1;
      while (--i) {
        token = tokens[i - 1].split('=');
        params[token[0]] = decodeURIComponent(token[1]);
      }
    },

    'parseUrl': function (url) {

      var self = this;
      var link = document.createElement('a');
      link.href = url;

      var params = {};
      self.parseQueryString(link.search && link.search.substr(1), params);
      self.parseQueryString(link.hash && link.hash.substr(1), params);

      return {
        'protocol': link.protocol || 'http',
        'host': link.host || link.hostname,
        'path': link.pathname,
        'params': params
      };
    }

  });
});