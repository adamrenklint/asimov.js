var collections = require('./lib/init/collections');
var npath = require('path');

module.exports = function (asimov) {

  asimov.init(collections);

  // asimov.templates(npath.join(__dirname, '../../site/templates'));
  // asimov.templates(npath.join(process.cwd(), 'site/templates'));
};

// exports.Page = require('./lib/models/Page');
