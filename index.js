// Public interface and bootstrap

var Asimov = require('./lib/bootstrap/Asimov');
var asimov = module.exports = new Asimov();

module.parent || asimov.start();