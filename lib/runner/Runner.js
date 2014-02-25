/*

  test runner bootstrap class

*/

define([

  '../core/Base',
  '../core/Signature',
  './RunnerInterface',
  'lodash',
  'path',
  'mocha',
  'chai'

], function (Base, Signature, RunnerInterface, _, path, Mocha, chai) {

  var _super = Base.prototype;
  var mocha = new Mocha();

  return Base.extend({

    'namespace': 'Runner',

    'initialize': function () {

      var self = this;
      _super.initialize.apply(self, arguments);

      self.options.path = self.options.path || 'tests';
      self.options.mocha = mocha;
      self.options.mocha.realPaths = [];

      self.runnerInterface = new RunnerInterface(self.options);
      global.test = self.runnerInterface.test;

      self.setupMocha();

      var signature = new Signature(self.options);
      signature.animate(self.bootstrap);
    },

    'bootstrap': function () {

      var self = this;
      var meta = self.options.meta;

      self.logger.startTimer();

      var startString = 'Running tests for "' + meta.name + '" @ ' + meta.version;
      var starting = self.logger.info(self.namespace, startString.bold, false);
      self.logger.info(self.namespace, 'The time is ' + new Date(), false);

      self.runTestsInPath(self.options.path);
    },

    'setupMocha': function () {

      var self = this;

      mocha.ui('bdd');
      mocha.reporter('spec');
      //mocha.reporter('dot');

      global.should = chai.should();
      global.expect = chai.expect;

      var run = mocha.run.bind(mocha);
      mocha.run = _.debounce(function () {
        run(process.exit);
      }, 100);
    },

    'runTestsInPath': function (path) {

      var self = this;

      if (!self.filesystem.isDirectory(path)) {
        throw new Error('Cannot start test runner, invalid path @ ' + path);
      }

      self.filesystem.readDirectory(path, self.runTest);
    },

    'shouldTestFile': function (path) {

      var self = this;
      var filter = self.options.filter;

      if (filter && path.indexOf(filter) < 0) {
        return false;
      }

      return path.indexOf('.test.js') > 0;
    },

    'runTest': function (path) {

      var self = this;

      if (self.filesystem.isDirectory(path)) {
        return self.runTestsInPath(path);
      }

      if (!self.shouldTestFile(path)) {
        return;
      }

      mocha.files = mocha.files || [];
      mocha.realPaths = mocha.realPaths || [];
      mocha.files.push(path);
      mocha.realPaths.push(path);

      mocha.run();
    }
  });
});