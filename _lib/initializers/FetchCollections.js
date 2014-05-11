var Initializer = require('./Initializer');
var _super = Initializer.prototype;

module.exports = Initializer.extend({

  'run': function (next) {

    var self = this;
    var options = self.options;

    var templatesFetched = options.templates.fetch(options.paths.templates);
    var dataFetched = options.siteData.fetch(options.paths.data);
    var helpersFetched = options.helpers.fetch(options.paths.helpers);

    self.when(templatesFetched, dataFetched, helpersFetched).done(function () {

      options.pages.fetch(options.paths.content).done(function () {

        options.pages.ensureErrorPages();

        next();
      });
    });
  }
});
