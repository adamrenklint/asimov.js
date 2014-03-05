/*

  ▲ asimov.js base class

  empowers the skeleton class with logging,
  filesystem and child process

*/

define([

  './Klass',
  '../logger/Logger',
  './Filesystem',
  './ChildProcess',
  'lodash'

], function (Klass, Logger, Filesystem, ChildProcess, _) {

  var _super = Klass.prototype;
  var logger = new Logger();
  var filesystem = new Filesystem();
  var child = new ChildProcess();
  var mediator = new Klass();

  return Klass.extend({

    'initialize': function () {

      var self = this;
      _super.initialize.apply(self, arguments);
      self.options = self.options || {};

      self.logger = logger;
      self.filesystem = filesystem;
      self.child = child;
      self.mediator = mediator;

      self._originalTriggerEvent = self.triggerEvent;
      self.triggerEvent = self._triggerEvent;
    },

    '_triggerEvent': function (name, params) {

      var self = this;
      self._originalTriggerEvent.apply(self, arguments);

      if (name !== 'all') {
        params.unshift(name);
        params.unshift('all');
        self.trigger.apply(self, params);
      }

      return self;
    },

    'assert': function (type, o, message) {

      var self = this;
      message = message || 'Invalid type: expected ' + type + ', got ' + o.toString();

      var chars = _.toArray(type);
      chars[0] = chars[0].toUpperCase();
      var methodName = 'is' + chars.join('');
      var method = _[methodName];

      if (type == 'defined' && !!!o || typeof method === 'function' && !method(o)) {
        throw new Error(message);
      }
    },

    // 'assert': function (type, o, message) {

    //   var self = this;

    //   if (type.indexOf(' ') > 0) {
    //     type = type.split(' ');
    //   }
    //   else if (typeof type === 'string') {
    //     type = [type];
    //   }

    //   _.each(type, function (assertion) {

    //     console.log('assrt', assertion);

    //     var chars = _.toArray(assertion);
    //     chars[0] = chars[0].toUpperCase();
    //     var methodName = 'is' + chars.join('');
    //     var method = _[methodName];

    //     console.log('bef', assertion, !!o, o, typeof o, o && o.length)

    //     if (typeof method === 'function' && !method(o) || assertion === 'defined' && !!!o) {

    //       console.log('aft', assertion === 'defined', !!!o)

    //       throw new Error(message || 'Invalid type: expected ' + assertion + ', got ' + o.toString());
    //     }
    //   });
    // },

    'isHiddenPath': function (path) {

      return path[0] === '_' || path.indexOf('/_') >= 0;
    }
  });
});