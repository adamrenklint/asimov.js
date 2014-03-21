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
  '../updaters/TemplateHandler'

], function (Model, _, madge, StyleSheetParser, PageParser, TemplateParser, PageHandler, TemplateHandler) {

  var _super = Model.prototype;

  return Model.extend({

    'namespace': 'Watcher',

    'parsers': {

      'styleSheet': StyleSheetParser,
      'page': PageParser,
      'template': TemplateParser
    },

    'handlers': {

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
        self[hiddenType][name] = new Ctor(self.options);
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
    },

    'handleChange': function (path, before, after, type) {

      var self = this;
      var graph = self.get(path);
      var pathType = self.getPathType(path);
      return self._handlers[pathType][type](path);

      // if (graph && graph.length) {

      //   var logger = self.options.muteLog || self.logger.wait(self.namespace, 'A file was changed and invalidated ' + graph.length + ' other files @' + path);

      //   _.each(graph, function (dependency) {

      //     if (path.indexOf('.tmpl') > 0 && dependency.attributes.path.indexOf('.txt') > 0) {

      //       var template = dependency.template();
      //       template.fetch().done(function () {
      //         dependency.trigger('change:raw', dependency);
      //       });
      //     }
      //     else if (path.indexOf('.styl') > 0 && dependency.attributes.path.indexOf('.styl') > 0) {

      //       var model = self.options.styleSheets.find(function (sheet) {
      //         return sheet.attributes.path.indexOf(path) >= 0;
      //       });

      //       model.fetch().done(function () {
      //         dependency.trigger('change:raw', dependency);
      //       });
      //     }
      //     else {
      //       dependency.fetch(null, logger);
      //     }
      //   });
      // }
      // else if (path.indexOf('.txt') > 0) {
      //   self.options.pages.fetch();
      // }
    },

    'parseDependencies': function (model) {

      var self = this;
      var attributes = model.attributes;
      var type = attributes.type;
      var parser = self._parsers[type];

      var logger = self.options.logVerbose && self.logger.wait(self.namespace, 'Parsing dependencies @ ' + model.attributes.path);

      if (parser) {
        var result = parser.parse(model, null, self);
        logger && logger.nextAndDone();
        return result;
      }
      else {
        throw new Error('No dependency parser exists for type "' + type + '"');
      }
    }



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