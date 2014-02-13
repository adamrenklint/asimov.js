/*

  app bundle render job class

  creates minified javascript application bundle

*/

define([

  '../core/Base',
  'stylus',
  'nib',
  'lodash',
  'path'

], function (Base, stylus, nib, _, npath) {

  var _super = Base.prototype;

  return Base.extend({

    'namespace': 'Render',

    'run': function (data) {

      var self = this;
      var bundles = [];
      var path = self.options.paths.styles + '/' + data.name + '.styl';

      if (data.url.indexOf('asimov.js') >= 0) {
        path = npath.join(self.options.baseDir, self.options.frameworkDir, self.options.paths.frameworkStyles.replace('framework', ''), data.url.split('asimov.js')[1].replace('.css', '.styl'));
      }

      path = path.replace(/\/\//g, '/');

      if (!self.filesystem.pathExists(path)) {

        throw new Error('Cannot find stylesheet @ ' + data.url);
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
          deferred.resolve(data.url, result, data);
        });
      }
      catch (e) {

        throw new Error('Failed to compile stylesheet @ ' + path + '\n' + e);
      }

      return bundles;
    }
  });
});