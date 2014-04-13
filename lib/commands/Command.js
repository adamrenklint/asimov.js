var Installer = require('../core/Installer');
var _super = Installer.prototype;
var fs = require('fs');
var child_process = require('child_process');
var npath = require('path');
var _ = require('lodash');
var colors = require('colors');

module.exports = Installer.extend({

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

    console.log(self.lineDelimiter);
    self.logLines(self.signature);
    console.log(self.lineDelimiter);
  },

  'logLines': function (lines) {

    var self = this;
    (lines || self.lines).forEach(function (line) {
      console.log(self.padding + line);
    });
  },

  'logAsimovHeader': function () {

    var self = this;
    self.logger.pending('cli', 'Loading asimov.js @ ' + self.options.pkg.version);
  },

  'openPath': function (path) {

    var self = this;
    if (self.options.args.indexOf('--open') > 0) {
      return self.child.execute('open ' + path);
    }
  }
});