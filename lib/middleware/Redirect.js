var Middleware = require('./Middleware');

module.exports = Middleware.extend({

  'use': function (req, res, next) {

    var self = this;
    var url = req.url;
    var page = self.pages.get(url);

    if (page && page.attributes.redirect) {
      return res.redirect(page.attributes.redirect);
    }

    var alias = self.pages.getUrlForAlias(url);

    if (alias) {
      return res.redirect(alias);
    }

    next();
  }
});