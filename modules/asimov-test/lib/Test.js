var Klass = require('../../asimov-core').Klass;
var _super = Klass.prototype;

var RunnerInterface = require('./RunnerInterface');
var _ = require('lodash');
var npath = require('path');
var Mocha = require('mocha');
var chai = require('chai');
var colors = require('colors');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var mocha = new Mocha();

var runner;

var isSetup = false;
function setup () {

  if (isSetup) {
    return;
  }

  isSetup = true;

  runner = new RunnerInterface();

  mocha.ui('bdd');

  // Setup the reporter - some good ones: dot, spec, progress
  mocha.reporter(process.env.REPORTER || 'spec');

  chai.use(sinonChai);
  global.should = chai.should();
  global.expect = chai.expect;
  global.sinon = sinon;
}

module.exports = Klass.extend({

  'run': function (name, callback) {

    var self = this;
    var displayName = process.env.LEGACY_RENDER ? name.bold : name.black.inverse.bold;

    setup();
    describe(displayName, function () {
      callback(runner);
    });
  }
});