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
      process.cwd() + '/node_modules/asimov',
    ];

    command = command[0].toUpperCase() + command.substr(1);

    var loadPath = self.filesystem.findFirstMatch('/command/' + command + '.js', paths);
    var Command;

    try {
      Command = require(loadPath);
    }
    catch (e) {}

    self.assert('function', Command, function () {
      self.error([
        'Invalid command: ' + command.toLowerCase(),
        'To get usage instructions, type ' + 'ajs help'.bold
      ]);
    });

    config.json.command = command;

    new Command(config.json);
  }
});