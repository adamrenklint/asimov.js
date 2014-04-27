var Base = require('./Base');
var _ = require('lodash');
var handlebars = require('handlebars');
var npath = require('path');

var _super = Base.prototype;

module.exports = Base.extend({

  'defaultEnvironment': 'development',

  'initialize': function () {

    var self = this;
    _super.initialize.apply(self, arguments);

    var args = process.argv || [];

    args.forEach(function (arg) {
      if (arg.indexOf('--port ') === 0) {
        var _port = parseInt(arg.split(' ').pop(), 10);
        if (typeof _port === 'number') {
          process.env.PORT = _port;
        }
      }
    });

    var environment = self.getEnvironment();
    self.json = self.generate(environment);
    self.json.reloadPort = parseInt(process.env.PORT, 10) + 1234;
  },

  'getEnvironment': function () {

    var self = this;
    return process.env.ENV || self.options.environment || self.defaultEnvironment;
  },

  'readConfig': function (path) {

    var self = this;

    self.options.muteLog || self.logger.pending(self.namespace, 'Loading configuration @ ' + path);

    if (self.filesystem.pathExists(path)) {

      var config = self.filesystem.readJSON(path);

      if (config.inherits && typeof config.inherits === 'string') {

        var parts = path.split('/');
        parts.pop();
        var parentPath = parts.join('/') + '/' + config.inherits + '.json';
        config = _.merge(self.readConfig(parentPath), config);
      }

      config = self.renderValues(config);

      return config;
    }
  },

  'renderValues': function (hash) {

    var self = this;

    _.each(hash, function (value, key) {

      if (typeof value === 'string' && value.indexOf('{{') >= 0 && value.indexOf('}}') > 0) {

        var template = handlebars.compile(value);
        hash[key] = template({
          'framework': self.options.frameworkDir
        });
      }
      else if (_.isPlainObject(value) || _.isArray(value)) {

        hash[key] = self.renderValues(value);
      }
    });

    return hash;
  },

  'decorateInitializers': function (config) {

    var self = this;
    var frameworkInitializers = [
      'Collections',
      'ServerCluster',
      'CollectionEvents',
      'ComputedPageProperties',
      'PagePostRender',
      'FetchCollections'
    ];

    if (_.isArray(config.initializers)) {

      config.initializers = _.unique(frameworkInitializers.concat(config.initializers));
    }
    else if (config.initializers && _.isString(config.initializers)) {

      config.initializers = _.unique(frameworkInitializers.concat([config.initializers]));
    }
    else {
      config.initializers = _.unique(frameworkInitializers);
    }

    return config;
  },

  'getPath': function (path) {

    var self = this;
    var containsAsimovPath = path.indexOf(self.options.frameworkDir) >= 0;
    var containsCwd = path.indexOf(process.cwd()) >= 0;
    if (!containsAsimovPath && !containsCwd) {
      return npath.join(process.cwd(), path);
    }

    return path;
  },

  'absolutePaths': function (config) {

    var self = this;

    _.each(config.paths, function (paths, name) {
      if (_.isArray(paths)) {
        _.each(paths, function (path, index) {
          config.paths[name][index] = self.getPath(path);
        });
        config.paths[name] = _.unique(config.paths[name]);
      }
      else if (typeof paths === 'string') {
        config.paths[name] = self.getPath(paths);
      }
    });

    return config;
  },

  'generate': function (environment) {

    var self = this;
    var config = self.options;

    // Framework config read first so that it can be overriden by the app
    var frameworkConfigPath = self.options.frameworkDir + '/lib/config.json';
    _.merge(config, self.readConfig(frameworkConfigPath));

    var environmentConfigPath = npath.join(process.cwd(), config.paths.configs,environment + '.json');
    _.merge(config, self.readConfig(environmentConfigPath));

    config.contentPath = config.paths.content;

    delete config.inherits;

    config = self.decorateInitializers(config);

    return self.absolutePaths(config);
  }
});