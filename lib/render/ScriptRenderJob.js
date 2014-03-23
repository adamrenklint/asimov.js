/*

  script render job class

  creates minified javascript application bundle

*/

define([

  '../core/Base',
  'lodash',
  'handlebars',
  'uglify-js'

], function (Base, _, handlebars, uglify) {

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

      var script = uglify.minify(attributes.raw, {
        'fromString': true
      });

      model.set({
        'rendered': script.code
      });

      deferred.resolve(model);

      // var tempName = 'temp_app_' + data.name + '.js';
      // var command = 'node ' + self.options.frameworkDir + '/node_modules/requirejs/bin/r.js -o baseUrl=. paths.asimov=' + self.options.frameworkDir + '/classes paths.framework=' + self.options.frameworkDir + '/ paths.wunderbits-core=' + self.options.frameworkDir + '/node_modules/asimov-core/vendor/wunderbits.core/ include=' + self.options.frameworkDir + '/vendor/almond name='+path+' out=' + tempName;

      // self.child.execute(command).done(function () {

      //   self.appendBootstrap(tempName, data.name);

      //   var content = self.filesystem.readFile(tempName);
      //   self.filesystem.recursiveDelete(tempName);

      //   data.nextLogger.nextAndDone();
      //   deferred.resolve(content, data.url);
      // }).fail(function (err, output) {

      //   throw new Error('Failed to create application bundle @ ' + path + err + output);
      // });

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