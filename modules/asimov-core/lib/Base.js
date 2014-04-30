var Klass = require('./Klass');
var Logger = require('./Logger');
var Filesystem = require('./Filesystem');
var ChildProcess = require('./ChildProcess');
var _super = Klass.prototype;
var _ = require('lodash');

var logger = new Logger();
var filesystem = new Filesystem();
var mediator = new Klass();
var child = new ChildProcess();

module.exports = Klass.extend({

  'namespace': 'asimov',

  'initialize': function () {

    var self = this;
    _super.initialize.apply(self, arguments);
    self.options = self.options || {};

    self.logger = self.options.logger || self.logger || logger;
    self.logger.logVerbose = self.options.logVerbose;

    self.filesystem = self.options.filesystem || self.filesystem || filesystem;
    self.child = self.options.child || self.child || child;
    self.mediator = self.options.mediator || self.mediator || mediator;

    self._originalTriggerEvent = self.triggerEvent;
    self.triggerEvent = self._triggerEvent;
  },

  'isHiddenPath': function (path) {

    return path[0] === '_' || path.indexOf('/_') >= 0;
  },

  'error': function (lines) {

    var self = this;

    lines.forEach(function (line) {
      self.logger.log('error', line);
    });

    process.exit(1);
  },

  'restart': function (path) {

    var self = this;

    if (process.send) {
      process.send({
        'restart': true
      });
    }
    else {
      process.exit(1);
    }
  }
});