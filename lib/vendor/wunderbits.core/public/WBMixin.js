define([

  './lib/extend',
  './lib/clone',
  './lib/assert',

  './WBSingleton'

], function (
  extend, clone, assert,
  WBSingleton,
  undefined
) {

  'use strict';

  var WBMixin = WBSingleton.extend({

    // Apply the mixin to an instance of a class
    'applyTo': function (instance) {

      var behavior = clone(this.Behavior, true);

      // apply mixin's initialize & remove it from the instance
      var initializer;
      if (typeof behavior.initialize === 'function') {
        initializer = behavior.initialize;
        delete behavior.initialize;
      }

      // augment mixin's properties object into the instance
      var properties = behavior.properties;
      delete behavior.properties;

      // mixin the behavior
      extend(instance, behavior);

      // apply the initializer, if any
      initializer && initializer.apply(instance);

      // augment proerties to the instance
      properties && extend(instance, properties);

      return instance;
    },

    // Apply the mixin to the class directly
    'applyToClass': function (klass) {

      // validate class
      assert.class(klass, 'applyToClass expects a class');

      var proto = klass.prototype;
      var behavior = clone(this.Behavior, true);

      // cache the mixin's initializer, to be applied later
      var initialize = behavior.initialize;
      if (typeof initialize === 'function') {
        var initializers = proto.initializers = proto.initializers || [];
        initializers.push(initialize);
        delete behavior.initialize;
      }

      var properties = behavior.properties;
      delete behavior.properties;

      // extend the prototype
      extend(proto, behavior);

      // cache the properties, to be applied later
      var props = proto.properties = proto.properties || {};
      properties && extend(props, properties);

      return klass;
    }
  });

  // The only real change from a simple singleton is
  // the altered extend class method, which will save
  // "mixinProps" into a specific member, for easy
  // and clean application using #applyTo
  WBMixin.extend = function (mixinProps, staticProps) {

    mixinProps || (mixinProps = {});
    staticProps || (staticProps = {});

    var current = clone(this.Behavior, true);
    staticProps.Behavior = extend(current, mixinProps);
    var mixin = WBSingleton.extend.call(this, staticProps);

    mixin.extend = WBMixin.extend;

    return mixin;
  };

  return WBMixin;
});