define([
  './WBClass',
  './WBPromise'
], function (WBClass, WBPromise) {

  'use strict';

  var arrayRef = [];

  var states = {
    'pending': 0,
    'resolved': 2,
    'rejected': 4
  };

  var stateNames = {
    0: ['pending'],
    2: ['resolved', 'resolve'],
    4: ['rejected', 'reject']
  };

  var proto = {

    'constructor': function () {

      var self = this;
      self._state = states.pending;
      self._args = [];
      self.handlers = [];
    },

    'state': function () {
      var self = this;
      return stateNames[self._state][0];
    },

    'checkDeferredStatus': function (withContext) {

      var self = this;
      if (self._state === states.pending) {
        return;
      }

      var handlers = self.handlers, handle;
      while (handlers.length) {
        handle = handlers.shift();
        self.invoke(handle, withContext);
      }
    },

    'invoke': function (deferredResponse, withContext) {

      var self = this;
      var state = self._state;
      var context = deferredResponse.context || withContext || self;
      var args = deferredResponse.args;

      self._args.forEach(function (arg) {
        // send single arguments as the item, otherwise send it as an array
        args.push(arg);
      });

      var isCompleted = (deferredResponse.type === 'then') ||
        (deferredResponse.type === 'done' && state === states.resolved) ||
        (deferredResponse.type === 'fail' && state === states.rejected);

      isCompleted && deferredResponse.fn.apply(context, args);
    },

    'promise': function () {

      var self = this;
      self._promise = self._promise || new WBPromise(this);
      return self._promise;
    }
  };

  ['then', 'done', 'fail'].forEach(function (method) {
    proto[method] = function () {

      var self = this;

      // store references to the context, callbacks, and arbitrary arguments
      var args = arrayRef.slice.call(arguments);
      var fn = args.shift();
      var context = args.shift();
      self.handlers.push({
        'type': method,
        'context': context,
        'fn': fn,
        'args': args
      });

      // if the defered is not pending anymore, call the callbacks
      self.checkDeferredStatus();

      return self;
    };
  });

  // Alias `always` to `then` on Deferred's prototype
  proto.always = proto.then;

  [states.resolved, states.rejected].forEach(function (state) {
    var fnName = stateNames[state][1];
    proto[fnName] = function () {
      var self = this;
      if (self._state !== states.pending) {
        return self;
      }

      self._state = state;
      self._args = arrayRef.slice.call(arguments);
      self.checkDeferredStatus();
      return self;
    };

    proto[fnName + 'With'] = function () {
      var self = this;
      if (self._state !== states.pending) {
        return self;
      }

      self._args = arrayRef.slice.call(arguments);
      var context = self._args.shift();
      self._state = state;
      self.checkDeferredStatus(context);
      return self;
    };
  });

  return WBClass.extend(proto);
});