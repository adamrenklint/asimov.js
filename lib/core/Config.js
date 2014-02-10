/*
  
  ▲ asimov.js config class

  loads the environment configurations

*/

define([

  './Base',
  'lodash'

], function (Base, _) {

  var _super = Base.prototype;

  return Base.extend({

    'namespace': 'Config',

    'defaultEnvironment': 'development',

    'initialize': function (options) {

      var self = this;
      _super.initialize.apply(self, arguments);

      var environment = self.getEnvironment();
      self.json = self.generate(environment);
    },

    'logLoading': function (done, path) {

      var self = this;

      if (!done) {
        self.loading = self.logger.wait(self.namespace, 'Loading environment config @ ' + path, true);
      }
      else if (self.loading) {
        self.loading.nextAndDone();
        self.loading = null;
      }
    },

    'getEnvironment': function () {

      var self = this;
      return process.env.ENV || self.defaultEnvironment;
    },

    'readConfig': function (path) {

      var self = this;
      self.logLoading(false, path);

      if (self.filesystem.pathExists(path)) {

        var config = self.filesystem.readJSON(path);

        if (config.inherits && typeof config.inherits === 'string') {

          var parts = path.split('/');
          parts.pop();
          var parentPath = parts.join('/') + '/' + config.inherits + '.json';
          config = _.merge(self.readConfig(parentPath), config)
        }
        
        self.logLoading(true, path);

        return config;
      }
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