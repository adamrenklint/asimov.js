var collections = require('./lib/init/collections');
var methods = require('./lib/init/methods');
var paths = require('./lib/init/paths');
var watch = require('./lib/init/watch');
var render = require('./lib/init/render');
// var npath = require('path');

module.exports = function (asimov, options) {

  options = options || {};

  asimov.addSequence('processor');
  //middleware sequence will be added by server module

  [collections, methods, paths, render].forEach(function (init) {
    asimov.init(init);
  })

  if (options.watch !== false) asimov.init(watch);
  

  // asimov.init(config); // add paths
    //asimov.addTemplatePath(path);
    //asimov.addPagesPath(path, baseUrl);
    // asimov.templates(npath.join(__dirname, '../../site/templates'));
    // asimov.templates(npath.join(process.cwd(), 'site/templates'));
};

// exports.Page = require('./lib/models/Page');
