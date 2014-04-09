var Base = require('../core/Base');
var Config = require('../core/Config');
var express = require('express');
var _ = require('lodash');
var npath = require('path');
var staticAsset = require('static-asset');
var _super = Base.prototype;
var livereload = require('express-livereload');
var cluster = require('cluster');

module.exports = Base.extend({

  'namespace': 'server',

  'initialize': function () {

    var self = this;
    _super.initialize.apply(self, arguments);

    // self.middleware = {};

    var config = self.config = new Config(_.merge({}, self.options, {
      'muteLog': true
    }));
    config.json.outputPath = config.json.paths.outputDir;
    self.options = config.json;

    self.start();
  },

  'start': function () {

    var self = this;
    var port = self.port = self.options.port || parseInt(process.env.PORT, 10) || 3003;

    var app = self.app = express();

    if (process.env.ENV !== 'production') {
      // Kind of a hack, since we only want to run livereload once,
      // running on one port. Will work on everything served from
      // each server fork though, since they all include the js file
      try {
        livereload(app, {
          'watchDir': self.options.outputPath
        });
      }
      catch (e) {}
    }

    app.use(function (req, res, next) {
      if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', [
          'Content-Type'
        ]);
        res.end();
      }
      else {
        next();
      }
    });

    app.use(function (req, res, next) {
      self.requestCount++;
      res.setHeader('X-Powered-By', 'asimov.js');
      next();
    });

    app.use(express.compress({
      threshold: 0
    }));

    app.use(staticAsset(self.options.outputPath, staticAsset.strategies.etag));
    app.use(express.static(self.options.outputPath));
    // app.use(self.lazyLoadMiddleware);

    app.listen(port);
    self.logToMaster();
  },

  'logToMaster': function () {

    var self = this;
    var timeout = self.options.server.workerLogInterval;

    process.send({
      'pid': cluster.worker.process.pid,
      'requestCount': self.requestCount
    });

    self.requestCount = 0;

    self.delay(function () {
      self.logToMaster();
    }, 1000 * timeout);
  },

  // 'resolveMiddleware': function (url) {

  //   var self = this;
  //   var page;// = self.options.pages.get(url);

  //   var preMiddleware = ['Error', 'LanguageRedirector', 'Redirect'];
  //   var pageMiddleware = page && page.attributes && page.attributes.middleware || [];
  //   var configMiddleware = self.options.middleware;
  //   var postMiddleware = ['NotFound'];

  //   var allMiddleware = [].concat(preMiddleware, configMiddleware, pageMiddleware, postMiddleware);

  //   return _.map(allMiddleware, function (middleware) {
  //     return self.filesystem.findFirstMatch(middleware + '.js', self.options.paths.middleware) || middleware;
  //   });
  // },

  // 'createMiddleware': function (constructor) {

  //   var self = this;

  //   return new constructor({
  //     'outputPath': self.options.outputPath,
  //     'paths': self.options.paths,
  //     'pages': self.options.pages,
  //     'server': self,
  //     'localization': self.options.localization
  //   });
  // },

  // 'lazyLoadMiddleware': function (req, res, next) {

  //   var self = this;

  //   self.requestCount++;

  //   var middleware = self.resolveMiddleware(req.url) || [];
  //   var originalNext = next;
  //   var middlewareName;

  //   next = function next (error) {

  //     if (error) {
  //       return originalNext(error);
  //     }

  //     var path = middleware.shift();
  //     var name = path.replace(/.js$/, '');

  //     if (!self.middleware[name]) {

  //       if (!self.filesystem.pathExists(path)) {
  //         return next(new Error('Invalid middleware configuration @ ' + path));
  //       }

  //       var Constructor = require(name);
  //       var instance = self.middleware[name] = self.createMiddleware(Constructor);
  //       instance.use(req, res, next);
  //     }
  //     else {
  //       self.middleware[name].use(req, res, next);
  //     }
  //   };

  //   next();
  // },

  // 'respond': function (model, res) {

  //   var self = this;
  //   var type = model.attributes.type;
  //   var data = model.attributes.rendered || model.attributes.data;

  //   if (type === 'appBundle') {
  //     res.set('Content-Type', 'application/javascript');
  //     res.end(data);
  //   }
  //   else if (type === 'styleSheet') {
  //     res.set('Content-Type', 'text/css');
  //     res.end(data);
  //   }
  //   else {
  //     res.send(data);
  //   }

  //   if (model.attributes.url === '/404' || model.attributes.url === '/error') {
  //     self.errorCount++;
  //   }

  //   res.logger && res.logger.nextAndDone();
  // }
});