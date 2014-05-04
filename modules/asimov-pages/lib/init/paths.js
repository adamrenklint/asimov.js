var npath = require('path');
var moduleRoot = npath.join(__dirname, '../../');

module.exports = function (next, asimov) {

  asimov.pagesPath(npath.join(process.cwd(), 'content'));

  asimov.templatesPath(npath.join(process.cwd(), 'site/templates'));

  asimov.helpersPath(npath.join(process.cwd(), 'lib/helpers'));
  asimov.helpersPath(npath.join(moduleRoot, 'lib/helpers'));

  asimov.siteDataPath(npath.join(process.cwd(), 'site/data'));

  next();
};
