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
  'chai',
  'sinon',
  'sinon-chai'

], function (Base, Signature, RunnerInterface, _, npath, Mocha, chai, sinon, sinonChai) {

  var _super = Base.prototype;
  var mocha = new Mocha();

  return Base.extend({

    'namespace': 'Runner',

    'initialize': function () {

      var self = this;
      _super.initialize.apply(self, arguments);

      self.options.path = self.options.path || 'tests';
      self.options.tempPath = npath.join(process.cwd(), self.options.path, 'temp');
      self.options.mocha = mocha;
      self.options.mocha.realPaths = [];

      self.logger.log('init;' + self.options.path + self.options.tempPath);


      self.runnerInterface = new RunnerInterface(self.options);
      global.test = self.runnerInterface.test;

      self.setup();

      var signature = new Signature(self.options);
      signature.animate(self.bootstrap);
    },

    'bootstrap': function () {

      var self = this;
      var meta = self.options.meta;

      self.logger.startTimer();

      var startString = 'Running tests for project "' + meta.name + '" @ ' + meta.version;
      var starting = self.logger.info(self.namespace, startString.bold, false);
      self.logger.info(self.namespace, 'The time is ' + new Date(), false);

      self.runTestsInPath(self.options.path);
    },

    'setup': function () {

      var self = this;

      mocha.ui('bdd');

      // Setup the reporter - some good ones: dot, spec, progress
      // TODO: options to override this with flags
      if (process.env.LEGACY_RENDER) {
        mocha.reporter('spec');
      }
      else {
        mocha.reporter('progress');
      }

      chai.use(sinonChai);
      global.should = chai.should();
      global.expect = chai.expect;
      global.sinon = sinon;

      var run = mocha.run.bind(mocha);
      mocha.run = _.debounce(function () {
        run(self.stop);
      }, 100);

      self.logger.log('force exists ? ' + self.options.tempPath);
      self.filesystem.forceExists(self.options.tempPath);
      process.exit(1);
    },

    'stop': function (code) {

      var self = this;
      var tempPath = self.options.tempPath;

      // self.filesystem.recursiveDelete(tempPath);
      process.exit(code || 0);
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