define([

  'application/runtime',
  './WBViewController'

], function (
  runtime,
  WBViewController,
  undefined
) {

  'use strict';

  return WBViewController.extend({

    'implements': {
      
      'close': 'closeView',
      'click:close': 'closeView'
    },

    'closeView': function () {

      var self = this, view = self.view;

      if (typeof view.options.onClose === 'function') {
        view.options.onClose();
      }

      if (view.returnFocus) {
        runtime.trigger('focus:set', view.returnFocus);
        view.returnFocus = null;
      }

      view.destroy();
    },
  });
});