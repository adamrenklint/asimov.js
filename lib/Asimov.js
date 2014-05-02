var Base = require('./Base');
var _super = Base.prototype;
var npath = require('path');
var _ = require('lodash');

var Config = require('./Config');

module.exports = Base.extend({

  'namespace': 'start',

  'initialize': function () {

    var self = this;
    _super.initialize.apply(self, arguments);

    self.logAsimovHeader();

    self.initializers = [];
  },

  'getConfig': function () {

    var self = this;

    var config = self.config = new Config(self.options);
    config.json.outputPath = config.json.paths.outputDir;
    _.merge(self.options, config.json);
    return self.options;
  },

  'logAsimovHeader': function () {

    var self = this;

    if (self.options.muteLog) return;

    console.log(self.lineDelimiter);
    self.logLines(self.signature);
    console.log(self.lineDelimiter);
  },

  'use': function (plugin) {

    var self = this;
    self.assert('function', plugin, 'Invalid plugin constructor function');

    plugin(self);
  },

  'start': function (next) {

    var self = this;
    self.started = new Date();

    self.logger.pending(self.namespace, 'Loading asimov.js @ ' + self.options.pkg.version);
    self.logger.log(self.namespace, 'The time is ' + self.started);

    var config = self.getConfig();

    if (typeof next === 'function') next();
  }
});
