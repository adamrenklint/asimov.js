define([

  '../lib/dependencies',
  '../WBMixin'

], function (
  dependencies,
  WBMixin,
  undefined
) {

  'use strict';

  var $ = dependencies.$;

  return WBMixin.extend({

    'show': function () {

      var self = this;
      if (!self.destroyed && self.$el) {
        self.$el.removeClass('hidden');
      }
      return self;
    },

    'hide': function () {

      var self = this;
      if (!self.destroyed && self.$el) {
        self.$el.addClass('hidden');
      }
      return self;
    },

    'fadeOut': function (ms, selector) {

      var self = this;
      var def = new $.Deferred();
      var $el = selector ? self.$(selector) : self.$el;
      $el.fadeOut(ms, def.resolve);
      return def.promise();
    },

    'fadeIn': function (ms, selector) {

      var self = this;
      var def = new $.Deferred();
      var $el = selector ? self.$(selector) : self.$el;
      $el.fadeIn(ms, def.resolve);
      return def.promise();
    }
  });

});