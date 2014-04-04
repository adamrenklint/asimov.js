var Middleware = require('./Middleware');

module.exports = Middleware.extend({

  'use': function (req, res, next) {

    var self = this;
    var langCode = self.options.localization.defaultLangCode;

    if (req.url.indexOf('/' + langCode + '/') === 0) {
      return res.redirect(req.url.replace('/' + langCode, ''));
    }

    next();
  }
});