var Base = require('./Base');
var _super = Base.prototype;
var npath = require('path');
var _ = require('lodash');

var Config = require('./Config');

module.exports = Base.extend({

  'namespace': 'start',

  'publicMethods': [
    'use',
    'start',
    'sequence',
    'helper'
  ],

  'sequences': {
    'init': 'initializer',
    'processor': 'processor',
    'middleware': 'middleware'
  },

  'initialize': function () {

    var self = this;
    _super.initialize.apply(self, arguments);

    if (self.options.muteLog) {
      process.env.MUTE = true;
    }

    _.each(self.sequences, self.setupSequence);
    self.helpers = {};

    self.logAsimovHeader();
  },

  'setupSequence': function (name, method) {

    var self = this;
    var plural = name + 's';

    self[plural] = [];
    self.publicMethods.push(method);

    self[method] = function (callback) {

      self.assert('function', callback, 'Invalid ' + name + ' function');
      self[plural].push(callback);
      self[plural] = _.unique(self[plural]);

      return self.publicInterface();
    }.bind(self);
  },

  'publicInterface': function () {

    var self = this;

    if (!self._publicInterface) {

      self._publicInterface = {};

      self.publicMethods.forEach(function (methodName) {
        self._publicInterface[methodName] = self[methodName];
      });
    }

    return self._publicInterface;
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

    return self;
  },

  'use': function (plugin) {

    var self = this;
    self.assert('function', plugin, 'Invalid plugin constructor function');

    plugin(self.publicInterface());

    return self.publicInterface();
  },

  'helper': function (name, helper) {

    var self = this;

    self.assert('string', name, 'Invalid helper name');
    self.assert('function', helper, 'Invalid helper callback function');

    self.helpers[name] = helper;

    return self.publicInterface();
  },

  'sequence': function (namespace, done) {

    var self = this;
    var type = namespace + 's';
    var jobs = self[type];

    self.assert('array', jobs, 'Invalid sequence for namespace "' + namespace + '"');

    // make sure we don't modify the original jobs queue
    jobs = jobs.slice();
    var count = jobs.length;

    function next () {

      var job = jobs.shift();

      if (!job) {

        done && done({
          'count': count,
          'namespace': namespace
        });

        return;
      }

      job(next);
    }

    next();

    return self.publicInterface();
  },

  'start': function (next) {

    var self = this;
    self.started = new Date();

    self.logger.pending(self.namespace, 'Loading asimov.js @ ' + self.options.pkg.version);
    self.logger.log(self.namespace, 'The time is ' + self.started);

    var config = self.getConfig();

    self.sequence('initializer', next);

    return self.publicInterface();
  }
});
