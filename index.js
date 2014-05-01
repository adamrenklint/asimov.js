// Public interface and bootstrap

process.env.PORT = process.env.PORT || 3003;

var Asimov = require('./lib/Asimov');
var asimov = module.exports = new Asimov({
  'root': process.cwd(),
  'frameworkDir': __dirname
});

//export public classes
// exports.Base = req(Base);

module.parent || asimov.start();