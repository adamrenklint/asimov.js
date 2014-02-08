/*
  
  ▲ asimov.js bootstrap

*/

// Setup requirejs
var requirejs = require('requirejs');

module.exports = function (options) {

  // And start the beast
  requirejs([

    options.frameworkDir + '/lib/Asimov'

  ], function (Asimov) {
    
    var asimov = new Asimov(options);
  });
};