var Middleware = require('./Middleware');

module.exports = Middleware.extend({

  'use': function (req, res, next) {

    var self = this;

    if (req.url.indexOf('/home') === 0) {
      req.url = req.url.replace('/home', '/');
    }

    next();
  }
});
