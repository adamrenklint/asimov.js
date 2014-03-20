/*

  output writer class

  writes the rendered raw data to disk,
  to be picked up by express' static middleware

*/

define([

  '../core/Base'

], function (Base) {

  var _super = Base.prototype;

  return Base.extend({

    'namespace': 'Output',

    'initialize': function () {

      var self = this;
      _super.initialize.apply(self, arguments);

      self.filesystem.rebuildDirectory(self.options.outputPath);

      self.symlinkSiteFolder('images');
    },

    'symlinkSiteFolder': function (name) {

      var self = this;
      var srcPath = process.cwd() + '/site/' + name;
      var destFolder = self.options.outputPath + '/site';
      var destPath = destFolder + '/' + name;

      if (self.filesystem.pathExists(srcPath)) {
        self.filesystem.forceExists(destFolder);
        self.filesystem.symlink(srcPath, destPath, 'dir');
      }
    },

    'symlinkPageFolder': function (srcPath, destPath) {

      var self = this;

      self.filesystem.readDirectory(srcPath, function (subpath, filename) {

        if (self.filesystem.isDirectory(subpath)) {
          self.symlinkPageFolder(subpath, destPath + filename + '/');
        }
        else if (!self.filesystem.hasFileExtension(filename, 'txt')) {

          self.filesystem.forceExists(destPath);
          self.filesystem.symlink(subpath, destPath + filename, 'dir');
        }
      });
    },

    'write': function (model) {

      var self = this;
      var attributes = model.attributes;
      var path = attributes.url;

      if (model.isPage()) {

        path = (path + '/index.html').replace('//', '/');
      }

      path = self.options.outputPath + path;

      var logger = self.logger.wait(self.namespace, 'Writing ' + attributes.type + ' to static build folder @ ' + path);

      var parts = path.split('/');
      parts.pop();
      var parentPath = parts.join('/');
      self.filesystem.forceExists(parentPath);

      if (model.isPage()) {

        var realPath = model.attributes.path;
        var realParts = realPath.split('/');
        realParts.pop();
        realPath = realParts.join('/');

        self.symlinkPageFolder(realPath, self.options.outputPath + model.attributes.url);
      }

      self.filesystem.writeFile(path, attributes.rendered);
      logger.nextAndDone();
    }
  });
});