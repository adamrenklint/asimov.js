var Middleware = require('./Middleware');
var _super = Middleware.prototype;

module.exports = Middleware.extend({

  'use': function (req, res, next) {

    var self = this;
    res.error = function (message) {

      res.status(501);

      var model = self.options.pages.get('/error');

      if (!model) {
        throw new Error('Ooops, this is bad. Seems you\'ve managed to remove the default 501 page. Step back, and let the pro\'s do the heavy lifting.');
      }

      self.options.server.respond(model, res);
      self.logger.lowSince(self.namespace, 'Responded with 501 Internal Server Error @ '+ req.host + ':' + self.options.server.port + req.url, req.started);
    };

    next();
  }
});