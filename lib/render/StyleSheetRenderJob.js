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
      var path = npath.join(process.cwd(), attributes.path);

      if (!self.filesystem.pathExists(path)) {

        throw new Error('Cannot find stylesheet @ ' + path);
      }

      var raw = self.filesystem.readFile(path).toString();

      try {

        stylus(raw, {
          'compress': true,
          'paths': self.options.paths.styles,
        })
        .use(nib())
        .import('nib')
        .render(function (err, result) {

          if (err) {
            throw new Error('Failed to render stylesheet @ ' + path + '\n' + err);
          }

          model.set({
            'url': attributes.path,
            'path': path,
            'raw': raw,
            'rendered': result
          });

          model.logger.nextAndDone();

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