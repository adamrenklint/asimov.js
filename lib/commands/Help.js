var Command = require('./Command');
var _super = Command.prototype;
var _ = require('lodash');
var colors = require('colors');

module.exports = Command.extend({

  'prefix': '$ asimov.js ',

  'commands': {

    'help': 'Show usage instructions',
    'create [name]': 'Create new project',
    'new [parent] [path]': 'Create class in [path], extending [parent]' + '\n\n      Example, extend a default class: asimov.js new Helper helpers/RelatedPosts\n      Available default classes: Base, Middleware, Initializer, Helper and Test\n\n      Example, extend a custom class: asimov.js new helper/RelatedPosts otherFolder/SmarterPosts'.grey,
    'start': 'Start project in current directory',
    'test [grep]': 'Run all tests in /tests, or only the ones matching [grep]'
    // 'test -w': 'Run all tests and watch for file changes',
  },

  'initialize': function () {

    var self = this;
    _super.initialize.apply(self, arguments);

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