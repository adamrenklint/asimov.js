/*

  collection class proxy for Slimbo.Collection

*/

define([

  '../vendor/Slimbo',
  '../vendor/wunderbits.core/public/mixins/WBUtilsMixin',
  '../vendor/wunderbits.core/public/mixins/WBDestroyableMixin',
  '../vendor/wunderbits.core/public/mixins/WBEventsMixin',
  '../vendor/wunderbits.core/public/mixins/WBBindableMixin',
  './Base',
  'lodash',
  './Model'

], function (_Slimbo, WBUtilsMixin, WBDestroyableMixin, WBEventsMixin, WBBindableMixin, Base, _, Model) {

  var _super = Slimbo.Collection.prototype;
  var base = new Base();

  return Slimbo.Collection.extend({

    'model': Model,

    'initialize': function () {

      var self = this;
      _super.initialize.apply(self, arguments);
      _.bindAll(self);

      WBUtilsMixin.applyTo(self);
      WBDestroyableMixin.applyTo(self);
      WBEventsMixin.applyTo(self);
      WBBindableMixin.applyTo(self);

      self.logger = base.logger;
      self.filesystem = base.filesystem;
    },

    'add': function (models, options) {

      var self = this;
      options = _.merge({}, options, self.options);
      _super.add.call(self, models, options);

      if (!_.isArray(models)) {
        models = [models];
      }

      _.each(models, function (model) {

        if (!model.attributes) {
          return;
        }

        self.trigger('add', model, self, options);

        // TODO: cache the binding for each model, its leaky
        self.bindTo(model, 'change', self.triggerChange);
      });
    },

    'lazyChangeMethod': function (key, model) {

      var self = this;
      self.changeMethods = self.changeMethods || {};
      var realKey = model.id + key + model.cid;
      self.logger.log('lazyChangeMethod:' + realKey)
      var changeMethod = self.changeMethods[realKey];

      if (typeof changeMethod !== 'function') {
        changeMethod = self.changeMethods[realKey] = _.debounce(function () {
          self.logger.log('collection triggering change:' + key + ' for ' + model.id);
          self.trigger('change:' + key, model);
        }, 0);
      }

      changeMethod();
    },

    'triggerChange': function (keys, model) {

      var self = this;

      if (keys.attributes) {
        model = keys;
      }

      self.logger.log('changed attributes @ ' + model.id + self.cid);
      self.logger.json(model.changedAttributes());

      _.each(model.changedAttributes(), function (value, key) {
        self.lazyChangeMethod(key, model);
      });
    },

    'remove': function (models) {

      var self = this;
      _super.remove.apply(self, arguments);

      if (!_.isArray(models)) {
        models = [models];
      }

      _.each(models, function (model) {
        self.unbindFromTarget(model);
        self.trigger('removed', model, self);
      });
    },

    'fetch': function () {}
  });
});