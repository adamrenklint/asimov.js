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

    lazy.install(config, function (installed) {

      installed.length && self.logger.since('npm', 'Installed ' + installed.length + ' module(s)', installed.started);

      deferred.resolve();
    });

    //     if (name === 'watchdirectory' && process.env.ENV === 'production' && !process.env.WATCH) return;

    //     install.push({
    //       'name': name,
    //       'version': version
    //     });
    //   }
    // }

    // _.each(self.options.meta.dependencies, checkDependency);
    // _.each(self.options.dependencies.production, checkDependency);

    // var env = self.options.dependencies[process.env.ENV];
    // env && _.each(env, checkDependency);

    // var installEnv = self.installEnv && self.options.dependencies[self.installEnv];
    //  installEnv && _.each(installEnv, checkDependency);

    // var length = install.length;

    // function next () {

    //   if (install.length) {

    //     var dep = install.shift();
    //     var signature = dep.name + '@' + dep.version;
    //
    //     self.child.execute('npm install ' + signature).then(next);
    //   }
    //   else {
    //
    //     deferred.resolve();
    //   }
    // }

    // next();

    return deferred.promise();
  }
});