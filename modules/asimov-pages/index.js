var collections = require('./lib/init/collections');
var methods = require('./lib/init/methods');
// var npath = require('path');

module.exports = function (asimov) {

  asimov.init(collections);
  asimov.init(methods);
  // asimov.init(watch);
  // asimov.init(render);

  // asimov.init(config); // add paths
    //asimov.addTemplatePath(path);
    //asimov.addPagesPath(path, baseUrl);
    // asimov.templates(npath.join(__dirname, '../../site/templates'));
    // asimov.templates(npath.join(process.cwd(), 'site/templates'));
};

// exports.Page = require('./lib/models/Page');
