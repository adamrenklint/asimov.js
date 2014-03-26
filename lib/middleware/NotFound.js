/*

  not found middleware class

  end of the line of the server request handlers
  and if a request got this far, we return a 404

*/

define([

  '../server/Middleware'

], function (Middleware) {

  var _super = Middleware.prototype;

  return Middleware.extend({

    'use': function (req, res, next) {

      var self = this;
      res.status(404);

      var model = self.options.pages.get('/404');

      if (!model) {
        throw new Error('Ooops, this is bad. Seems you\'ve managed to remove the default 404 page. Step back, and let the pro\'s do the heavy lifting.');
      }

      self.options.server.respond(model, res);
      self.logger.lowSince(self.namespace, 'Responded with 404 Not Found @ '+ req.host + ':' + port + req.url, req.started);
    }
  });
});