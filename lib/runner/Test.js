var Base = require('../core/Base');
var RunnerInterface = require('./RunnerInterface');
var _ = require('lodash');
var npath = require('path');
var Mocha = require('mocha');
var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var _super = Base.prototype;
var mocha = new Mocha();

var runner = new RunnerInterface();

var isSetup = false;
function setup () {

  if (isSetup) {
    return;
  }

  isSetup = true;

  mocha.ui('bdd');

  // Setup the reporter - some good ones: dot, spec, progress
  mocha.reporter(process.env.REPORTER || 'spec');

  chai.use(sinonChai);
  global.should = chai.should();
  global.expect = chai.expect;
  global.sinon = sinon;
}

module.exports = Base.extend({}, {

  'run': function (name, callback) {

    var self = this;

    setup();
    describe(name, function () {
      callback(runner);
    });
  }
  // 'initialize': function () {

  //   var self = this;
  //   _super.initialize.apply(self, arguments);

  //   self.options.path = self.options.path || 'tests';
  //   self.options.tempPath = npath.join(process.cwd(), self.options.path, 'temp');

  //   console.log(self);
    // self.options.mocha = mocha;
    // self.options.mocha.realPaths = [];

    // self.runnerInterface = new RunnerInterface(self.options);
    // global.test = self.runnerInterface.test;

    // self.setup();

    // self.logger.pending('main', 'Loading asimov.js @ ' + self.options.pkg.version);
    // self.logger.log('main', 'The time is ' + new Date());

    // _.defer(self.bootstrap);
  // },

  // 'bootstrap': function () {

  //   var self = this;
  //   var meta = self.options.meta;

  //   self.logger.pending(self.namespace, 'Running tests for project "' + meta.name + '" @ ' + meta.version);

  //   self.runTestsInPath(self.options.path);
  // },

  // 'setup': function () {

  //   var self = this;



  //   var run = mocha.run.bind(mocha);
  //   mocha.run = _.debounce(function () {

  //     if (mocha.files.length) {
  //       run(self.stop);
  //     }
  //     else {
  //       self.noTestsExit();
  //     }

  //   }, 100);

  //   self.filesystem.forceExists(self.options.tempPath);
  // },

  // 'noTestsExit': function () {

  //   var self = this;
  //   var message = 'No test files found';
  //   var filter = self.options.filter;

  //   filter && (message += ' for "' + filter + '"');

  //   self.logger.info(self.namespace, message, false);
  //   self.stop(0);
  // },

  // 'stop': function (code) {

  //   var self = this;
  //   var tempPath = self.options.tempPath;

  //   self.filesystem.recursiveDelete(tempPath);
  //   process.exit(code);
  // },

  // 'runTestsInPath': function (path) {

  //   var self = this;

  //   if (!self.filesystem.isDirectory(path)) {
  //     throw new Error('Cannot start test runner, invalid path @ ' + path);
  //   }

  //   self.filesystem.readDirectory(path, self.runTest);
  // },

  // 'shouldTestFile': function (path) {

  //   var self = this;
  //   var filter = self.options.filter;

  //   if (filter && path.indexOf(filter) < 0) {
  //     return false;
  //   }

  //   return path.indexOf('.test.js') > 0;
  // },

  // 'runTest': function (path) {

  //   var self = this;

  //   mocha.files = mocha.files || [];
  //   mocha.realPaths = mocha.realPaths || [];
  //   mocha.run();

  //   if (self.filesystem.isDirectory(path)) {
  //     return self.runTestsInPath(path);
  //   }

  //   if (!self.shouldTestFile(path)) {
  //     return;
  //   }

  //   mocha.files.push(path);
  //   mocha.realPaths.push(path);
  // }
});