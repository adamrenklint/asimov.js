module.exports = function (next, asimov) {

  var paths = asimov.config.paths;

  asimov.templates.fetch(paths.templates).done(function () {
    asimov.helpers.fetch(paths.helpers).done(function () {
      asimov.siteData.fetch(paths.siteData).done(function () {
        asimov.pages.fetch(paths.pages).done(function () {

          // asimov.pages.ensureErrorPages();

          next();
        });
      });
    });
  });
};
