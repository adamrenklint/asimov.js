/*

  ▲ asimov.js base class

  empowers the skeleton class with logging,
  filesystem and child process

*/

define([

  './Klass',
  '../logger/Logger',
  './Filesystem',
  './ChildProcess'

], function (Klass, Logger, Filesystem, ChildProcess) {

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

    'isHiddenPath': function (path) {

      return path[0] === '_' || path.indexOf('/_') >= 0;
    }
  });
});