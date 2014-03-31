#!/usr/bin/env node

var Base = require('../lib/core/Base');
var _super = Base.prototype;
var pkg = require('../package.json');
var _ = require('lodash');
// var args = process.argv;
// var pathIndex;

var CLI = Base.extend({

  'namespace': 'asimov',

  'initialize': function () {

    var self = this;
    _super.initialize.apply(self, arguments);

    self.logger.pending('main', 'Loading asimov.js @ ' + self.options.pkg.version);
    self.logger.log('main', 'The time is ' + new Date());
  }
});

module.exports = new CLI({
  'pkg': pkg,
  'args': process.argv
});

// console.log()

// _.find(args, function (arg, index) {
//   if (arg.indexOf('asimov.js/bin') > 0) {
//     pathIndex = index;
//   }
// });

// if (!pathIndex) {
//   throw new Error('CLI started with invalid path');
// }

// var command = args[pathIndex + 1];

// if (!command) {
//   throw new Error('Must specify a command to use');
// }

// command = _.find(x, function (_command, name) {
//   return name === command;
// });

// // var program = require('commander');
// console.log(command);



// // console.log('CLI no implemented yet, fork https://github.com/adamrenklint/asimovjs-template-project.git to get started');

// // var requirejs = require('requirejs');
// //
// // var path = require('path');
// // var baseDir = path.join(__dirname, '..');

// // requirejs.config({
// //   'paths': {
// //     // 'asimov-framework': '../node_modules/asimov-framework',
// //     // 'asimov-framework': '../../asimov-framework',
// //     // 'asimov-core': '../node_modules/asimov-framework/node_modules/asimov-core/lib',
// //     // 'vendor/wunderbits.core': '../node_modules/asimov-framework/node_modules/asimov-core/vendor/wunderbits.core'
// //   }
// // });

// // function wrapAction (path) {
// //   return function () {
// //     var
// //     // return requirejs(['../lib/actions/' + path], function (Action) {

// //     //   return new Action({
// //     //     'baseDir': baseDir,
// //     //     'args': program.args[0]
// //     //   });
// //     // });
// //   };
// // }

// // program
// //   .version(meta.version);

// // program
// //   .command('create')
// //   .option('--name [name]', 'Name of template')
// //   .description('Preview template with [name]')
// //   .action(wrapAction('Create'));

// // program.parse(process.argv);