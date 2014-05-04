var Base = require('./Base');
var _super = Base.prototype;
var npath = require('path');
var _ = require('lodash');

var Config = require('./Config');

module.exports = Base.extend({

  'publicMethods': [
    'use',
    'start',
    'addSequence',
    'runSequence',
    'helper',
    'register',
    'templates',
    'config',
    'fs',
    'logPending',
    'logSince'
  ],

  // 'sequences':
  //   'init': 'initializer'
  //   // ,
  //   // 'processor': 'processor',
  //   // 'middleware': 'middleware'
  // },
  'config': {},

  'initialize': function () {

    var self = this;
    _super.initialize.apply(self, arguments);

    if (self.options.muteLog) {
      process.env.MUTE = true;
    }

    self._publicInterface = {};

    self.addSequence('initializer', 'init');
    // self.helpers = {};

    self.logAsimovHeader();

    self.fs = self.filesystem;
  },

  'logPending': function (namespace, message) {
    if (!message) {
      message = namespace;
      namespace = 'asimov';
    }
    return this.logger.low(namespace, message);
  },

  'logSince': function (namespace, message, date) {

    if (!date) {
      date = message;
      message = namespace;
      namespace = 'asimov';
    }
    return this.logger.lowSince(namespace, message, date);
  },

  'start': function (next) {

    var self = this;
    self.started = new Date();

    self.logger.pending('start', 'Loading asimov.js @ ' + self.options.pkg.version);
    self.logger.log('start', 'The time is ' + self.started);

    self.config = self.getConfig();

    self.runSequence('initializer', next);

    return self.publicInterface();
  },

  'getConfig': function () {

    var self = this;

    var config = self.config = new Config(self.options);
    config.json.outputPath = config.json.paths.outputDir;
    _.merge(self.options, config.json);
    return self.options;
  },

  'use': function (plugin, options) {

    var self = this;
    self.assert('function', plugin, 'Invalid plugin constructor function');

    plugin(self.publicInterface());

    return self.publicInterface();
  },

  // 'helper': function (name, helper) {
  //
  //   var self = this;
  //
  //   self.assert('string', name, 'Invalid helper name');
  //   self.assert('function', helper, 'Invalid helper callback function');
  //
  //   self.log('Adding template helper "' + name + '"');
  //
  //   self.helpers[name] = helper;
  //
  //   return self.publicInterface();
  // },

  'addSequence': function (namespace, method) {

    var self = this;
    var plural = namespace + 's';

    if (self[plural]) return false;

    self.assert('string', namespace, 'Invalid sequence namespace');
    method = method || namespace;

    self[plural] = [];
    self.publicMethods.push(method);

    self[method] = function (callback) {

      self.assert('function', callback, 'Invalid ' + namespace + ' function');
      self[plural].push(callback);
      self[plural] = _.unique(self[plural]);

      return self.publicInterface();
    }.bind(self);
  },

  'getSequence': function (namespace) {

    var self = this;
    var type = namespace + 's';
    return self[type];
  },

  'runSequence': function (namespace, done) {

    var self = this;
    var type = namespace + 's';
    var jobs = self.getSequence(namespace);

    self.assert('array', jobs, 'Invalid sequence for namespace "' + namespace + '"');

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

      job(next, self.publicInterface());
    }

    next();

    return self.publicInterface();
  },

  'register': function (name, target) {

    var self = this;

    self.assert('string', name, 'Invalid register namespace');
    self.assert('defined', target, 'Invalid register target');

    self.log('Adding public interface @ asimov.' + name);

    self._publicInterface[name] = target;

    return self.publicInterface();
  },

  'logAsimovHeader': function () {

    var self = this;

    if (self.options.muteLog) return;

    console.log(self.lineDelimiter);
    self.logLines(self.signature);
    console.log(self.lineDelimiter);

    return self;
  },

  'log': function (message) {

    var self = this;
    self.logger.low(self.namespace, message);
  }
});
