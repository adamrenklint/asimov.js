var Base = require('./Base');
var _super = Base.prototype;
var _ = require('lodash');

module.exports = Base.extend({

  'defaultCommand': 'start',

  'initialize': function () {

    var self = this;
    _super.initialize.apply(self, arguments);

    var command = self.getCommand();
    self.launchCommand(command);
  },

  'getCommand': function () {

    var self = this;
    var args = process.argv;
    var pathIndex;

    _.find(args, function (arg, index) {
      if (arg.indexOf('asimov/bin') > 0 || arg.indexOf('bin/asimov/') > 0 || arg.indexOf('bin/asimov') > 0) {
        pathIndex = index;
      }
    });

    self.assert('number', pathIndex, 'Failed to start CLI, invalid load path');
    return args[pathIndex + 1] || self.defaultCommand;
  },

  'launchCommand': function (command) {

    var self = this;
    var paths = [
      process.cwd() + '/lib',
      self.options.frameworkDir + '/lib',
      process.cwd() + '/modules',
      process.cwd() + '/node_modules',
    ];

    var loadPath = self.filesystem.findFirstMatch('/commands/' + command + '.js', paths);

    var fn, err;

    try {
      fn = require(loadPath);
    }
    catch (e) {
      err = e;
    }

    self.assert('function', fn, function () {
      self.error([
        'Invalid command: ' + command.toLowerCase(),
        'To get usage instructions, type ' + 'ajs help'.bold,
        err || 'Error: Module did not return a function!'
      ]);
    });

    // Pass an empty function to make it compatible with functions
    // that expects a "next" or "done" callback
    fn(function () {});
  }
});