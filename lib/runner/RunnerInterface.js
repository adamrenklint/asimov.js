define([

  '../core/Base',
  'lodash',
  'requirejs',
  'zombie',
  'mocha',
  'URIjs',
  'path'

], function (Base, _, requirejs, zombie, Mocha, uri, npath) {

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
        path = realPath + '/' + path;
        paths[index] = path;
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

      if (!process.env.LEGACY_RENDER) {
        name = name.black.inverse;
      }

      describe(name.bold, function () {

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

      if (!process.env.LEGACY_RENDER) {
        url = url.grey.inverse.bold;
      }

      return describe(url, function () {

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
  });
});