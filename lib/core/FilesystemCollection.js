/*

  filesystem collection class

  knows how to crawl a directory and create
  models from the raw data

*/

define([

  '../core/Collection',
  'lodash',
  'path'

], function (Collection, _, npath) {

  var _super = Collection.prototype;

  return Collection.extend({

    'namespace': 'FilesystemCollection',

    'filetype': 'file',

    'initialize': function (options) {

      var self = this;
      _super.initialize.apply(self, arguments);
    },

    'shouldReadPath': function (path) {

      var self = this;
      return self.filesystem.hasFileExtension(path, self.extension);
    },

    'readPath': function (path) {

      var self = this;
      var raw = self.filesystem.readFile(path);

      return {
        'path': path,
        'raw': raw
      };
    },

    'fetchModels': function (path, logger) {

      var self = this;
      var models = [];

      self.filesystem.readDirectory(path, function (subpath) {

        if (self.shouldReadPath(subpath)) {
          models.push(self.readPath(subpath));
          logger.nextAndDone();
        }
        else if (self.filesystem.isDirectory(subpath)) {
          models = models.concat(self.fetchModels(subpath, logger));
        }
      });

      return models;
    },

    'fetch': function (paths) {

      var self = this;
      var deferred = self.deferred();
      var models = [];

      if (!_.isArray(paths)) {
        paths = [paths];
      }

      _.each(paths, function (path) {

        if (path.indexOf(process.cwd()) < 0) {
          path = npath.join(process.cwd(), path);
        }

        var logger = self.logger.wait(self.namespace, 'Loading 0 ' + self.filetype + '(s) @ ' + path, true);

        if (!self.filesystem.isDirectory(path)) {
          throw new Error(self.namespace + ' could not fetch ' + self.filetype + ', invalid path @' + path);
        }

        var newModels = self.fetchModels(path, logger);
        if (newModels.length) {
          models = models.concat(newModels);
        }
      });

      self.reset(models, self.options);
      deferred.resolve(self);

      return deferred.promise();
    }
  });
});