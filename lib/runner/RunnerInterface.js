var Base = require('../core/Base');
var AssertionHelper = require('./AssertionHelper');
var _ = require('lodash');
var zombie = require('zombie');
var Mocha = require('mocha');
var npath = require('path');
var child = require('child_process');
var Loader = require('../core/Loader');
var createUID = require('../../node_modules/wunderbits.core/public/lib/createUID');

function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var _super = Base.prototype;
var mocha = new Mocha();

var port = getRandomInt(3000, 3999);
var _server = child.exec('PORT=' + port + ' LEGACY_RENDER=true node main.js');
var started = (new Date()).valueOf();
var server;

module.exports = Base.extend({

  // TODO: this has to be done better - we need to just wait until it's all rendered, the server must emit an event - probably gonna have to use child.spawn, and mute the logger instead of child.exec
  'serverDelay': process.env.TRAVIS ? 10000 : 5000,

  'initialize': function () {

    var self = this;
    _super.initialize.apply(self, arguments);

    self.options.tempPath = npath.join(process.cwd(), 'tests/temp');
    self.tests = {};

    self.itShould = new AssertionHelper({
      'test': self
    });

    if (!server) {

      server = self.deferred();
      var lapsed = (new Date()).valueOf() - started;
      var delay = self.serverDelay - lapsed;
      setTimeout(function () {
        server.resolve();
      }, delay);
    }
  },

  'fixPaths': function (realPath, paths) {

    var self = this;
    realPath = _.initial(realPath.split('/')).join('/');

    _.each(paths, function (path, index) {
      if (path.indexOf('/') > 0) {
        path = realPath + '/' + path;
        paths[index] = path;
      }
    });

    return paths;
  },

  'writeTempFile': function (path, content) {

    var self = this;

    if (!path || typeof path !== 'string') {
      throw new Error('Cannot write temporary file, invalid path @ ' + path);
    }

    if (!content) {
      throw new Error('Cannot write temporary file, no content provided @ ' + path);
    }

    var tempPath = self.options.tempPath;
    path = npath.join(tempPath, path);

    return self.filesystem.writeFile(path, content);
  },

  'getTempFilename': function () {

    return createUID();
  },

  'removeTempFile': function (path, wait) {

    var self = this;

    if (wait !== false) {
      wait = true;
    }

    if (!path || typeof path !== 'string') {
      throw new Error('Cannot remove temporary file, invalid path @ ' + path);
    }

    var tempPath = self.options.tempPath;
    path = npath.join(tempPath, path);

    if (wait && !self.filesystem.pathExists(path)) {
      return setTimeout(function () {
        self.removeTempFile(path, wait);
      }, 100);
    }

    return self.filesystem.recursiveDelete(path);
  },

  'before': function (callback) {

    return before(callback);
  },

  'beforeEach': function (callback) {

    return beforeEach(callback);
  },

  'after': function (callback) {

    return after(callback);
  },

  'afterEach': function (callback) {

    return afterEach(callback);
  },

  'when': function (name, callback) {

    var self = this;
    return describe('when ' + name, callback);
  },

  'spec': function (name, callback) {

    var self = this;

    if (!process.env.LEGACY_RENDER) {
      name = name.grey.inverse.bold;
    }

    return describe(name, callback);
  },

  'it': function (message, callback) {

    var self = this;

    if (!message || typeof message !== 'string') {
      throw new Error('Message is not a string');
    }

    if (message.indexOf('it') !== 0) {
      message = 'it ' + message;
    }

    return it.call(global, message, callback);
  },

  'integration': function (url, callback) {

    var self = this;

    if (!url || typeof url !== 'string') {
      throw new Error('Message is not a string');
    }

    if (!callback || typeof callback !== 'function') {
      return;
    }

    if (url.indexOf('http') < 0) {
      url = 'http://localhost:' + port + url;
    }

    var displayUrl = process.env.LEGACY_RENDER ? url : url.grey.inverse.bold;

    return describe(displayUrl, function () {

      this.timeout(self.serverDelay * 2);

      before(function (done) {

        var _self = this;

        server.done(function () {
          _self.browser = new zombie();
          _self.browser.visit(url, done);
        });
      });

      return (function () {

        return callback.apply(global, arguments);
      })();
    });
  }
});