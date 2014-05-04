module.exports = function (next, asimov) {

  var paths = asimov.config.paths;

  var templates = asimov.templates.fetch(paths.templates);

  next();
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
