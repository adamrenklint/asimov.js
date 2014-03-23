/*

  script render job class

  creates minified javascript application bundle

*/

define([

  '../core/Base',
  'lodash',
  'handlebars',
  'uglify-js',
  'requirejs',
  'path'

], function (Base, _, handlebars, uglify, requirejs, npath) {

  var _super = Base.prototype;

  return Base.extend({

    'namespace': 'Render',

    'run': function (model) {

      var self = this;
      var deferred = self.deferred();
      var attributes = model.attributes;
      var path = attributes.path;

      if (!self.filesystem.pathExists(path)) {

        throw new Error('Cannot find script @ ' + path);
      }

      function save (raw) {

        var script = uglify.minify(raw, {
          'fromString': true
        });

        model.set({
          'rendered': script.code
        });

        deferred.resolve(model);
      }

      if (!attributes.bundle) {

        save(attributes.raw);
      }
      else {

        var outPath = npath.join(self.options.outputPath, attributes.url);

        requirejs.optimize({
          'name': attributes.name,
          'out': outPath,
          'include': [
            self.options.frameworkDir + '/vendor/almond'
          ]
        }, function (err) {

          var file = self.filesystem.readFile(outPath);
          save(file);
        });
      }

      return deferred;
    }
  });
});