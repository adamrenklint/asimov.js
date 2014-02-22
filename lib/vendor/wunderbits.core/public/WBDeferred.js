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

    'constructor': function (context) {
      var self = this;
      self._context = context;
      self._state = states.pending;
      self._args = [];
      self.handlers = [];
    },

    'state': function () {
      var self = this;
      return stateNames[self._state][0];
    },

    'trigger': function (withContext) {

      var self = this;
      if (self._state === states.pending) {
        return;
      }

      var handlers = self.handlers, handle;
      while (handlers.length) {
        handle = handlers.shift();
        self.invoke(handle, withContext || self._context);
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

      var type = deferredResponse.type;
      var isCompleted = (type === 'then') ||
        (type === 'done' && state === states.resolved) ||
        (type === 'fail' && state === states.rejected);

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
      self.trigger();

      return self;
    };
  });

  // Alias `always` to `then` on Deferred's prototype
  proto.always = proto.then;

  function resolver (state, isWith, fnName) {
    return function complete () {

      var self = this;

      if (!(self instanceof WBDeferred)) {
        throw new Error(fnName + ' invoked with wrong context');
      }

      // can't change state once resolved or rejected
      if (self._state !== states.pending) {
        return self;
      }

      self._args = arrayRef.slice.call(arguments);
      var context = isWith ? self._args.shift() : undefined;

      self._state = state;
      self.trigger(context);

      return self;
    };
  }

  [states.resolved, states.rejected].forEach(function (state) {
    var fnName = stateNames[state][1];
    proto[fnName] = resolver(state, false, fnName);
    proto[fnName + 'With'] = resolver(state, true, fnName);
  });

  var WBDeferred = WBClass.extend(proto);
  return WBDeferred;
});