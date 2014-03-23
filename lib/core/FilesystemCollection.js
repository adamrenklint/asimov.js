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

    'model': FilesystemModel,

    'filetype': 'file',

    'initialize': function (options) {

      var self = this;
      _super.initialize.apply(self, arguments);
    },

    'shouldReadPath': function (path) {

      var self = this;
      if (path.indexOf('/_') >= 0) return false;
      return self.filesystem.hasFileExtension(path, self.extension);
    },

    'fetchModels': function (path) {

      var self = this;
      var deferred = self.deferred();
      var promises = [];

      self.filesystem.readDirectory(path, function (subpath) {

        if (self.shouldReadPath(subpath)) {
          var model = new self.model({
            'path': subpath
          }, self.options);
          promises.push(model.fetch(subpath));
        }
        else if (self.filesystem.isDirectory(subpath)) {
          promises = promises.concat(self.fetchModels(subpath));
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
      var started = new Date();
      var deferred = self.deferred();
      var models = [];
      var promises = [];
      paths = paths || self.lastPaths;

      if (!paths) {
        throw new Error('Cannot load collection, no path(s) provided');
      }

      if (!_.isArray(paths)) {
        paths = [paths];
      }

      self.lastPaths = paths;

      _.each(paths, function (path) {

        if (path.indexOf(process.cwd()) < 0) {
          path = npath.join(process.cwd(), path);
        }

        if (!self.filesystem.pathExists(path)) {
          return;
        }

        if (!self.filesystem.isDirectory(path)) {
          throw new Error(self.namespace + ' could not fetch ' + self.filetype + ' file, invalid path @' + path);
        }

        promises.push(self.fetchModels(path));
      });

      self.when.call(self, promises).done(function () {

        var models = _.flatten(_.toArray(arguments));
        self.add(models, self.options);

        if (models.length) {
          self.logger.since(self.namespace, 'Loaded ' + models.length + ' ' + self.filetype + '(s)', started);
        }

        deferred.resolve(self);
      });

      return deferred.promise();
    }
  });
});