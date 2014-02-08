define([

  '../lib/dependencies',

  '../WBRuntime',
  '../WBMixin'

], function (

  dependencies,
  WBRuntime,
  WBMixin,
  undefined
) {

  'use strict';

  var $ = dependencies.$;

  return WBMixin.extend({

    'setupPathLinksHandler': function () {

      var self = this;
      self.bindTo(self.$('a'), 'click', self.pathLinksHandler);
    },

    'pathLinksHandler': function (e) {

      var $target = $(e.currentTarget);
      var path = $target.attr('data-path');
      if (path && path !== WBRuntime.currentRoute()) {
        WBRuntime.trigger('route:' + path);
      }
    }
  });
});