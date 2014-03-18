/*

  redirector middleware class

*/

define([

  '../server/Middleware'

], function (Middleware) {

  return Middleware.extend({

    'use': function (req, res, next) {

      var self = this;
      var url = req.url;
      var page = self.options.pages.get(url);

      if (page && page.attributes && page.attributes.redirect) {
        return res.redirect(page.attributes.redirect);
      }

      next();
    }
  });
});