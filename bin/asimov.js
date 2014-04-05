#!/usr/bin/env node

var npath = require('path');
var fs = require('fs');
var Base = require('../lib/core/Base');
var Config = require('../lib/core/Config');
var _super = Base.prototype;
var pkg = require('../package.json');
var loadPathPkgPath = npath.join(process.cwd(), 'package.json');
var pkgExists = fs.existsSync(loadPathPkgPath);
var meta = pkgExists ? require(loadPathPkgPath) : {};
var _ = require('lodash');
var commandsPath = '../lib/commands/';

var path = __dirname;
var isModule = path.indexOf('node_modules/asimov.js/bin') >= 0;
var frameworkDir = path.replace('/bin', '');

var CLI = Base.extend({

  'namespace': 'cli',

  'initialize': function () {

    var self = this;
    _super.initialize.apply(self, arguments);

    var config = new Config(_.merge({}, self.options, {
      'muteLog': true
    }));

    var command = self.getCommand(self.options.args);
    var loadPath = self.filesystem.findFirstMatch('/' + command + '.js', config.json.paths.commands);
    var Command;

    try {
      Command = require(loadPath);
    }
    catch (e) {}

    self.assert('function', Command, function () {
      self.error([
        'Invalid command: ' + command,
        'To get usage instructions, type ' + 'asimov.js help'.bold
      ]);
    });

    config.json.command = command;

    new Command(config.json);
  },

  'getCommand': function (args) {

    var self = this;
    var pathIndex;

    _.find(args, function (arg, index) {
      if (arg.indexOf('asimov.js/bin') > 0 || arg.indexOf('bin/asimov.js') > 0 || arg.indexOf('bin/ajs') > 0) {
        pathIndex = index;
      }
    });

    self.assert('number', pathIndex, 'Failed to start CLI, invalid load path');
    var command = args[pathIndex + 1] || 'help';
    self.options.command = command[0].toUpperCase() + command.substr(1);
    return self.options.command;
  }
});

module.exports = new CLI({
  'pkg': pkg,
  'args': process.argv,
  'meta': meta,
  'frameworkDir': frameworkDir
});