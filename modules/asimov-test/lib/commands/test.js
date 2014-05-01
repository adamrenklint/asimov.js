var bootstrap = require(process.cwd() + '/index');
var Command = require('../Command');

module.exports = function testCommand (next) {
  bootstrap.start(function () {
    var command = new Command();
    command.run(next);
  });
};