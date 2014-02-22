// Based on https://github.com/jimmydo/js-toolbox
define([

  './lib/extend',
  './lib/clone',
  './lib/createUID'

], function (extend, clone, createUID, undefined) {

  'use strict';

  // Shared empty constructor function to aid in prototype-chain creation.
  var Constructor = function () {};

  // Helper function to correctly set up the prototype chain, for subclasses.
  // Similar to `goog.inherits`, but uses a hash of prototype properties and
  // class properties to be extended.
  var inherits = function (parent, protoProps, staticProps) {

    var child;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call `super()`.
    if (protoProps && protoProps.hasOwnProperty('constructor')) {
      child = protoProps.constructor;
    }
    else {
      child = function () {
        return parent.apply(this, arguments);
      };
    }

    // Inherit class (static) properties from parent.
    extend(child, parent);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    Constructor.prototype = parent.prototype;
    child.prototype = new Constructor();

    // Add prototype properties (instance properties) to the subclass,
    // if supplied.
    extend(child.prototype, protoProps);

    // Correctly set child's `prototype.constructor`.
    child.prototype.constructor = child;

    // Add static properties to the constructor function, if supplied.
    extend(child, staticProps);

    // Set a convenience property
    // in case the parent's prototype is needed later.
    child.__super__ = parent.prototype;

    return child;
  };

  // Self-propagating extend function.
  // Create a new class,
  // that inherits from the class found in the `this` context object.
  // This function is meant to be called,
  // in the context of a constructor function.
  function extendSelf (protoProps, staticProps) {
    /* jshint validthis:true */

    protoProps = protoProps || {};

    // extract mixins, if any
    var mixins = protoProps.mixins || [];
    delete protoProps.mixins;

    // create the derived class
    var child = inherits(this, protoProps, staticProps);

    // apply mixins to the derived class
    var mixin;
    while (mixins.length) {
      mixin = mixins.shift();
      (typeof mixin.applyToClass === 'function') &&
        mixin.applyToClass(child);
    }

    // make the child class extensible
    child.extend = extendSelf;
    return child;
  }

  function WBClass (options) {

    var self = this;

    // Assign a unique identifier to the instance
    self.uid = createUID();

    // save options, make sure it's at least an empty object
    self.options = options || self.options;

    // augment properties from mixins
    self.augmentProperties();

    // initialize the instance
    self.initialize.apply(self, arguments);

    // initialize all the mixins, if needed
    // don't keep this in the initialize,
    // initialize can be overwritten
    self.initMixins.apply(self, arguments);
  }

  extend(WBClass.prototype, {

    'initialize': function () {

      // Return self to allow for subclass to assign
      // super initializer value to self
      var self = this;
      return self;
    },

    // If any mixins were applied to the prototype, initialize them
    'initMixins': function () {

      var self = this;
      var initializers = (self.initializers || []).slice(0);

      var initializer;
      while (initializers.length) {
        initializer = initializers.shift();
        (typeof initializer === 'function') &&
          initializer.apply(self, arguments);
      }
    },

    // If any proerties were defined in the mixins, augment them to the instance
    'augmentProperties': function () {

      var self = this;
      var properties = (self.properties || {});

      for (var key in properties) {
        self[key] = clone(properties[key], true);
      }
    }
  });

  WBClass.extend = extendSelf;

  return WBClass;
});