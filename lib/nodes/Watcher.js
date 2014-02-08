/*
  
  ▲ asimov.js watcher class

  sorts out app bundle and style sheet dependencies, 
  watches for changes and triggers re-rendering

*/

define([

  '../core/Base',
  '../core/Filesystem',
  'lodash',
  'madge'

], function (Base, Filesystem, _, madge) {

  var _super = Base.prototype;

  var filesystem = new Filesystem();

  return Base.extend({

    'namespace': 'Watcher',

    'initialize': function (options) {

      var self = this;
      _super.initialize.apply(self, arguments);

      self.registry = {};
    },

    'watch': function (url, type, data) {

      var self = this;

      if (url.indexOf('.js') > 0) {
        self.watchAppBundle(url, data);
      }
      else if (url.indexOf('.css') > 0) {
        self.watchStyleSheet(url, data);
      }
    },

    'watchStyleSheet': function (url, data) {

      var self = this;
      var dependencies = [];

      function findNextStyleSheet (haystack, filename) {

        var matches = haystack.match(/@import "(\w|\.)+"/);
        var match = matches && matches[0];
        var name;

        if (match && typeof match === 'string') {
          name = match.replace('@import "', '').replace('"', '');
          if (name.indexOf(self.options.paths.styles) < 0) {
            name = self.options.paths.styles + '/' + name;
          }

          var file = self.getStyleSheet(name);
          file && findNextStyleSheet(file.data, name);

          dependencies.push(name);
          haystack = haystack.replace(match);
          findNextStyleSheet(haystack, name);
        }
      }

      var file = self.getStyleSheet(url);
      findNextStyleSheet(file.data, file.name);

      self.register(url, 'styleSheet', dependencies);
    },

    'getStyleSheet': function (url) {

      var self = this;
      var filename = url.replace('.css', '.styl');
      if (filename[0] === '/') {
        filename = filename.replace('/', '');
      }

      return {
        'data': filesystem.readFile(filename),
        'name': filename
      };
    },

    'watchAppBundle': function (url, data) {

      var self = this;
      var dependencies = [];

      function findNextAppBundle (haystack) {

        var matches = haystack.match(/define\("(\w|\/|\.)+"/);
        var match = matches && matches[0];

        if (match && typeof match === 'string') {
          dependencies.push(match.replace('define("', '').replace('"', ''));
          haystack = haystack.replace(match);
          findNextAppBundle(haystack);
        }
      }

      findNextAppBundle(data);
      
      self.register(url, 'appBundle', dependencies);
    },

    'startWatching': function () {

      var self = this;
      if (self.watching) {
        return;
      }

      self.watching = true;
      filesystem.watchTree('./', self.handleChange);
    },

    'handleChange': function (changed) {

      var self = this;
      if (typeof changed !== 'string') {
        return;
      }

      changed = changed.replace('.js', '');

      var dependencies = self.registry[changed] || [];
      var dep, logger, name;

      while (dependencies.length) {

        dep = dependencies.shift();

        if (!logger || logger.isDone) {
          logger = self.logger.wait(self.namespace, 'The file "' + changed + '" changed and invalidated 0 ' + dep.nodeType + '(s)');
        }
        
        name = dep.url.replace('/applications/', '').replace('/Application.js', '').replace(self.options.paths.styles, '').replace('.css', '').replace('//', '');
      
        self.trigger('queue', {
          'nodeType': dep.nodeType,
          // TODO: gotta make this replace thing, and queue posting, work well with stylesheet paths
          'name': name,
          'url': dep.url
        });

        logger.nextAndDone();
      }
    },

    'register': function (url, type, dependencies) {

      var self = this;

      if (!self.watching) {
        self.startWatching();
      }

      var logger = self.logger.wait(self.namespace, 'Watching 0 files for changes @ ' + self.resolveUrl(url));

      function register (dep) {

        dep = self.resolveUrl(dep);

        if (!self.registry[dep]) {
          self.registry[dep] = [];
        }

        self.registry[dep].push({
          'url': url,
          'nodeType': type
        });

        logger.nextAndDone();
      }

      _.each(dependencies, register);

      register(url);
    },

    'resolveUrl': function (url) {

      if (url[0] === '/') {
        url = url.replace('/', '');
      }

      url = url.replace('.css', '.styl');
      url = url.replace('asimov/', 'framework/classes/');
      return url;
    }
  });
});