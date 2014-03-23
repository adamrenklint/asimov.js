/*

  config class

  loads the environment configurations

*/

define([

  './Base',
  'lodash',
  'handlebars',
  'path'

], function (Base, _, handlebars, npath) {

  var _super = Base.prototype;

  return Base.extend({

    'defaultEnvironment': 'development',

    'initialize': function () {

      var self = this;
      _super.initialize.apply(self, arguments);

      var environment = self.getEnvironment();
      self.json = self.generate(environment);
    },

    'getEnvironment': function () {

      var self = this;
      return process.env.ENV || self.options.environment || self.defaultEnvironment;
    },

    'readConfig': function (path) {

      var self = this;
      if (path.indexOf(process.cwd()) < 0) {
        path = npath.join(process.cwd(), path);
      }

      self.logger.pending(self.namespace, 'Loading configuration @ ' + path);

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

    'generate': function (environment) {

      var self = this;
      var config = self.options;

      // Framework config read first so that it can be overriden by the app
      var frameworkConfigPath = self.options.frameworkDir + '/config.json';
      _.merge(config, self.readConfig(frameworkConfigPath));

      var environmentConfigPath = config.paths.configs + '/' + environment + '.json';
      _.merge(config, self.readConfig(environmentConfigPath));

      config.contentPath = config.paths.content;

      delete config.inherits;
      return config;
    }
  });
});