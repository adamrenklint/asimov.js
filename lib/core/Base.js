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

    'namespace': 'asimov',

    'initialize': function () {

      var self = this;
      _super.initialize.apply(self, arguments);
      self.options = self.options || {};

      self.logger = logger;
      self.logger.logVerbose = self.options.logVerbose;

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

      if (type.indexOf(' ') > 0) {
        var types = type.split(' ');
        return _.each(types, function (_type) {
          self.assert(_type, o, message);
        });
      }

      var chars = _.toArray(type);
      chars[0] = chars[0].toUpperCase();
      var methodName = 'is' + chars.join('');
      var method = _[methodName];

      if (type == 'defined' && !!!o || typeof method === 'function' && !method(o)) {
        throw new Error(message);
      }
    },

    'isHiddenPath': function (path) {

      return path[0] === '_' || path.indexOf('/_') >= 0;
    }
  });
});