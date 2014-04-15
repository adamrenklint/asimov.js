var Base = require('./Base');
var _ = require('lodash');
var npath = require('path');
var lazy = require('./lazy');

var _super = Base.prototype;

module.exports = Base.extend({

  'ensureAsimovProject': function () {

    var self = this;
    var deferred = self.deferred();

    var path = npath.join(process.cwd(), 'main.js');

    if (!self.filesystem.pathExists(path)) {
      self.logger.log(self.namespace, 'The "' + self.options.command.toLowerCase() + '" command can only be run in asimov.js projects');
      var message = 'Couldn\'t find main.js in ' + process.cwd();
      console.log('[' + self.namespace + '] ' + message);
      process.exit(1);
    }

    return deferred.resolve(path).promise();
  },

  'logBefore': function (name, version) {

    var self = this;
    self.logger.pending('npm', 'Installing ' + name + ' @ ' + version);
    return true;
  },

  'updateDependencies': function () {

    var self = this;
    var deferred = self.deferred();

    var config = {
      'path': npath.join(__dirname, '../../package.json'),
      'before': self.logBefore,
      'groups': ['production']
    };

    process.env.ENV && (config.groups.push(process.env.ENV));
    self.installEnv && (config.groups.push(self.installEnv));

    lazy.install(config, function (installed) {

      installed.length && self.logger.since('npm', 'Installed ' + installed.length + ' module(s)', installed.started);

      deferred.resolve();
    });

    return deferred.promise();
  }
});