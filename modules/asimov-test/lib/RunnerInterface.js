var Klass = require('../../asimov-core').Klass;
var _super = Klass.prototype;

var AssertionHelper = require('./AssertionHelper');
var _ = require('lodash');
var zombie = require('zombie');
var Mocha = require('mocha');
var npath = require('path');
var child = require('child_process');
var createUID = require('wunderbits.core').lib.createUID;

var tempPath = npath.join(process.cwd(), 'tests/temp');

var Filesystem = require('../../asimov-core').Filesystem;
var filesystem = new Filesystem();

function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var mocha = new Mocha();

module.exports = Klass.extend({

  'initialize': function () {

    var self = this;
    _super.initialize.apply(self, arguments);

    filesystem.forceExists(tempPath);

    self.itShould = new AssertionHelper({
      'test': self
    });
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

    if (typeof name === 'function') {
      return name();
    }

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
      url = 'http://127.0.0.1:' + (process.env.PORT || 3003) + url;
    }

    var displayUrl = process.env.LEGACY_RENDER ? url : url.grey.inverse.bold;

    return describe(displayUrl, function () {

      before(function (done) {

        var _self = this;
        this.timeout(15 * 1000);

        _self.browser = new zombie();
        _self.browser.visit(url, done);
      });

      return (function () {

        return callback.apply(global, arguments);
      })();
    });
  }
});