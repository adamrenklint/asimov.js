/*
  
  ▲ asimov.js config class

  loads the environment configurations

*/

define([

  './Base',
  './Filesystem',
  'lodash'

], function (Base, Filesystem, _) {

  var _super = Base.prototype;

  // Every instance can share this one
  var filesystem = new Filesystem();

  return Base.extend({

    'namespace': 'Config',

    'initialize': function (options) {

      var self = this;
      _super.initialize.apply(self, arguments);

      self.json = self.generate();
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

    'generate': function () {

      var self = this;
      var baseDir = self.options.baseDir;
      var frameworkConfigPath = self.options.frameworkDir + '/config.json';

      self.logLoading(false, frameworkConfigPath);

      var config = _.merge(self.options, filesystem.readJSON(frameworkConfigPath));

      self.logLoading(true, frameworkConfigPath);

      var environment = 'common';
      var configPath = filesystem.join(config.paths.configs, environment + '.json');

      self.logLoading(false, configPath);

      config = _.merge(config, filesystem.readJSON(configPath));

      self.logLoading(true, configPath);

      config.contentPath = config.paths.content;

      return config;
    }
  });
});