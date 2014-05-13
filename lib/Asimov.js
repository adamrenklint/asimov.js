var Sequencer = require('./Sequencer');
var _super = Sequencer.prototype;
var npath = require('path');
var _ = require('lodash');

var Config = require('./Config');

module.exports = Sequencer.extend({

  'publicMethods': [
    'on',
    'once',
    'trigger',
    'use',
    'start',
    'addSequence',
    'runSequence',
    'register',
    'config',
    'logPending',
    'logSince',
    'error',
    'paths'
  ],

  'config': {},

  'initialize': function () {

    var self = this;
    _super.initialize.apply(self, arguments);

    if (self.options.muteLog || process.env.MUTE || global.muteLog) {
      process.env.MUTE = self.options.muteLog = 'true';
    }

    self.logAsimovHeader();

    self.started = new Date();

    if (!self.options.muteLog) {
      self.logger.pending('start', 'Loading asimov.js @ ' + self.options.meta.version);
      self.logger.log('start', 'The time is ' + self.started);
    }

    self.config = _.merge(self.getConfig(), self.config);

    self._publicInterface = {};

    ['init', 'preinit', 'postinit'].forEach(self.addSequence);

    self.publicMethods.forEach(function (name) {
      self.register(name, self[name]);
    });

    self._publicInterface.fs = self.filesystem;
    self._publicInterface.logger = self.logger;
  },

  'start': function (next) {

    var self = this;
    var started = new Date();
    var template = '$ "' + self.options.pkg.name + '" @ ' + self.options.pkg.version;

    self.options.muteLog || self.logger.pending(self.namespace, template.replace('$', 'Starting'));

    var amount = self.getSequence('preinit').length + self.getSequence('init').length + self.getSequence('postinit').length;

    if (!amount) {
      self.error('No initializers found');
      return next && next();
    }

    self.runSequence('preinit').done(function () {
      self.runSequence('init').done(function () {
        self.runSequence('postinit').done(function () {

          if (!self.options.muteLog) {
            self.logger.since(self.namespace, 'Executed ' + amount + ' initializer(s)', started);
            self.logger.since(self.namespace, template.replace('$', 'Started'), self.started);
          }

          if (typeof next === 'function') next();
        }).fail(self.error);
      }).fail(self.error);
    }).fail(self.error);

    return self.publicInterface();
  },

  'getConfig': function () {

    var self = this;

    var config = self._config = new Config(self.options);
    var json = config.json;

    return {
      'paths': json.paths,
      'outputPath': json.paths.outputDir,
      'meta': json.meta,
      'pkg': json.pkg,
      'defaultLangCode': json.defaultLangCode
    };
  },

  'use': function (plugin, options) {

    var self = this;
    self.assert('function', plugin, 'Invalid plugin constructor function');

    plugin(self.publicInterface());

    return self.publicInterface();
  },

  'addedSequence': function (namespace, method) {

    var self = this;
    return self.register(method, self[method]);
  },

  'paths': function (type, namespace) {

    var self = this;
    var name = type + 'Path';

    self.config.paths = self.config.paths || {};
    self.config.paths[type] = self.config.paths[type] || [];

    self.register(name, function (path, namespace) {
      namespace = namespace || 'pages';
      self.options.muteLog || self.logPending(namespace, 'Adding path for asimov.' + type + ' @ ' + path);
      self.config.paths[type].push(path);
    }, namespace);
  },

  'register': function (name, target, namespace) {

    var self = this;

    self.assert('string', name, 'Invalid register namespace');
    self.assert('defined', target, 'Invalid register target "' + name + '"');

    self.options.muteLog || self.log('Adding public interface @ asimov.' + name, namespace);

    self._publicInterface[name] = target;

    return self.publicInterface();
  },

  'logAsimovHeader': function () {

    var self = this;

    if (self.options.muteLog) return;

    console.log(self.lineDelimiter);
    self.logLines(self.signature);
    console.log(self.lineDelimiter);
  },

  'log': function (message, namespace) {

    var self = this;
    self.logger.low(namespace || self.namespace, message);
  },

  'error': function (message) {

    var self = this;
    var messages = _.toArray(arguments);
    var pattern = 'Error: ';

    if (_.isArray(message)) {
      self.error.apply(self, message);
    }
    else if (_.isArray(messages)) {
      messages.forEach(function (message) {
        message = message.toString();
        if (message.indexOf(pattern) === 0) {
          message = message.replace(pattern, '');
        }
        self.logger.log('error', message, 'red');
      });
    }
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
