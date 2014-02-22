define([

  '../lib/dependencies'

], function (dependencies, undefined) {

  'use strict';

  var Backbone = dependencies.Backbone;
  var _ = dependencies._;
  var _events = Backbone.Events;
  var _eventSplitter = /\s+/;

  return {

    '_eventArgsMap': {},

    'on': function (events, callback, context) {

      var self = this;

      if (!events || !_.isString(events)) {
        throw new Error('Cannot bind callback without event name(s)');
      }

      if (!callback || !_.isFunction(callback)) {
        throw new Error('Cannot bind callback to event without valid callback');
      }

      self.iterateOverEvents(events, function (event) {

        var args = self._eventArgsMap[event];
        args && _.isFunction(callback) && callback.apply(context || self, args);
      });

      _events.on.apply(this, arguments);

      return self;
    },

    'trigger': function (events) {

      var self = this;
      var params = _.toArray(arguments);

      if (!events || !_.isString(events)) {
        throw new Error('Cannot trigger event(s) without event name(s)');
      }

      self.iterateOverEvents(events, function (eventName) {

        var channelName = '';
        var queue = [];
        var storedFragments;
        var message, part, fragments;

        // Iterate the parts of the eventName to create
        // a queue of all channels to trigger event on
        var channelFragments = eventName.split(':');
        for (var i2 = 0, len2 = channelFragments.length; i2 < len2; i2++ ) {

          part = channelFragments[i2];
          message = {};
          if (channelName) {
            channelName += ':';
          }
          channelName += part;

          storedFragments = _.rest(storedFragments || channelFragments);
          message.fragments = storedFragments;
          message.channel = channelName;

          queue.push(message);
        }

        // Reverse the queue, to make sure "bubbling"
        // occurs from inside out, up to the parent channel
        queue.reverse();
        while (queue.length) {

          message = queue.shift();
          // Always send the current channel name as the first argument, to be triggered
          fragments = [message.channel];

          // Put the arguments back together with the fragment as the second argument
          // This will work recursively, pushing the fragments onto the arguments
          if (message.fragments.length) {
            fragments.push(message.fragments);
          }
          fragments.push.apply(fragments, params.slice(1));

          _events.trigger.apply(self, fragments);
        }

        self.triggered && self.triggered.apply(self, [eventName].concat(_.rest(params)));
      });

      return self;
    },

    'off': function (events) {

      var self = this;

      if (events !== undefined && !_.isString(events)) {
        throw new Error('Cannot unsubscribe event(s) with invalid event name(s)');
      }

      // backbone has a funny way of unbinding events, looping
      // the whole list and then applying #on on the events that
      // shouldn't be unbound - so, we have to temporarily replace
      // self's #on, since the on method will re-trigger any
      // published event...
      var _on = self.on;
      self.on = _events.on;
      _events.off.apply(self, arguments);
      self.on = _on;

      return self;
    },

    'once': function () {

      var self = this;
      var args = _.toArray(arguments);
      var callback = args[1];

      if (_.isFunction(callback)) {
        args[1] = function () {
          _events.off.apply(self, args);
          callback.apply(args[2] || self, arguments);
        };
      }

      self.on.apply(self, args);

      return self;
    },

    'publish': function (events) {

      var self = this;
      var args = Array.prototype.slice.call(arguments, 1);

      if (!events || !_.isString(events)) {
        throw new Error('Cannot publish event(s) without event name(s)');
      }

      self.iterateOverEvents(events, function (event) {

        if (!self._eventArgsMap[event]) {
          self._eventArgsMap[event] = args;
          var payload = [event].concat(args);
          _events.trigger.apply(self, payload);
        }
      });

      return self;
    },

    'unpublish': function (events) {

      var self = this;

      if (!events || !_.isString(events)) {
        throw new Error('Cannot unpublish event(s) without event name(s)');
      }

      self.iterateOverEvents(events, function (event) {
        delete self._eventArgsMap[event];
      });

      return self;
    },

    'unpublishAll': function () {

      var self = this;
      self._eventArgsMap = {};

      return self;
    },

    'iterateOverEvents': function (events, callback) {

      var eventsArray = events.split(_eventSplitter);
      var event;
      while (eventsArray.length) {
        event = eventsArray.shift();
        callback(event);
      }
    }
  };
});