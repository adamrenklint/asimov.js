var asimov = require('../../index');

var commandPath = asimov.fs.findFirstMatch('node_modules/asimov-test/lib/Command.js', [process.cwd()]);
var Command = commandPath && require(commandPath);

module.exports = function startCommand (next) {
  asimov.start(function () {

    if (!Command) return asimov.error('asimov-test is not installed');

    var test = new Command();
    test.run(next);
  });
};
