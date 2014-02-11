/*
  
  app bundle render job class

  creates minified javascript application bundle

*/

define([

  '../core/Base',
  'stylus',
  'nib',
  'lodash'

], function (Base, stylus, nib, _) {

  var _super = Base.prototype;
  
  return Base.extend({

    'namespace': 'Render',

    'run': function (data) {

      var self = this;
      var path = self.options.paths.styles + '/' + data.name + '.styl';
      var bundles = [];

      if (!self.filesystem.pathExists(path)) {

        var originalPath = path;
        path = self.options.paths.frameworkStyles + '/' + data.name + '.styl';
        path = data.name.indexOf(self.options.paths.frameworkStyles) < 0 ? path : data.name + '.styl';
        path = path.replace('framework', self.options.frameworkDir);

        if (!self.filesystem.pathExists(path)) {

          throw new Error('Cannot find stylesheet @ ' + data.name + path);
        }
      }

      var deferred = self.deferred();
      bundles.push(deferred.promise());

      var raw = self.filesystem.readFile(path).toString();

      try {

        stylus(raw, {
          'compress': true,
          'paths': [self.options.paths.styles],
        })
        .use(nib())
        .import('nib')
        .render(function (err, result) {

          if (err) {
            throw new Error('Failed to compile stylesheet @ ' + path + '\n' + err);
          }

          data.logger.nextAndDone();
          deferred.resolve(result, '/' + path.replace('.styl', '.css'));
        });
      }
      catch (e) {

        throw new Error('Failed to compile stylesheet @ ' + path + '\n' + e);
      }

      return bundles;
    }
  });
});