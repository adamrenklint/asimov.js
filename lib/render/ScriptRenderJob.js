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

      if (!attributes.bundle) {

        var script = uglify.minify(attributes.raw, {
          'fromString': true
        });

        model.set({
          'rendered': script.code
        });

        deferred.resolve(model);
      }
      else {

        requirejs.optimize({
          'name': attributes.name,
          'out': npath.join(self.options.outputPath, attributes.url),
          'include': [
            self.options.frameworkDir + '/vendor/almond'
          ]
        }, function (err) {
          deferred.resolve(model);
        });
      }

      return deferred.promise();
    },

    'appendBootstrap': function (target, name) {

      var self = this;
      var bootstrapPath = '.bootstrap_' + name + '.js';
      var bootstrapTemplatePath = self.options.frameworkDir + '/templates/bootstrap.tmpl';
      var raw = self.filesystem.readFile(bootstrapTemplatePath).toString();
      var template = handlebars.compile(raw);
      var content = template({
        'path': 'public/applications/' + name + '/Application'
      });

      var existing = self.filesystem.readFile(target);
      self.filesystem.writeFile(target, existing.toString() + content);

      return bootstrapPath;
    }
  });
});