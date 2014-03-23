/*

  last modified tracker class

*/

define([

  '../core/Base',
  'lodash'

], function (Base, _) {

  var _super = Base.prototype;

  return Base.extend({

    'filePath': '/lastModfiedAt.json',

    'initialize': function () {

      var self = this;
      _super.initialize.apply(self, arguments);

      self.data = self.getExisting();

      self.pending = {};
      self.saveToFile = _.debounce(self.saveToFile, 10);
    },

    'getPath': function () {

      var self = this;
      return self.options.outputPath + self.filePath;
    },

    'getModified': function () {

      var self = this;
      var modified = [];
      var existing = self.getExisting();

      _.each(existing, function (oldModifiedAt, path) {

        var info = self.filesystem.getStats(path);
        var modifiedAt = (new Date(info.mtime)).valueOf();

        if (oldModifiedAt !== modifiedAt) {
          modified.push(path);
        }
      });

      return modified;
    },

    'getExisting': function () {

      var self = this;
      var path = self.getPath();
      var existing = {};

      if (self.filesystem.pathExists(path)) {

        try {
          var file = self.filesystem.readFile(path);
          existing = JSON.parse(file);
        }
        catch (e) {
          // do nothing, fail silently
        }
      }

      return existing || {};
    },

    'save': function (path, date) {

      var self = this;

      self.pending[path] = date.valueOf();
      self.saveToFile();
    },

    'saveToFile': function () {

      var self = this;

      if (_.keys(self.pending).length) {

        var existing = self.getExisting();
        existing = _.merge(existing, self.pending);
        self.filesystem.writeFile(self.getPath(), JSON.stringify(existing));

        self.pending = {};
      }
    }
  });
});