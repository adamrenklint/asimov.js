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

    // 'getPath': function (name) {

    //   var self = this;
    //   var path;

    //   _.each(self.options.paths.styles, function (possible) {

    //     possible = npath.join(process.cwd(), possible, name + '.styl');

    //     if (self.filesystem.pathExists(possible)) {
    //       path = possible;
    //     }
    //   });

    //   if (!path) {
    //     throw new Error('Failed to find path for stylesheet "' + name + '"');
    //   }

    //   return path;
    // },

    'run': function (model) {

      var self = this;
      var deferred = self.deferred();
      var attributes = model.attributes;
      var path = npath.join(process.cwd(), attributes.path);

      if (!self.filesystem.pathExists(path)) {

        throw new Error('Cannot find stylesheet @ ' + path);
      }

      console.log(attributes);process.exit(1);


      var deferred = self.deferred();
      bundles.push(deferred.promise());

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

          data.logger.nextAndDone();
          deferred.resolve(result, data.url);
        });
      }
      catch (e) {

        throw new Error('Failed to compile stylesheet @ ' + path + '\n' + e);
      }

      return deferred.promise();
    }
  });
});