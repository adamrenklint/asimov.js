define([
  './assert',
  './toArray',
  './clone'
], function (assert, toArray, clone) {

  'use strict';

  var eventSplitter = /\s+/;

  var validationErrors = {
    'trigger': 'Cannot trigger event(s) without event name(s)',
    'events': 'Cannot bind/unbind without valid event name(s)',
    'callback': 'Cannot bind/unbind to an event without valid callback function'
  };

  var events = {

    'properties': {
      '_events': {},
      '_cache': {}
    },

    'on': function (events, callback, context) {

      var self = this;

      // validate arguments
      assert.string(events, validationErrors.events);
      assert.function(callback, validationErrors.callback);

      // loop through the events & bind them
      self.iterate(events, function (name) {
        // keep the binding
        self.bind(name, callback, context);

        // if this was a published event, do an immediate trigger
        var cache = self._cache;
        if (cache[name]) {
          callback.apply(context || self, cache[name]);
        }
      });

      return self;
    },

    'off': function (events, callback, context) {

      var self = this;

      // validate events only if a truthy value is passed
      events && assert.string(events, validationErrors.events);

      // if no arguments were passed, unbind everything
      if (!events && !callback && !context) {
        self._events = {};
        return self;
      }

      // if no events are passed, unbind all events with this callback
      events = events || Object.keys(self._events);

      // loop through the events & bind them
      self.iterate(events, function (name) {
        self.unbind(name, callback, context);
      });

      return self;
    },

    'once': function (events, callback, context) {

      var self = this;
      var args = toArray(arguments);

      // create a one time binding
      args[1] = function () {
        self.off.apply(self, args);
        callback.apply(context || self, arguments);
      };

      self.on.apply(self, args);

      return self;
    },

    'publish': function (events) {

      var self = this;
      var args = toArray(arguments);

      // validate events
      assert.string(events, validationErrors.events);

      self.iterate(events, function (name) {
        var cache = self._cache;
        if (!cache[name]) {
          cache[name] = args.slice(1);
          args[0] = name;
          self.trigger.apply(self, args);
        }
      });

      return self;
    },

    'unpublish': function (events) {

      var self = this;

      // validate events
      assert.string(events, validationErrors.events);

      // remove the cache for the events
      self.iterate(events, function (name) {
        self._cache[name] = undefined;
      });

      return self;
    },

    'unpublishAll': function () {
      var self = this;
      self._cache = {};
      return self;
    },

    'trigger': function (events) {

      var self = this;

      // validate arguments
      assert.string(events, validationErrors.trigger);

      // loop through the events & trigger them
      var params = toArray(arguments, 1);
      self.iterate(events, function (name) {
        self.triggerEvent(name, params);
      });

      return self;
    },

    'triggerEvent': function (name, params) {

      var self = this;
      var events = self._events || {};

      // call sub-event handlers
      var current = [];
      var fragments = name.split(':');
      while (fragments.length) {
        current.push(fragments.shift());
        name = current.join(':');
        if (name in events) {
          self.triggerSection(name, fragments, params);
        }
      }
    },

    'triggerSection': function (name, fragments, params) {

      var self = this;
      var events = self._events || {};
      var bucket = events[name] || [];

      bucket.forEach(function (item) {
        var args;
        if (fragments.length) {
          args = clone(params);
          args.unshift(fragments);
        }
        item.callback.apply(item.context || self, args || params);
      });
    },

    'iterate': function (events, iterator) {

      var self = this;

      if (typeof events === 'string') {
        events = events.split(eventSplitter);
      } else {
        assert.array(events);
      }

      while (events.length) {
        iterator.call(self, events.shift());
      }
    },

    'bind': function (name, callback, context) {

      var self = this;

      // store the reference to the callback + context
      var events = self._events || {};
      var bucket = events[name] || (events[name] = []);
      bucket.push({
        'callback': callback,
        'context': context
      });

      return self;
    },

    'unbind': function (name, callback, context) {

      var self = this;

      // lookup the reference to handler & remove it
      var events = self._events;
      var bucket = events[name] || [];
      var retain = [];

      // loop through the handlers
      var i = -1, l = bucket.length, item;
      while (++i < l) {
        item = bucket[i];
        if ((callback && callback !== item.callback) ||
            (context && context !== item.context)) {
          retain.push(item);
        }
      }

      // flush out detached handlers
      events[name] = retain;

      return self;
    }
  };

  return events;

});
