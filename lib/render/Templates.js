/*

  templates collection class

  reads all templates and register partials

*/

define([

  '../core/Base',
  'handlebars',
  'lodash',
  'path'

], function (Base, handlebars, _, npath) {

  var _super = Base.prototype;

  return Base.extend({

    'namespace': 'Templates',

    'readLogString': 'Loading 0 template(s)',

    'initialize': function () {

      var self = this;
      _super.initialize.apply(self, arguments);

      self.models = self.readTemplates();
    },

    'readTemplates': function (paths, models) {

      var self = this;
      paths = paths || self.options.paths.templates;
      models = models || {};

      _.each(paths, function (path) {

        if (path.indexOf(process.cwd()) < 0) {
          path = npath.join(process.cwd(), path);
        }

        var logger = self.logger.wait(self.namespace, self.readLogString + ' @ ' + path);

        self.filesystem.readDirectory(path, function (subPath, filename) {

          if (self.filesystem.isDirectory(subPath)) {

            models = self.readTemplates(subPath, models);
            return;
          }

          var template = self.readTemplate(subPath, filename);

          if (template && template.name && template.content) {
            models[template.name] = template;
            logger.nextAndDone();
          }
        });
      });

      return models;
    },

    'readTemplate': function (path, filename) {

      var self = this;
      var model;

      if (self.filesystem.hasFileExtension(filename, 'tmpl')) {

        var raw = '' + self.filesystem.readFile(path, 'utf8');
        var name = filename.replace('.tmpl', '');

        try {

          handlebars.registerPartial(name, raw);
          model = {
            'name': name,
            'content': handlebars.compile(raw),
            'raw': raw
          };
        }
        catch (e) {

          throw new Error('Invalid template @ ' + path);
        }
      }

      return model;
    }
  });
});