define([

  '../core/Base',
  'lodash',
  'requirejs',
  'zombie',
  'mocha',
  'URIjs',
  'path',
  '../vendor/wunderbits.core/public/lib/createUID',

], function (Base, _, requirejs, zombie, Mocha, uri, npath, createUID) {

  var _super = Base.prototype;
  var mocha = new Mocha();

  return Base.extend({

    'initialize': function () {

      var self = this;
      _super.initialize.apply(self, arguments);

      self.tests = {};
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

    'test': function (name, dependencies, callback) {

      var self = this;
      var fullPath = self.options.mocha.realPaths.shift();

      if (typeof name !== 'string') {
        throw new Error('Invalid test name');
      }

      if (!_.isArray(dependencies)) {
        callback = dependencies;
        dependencies = [];
      }
      else {
        dependencies = self.fixPaths(fullPath, dependencies);
      }

      if (typeof callback !== 'function') {
        throw new Error('Invalid test runner callback');
      }

      if (self.tests[name]) {
        return false;
      }

      self.tests[name] = (new Date()).valueOf();
      var displayName = process.env.LEGACY_RENDER ? name.bold : name.black.inverse.bold;

      describe(displayName, function () {

        before(function (done) {

          requirejs(dependencies, function () {

            self.deps = self.deps || {};

            _.each(_.toArray(arguments), function (dep, index) {

              var key = dependencies[index].split('/').pop();
              self.deps[key] = dep;
            });

            done();
          });
        });

        callback.call(global, self);
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

      var displayUrl = process.env.LEGACY_RENDER ? url : url.grey.inverse.bold;

      return describe(displayUrl, function () {

        this.timeout(5000);

        before(function (done) {

          this.browser = new zombie();
          this.browser.visit(url, done);
        });

        return (function () {

          return callback.apply(global, arguments);
        })();
      });
    },

    'itShouldThrowError': function (callback) {

      var self = this;
      self.it('should throw an error', function () {
        expect(callback).to.throw(Error);
      });
    }
  });
});