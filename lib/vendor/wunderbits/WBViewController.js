define([

  './lib/dependencies',
  './WBController',
  './WBViewPresenter'

], function (dependencies, WBController, WBViewPresenter, undefined) {

  'use strict';

  var _ = dependencies._;

  var _super = WBController.prototype;

  return WBController.extend({

    'model': undefined,
    'options': undefined,
    'state': undefined,
    'view': undefined,
    '_viewEvents': undefined,

    'implements': {
      'visible': 'viewMadeVisible',
      'hidden': 'viewMadeHidden'
    },

    'initialize': function (view) {

      var self = this;
      _super.initialize.apply(self, arguments);

      self.view = view || self.view;
      if (!self.view instanceof WBViewPresenter) {
        throw new Error('Cannot initialize without instance of WBViewPresenter as self.view');
      }

      self.model = self.view.model;
      self.options = WBViewPresenter.prototype._mergeFromSuper(self, 'options');
      self.state = WBViewPresenter.prototype._mergeFromSuper(self, 'state');

      self.bindViewEvents();
    },

    'bindViewEvents': function (instance) {

      var self = this;
      instance || (instance = self);
      var method;

      if (!self._viewEvents) {
        self._viewEvents = {};
      }

      for (var event in instance.implements) {
        if (instance.implements.hasOwnProperty(event)) {
          method = instance.implements[event];
          method = _.isFunction(method) ? method : _.isFunction(self[method]) ? self[method] : null;

          if (method && self._viewEvents[event] !== method) {
            self.bindTo(self.view, event, method);
            self._viewEvents[event] = method;
          }
        }

        method = null;
      }

      if (instance.constructor && instance.constructor.__super__) {
        self.bindViewEvents(instance.constructor.__super__);
      }
    }
  });
});