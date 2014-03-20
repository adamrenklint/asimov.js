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
      self.symlinkSiteFolder();
    },

    'symlinkSiteFolder': function () {

      var self = this;
      self.filesystem.forceExists(self.options.outputPath + '/site');

      self.filesystem.symlink(process.cwd() + '/site/images', self.options.outputPath + '/site/images', 'dir');
    },

    'symlinkPageFolder': function (model) {

      var self = this;
      var path = model.attributes.path;
      var url = model.attributes.url;

      // CAN'T create a folder symlink, since the folder will already exist
      // need to iterate over all files, and create symlinks
      // if folder, go into folder, and if no text file exists, do the symlinking there also and go into any subfolder

      // var parts = path.split('/');
      // parts.pop();
      // var realPath = parts.join('/')

      console.log(path, realPath);process.exit()
    },

    'write': function (model) {

      var self = this;
      var attributes = model.attributes;
      var path = attributes.url;

      if (attributes.type === 'page') {

        path = (path + '/index.html').replace('//', '/');
        self.symlinkPageFolder(model);
      }

      path = self.options.outputPath + path;


      var logger = self.logger.wait(self.namespace, 'Writing ' + attributes.type + ' to static build folder @ ' + path);

      var parts = path.split('/');
      parts.pop();
      var parentPath = parts.join('/');
      self.filesystem.forceExists(parentPath);

      self.filesystem.writeFile(path, attributes.rendered);
      logger.nextAndDone();
    }
  });
});