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

    var started = new Date();

    var loadPath = self.filesystem.findFirstMatch('/commands/' + command + '.js', paths);

    var fn, err;

    try {
      fn = loadPath && require(loadPath);
    }
    catch (e) {
      err = e;
    }

    self.assert('function', fn, function () {

      var message = 'Invalid command "' + command.toLowerCase() + '"';
      var help = 'To get usage instructions, type ' + 'ajs help'.bold;
      var detail = 'Error: No command module was found';

      if (loadPath) {
        message +=  '@ ' + loadPath;
        detail = 'Error: Command module did not return a function';
      }

      [message, help, detail].forEach(function (line) {
        self.logger.log('error', line);
      });

      if (err) {
        throw err;
      }
      else {
        process.exit(1);
      }
    });

    self.logger.since(self.namespace, 'Loaded "' + command + '" command @ ' + loadPath, started);

    // Pass an empty function to make it compatible with functions
    // that expects a "next" or "done" callback
    fn(function () {});
  }
});
