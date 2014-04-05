var Command = require('./Command');
var _super = Command.prototype;
var Templates = require('../render/TemplatesCollection');
var npath = require('path');

module.exports = Command.extend({

  'displayTypes': {

    'style': 'stylesheet'
  },

  'initialize': function () {

    var self = this;
    _super.initialize.apply(self, arguments);

    self.started = new Date();
    self.ensureAsimovProject().done(function () {

      self.logAsimovHeader();

      var commandIndex = self.options.args.indexOf(self.options.command.toLowerCase());
      var type = self.options.args[commandIndex + 1];
      var callback = self[type];

      self.assert('function', callback, function () {
        self.error(['Invalid type: ' + type]);
      });

      var templates = self.templates = new Templates(null, self.options);
      templates.fetch(self.options.paths.templates).done(callback);
    });
  },

  'page': function () {

    var self = this;
    var typeIndex = self.options.args.indexOf('page');
    var url = self.options.args[typeIndex + 1];

    self.assert('string', url, function () {
      self.error(['Invalid output path: ' + url]);
    });

    var templateName = self.options.args[typeIndex + 2] || 'page';

    self.assert('string', templateName, function () {
      self.error(['Invalid template name: ' + templateName]);
    });

    var template = self.templates.get(templateName);
    self.assert('object', template, function () {
      self.error(['Template does not exist: ' + templateName]);
    });

    var outputFolder = npath.join(self.options.paths.content, url);
    var outputPath = npath.join(outputFolder, templateName + '.txt');
    var outputTemplate = self.templates.get('new.page');
    var output = self.renderTemplate(outputTemplate.attributes.compiled);

    if (self.filesystem.pathExists(outputPath)) {
      self.error(['Path already exists: ' + outputPath]);
    }

    self.filesystem.forceExists(outputFolder);
    self.filesystem.writeFile(outputPath, output);

    self.logger.since(self.namespace, 'Created new page @ ' + outputPath, self.started);
  },

  'template': function () {

    var self = this;
    self.createEmptySiteFile('template', 'tmpl');
  },

  'style': function () {

    var self = this;
    self.createEmptySiteFile('style', 'styl');
  },

  'stylesheet': function () {

    var self = this;
    self.createEmptySiteFile('style', 'styl');
  },

  'createEmptySiteFile': function (type, extension) {

    var self = this;
    var displayType = self.displayTypes[type] || type;
    var typeIndex = self.options.args.indexOf(type);
    var name = self.options.args[typeIndex + 1];

    self.assert('string', name, function () {
      self.error(['Invalid ' + displayType + ' name: ' + name]);
    });

    var outputFolder = npath.join(process.cwd(), 'site', type + 's');
    var outputPath = npath.join(outputFolder, name + '.' + extension);

    if (self.filesystem.pathExists(outputPath)) {
      self.error(['Path already exists: ' + outputPath]);
    }

    self.filesystem.forceExists(outputFolder);
    self.filesystem.writeFile(outputPath, '');

    self.logger.since(self.namespace, 'Created new ' + displayType + ' @ ' + outputPath, self.started);
  },

  'renderTemplate': function (template) {

    var self = this;
    return template({});
  }
});