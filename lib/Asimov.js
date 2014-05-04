var Sequencer = require('./Sequencer');
var _super = Sequencer.prototype;
var npath = require('path');
var _ = require('lodash');

var Config = require('./Config');

module.exports = Sequencer.extend({

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

  'config': {},

  // 'sequences':
  //   'init': 'initializer'
  //   // ,
  //   // 'processor': 'processor',
  //   // 'middleware': 'middleware'
  // },
  'initialize': function () {

    var self = this;
    _super.initialize.apply(self, arguments);

    if (self.options.muteLog) {
      process.env.MUTE = true;
    }

    self.logAsimovHeader();

    self.config = _.merge(self.getConfig(), self.config);

    self._publicInterface = {};

    self.addSequence('initializer', 'init');
    self.addSequence('postinit');

    self.fs = self.filesystem;
  },

  'start': function (next) {

    var self = this;
    self.started = new Date();

    self.logger.pending('start', 'Loading asimov.js @ ' + self.options.pkg.version);
    self.logger.log('start', 'The time is ' + self.started);

    self.runSequence('initializer', function () {
      self.runSequence('postinit', function () {
        console.log('started');
        next();
      });
    });

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

  'register': function (name, target, namespace) {

    var self = this;

    self.assert('string', name, 'Invalid register namespace');
    self.assert('defined', target, 'Invalid register target');

    self.log('Adding public interface @ asimov.' + name, namespace);

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

  'log': function (message, namespace) {

    var self = this;
    self.logger.low(namespace || self.namespace, message);
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
  }
});
