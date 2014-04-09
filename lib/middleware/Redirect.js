var Middleware = require('./Middleware');

module.exports = Middleware.extend({

  'getPageForAlias': function (alias) {

    // add a listener to pages:change or something
    // and make an index of aliases - cant do the lookup on each request
  },

  'use': function (req, res, next) {

    var self = this;
    var url = req.url;
    var page = self.pages.get(url);

    if (page && page.attributes.redirect) {
      return res.redirect(page.attributes.redirect);
    }

    var alias = self.pages.getPageForAlias(url);

    if (alias && alias.attributes.url !== url) {
      return res.redirect(alias.attributes.url);
    }

    next();
  }
});