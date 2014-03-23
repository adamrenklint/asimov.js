/*

  watcher model class

  parses raw data, creates dependency graphs and
  triggers new fetch of data from disk on change

*/

define([

  '../core/Model',
  'lodash',
  'madge',
  '../parsers/StyleSheetParser',
  '../parsers/PageParser',
  '../parsers/TemplateParser',
  '../updaters/PageHandler',
  '../updaters/TemplateHandler',
  '../updaters/StyleSheetHandler'

], function (Model, _, madge, StyleSheetParser, PageParser, TemplateParser, PageHandler, TemplateHandler, StyleSheetHandler) {

  var _super = Model.prototype;

  return Model.extend({

    'parsers': {

      'styleSheet': StyleSheetParser,
      'page': PageParser,
      'template': TemplateParser
    },

    'handlers': {

      'styleSheet': StyleSheetHandler,
      'page': PageHandler,
      'template': TemplateHandler
    },

    'initialize': function () {

      var self = this;
      _super.initialize.apply(self, arguments);

      self.implement('parsers');
      self.implement('handlers');
    },

    'implement': function (type) {

      var self = this;
      var hiddenType = '_' + type;

      self[hiddenType] = {};
      _.each(self[type], function (Ctor, name) {
        self[hiddenType][name] = new Ctor(_.merge({}, self.options, {
          'watcher': self
        }));
      });
    },

    'watch': function (model) {

      var self = this;
      var attributes = model.attributes;

      self.assert('string', attributes.path, 'Cannot watch model without string as path');
      self.assert('string', attributes.type, 'Cannot watch model without string as type @ ' + attributes.path);
      self.assert('string', attributes.raw, 'Cannot watch model without string as raw @ ' + attributes.path);

      self.startWatching(process.cwd());
      self.parseDependencies(model);
    },

    'startWatching': function (path) {

      var self = this;

      if (!self.watching) {

        self.watching = self.filesystem.watchTree(path, self.handleChange);
      }
    },

    'destroy': function (argument) {

      var self = this;

      self.watching && self.watching();
      _super.destroy.apply(self, arguments);
    },

    'forceChange': function (paths) {

      var self = this;
      _.each(paths, self.handleChange);
    },

    'getPathType': function (path) {

      var self = this;

      if (self.filesystem.hasFileExtension(path, 'txt')) {
        return 'page';
      }
      else if (self.filesystem.hasFileExtension(path, 'tmpl')) {
        return 'template';
      }
      else if (self.filesystem.hasFileExtension(path, 'styl')) {
        return 'styleSheet';
      }
    },

    'forceChange': function (model) {

      var self = this;
      self.handleChange(model.attributes.path, {}, {}, 'modified');
    },

    'handleChange': function (path, before, after, type) {

      var self = this;
      if (path.indexOf(self.options.outputPath) >= 0) return;

      var graph = self.get(path) || [];
      var pathType = self.getPathType(path);
      var handler = self._handlers[pathType];

      handler && _.keys(after).length > 0 && self.logger.pending(self.namespace, 'A ' + pathType + ' file was ' + type + ', invalidating ' + graph.length + ' dependencies @ ' + path);

      return handler && handler[type](path, graph);
    },

    'parseDependencies': function (model) {

      var self = this;
      var started = new Date();
      var attributes = model.attributes;
      var type = attributes.type;
      var parser = self._parsers[type];

      if (parser) {

        var result = parser.parse(model, null, self);
        self.ensureForceChangeBindings();

        self.logger.lowSince(self.namespace, 'Parsed dependencies @ ' + model.attributes.path, started);

        return result;
      }
      else {
        throw new Error('No dependency parser exists for type "' + type + '"');
      }
    },

    'ensureForceChangeBindings': function () {

      var self = this;

      _.each(self.attributes, function (models, path) {
        _.each(models, function (model) {
          if (!model.forceChangeBinding) {
            model.forceChangeBinding = model.bindTo(model, 'force:change', self.forceChange);
          }
        });
      });
    },



    // 'watchAppBundle': function (url, data) {

    //   var self = this;
    //   var dependencies = [];

    //   function findNextAppBundle (haystack) {

    //     var matches = haystack.match(/define\("(\w|\/|\.)+"/);
    //     var match = matches && matches[0];

    //     if (match && typeof match === 'string') {
    //       dependencies.push(match.replace('define("', '').replace('"', ''));
    //       haystack = haystack.replace(match);
    //       findNextAppBundle(haystack);
    //     }
    //   }

    //   findNextAppBundle(data);

    //   self.register(url, 'appBundle', dependencies);
    // },
  });
});