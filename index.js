// Public interface and bootstrap

var Asimov = require('./lib/Asimov');
var asimov = module.exports = new Asimov({
  'root': process.cwd(),
  'frameworkDir': __dirname
});

//export public classes
// exports.Base = req(Base);

module.parent || asimov.start();