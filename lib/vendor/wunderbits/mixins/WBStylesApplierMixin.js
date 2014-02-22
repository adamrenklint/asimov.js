define([

  '../lib/dependencies',
  '../WBMixin',
  '../WBStyleApplier'

], function (dependencies, WBMixin, WBStyleApplier, undefined) {

  'use strict';

  var _ = dependencies._;

  return WBMixin.extend({

    'initialize': function () {

      var self = this;

      if (self.autoApplyStyles === false) {
        return;
      }

      self.applyStyles();
    },

    'applyStyles': function () {

      var self = this;
      if (!_.isArray(self.styles)) {
        return;
      }

      var sheet;
      for (var i = 0, len = self.styles.length; i < len; i++) {

        sheet = self.styles[i];
        if (!(sheet instanceof WBStyleApplier) && sheet.name && sheet.styles) {
          sheet = new WBStyleApplier(sheet.name, sheet.styles);
        }

        if (typeof sheet !== 'function' && typeof sheet.apply !== 'function') {
          throw new Error('Cannot apply style, not valid WBStyleApplier (sub)class');
        }

        sheet.apply(self, self.styleVariables || {});
      }
    }
  });
});