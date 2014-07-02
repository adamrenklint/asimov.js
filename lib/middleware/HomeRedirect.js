var Middleware = require('./Middleware');

module.exports = Middleware.extend({

  'use': function (req, res, next) {

    var self = this;
    var languages = self.mediator.languages.join('|');
    var localizedRE = new RegExp('^/(' + languages + ')/home');
    
    if (req.url.indexOf('/home') === 0 || req.url.match(localizedRE)) {
      req.url = req.url.replace('/home', '');
    }

    next();
  }
});
