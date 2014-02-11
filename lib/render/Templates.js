/*
  
  templates collection class

  reads all templates and register partials

*/

define([

  '../core/Base',
  'handlebars',
  'lodash'

], function (Base, handlebars, _) {

  var _super = Base.prototype;

  return Base.extend({

    'namespace': 'Templates',

    'readLogString': 'Loading 0 template(s)',

    'initialize': function () {

      var self = this;
      _super.initialize.apply(self, arguments);

      self.models = self.readTemplates();
    },

    'readTemplates': function () {

      var self = this;
      var models = {};

      _.each(self.options.paths.templates, function (path) {

        path = path.replace('framework', self.options.frameworkDir);
        
        var logger = self.logger.wait(self.namespace, self.readLogString + ' @ ' + path);

        self.filesystem.readDirectory(path, function (subPath, filename) {

          var template = self.readTemplate(subPath, filename);
          
          if (template && template.name && template.content) {
            models[template.name] = template;
            logger.nextAndDone();
          }
        });

        self.filesystem.watchTree(path, function (changed) {

          if (typeof changed === 'string') {

            var pieces = changed.split('/');
            var name = pieces[pieces.length - 1].replace('.tmpl', '');
            var template = self.readTemplate(changed, name + '.tmpl');

            if (template && template.name && template.content) {
              self.models[template.name] = template;
            }

            self.trigger('changed', name, self.models);
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