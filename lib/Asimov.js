var Sequencer = require('./Sequencer');
var _super = Sequencer.prototype;
var npath = require('path');
var _ = require('lodash');
var Configurable = require('./mixins/Configurable');

module.exports = Sequencer.extend({

  'publicMethods': [
    'on',
    'once',
    'trigger',
    'off',
    'publish',
    'unpublish',
    'use',
    'start',
    'addSequence',
    'runSequence',
    'getSequence',
    'register',
    'config',
    'logPending',
    'logSince',
    'error',
    'paths'
  ],

  'mixins': [
    Configurable
  ],

  'initialize': function () {

    var self = this;
    _super.initialize.apply(self, arguments);

    if (self.options.muteLog || process.env.MUTE || global.muteLog) {
      process.env.MUTE = self.options.muteLog = 'true';
    }

    self.started = new Date();

    self._publicInterface = {};

    ['init', 'preinit', 'postinit', 'shutdown'].forEach(self.addSequence);

    self.publicMethods.forEach(function (name) {
      self.register(name, self[name]);
    });

    self._publicInterface.fs = self.filesystem;
    self._publicInterface.logger = self.logger;

    self._publicInterface.config = self.config = self.chainableConfig;

    self.configure();
  },

  'start': function () {

    throw new Error('No start method implemented by Asimov subclass');
  },

  'configure': function () {

    var self = this;
    var frameworkRoot = __dirname.replace(/\/lib$/, '');

    return self
      .config('ROOT', process.cwd())
      .config('FRAMEWORK_ROOT', frameworkRoot)
      .config('PKG', require(npath.join(process.cwd(), 'package.json')))
      .config('ASIMOV', require(npath.join(frameworkRoot, 'package.json')));
  },

  'use': function (plugin, options) {

    var self = this;
    self.assert('function', plugin, 'Invalid plugin function');

    plugin();

    return self.publicInterface();
  },

  'chainableConfig': function (key, value) {

    var self = this;
    var result = Configurable.Behavior.config.apply(self, arguments);

    if (value !== undefined || _.isPlainObject(key)) {
      return self.publicInterface();
    }
    else {
      return result;
    }
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

    // self.options.muteLog || self.log('Adding public interface @ asimov.' + name, namespace);

    self._publicInterface[name] = target;

    return self.publicInterface();
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

      if (process.env.VERBOSE === 'true') {
        throw new Error(messages);
      }

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
