var bootstrap = require(process.cwd() + '/index');
var Test = require('../Test');

module.exports = function testCommand (next) {
  bootstrap.start(function () {
    var test = new Test();
    test.run(next);
  });
};