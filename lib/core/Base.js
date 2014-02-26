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

  return Klass.extend({

    'initialize': function () {

      var self = this;
      _super.initialize.apply(self, arguments);

      self.logger = logger;
      self.filesystem = filesystem;
      self.child = child;

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
      var chars = _.toArray(type);
      chars[0] = chars[0].toUpperCase();
      var methodName = 'is' + chars.join('');
      var method = _[methodName];

      if (typeof method === 'function' && !method(o)) {
        throw new Error(message || 'Invalid type: expected ' + type + ', got ' + o.toString());
      }
    },

    'isHiddenPath': function (path) {

      return path[0] === '_' || path.indexOf('/_') >= 0;
    }
  });
});