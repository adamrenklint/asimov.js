var bootstrap = require('../../index');
var Test = require('asimov-test').Command;

module.exports = function startCommand (next) {
  bootstrap.start(function () {
    var test = new Test();
    test.run(next);
  });
};
