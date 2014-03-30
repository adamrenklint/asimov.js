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
    var displayName = process.env.LEGACY_RENDER ? name.bold : name.black.inverse.bold;

    setup();
    describe(displayName, function () {
      callback(runner);
    });
  }
});