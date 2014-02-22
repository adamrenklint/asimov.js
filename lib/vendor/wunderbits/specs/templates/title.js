define([
  'vendor/handlebars'
], function (Handlebars) {

  'use strict';

  return Handlebars.template(function (H, data) {
    var self = this;
    self.compilerInfo = [4,'>= 1.0.0'];
    return self.escapeExpression(data.title);
  });
});