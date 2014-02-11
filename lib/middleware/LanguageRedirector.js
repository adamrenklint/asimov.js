/*
  
  language redirector middleware class

*/

define([

  '../server/Middleware',
  'lodash'

], function (Middleware, _) {

  var _super = Middleware.prototype;
  
  return Middleware.extend({

    'handle': function (req, res, next) {

      var self = this;
      var langCode = self.options.localization.defaultLangCode;

      if (req.url.indexOf('/' + langCode + '/') === 0) {
        return res.redirect(req.url.replace('/' + langCode, ''));
      }

      next();
    }
  });
});