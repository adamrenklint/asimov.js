/*
  
  ▲ asimov.js not found middleware class

  end of the line of the server request handlers
  and if a request got this far, we return a 404

*/

define([

  '../server/Middleware'

], function (Middleware) {

  var _super = Middleware.prototype;
  
  return Middleware.extend({

    'namespace': '404',

    'handle': function (req, res, next) {

      var self = this;
      res.logger = self.logger.wait('Server', 'Responding with 404 Not Found @ ' + req.url);
      res.status(404);
      self.server.trigger('fromCache', '/404', res);
    }
  });
});