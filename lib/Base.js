var Klass = require('../modules/asimov-core').Klass;
var Filesystem = require('../modules/asimov-core').Filesystem;
var ChildProcess = require('../modules/asimov-core').ChildProcess;

var _super = Klass.prototype;
var _ = require('lodash');
var npath = require('path');

var frameworkDir = __dirname.replace('/lib', '');
var pkg = require(npath.join(frameworkDir, 'package.json'));
var meta = require(npath.join(process.cwd(), 'package.json'));

var filesystem = new Filesystem();
var mediator = new Klass();
var child = new ChildProcess();

var colors = require('colors');

module.exports = Klass.extend({

  'namespace': 'asimov',

  'initialize': function () {

    var self = this;
    _super.initialize.apply(self, arguments);
    self.options = self.options || {};

    self.options.frameworkDir = frameworkDir;

    self.filesystem = self.options.filesystem || self.filesystem || filesystem;
    self.child = self.options.child || self.child || child;
    self.mediator = self.options.mediator || self.mediator || mediator;

    self._originalTriggerEvent = self.triggerEvent;
    self.triggerEvent = self._triggerEvent;

    self.options.pkg = pkg;
    self.options.meta = meta;
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