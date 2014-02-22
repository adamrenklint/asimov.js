define([

  './lib/dependencies',
  './WBSingleton'

], function (dependencies, WBSingleton, undefined) {

  'use strict';

  var _ = dependencies._;

  var Mixin = WBSingleton.extend({

    // Apply the mixin to an instance of a class
    'applyTo': function (instance) {

      var behavior = _.clone(this.Behavior || {});

      // apply mixin's initialize & remove it from the instance
      var initializer;
      if (typeof behavior.initialize === 'function') {
        initializer = behavior.initialize;
        delete behavior.initialize;
      }

      // mixin the behavior
      _.extend(instance, behavior);

      // bind all mixed in methods to the instance
      var property;
      for (var key in behavior) {
        property = behavior[key];
        if (typeof property === 'function') {
          instance[key] = _.bind(property, instance);
        }
      }

      initializer && initializer.apply(instance);

      return instance;
    },

    // Apply the mixin to the class directly
    'applyToClass': function (klass) {

      var proto = klass.prototype;
      if (!proto || !proto.constructor) {
        throw new Error('applyToClass expects a class');
      }

      var behavior = _.clone(this.Behavior || {});

      // cache the mixin's initializer, to be applied later
      var initialize = behavior.initialize;
      if (typeof initialize === 'function') {
        var initializers = proto.initializers = proto.initializers || [];
        initializers.push(initialize);
        delete behavior.initialize;
      }

      // extend the prototype
      _.extend(proto, behavior);

      return klass;
    }
  });

  // The only real change from a simple singleton is
  // the altered extend class method, which will save
  // "mixinProps" into a specific member, for easy
  // and clean application using #applyTo
  Mixin.extend = function (mixinProps, staticProps) {

    mixinProps || (mixinProps = {});
    staticProps || (staticProps = {});

    var current = _.clone(this.Behavior || {});
    var behavior = _.extend(current, mixinProps);
    var props = _.extend(staticProps, { Behavior: behavior });
    var mixin = WBSingleton.extend.call(this, props);

    mixin.extend = Mixin.extend;

    return mixin;
  };

  return Mixin;
});