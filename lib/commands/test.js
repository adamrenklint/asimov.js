var bootstrap = require('../../index');

// Loading the command directly takes 100ms instead of 700ms
var Test = require('../../node_modules/asimov-test/lib/Command');
// var Test = require('asimov-test').Command;

module.exports = function startCommand (next) {
  bootstrap.start(function () {
    var test = new Test();
    test.run(next);
  });
};
