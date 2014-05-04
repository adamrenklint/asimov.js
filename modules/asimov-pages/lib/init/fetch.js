module.exports = function (next, asimov) {

  var paths = asimov.config.paths;

  asimov.templates.fetch(paths.templates).done(function () {
    asimov.helpers.fetch(paths.helpers).done(function () {
      asimov.siteData.fetch(paths.siteData).done(function () {
        asimov.pages.fetch(paths.pages).done(function () {
          next();
        });
      })
    });
  });
};


// var templatesFetched = options.templates.fetch(options.paths.templates);
// var dataFetched = options.siteData.fetch(options.paths.data);
// var helpersFetched = options.helpers.fetch(options.paths.helpers);
//
// self.when(templatesFetched, dataFetched, helpersFetched).done(function () {
//
//   options.pages.fetch(options.paths.content).done(function () {
//
//     options.pages.ensureErrorPages();
//
//     next();
//   });
// });
