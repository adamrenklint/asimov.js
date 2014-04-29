//copied over to make tests run with old runner

var Asimov = require('./lib/bootstrap/Asimov');
var asimov = module.exports = new Asimov();

module.parent || asimov.start();