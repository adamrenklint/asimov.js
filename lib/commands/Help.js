var Command = require('./Command');
var _super = Command.prototype;
var _ = require('lodash');
var colors = require('colors');

module.exports = Command.extend({

  'prefix': 'ajs ',

  'commands': {

    'help': 'Show usage instructions',
    'create [name]': 'Create new project',
    'extend [parent] [path]': 'Create subclass of [parent] in [path]',
    'start': 'Start project in current directory',
    'debug': 'Start project with verbose logging',
    'test [grep]': 'Run all tests in /tests, or only the ones matching [grep]',
    'coverage': 'Generate a test coverage report using Istanbul',
    'publish': 'Publish project to NPM and push git tag',
    // 'test -w': 'Run all tests and watch for file changes',
  },

  'initialize': function () {

    var self = this;
    _super.initialize.apply(self, arguments);

    self.logAsimovHeader();

    console.log(self.lineDelimiter);
    // console.log(('   asimov.js ' + self.options.pkg.version + ' CLI').bold);
    console.log('   Usage:\n\n');

    _.each(self.commands, function (instruction, command) {
      console.log(self.padding + (self.prefix.replace('$', '$'.grey) + command).inverse);
      console.log(self.padding + instruction + '\n');

    });

    console.log(self.lineDelimiter);
  }
});