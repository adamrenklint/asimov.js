var npath = require('path');

module.exports = function (next, asimov) {

  asimov.pagesPath(npath.join(process.cwd(), 'content'));
  asimov.templatesPath(npath.join(process.cwd(), 'site/templates'));
  asimov.helpersPath(npath.join(process.cwd(), '_lib/helpers'));

  next();
};
