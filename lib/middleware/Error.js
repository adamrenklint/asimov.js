/*

  general error middleware class

*/

define([

  '../server/Middleware'

], function (Middleware) {

  var _super = Middleware.prototype;

  return Middleware.extend({

    'namespace': 'Error',

    'use': function (req, res, next) {

      var self = this;
      res.error = function (message) {

        res.logger = self.logger.wait('Server', 'Responding with 501 Internal Server Error @ ' + req.url + ' for error "' + message + '"');
        res.status(501);

        var model = self.options.pages.get('/error');

        if (!model) {
          throw new Error('Ooops, this is bad. Seems you\'ve managed to remove the default 501 page. Step back, and let the pro\'s do the heavy lifting.');
        }

        self.options.server.respond(model, res);
      };

      next();
    }
  });
});