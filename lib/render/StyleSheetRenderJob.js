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

    'run': function (model) {

      var self = this;
      var deferred = self.deferred();
      var attributes = model.attributes;
      var path = attributes.path;

      if (!self.filesystem.pathExists(path)) {

        throw new Error('Cannot find stylesheet @ ' + path);
      }

      var raw = self.filesystem.readFile(path).toString();

      try {

        stylus(raw, {
          'compress': true,
          'paths': self.options.paths.styles.slice(0),
        })
        .use(nib())
        .import('nib')
        .render(function (err, result) {

          if (err) {
            throw new Error('Failed to render stylesheet @ ' + path + '\n' + err);
          }

          model.set({
            'raw': raw,
            'rendered': result
          });

          deferred.resolve(model);
        });
      }
      catch (e) {

        throw new Error('Failed to compile stylesheet @ ' + path + '\n' + e);
      }

      return deferred.promise();
    }
  });
});