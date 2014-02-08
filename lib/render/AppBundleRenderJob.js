/*
  
  ▲ asimov.js app bundle render job class

  creates minified javascript application bundle

*/

define([

  '../core/Base',
  '../core/Filesystem',
  '../core/ChildProcess',
  'lodash',
  'handlebars'

], function (Base, Filesystem, ChildProcess, _, handlebars) {

  var _super = Base.prototype;
  var filesystem = new Filesystem();
  var child = new ChildProcess();

  return Base.extend({

    'namespace': 'Render',

    'run': function (data) {

      var self = this;
      var path = self.options.paths.applications + '/' + data.name + '/Application';
      var bundles = [];

      if (!filesystem.pathExists(path + '.js')) {

        throw new Error('Cannot find application @ ' + path);
      }

      var deferred = self.deferred();
      bundles.push(deferred.promise());

      var tempName = 'temp_app_' + data.name + '.js';
      var command = 'node node_modules/requirejs/bin/r.js -o baseUrl=. paths.asimov=framework/classes include=framework/vendor/almond name='+path+' out=' + tempName;

      child.execute(command).done(function () {

        self.appendBootstrap(tempName, data.name);

        var content = filesystem.readFile(tempName);
        filesystem.recursiveDelete(tempName);

        data.logger && data.logger.nextAndDone();
        deferred.resolve(content, data.url);
      }).fail(function (err, output) {

        throw new Error('Failed to create application bundle @ ' + path + output);
      });

      return bundles;
    },

    'appendBootstrap': function (target, name) {

      var self = this;
      var bootstrapPath = '.bootstrap_' + name + '.js';
      var bootstrapTemplatePath = 'framework/templates/bootstrap.tmpl';
      var raw = filesystem.readFile(bootstrapTemplatePath).toString();
      var template = handlebars.compile(raw);
      var content = template({
        'path': 'public/applications/' + name + '/Application'
      });

      var existing = filesystem.readFile(target);
      filesystem.writeFile(target, existing.toString() + content);

      return bootstrapPath;
    }
  });
});