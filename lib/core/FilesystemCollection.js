/*

  filesystem collection class

  knows how to crawl a directory and create
  models from the raw data

*/

define([

  '../core/Collection',
  './FilesystemModel',
  'lodash',
  'path'

], function (Collection, FilesystemModel, _, npath) {

  var _super = Collection.prototype;

  return Collection.extend({

    'namespace': 'FilesystemCollection',

    'model': FilesystemModel,

    'filetype': 'file',

    'initialize': function (options) {

      var self = this;
      _super.initialize.apply(self, arguments);
    },

    'shouldReadPath': function (path) {

      var self = this;
      return self.filesystem.hasFileExtension(path, self.extension);
    },

    'fetchModels': function (path, logger) {

      var self = this;
      var deferred = self.deferred();
      var promises = [];

      self.filesystem.readDirectory(path, function (subpath) {

        if (self.shouldReadPath(subpath)) {
          var model = new self.model(null, self.options);
          promises.push(model.fetch(subpath, logger));
        }
        else if (self.filesystem.isDirectory(subpath)) {
          promises = promises.concat(self.fetchModels(subpath, logger));
        }
      });

      self.when.call(self, promises).done(function () {
        var models = _.flatten(_.toArray(arguments));
        deferred.resolve(models);
      });

      return deferred.promise();
    },

    'fetch': function (paths) {

      var self = this;
      var deferred = self.deferred();
      var models = [];
      var promises = [];

      if (!_.isArray(paths)) {
        paths = [paths];
      }

      _.each(paths, function (path) {

        if (path.indexOf(process.cwd()) < 0) {
          path = npath.join(process.cwd(), path);
        }

        if (!self.filesystem.pathExists(path)) {
          return;
        }

        var logger = self.logger.wait(self.namespace, 'Loading 0 ' + self.filetype + '(s) @ ' + path, true);

        if (!self.filesystem.isDirectory(path)) {
          throw new Error(self.namespace + ' could not fetch ' + self.filetype + ', invalid path @' + path);
        }

        promises.push(self.fetchModels(path, logger));
      });

      self.when.call(self, promises).done(function () {

        var models = _.flatten(_.toArray(arguments));
        self.add(models, self.options);
        deferred.resolve(self);
      });

      return deferred.promise();
    }
  });
});