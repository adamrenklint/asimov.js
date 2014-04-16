var Base = require('./Base');
var _ = require('lodash');
var npath = require('path');
var install = require('lazy-install');

var _super = Base.prototype;

module.exports = Base.extend({

  'installGroups': [],

  'ensureAsimovProject': function () {

    var self = this;
    var deferred = self.deferred();

    var path = npath.join(process.cwd(), 'main.js');

    if (!self.filesystem.pathExists(path)) {
      self.error([
        'The "' + self.options.command.toLowerCase() + '" command can only be run in asimov.js projects',
        'Couldn\'t find ' + path
      ]);
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
      'groups': self.installGroups
    };

    if (process.argv.indexOf('--test') > 0) {
      config.groups.push('test');
      config.groups.push('runner');
    }

    install(config, function (err, installed) {

      if (err) self.error(['Failed to install lazy dependecies', err]);

      installed.length && self.logger.since('npm', 'Installed ' + installed.length + ' module(s)', installed.started);

      if (process.argv.indexOf('--preinstall') > 0) process.exit();

      deferred.resolve();
    });

    return deferred.promise();
  }
});