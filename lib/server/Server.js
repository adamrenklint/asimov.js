/*

  server class

  abstracts an express server
  automatically hooks up framework and application middleware

*/

define([

  '../core/Base',
  'express',
  'requirejs',
  'lodash',
  'path'

], function (Base, express, requirejs, _, npath) {

  var _super = Base.prototype;

  return Base.extend({

    'namespace': 'Server',

    'initialize': function () {

      var self = this;
      _super.initialize.apply(self, arguments);

      self.middleware = {};

      self.responseCount = 0;
      self.requestCount = 0;
    },

    'start': function () {

      var self = this;

      self.available = self.options.map;

      var app = self.app = express();
      var port = parseInt(process.env.PORT, 10) || 3003;

      var starting = self.logger.wait(self.namespace, ('Starting server @ http://127.0.0.1:' + port).bold, true);

      self.started = (new Date()).valueOf();

      app.use(self.lazyLoadMiddleware);
      app.listen(port);

      self.logRunning();

      starting.done();
    },

    'logRunning': function (display) {

      var self = this;

      if (display) {

        var now = (new Date()).valueOf();
        var delta = (now - self.started) / 1000;
        var days = Math.floor(delta / 86400);
        var hours = Math.floor(delta / 3600) % 24;
        var minutes = Math.floor(delta / 60) % 60;
        var seconds = Math.round(delta % 60);

        var time = '';
        days && (time += days + 'd ');
        hours && (time += hours + 'h ');
        minutes && (time += minutes + 'm ');
        seconds && (time += seconds + 's ');

        self.logger.info(self.namespace, 'Server has been running for ' + time.trim() + ', received ' + self.requestCount + ' requests and sent ' + self.responseCount + ' non-error responses');
      }

      self.delay(function () {
        self.logRunning(true);
      }, 1000 * 60);
    },

    'resolveMiddleware': function (url) {

      var self = this;
      var page = self.options.pages.get(url);

      if (page && page.attributes && page.attributes.middleware) {
        return page.attributes.middleware;
      }

      return [];
    },

    'lazyLoadMiddleware': function (req, res, next) {

      var self = this;

      self.requestCount++;

      var frameworkPath = self.options.frameworkDir + '/middleware/';
      var middleware = [frameworkPath + 'LanguageRedirector'];
      middleware = middleware.concat(self.resolveMiddleware(req.url) || []);
      var applicationPath = self.options.paths.middleware;
      var originalNext = next;
      var middlewareName;

      middleware.push(frameworkPath + 'CacheRouter');
      middleware.push(frameworkPath + 'DirectoryRouter');
      middleware.push(frameworkPath + 'NotFound');

      next = function next (error) {

        if (error) {
          return originalNext(error);
        }

        var name = middleware.shift();

        if (!self.middleware[name]) {

          var path = npath.join(process.cwd(), name + '.js');

          if (!self.filesystem.pathExists(path)) {
            return next(new Error('Invalid middleware configuration @ ' + path));
          }

          requirejs([name], function (constructor) {

            var instance = self.middleware[name] = new constructor({
              'pages': self.options.pages,
              'cache': self.options.paths,
              'server': self,
              'localization': self.options.localization
            });

            instance.handle(req, res, next);
          });
        }
        else {
          self.middleware[name].handle(req, res, next);
        }
      };

      next();
    },

    'respond': function (model, res) {

      var self = this;

      // if (data.type === 'appBundle') {

      //   res.set('Content-Type', 'application/javascript');
      //   res.end(data.content);

      // }
      // else if (data.type === 'styleSheet') {

      //   res.set('Content-Type', 'text/css');
      //   res.end(data.content);
      // }
      // else {
        res.send(model.attributes.rendered);
      // }

      self.responseCount++;
      res.logger && res.logger.nextAndDone();
    }
  });
});