var Base = require('../core/Base');
var express = require('express');
var _ = require('lodash');
var npath = require('path');
var staticAsset = require('static-asset');
var _super = Base.prototype;

function numberWithCommas (x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

module.exports = Base.extend({

  'namespace': 'server',

  'initialize': function () {

    var self = this;
    _super.initialize.apply(self, arguments);

    self.middleware = {};

    self.errorCount = 0;
    self.requestCount = 0;
  },

  'start': function () {

    var self = this;
    var port = self.port = parseInt(process.env.PORT, 10) || 3003;
    self.logger.pending(self.namespace, 'Starting server @ http://127.0.0.1:' + port);

    var app = self.app = express();

    self.started = (new Date()).valueOf();

    app.use(function (req, res, next) {
      req.started = new Date();
      self.requestCount++;
      self.logger.low('server', 'Processing request @ '+ req.host + ':' + port + req.url);
      res.setHeader('X-Powered-By', 'asimov.js');
      next();
    });

    app.use(express.compress({
      threshold: 0
    }));

    app.use(staticAsset(self.options.outputPath, staticAsset.strategies.etag));
    app.use(express.static(self.options.outputPath));
    app.use(self.lazyLoadMiddleware);

    app.listen(port);

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

      self.logger.log(self.namespace, 'Running ' + time.trim() + ', received ' + numberWithCommas(self.requestCount) + ' requests and sent ' + numberWithCommas(self.requestCount - self.errorCount) + ' non-error responses', false);
    }

    self.delay(function () {
      self.logRunning(true);
    }, 1000 * 15);
  },

  'resolveMiddleware': function (url) {

    var self = this;
    var page = self.options.pages.get(url);

    var preMiddleware = ['Error', 'LanguageRedirector', 'Redirect'];
    var pageMiddleware = page && page.attributes && page.attributes.middleware || [];
    var configMiddleware = self.options.middleware;
    var postMiddleware = ['NotFound'];

    var allMiddleware = [].concat(preMiddleware, configMiddleware, pageMiddleware, postMiddleware);

    return _.map(allMiddleware, function (middleware) {
      return self.filesystem.findFirstMatch(middleware, self.options.paths.middleware) || middleware;
    });
  },

  'createMiddleware': function (constructor) {

    var self = this;

    return new constructor({
      'outputPath': self.options.outputPath,
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

        console.log('p', path)
        if (!self.filesystem.pathExists(path)) {
          return next(new Error('Invalid middleware configuration @ ' + path));
        }

        var Constructor = require(npath.join(process.cwd(), name));
        var instance = self.middleware[name] = self.createMiddleware(Constructor);
        instance.use(req, res, next);
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

    if (model.attributes.url === '/404' || model.attributes.url === '/error') {
      self.errorCount++;
    }

    res.logger && res.logger.nextAndDone();
  }
});