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
      return false;
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

    'fetch': function (path) {

      var self = this;
      var deferred = self.deferred();

      if (path.indexOf(process.cwd()) < 0) {
        path = npath.join(process.cwd(), path);
      }

      var logger = self.logger.wait(self.namespace, 'Reading 0 ' + self.filetype + '(s) @ ' + path, true);

      if (!self.filesystem.isDirectory(path)) {
        throw new Error(self.namespace + ' could not fetch ' + self.filetype + ', invalid path @' + path);
      }

      var models = self.fetchModels(path, logger);
      self.reset(models, self.options);
      deferred.resolve(self);

      return deferred.promise();
    }
  });
});