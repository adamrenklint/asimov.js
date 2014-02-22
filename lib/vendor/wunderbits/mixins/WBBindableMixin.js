// Based on Marionette's EventBinder
// https://raw.github.com/derickbailey/backbone.marionette/master/lib/backbone.marionette.js

define([

  '../lib/dependencies',
  '../WBMixin',
  '../lib/createUID'

], function (dependencies, WBMixin, createUID) {

  'use strict';

  var _ = dependencies._;
  var Backbone = dependencies.Backbone;

  function _initBindings (self) {

    if (!self._bindings) {
      self._bindings = {};
      self._namedEvents = {};
    }
  }

  // keeps callback closure in own execution context with
  // only callback and context
  function _callbackFactory (callback, context) {

    var bindCallback;

    var forString = function stringCallback () {
      context[callback].apply(context, arguments);
    };

    var forFunction = function functionCallback () {
      callback.apply(context, arguments);
    };

    if (typeof callback === 'string') {
      bindCallback = forString;
      // cancel alternate closure immediately
      forFunction = null;
    }
    else {
      bindCallback = forFunction;
      forString = null;
    }

    return bindCallback;
  }

  return WBMixin.extend({

    'bindTo': function (target, event, callback, context) {

      var self = this;
      _initBindings(self);
      self.checkBindingArgs.apply(self, arguments);

      // if this binding already made, return it
      var bound = self.isAlreadyBound(target, event, callback);
      if (bound) {
        return bound;
      }

      // default to self if context not provided
      context = context || self;

      var callbackFunc, args;

      if (self.instanceOfBackbone(target)) {
        // Backbone accepts context when binding, simply pass it on
        callbackFunc = _.isString(callback) ? context[callback] : callback;
        args = [event, callbackFunc, context];
      }
      else {
        // jquery does not take context in .on()
        // cannot assume on takes context as a param for bindable object
        // create a callback which will apply the original callback in the correct context
        callbackFunc = _callbackFactory(callback, context);
        args = [event, callbackFunc];
      }

      // create binding on target
      target.on.apply(target, args);

      var binding = {
        'uid': createUID(),
        'target': target,
        'event': event,
        'originalCallback': callback,
        'callback': callbackFunc,
        'context': context
      };

      self._bindings[binding.uid] = binding;
      self.addToNamedBindings(event, binding);

      return binding;
    },

    'bindOnceTo': function (target, event, callback, context) {

      var self = this;
      _initBindings(self);
      self.checkBindingArgs.apply(self, arguments);

      // if this binding already made, return it
      var bound = self.isAlreadyBound(target, event, callback);
      if (bound) {
        return bound;
      }

      context = context || self;

      // this is a wrapper
      var onceBinding = function () {

        (_.isString(callback) ? context[callback] : callback).apply(context, arguments);
        self.unbindFrom.call(self, binding);
      };

      var binding = {

        'uid': createUID(),
        'target': target,
        'event': event,
        'originalCallback': callback,
        'callback': onceBinding,
        'context': context
      };

      target.on(event, onceBinding);

      self._bindings[binding.uid] = binding;
      self.addToNamedBindings(event, binding);

      return binding;
    },

    'unbindFrom': function (binding) {

      var self = this;
      _initBindings(self);

      if (!binding || !_.isString(binding.uid)) {
        throw new Error('Cannot unbind from undefined or invalid binding');
      }

      // a binding object with only uid, i.e. a destroyed/unbound
      // binding object has been passed - just do nothing
      if (!binding.event || !binding.callback || !binding.target) {
        return;
      }

      var event = binding.event;
      binding.target.off(event, binding.callback);

      // clean up binding object, but keep uid to
      // make sure old bindings, that have already been
      // cleaned, are still recognized as bindings
      for (var key in binding) {
        if (key !== 'uid') {
          delete binding[key];
        }
      }

      delete self._bindings[binding.uid];

      self._namedEvents[event] = _.filter(self._namedEvents[event], function (_binding) {
        if (_binding.cid === binding.cid) {
          return false;
        }
      });

      return undefined;
    },

    'unbindFromTarget': function (target) {

      var self = this;
      _initBindings(self);

      if (!target || !_.isFunction(target.on)) {
        throw new Error('Cannot unbind from undefined or invalid binding target');
      }

      var binding;
      for (var key in self._bindings) {
        binding = self._bindings[key];
        if (binding.target === target) {
          self.unbindFrom(binding);
        }
      }
    },

    'unbindAll': function () {

      var self = this;
      _initBindings(self);

      var binding;
      for (var key in self._bindings) {
        binding = self._bindings[key];
        self.unbindFrom(binding);
      }
    },

    'checkBindingArgs': function (target, event, callback, context) {

      context = context || this;

      // do not change these messages without updating the specs
      if (!target || !_.isFunction(target.on)) {
        throw new Error('Cannot bind to undefined target or target without #on method');
      }

      if (!event || !_.isString(event)) {
        throw new Error('Cannot bind to target event without event name');
      }

      if (!callback || (!_.isFunction(callback) && !_.isString(callback))) {
        throw new Error('Cannot bind to target event without a function or method name as callback');
      }

      if (_.isString(callback) && !context[callback]) {
        throw new Error('Cannot bind to target using a method name that does not exist for the context');
      }
    },

    'isAlreadyBound': function (target, event, callback) {

      var self = this;
      // check for same callback on the same target instance
      // return early withthe event binding
      var events = self._namedEvents[event];
      if (events) {
        for (var i = 0, max = events.length; i < max; i++) {
          
          // TODO all of our classes should have a cid or uid
          // and we need to pick one and mixin to all base classes
          // for now let targets without uid/cid rebind
          var boundTarget = events[i].target;
          if (!boundTarget) {
            return false;
          }
          var targetBound = target.cid ? target.cid === boundTarget.cid : target.uid ? target.uid === boundTarget.uid : false;
          if (events[i].originalCallback === callback && targetBound) {
            return events[i];
          }
        }
      }

      return false;
    },

    'instanceOfBackbone': function (target) {

      var B = Backbone;
      var t = target;

      return t instanceof B.Model || t instanceof B.View || t instanceof B.Collection || t instanceof B.Router;
    },

    'addToNamedBindings': function (event, binding) {

      var self = this;
      if (!self._namedEvents[event]) {
        self._namedEvents[event] = [];
      }
      self._namedEvents[event].push(binding);
    }
  });
});