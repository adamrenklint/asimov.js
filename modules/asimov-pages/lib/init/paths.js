var npath = require('path');

module.exports = function (next, asimov) {

  var pages = npath.join(process.cwd(), 'content');
  // console.log(pages);
  if (asimov.fs.pathExists(pages) && asimov.fs.isDirectory(pages)) {
    asimov.pagesPath(pages);
  }

  next();
};
