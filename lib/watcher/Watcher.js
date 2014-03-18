/*

  watcher model class

  parses raw data, creates dependency graphs and
  triggers new fetch of data from disk on change

*/

define([

  '../core/Model',
  'lodash',
  'madge',
  './StyleSheetParser',
  './PageParser',
  './TemplateParser'

], function (Model, _, madge, StyleSheetParser, PageParser, TemplateParser) {

  var _super = Model.prototype;

  return Model.extend({

    'namespace': 'Watcher',

    'parsers': {

      'styleSheet': StyleSheetParser,
      'page': PageParser,
      'template': TemplateParser
    },

    'initialize': function () {

      var self = this;
      _super.initialize.apply(self, arguments);

      self._parsers = {};
      _.each(self.parsers, function (Parser, type) {
        self._parsers[type] = new Parser(self.options);
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

    'handleChange': function (path) {

      var self = this;
      var graph = self.get(path);

      if (graph && graph.length) {

        var logger = self.logger.wait(self.namespace, 'A file was changed and invalidated ' + graph.length + ' other files @' + path);

        _.each(graph, function (dependency) {

          if (path.indexOf('.tmpl') > 0 && dependency.attributes.path.indexOf('.txt') > 0) {

            var template = dependency.template();
            template.fetch().done(function () {
              dependency.trigger('change:raw', dependency);
            });
          }
          else if (path.indexOf('.styl') > 0 && dependency.attributes.path.indexOf('.styl') > 0) {

            var model = self.options.styleSheets.find(function (sheet) {
              return sheet.attributes.path.indexOf(path) >= 0;
            });

            model.fetch().done(function () {
              dependency.trigger('change:raw', dependency);
            });
          }
          else {
            dependency.fetch(null, logger);
          }
        });
      }
      else if (path.indexOf('.txt') > 0) {
        self.options.pages.fetch();
      }
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




    // 'watch': function (url, type, data) {

    //   var self = this;
    //   return;

    //   if (url.indexOf('.js') > 0) {
    //     self.watchAppBundle(url, data);
    //   }
    //   else if (url.indexOf('.css') > 0) {
    //     self.watchStyleSheet(url, data);
    //   }
    // },



    //

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

    // 'startWatching': function () {

    //   var self = this;
    //   if (self.watching) {
    //     return;
    //   }

    //   self.watching = true;
    //   self.filesystem.watchTree('./', self.handleChange);
    // },

    // 'handleChange': function (changed) {

    //   var self = this;
    //   if (typeof changed !== 'string') {
    //     return;
    //   }

    //   if (changed.indexOf(self.options.paths.configs) >= 0) {

    //     throw new Error('Config file ' + changed + ' was changed, crashing server process');
    //   }

    //   changed = changed.replace('.js', '');

    //   var dependencies = self.registry[changed] || [];
    //   var dep, logger, name;

    //   while (dependencies.length) {

    //     dep = dependencies.shift();

    //     if (!logger || logger.isDone) {
    //       logger = self.logger.wait(self.namespace, 'The file "' + changed + '" changed and invalidated 0 ' + dep.nodeType + '(s)');
    //     }

    //     name = dep.url.replace('/applications/', '').replace('/Application.js', '').replace(self.options.paths.styles, '').replace('.css', '').replace('//', '');

    //     self.trigger('queue', {
    //       'nodeType': dep.nodeType,
    //       // TODO: gotta make this replace thing, and queue posting, work well with stylesheet paths
    //       'name': name,
    //       'url': dep.url
    //     });

    //     logger.nextAndDone();
    //   }
    // },

    // 'register': function (url, type, dependencies) {

    //   var self = this;

    //   if (!self.watching) {
    //     self.startWatching();
    //   }

    //   var logger = self.logger.wait(self.namespace, 'Watching 0 file(s) for changes @ ' + self.resolveUrl(url));

    //   function register (dep) {

    //     dep = self.resolveUrl(dep);

    //     if (!self.registry[dep]) {
    //       self.registry[dep] = [];
    //     }

    //     self.registry[dep].push({
    //       'url': url,
    //       'nodeType': type
    //     });

    //     logger.nextAndDone();
    //   }

    //   _.each(dependencies, register);

    //   register(url);
    // },

    // 'resolveUrl': function (url) {

    //   if (url[0] === '/') {
    //     url = url.replace('/', '');
    //   }

    //   url = url.replace('.css', '.styl');
    //   url = url.replace('asimov/', 'framework/classes/');
    //   return url;
    // }
  });
});