
define('wunderbits/core/lib/assert',[],function () {

  

  function assert (condition, message) {
    if (!condition) {
      throw new Error(message || '');
    }
  }

  var nativeIsArray = Array.isArray;
  assert.empty = function (object, message) {
    var keys = nativeIsArray(object) ? object : Object.keys(object);
    assert(keys.length === 0, message);
  };

  assert.array = function (array, message) {
    assert(nativeIsArray(array), message);
  };

  var types = [
    'undefined',
    'boolean',
    'number',
    'string',
    'function',
    'object'
  ];

  function typecheck (type) {
    assert[type] = function (o, message) {
      assert(typeof o === type, message);
    };
  }

  while (types.length) {
    typecheck(types.shift());
  }

  return assert;
});
define('wunderbits/core/lib/merge',[],function () {

  

  return function merge (object, source) {

    for (var key in source) {
      if (source.hasOwnProperty(key)) {
        object[key] = source[key];
      }
    }

    return object;
  };
});
define('wunderbits/core/lib/extend',[
  './assert',
  './merge'
], function (assert, merge) {

  

  return function extend () {

    // convert the argument list into an array
    var args = [].slice.call(arguments);

    // validate input
    assert(args.length > 0, 'extend expect one or more objects');

    // loop through the arguments
    // & merging them recursively
    var object = args.shift();
    while (args.length) {
      merge(object, args.shift());
    }

    return object;
  };
});
define('wunderbits/core/lib/createUID',[],function () {

  

  function replacer (match) {
    var r = Math.random() * 16 | 0;
    var v = (match === 'x') ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  }

  return function createUID () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, replacer);
  };
});
// Based on https://github.com/jimmydo/js-toolbox
define('wunderbits/core/WBClass',[

  './lib/extend',
  './lib/createUID'

], function (extend, createUID, undefined) {

  

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

      var initializers = self.initializers || [];

      var initializer;
      while (initializers.length) {
        initializer = initializers.shift();
        (typeof initializer === 'function') &&
          initializer.apply(self, arguments);
      }
    }
  });

  WBClass.extend = extendSelf;

  return WBClass;
});
define('wunderbits/core/WBSingleton',[

  './lib/extend',
  './lib/createUID'

], function (extend, createUID, undefined) {

  

  function applyMixins (mixins, instance) {
    var mixin;
    while (mixins.length) {
      mixin = mixins.shift();
      (typeof mixin.applyTo === 'function') &&
        mixin.applyTo(instance);
    }
  }

  function extendSelf (staticProps) {
    /* jshint validthis:true */

    staticProps = staticProps || {};

    // extend from the base singleton
    var BaseSingleton = this || WBSingleton;

    // create a new instance
    Ctor.prototype = BaseSingleton;
    var singleton = new Ctor();

    // extract mixins
    var mixins = staticProps.mixins || [];
    staticProps.mixins = undefined;

    // apply mixins to the instance
    applyMixins(mixins, singleton);

    // append the static properties to the singleton
    extend(singleton, staticProps);

    // make the singleton extendable
    // Do this after applying mixins,
    // to ensure that no mixin can override `extend` method
    singleton.extend = extendSelf;

    // every signleton gets a UID
    singleton.uid = createUID();

    return singleton;
  }

  var Ctor = function () {};
  Ctor.prototype = {
    'extend': extendSelf
  };

  var WBSingleton = new Ctor();
  return WBSingleton;
});
define('wunderbits/core/lib/clone',[],function () {

  

  var nativeIsArray = Array.isArray;

  function cloneArray (arr) {
    return arr.slice();
  }

  function cloneDate (date) {
    return new Date(date);
  }

  function cloneObject (source) {
    var object = {};
    for (var key in source) {
      if (source.hasOwnProperty(key)) {
        var value = source[key];
        if (value instanceof Date) {
          object[key] = cloneDate(value);
        } else if (typeof value === 'object' && value !== null) {
          object[key] = clone(value);
        } else {
          object[key] = value;
        }
      }
    }
    return object;
  }

  function clone (obj) {

    if (nativeIsArray(obj)) {
      return cloneArray(obj);
    }

    return cloneObject(obj);
  }

  return clone;

});
define('wunderbits/core/WBMixin',[

  './lib/extend',
  './lib/clone',
  './WBSingleton'

], function (extend, clone, WBSingleton, undefined) {

  

  var WBMixin = WBSingleton.extend({

    // Apply the mixin to an instance of a class
    'applyTo': function (instance) {

      var behavior = clone(this.Behavior);

      // apply mixin's initialize & remove it from the instance
      var initializer;
      if (typeof behavior.initialize === 'function') {
        initializer = behavior.initialize;
        delete behavior.initialize;
      }

      // mixin the behavior
      extend(instance, behavior);

      // apply the initializer, if any
      initializer && initializer.apply(instance);

      return instance;
    },

    // Apply the mixin to the class directly
    'applyToClass': function (klass) {

      var proto = klass.prototype;
      if (!proto || proto.constructor !== klass) {
        throw new Error('applyToClass expects a class');
      }

      var behavior = clone(this.Behavior);

      // cache the mixin's initializer, to be applied later
      var initialize = behavior.initialize;
      if (typeof initialize === 'function') {
        var initializers = proto.initializers = proto.initializers || [];
        initializers.push(initialize);
        delete behavior.initialize;
      }

      // extend the prototype
      extend(proto, behavior);

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

    var current = clone(this.Behavior);
    staticProps.Behavior = extend(current, mixinProps);
    var mixin = WBSingleton.extend.call(this, staticProps);

    mixin.extend = WBMixin.extend;

    return mixin;
  };

  return WBMixin;
});
define('wunderbits/core/WBPromise',[
  './WBClass'
], function (WBClass) {

  

  function proxy (name) {
    return function () {
      var deferred = this.deferred;
      return deferred[name].apply(deferred, arguments);
    };
  }

  var proto = {
    'constructor': function (deferred) {
      this.deferred = deferred;
    }
  };

  [
    'state',
    'done',
    'fail',
    'then',
    'promise'
  ].forEach(function (name) {
    proto[name] = proxy(name);
  });

  proto.always = proto.then;

  return WBClass.extend(proto);

});
define('wunderbits/core/WBDeferred',[
  './WBClass',
  './WBPromise'
], function (WBClass, WBPromise) {

  

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

    'trigger': function (withContext) {

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
define('wunderbits/core/When',[
  './WBSingleton',
  './WBDeferred'
], function (WBSingleton, WBDeferred) {

  

  var arrayRef = [];

  var self = WBSingleton.extend({

    'when': function () {

      var context = this;
      var main = new WBDeferred(context);
      var deferreds = arrayRef.slice.call(arguments);

      var count = deferreds.length;
      var args = new Array(count);

      function Fail () {
        main.rejectWith(this);
      }

      function Done () {

        if (main.state() === 'rejected') {
          return;
        }

        var index = count - deferreds.length - 1;
        args[index] = arrayRef.slice.call(arguments);

        if (deferreds.length) {
          var next = deferreds.shift();
          next.done(Done);
        } else {
          args.unshift(this);
          main.resolveWith.apply(main, args);
        }
      }

      if (deferreds.length) {

        deferreds.forEach(function (deferred) {
          deferred.fail(Fail);
        });

        var current = deferreds.shift();
        current.done(Done);
      } else {
        main.resolve();
      }

      return main.promise();
    }
  });

  return self;
});
define('wunderbits/core/lib/toArray',[],function () {

  

  return function (obj, skip) {
    return [].slice.call(obj, skip || 0);
  };
});
define('wunderbits/core/lib/events',[
  './assert',
  './toArray',
  './clone'
], function (assert, toArray, clone) {

  

  var eventSplitter = /\s+/;

  var validationErrors = {
    'trigger': 'Cannot trigger event(s) without event name(s)',
    'events': 'Cannot bind/unbind without valid event name(s)',
    'callback': 'Cannot bind/unbind to an event without valid callback function'
  };

  var events = {

    'initialize': function () {
      var self = this;
      self._events = {};
      self._cache = {};
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
      var events = self._events;

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
      var events = self._events;
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
      var events = self._events;
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

define('wunderbits/core/mixins/WBEventsMixin',[

  '../WBMixin',
  '../lib/events'

], function (WBMixin, events, undefined) {

  

  return WBMixin.extend(events);
});