var Base = require('./Base');
var _ = require('lodash');
var npath = require('path');

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

    self.updateDependencies().done(function () {
      deferred.resolve(path);
    });

    return deferred.promise();
  },

  'updateDependencies': function () {

    var self = this;
    var deferred = self.deferred();
    var install = [];
    var existing = {};
    var started = new Date();

    var moduleDirectory = process.cwd() + '/node_modules';
    self.filesystem.readDirectory(moduleDirectory, function (path, filename) {
      if (self.filesystem.isDirectory(path)) {
        var pkg = require(path + '/package.json');
        existing[filename] = pkg.version;
      }
    });

    function checkDependency (version, name) {
      var current = existing[name];

      if (current !== version) {

        if (name === 'watchdirectory' && process.env.ENV === 'production' && !process.env.WATCH) return;

        install.push({
          'name': name,
          'version': version
        });
      }
    }

    _.each(self.options.meta.dependencies, checkDependency);
    _.each(self.options.dependencies.production, checkDependency);

    var env = self.options.dependencies[process.env.ENV];
    env && _.each(env, checkDependency);

    var installEnv = self.installEnv && self.options.dependencies[self.installEnv];
     installEnv && _.each(installEnv, checkDependency);

    var length = install.length;

    function next () {

      if (install.length) {

        var dep = install.shift();
        var signature = dep.name + '@' + dep.version;
        self.logger.pending('npm', 'Installing ' + signature.replace('@', ' @ '));
        self.child.execute('npm install ' + signature).then(next);
      }
      else {
        length && self.logger.since('npm', 'Installed ' + length + ' module(s)', started);
        deferred.resolve();
      }
    }

    next();

    return deferred.promise();
  }
});