var Base = require('../core/Base');
var _super = Base.prototype;
var fs = require('fs');
var child_process = require('child_process');
var npath = require('path');
var _ = require('lodash');
var colors = require('colors');

module.exports = Base.extend({

  'lineDelimiter': '\n\n',
  'lines': [],
  'padding': '      ',

  'signature': [
    'asimov.js'.bold,
    'a better way to build awesome websites',
    'and apps, with javascript and textfiles'
  ],

  'initialize': function () {

    var self = this;
    _super.initialize.apply(self, arguments);

    console.log(self.lineDelimiter);
    self.logLines(self.signature);
    console.log(self.lineDelimiter);
  },

  'logLines': function (lines) {

    var self = this;
    (lines || self.lines).forEach(function (line) {
      console.log(self.padding + line);
    });
  },

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

    // function log (data) {
    //   data = data.toString().replace('/\n/g', '').trim();
    //   if (data.length < 10 || data.indexOf('npm') === 0) return;

    //   self.logger.log('install', data);
    // }

    // if (!self.hasUpdatedDependencies()) {

    //

    //   child.on('exit', function () {
    //     deferred.resolve(path);
    //   });

    //   child.stdout.on('data', log);
    //   child.stderr.on('data', log);
    // }
    // else {
    //   deferred.resolve(path);
    // }

    return deferred.promise();
  },

  'updateDependencies': function () {

    var self = this;
    var deferred = self.deferred();
    var install = [];
    var existing = {};
    var started = new Date();

    var moduleDirectory = self.options.frameworkDir + '/node_modules';
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
    _.each(self.options.dependencies.production, checkDependency);

    var env = self.options.dependencies[process.env.ENV];
    env && _.each(env, checkDependency);


    var length = install.length;

    function next () {

      if (install.length) {

        var dep = install.shift();
        var signature = dep.name + '@' + dep.version;
        self.logger.pending('npm', 'Installing ' + signature);
        self.child.execute('npm install ' + signature).then(next);
      }
      else {
        length && self.logger.since('npm', 'Installed ' + length + ' module(s)', started);
        deferred.resolve();
      }
    }

    next();

    return deferred.promise();
  },

  'logAsimovHeader': function () {

    var self = this;
    self.logger.pending('cli', 'Loading asimov.js @ ' + self.options.pkg.version);
  },

  'openPath': function (path) {

    var self = this;
    if (self.options.args.indexOf('--open') > 0) {
      return self.child.execute('open ' + path);
    }
  }
});