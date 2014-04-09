var Base = require('../core/Base');
var PageNodesCollection = require('../nodes/PageNodesCollection');
var Config = require('../core/Config');
var express = require('express');
var _ = require('lodash');
var npath = require('path');
var staticAsset = require('static-asset');
var _super = Base.prototype;
var livereload = require('express-livereload');
var cluster = require('cluster');

var NotFound = require('../middleware/NotFound');

module.exports = Base.extend({

  'namespace': 'server',

  'initialize': function () {

    var self = this;
    _super.initialize.apply(self, arguments);

    self.bindTo(process, 'message', 'onMessage');
    self.middleware = {};

    var config = self.config = new Config(_.merge({}, self.options, {
      'muteLog': true
    }));
    config.json.outputPath = config.json.paths.outputDir;
    self.options = config.json;

    self.pages = new PageNodesCollection(null, self.options);
    self.start();
  },

  'onMessage': function (data) {

    var self = this;

    var existing = self.pages.get(data.url);
    if (existing) {
      existing.set(data);
    }
    else {
      self.pages.add(data);
    }
  },

  'start': function () {

    var self = this;
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
    app.use(self.lazyLoadMiddleware);
    app.use(express.static(self.options.outputPath));

    var notFound = new NotFound(self.options);
    app.use(notFound.use);

    app.listen(self.options.port);
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

  'resolveMiddleware': function (url) {

    var self = this;
    var page = self.pages.get(url);

    var preMiddleware = ['LanguageRedirector', 'Redirect'];
    var configMiddleware = self.options.middleware;
    var pageMiddleware = page && page.attributes && page.attributes.middleware || [];

    var allMiddleware = [].concat(preMiddleware, configMiddleware, pageMiddleware);

    return _.map(allMiddleware, function (middleware) {
      return self.filesystem.findFirstMatch(middleware + '.js', self.options.paths.middleware) || middleware;
    });
  },

  'createMiddleware': function (constructor) {

    var self = this;

    return new constructor({
      'outputPath': self.options.outputPath,
      'paths': self.options.paths,
      'pages': self.pages,
      'server': self,
      'localization': self.options.localization
    });
  },

  'lazyLoadMiddleware': function (req, res, next) {

    var self = this;

    var middleware = self.resolveMiddleware(req.url) || [];
    var originalNext = next;
    var middlewareName;

    next = function next (error) {

      if (error || !middleware.length) {
        return originalNext(error);
      }

      var path = middleware.shift() || '';
      var name = path.replace(/.js$/, '');

      if (!name) {
        return next();
      }

      if (!self.middleware[name]) {

        if (!self.filesystem.pathExists(path)) {
          return next(new Error('Invalid middleware configuration @ ' + path));
        }

        var Constructor = require(name);
        var instance = self.middleware[name] = self.createMiddleware(Constructor);
        instance.use(req, res, next);
      }
      else {
        self.middleware[name].use(req, res, next);
      }
    };

    next();
  }
});