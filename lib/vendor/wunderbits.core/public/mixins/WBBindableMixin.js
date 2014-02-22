define([

  '../WBMixin',
  '../lib/assert',
  '../lib/createUID'

], function (WBMixin, assert, createUID) {

  /* jshint maxcomplexity:11, maxstatements:20, maxlen:110 */

  'use strict';

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

    'properties': {
      '_bindings': {},
      '_namedEvents': {}
    },

    'bindTo': function (target, event, callback, context) {

      var self = this;
      self.checkBindingArgs.apply(self, arguments);

      // if this binding already made, return it
      var bound = self.isAlreadyBound(target, event, callback);
      if (bound) {
        return bound;
      }

      // default to self if context not provided
      context = context || self;

      var callbackFunc, args;

      // if a jquery object
      if (target.constructor && target.constructor.fn && target.constructor.fn.on === target.on) {
        // jquery does not take context in .on()
        // cannot assume on takes context as a param for bindable object
        // create a callback which will apply the original callback in the correct context
        callbackFunc = _callbackFactory(callback, context);
        args = [event, callbackFunc];
      } else {
        // Backbone accepts context when binding, simply pass it on
        callbackFunc = (typeof callback === 'string') ? context[callback] : callback;
        args = [event, callbackFunc, context];
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
      self.checkBindingArgs.apply(self, arguments);

      // if this binding already made, return it
      var bound = self.isAlreadyBound(target, event, callback);
      if (bound) {
        return bound;
      }

      context = context || self;

      // this is a wrapper
      var onceBinding = function () {

        ((typeof callback === 'string') ? context[callback] : callback).apply(context, arguments);
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

      if (!binding || (typeof binding.uid !== 'string')) {
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

      var namedEvents = self._namedEvents;
      var events = namedEvents[event];

      if (events) {
        var cloned = events && events.slice(0);
        for (var i = events.length - 1; i >= 0; i--) {
          if (events[i].uid === binding.uid) {
            cloned.splice(i, 1);
          }
        }

        namedEvents[event] = cloned;
      }

      return;
    },

    'unbindFromTarget': function (target) {

      var self = this;

      if (!target || (typeof target.on !== 'function')) {
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

      var binding;
      for (var key in self._bindings) {
        binding = self._bindings[key];
        self.unbindFrom(binding);
      }
    },

    'checkBindingArgs': function (target, event, callback, context) {

      context = context || this;

      // do not change these messages without updating the specs
      if (!target || (typeof target.on !== 'function')) {
        throw new Error('Cannot bind to undefined target or target without #on method');
      }

      if (!event || (typeof event !== 'string')) {
        throw new Error('Cannot bind to target event without event name');
      }

      if (!callback || ((typeof callback !== 'function') && (typeof callback !== 'string'))) {
        throw new Error('Cannot bind to target event without a function or method name as callback');
      }

      if ((typeof callback === 'string') && !context[callback]) {
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

          var current = events[i] || {};
          var boundTarget = current.target;
          if (!boundTarget) {
            return false;
          }

          var targetBound = target.uid ? target.uid === boundTarget.uid : false;
          if (current.originalCallback === callback && targetBound) {
            return current;
          }
        }
      }

      return false;
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