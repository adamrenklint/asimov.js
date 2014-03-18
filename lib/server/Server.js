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
  'path',
  '../middleware/NotFound'

], function (Base, express, requirejs, _, npath, NotFound) {

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

      app.use(express.compress({
        threshold: 0
      }));

      var oneDay = 86400000;
      app.use(express.static(self.options.outputPath, {
        maxAge: oneDay
      }));

      app.use(self.lazyLoadMiddleware);

      app.listen(port);

      starting.nextAndDone();
      self.logRunning();

      return 'http://127.0.0.1:' + port;
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

        self.logger.info(self.namespace, 'Server has been running ' + time.trim() + ', received ' + self.requestCount + ' requests and sent ' + self.responseCount + ' non-error responses', false);
      }

      self.delay(function () {
        self.logRunning(true);
      }, 1000 * 15);
    },

    'resolveMiddleware': function (url) {

      var self = this;
      var page = self.options.pages.get(url);

      var preMiddleware = ['LanguageRedirector'];
      var pageMiddleware = page && page.attributes && page.attributes.middleware || [];
      var configMiddleware = self.options.middleware;
      var postMiddleware = ['DirectoryRouter', 'NotFound'];

      var allMiddleware = [].concat(preMiddleware, configMiddleware, pageMiddleware, postMiddleware);

      return _.map(allMiddleware, function (middleware) {
        return self.filesystem.findFirstMatch(middleware, self.options.paths.middleware) || middleware;
      });
    },

    'createMiddleware': function (constructor) {

      var self = this;

      return new constructor({
        'paths': self.options.paths,
        'pages': self.options.pages,
        'server': self,
        'localization': self.options.localization
      });
    },

    'lazyLoadMiddleware': function (req, res, next) {

      var self = this;

      self.requestCount++;

      var middleware = self.resolveMiddleware(req.url) || [];
      var originalNext = next;
      var middlewareName;

      next = function next (error) {

        if (error) {
          return originalNext(error);
        }

        var path = middleware.shift();
        var name = path.replace(/.js$/, '');

        if (!self.middleware[name]) {

          if (!self.filesystem.pathExists(path)) {
            return next(new Error('Invalid middleware configuration @ ' + path));
          }

          requirejs([name], function (constructor) {

            var instance = self.middleware[name] = self.createMiddleware(constructor);

            instance.use(req, res, next);
          });
        }
        else {
          self.middleware[name].use(req, res, next);
        }
      };

      next();
    },

    'respond': function (model, res) {

      var self = this;
      var type = model.attributes.type;
      var data = model.attributes.rendered || model.attributes.data;

      if (type === 'appBundle') {
        res.set('Content-Type', 'application/javascript');
        res.end(data);
      }
      else if (type === 'styleSheet') {
        res.set('Content-Type', 'text/css');
        res.end(data);
      }
      else {
        res.send(data);
      }

      self.responseCount++;
      res.logger && res.logger.nextAndDone();
    }
  });
});