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

    'namespace': 'queue',

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
          filename = filename.replace(/(\d)+-/, '');
          self.symlinkPageFolder(subpath, destPath + filename + '/');
        }
        else if (!self.filesystem.hasFileExtension(filename, 'txt')) {

          self.filesystem.forceExists(destPath);
          self.filesystem.symlink(subpath, destPath + '/' + filename, 'dir');
        }
      });
    },

    'write': function (model) {

      var self = this;
      var started = new Date();
      var attributes = model.attributes;
      var path = model.getOutputPath();
      var output = attributes.rendered;

      var parts = path.split('/');
      parts.pop();
      var parentPath = parts.join('/');
      self.filesystem.forceExists(parentPath);

      if (model.isPage()) {

        var url = model.attributes.url;
        self.symlinkPageFolder(process.cwd() + '/' + self.options.paths.content + url, (self.options.outputPath + url).replace('//', '/'));
        output = output.replace('<head>', '<head><meta generator="asimov.js ' + self.options.pkg.version + '">');
      }

      self.filesystem.writeFile(path, output);
      model.set('outputPath', path);
      self.logger.lowSince(self.namespace, 'Saved ' + attributes.type + ' to build folder @ ' + path, started);
    },

    'clear': function (model) {

      var self = this;
      var attributes = model.attributes;
      var path = model.getOutputPath();

      var logger = self.logger.wait(self.namespace, 'Clearing ' + attributes.type + ' from static build folder @ ' + path);

      self.filesystem.recursiveDelete(path);
      logger.nextAndDone();
    }
  });
});