/*

  watcher class

  sorts out app bundle and style sheet dependencies,
  watches for changes and triggers re-rendering

*/

define([

  '../core/Base',
  'lodash',
  'madge'

], function (Base, _, madge) {

  var _super = Base.prototype;

  return Base.extend({

    'namespace': 'Watcher',

    'initialize': function (options) {

      var self = this;
      _super.initialize.apply(self, arguments);

      self.registry = {};
    },

    'watch': function (url, data, output) {

      var self = this;
      var type = data.nodeType;
      url = url.replace(/\/\//g, '/');

      if (url.indexOf('.js') > 0) {
        self.watchAppBundle(url, output, data);
      }
      else if (url.indexOf('.css') > 0) {
        self.watchStyleSheet(url, output, data);
      }
      else if (type === 'page') {
        self.watchPage(url, output, data);
      }
    },

    'watchPage': function (url, output, data) {

      var self = this;
      var dependencies = [];
      var contentDir = self.options.paths.content;
      var templateDir = self.options.paths.templates;

      var path = (self.options.realPaths[url] || url) + '/' + data.meta.template + '.txt';
      dependencies.push(path);
      dependencies.push(templateDir + '/' + data.meta.template + '.tmpl');

      self.register(url, 'page', dependencies);
      // console.log(self.registry);process.exit(1);
    },

    'watchStyleSheet': function (url, output, data) {

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
        'data': self.filesystem.readFile(filename),
        'name': filename
      };
    },

    'watchAppBundle': function (url, output, data) {

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

      findNextAppBundle(output);

      self.register(url, 'appBundle', dependencies);
    },

    'startWatching': function () {

      var self = this;
      if (self.watching) {
        return;
      }

      self.watching = true;
      self.filesystem.watchTree('./', self.handleChange);
    },

    'getTypeFromPath': function (path) {

      var self = this;

      if (path.indexOf('.tmpl') > 0) {
        return 'template';
      }

      if (path.indexOf('.js') > 0) {
        return 'appBundle';
      }

      if (path.indexOf(self.options.paths.content) === 0) {
        return 'page';
      }


      console.log(path);process.exit(1)
    },

    // 'templateWasChanged': function (path) {

    //   var self = this;
    //   self.trigger('changed:template');
    //   self.forDependenciesOf(path, self.triggerQueue);
    // },

    // 'pageWasChanged': function (path) {

    //   var self = this;
    //   self.trigger()
    //   console.log(path);process.exit(1)
    // },

    'triggerQueue': function (job) {

      var self = this;
      var name = job.url.replace('/applications/', '').replace('/Application.js', '').replace(self.options.paths.styles, '').replace('.css', '').replace('//', '');

      self.logger.log('triggerQueue:' + job.nodeType + ' >>> ' + name + ' ::: ' + job.url);

      self.trigger('queue', {
        'nodeType': job.nodeType,
        'name': name,
        'url': job.url
      });
    },

    'forDependenciesOf': function (path, callback) {

      var self = this;
      var dependencies = self.registry[path] || [];
      var loggers = {};

      while (dependencies.length) {

        dep = dependencies.shift();

        if (!loggers[dep.nodeType] || loggers[dep.nodeType].isDone) {
          loggers[dep.nodeType] = self.logger.wait(self.namespace, 'The file "' + path + '" changed and invalidated 0 ' + dep.nodeType + '(s)');
        }

        callback(dep);

        loggers[dep.nodeType].nextAndDone();
      }
    },

    'handleChange': function (changed) {

      var self = this;
      if (typeof changed !== 'string') {
        return;
      }

      if (changed.indexOf(self.options.paths.configs) >= 0) {

        throw new Error('Config file ' + changed + ' was changed, crashing server process');
      }

      var type = self.getTypeFromPath(changed);
      self.trigger('changed:' + type, changed);

      self.forDependenciesOf(changed, self.triggerQueue);

      return;
      // var strategy = self[type + 'WasChanged'];

      // if (typeof strategy !== 'function') {
      //   throw new Error('Invalid change handler for type ' + type);
      // }

      // return strategy(changed);


      changed = changed.replace('.js', '');
      changed = changed.replace(self.options.paths.content + '/', '');

      var dependencies = self.registry[changed] || [];
      var dep, logger, name;

      // console.log(changed, dependencies);console.log(self.registry);process.exit(1);

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

      var logger = self.logger.wait(self.namespace, 'Watching 0 file(s) for changes @ ' + self.resolveUrl(url));

      function register (dep) {

        dep = self.resolveUrl(dep);

        self.logger.log('register:' + dep);

        if (!dep) {
          return;
        }

        if (!self.registry[dep]) {
          self.registry[dep] = [];
        }

        var existing = _.find(self.registry[dep], function (_dep) {

          return _dep.url === url;
        });

        if (!existing) {
          self.registry[dep].push({
            'url': url,
            'nodeType': type
          });

          logger.nextAndDone();
        }
      }

      _.each(dependencies, register);

      self.logger.json(self.registry)
    },

    'resolveUrl': function (url) {

      if (url.indexOf('.') > 0 && url[0] === '/') {
        url = url.replace('/', '');
      }

      url = url.replace('.css', '.styl');
      url = url.replace('asimov/', 'framework/classes/');
      return url;
    }
  });
});