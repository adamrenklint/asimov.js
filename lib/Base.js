var Klass = require('asimov-core').Klass;
var Filesystem = require('asimov-core').Filesystem;
var ChildProcess = require('asimov-core').ChildProcess;

var _super = Klass.prototype;
var _ = require('lodash');
var npath = require('path');

var frameworkDir = __dirname.replace(/\/lib$/, '');

var filesystem = new Filesystem();
var mediator = new Klass();
var child = new ChildProcess();

var colors = require('colors');

module.exports = Klass.extend({

  'namespace': 'asimov',

  'lineDelimiter': '\n\n',
  'lines': [],
  'padding': '       ',

  'signature': [
    'asimov.js'.bold,
    'a better way to build awesome websites',
    'and apps, with javascript and textfiles'
  ],

  'initialize': function () {

    var self = this;
    _super.initialize.apply(self, arguments);
    self.options = self.options || {};

    self.options.frameworkDir = frameworkDir;

    self.filesystem = self.options.filesystem || self.filesystem || filesystem;
    self.child = self.options.child || self.child || child;
    self.mediator = self.options.mediator || self.mediator || mediator;
  },

  'logLines': function (lines) {

    var self = this;
    (lines || self.lines).forEach(function (line) {
      console.log(self.padding + line);
    });
  },

  // prohibit use of this method, everyone should use asimov.error
  'error': null,

  'isHiddenPath': function (path) {

    return path[0] === '_' || path.indexOf('/_') >= 0;
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
