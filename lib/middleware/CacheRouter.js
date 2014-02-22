/*

  cache router middleware class

  if the url should be handled by the cache, pass on the
  request to it. covers pages, applications bundles and styles.

*/

define([

  '../server/Middleware'

], function (Middleware) {

  var _super = Middleware.prototype;

  return Middleware.extend({

    'handle': function (req, res, next) {

      var self = this;
      var page = self.options.pages.get(req.url);
      var type;

      if (page) {
        type = 'HTML page';
      }
      else if (self.filesystem.hasFileExtension(req.url, 'js')) {
        type = 'application bundle';
      }
      else if (self.filesystem.hasFileExtension(req.url, 'css')) {
        type = 'stylesheet';
      }

      if (type) {

        res.logger = self.logger.wait('Server', 'Responding with ' + type + ' @ ' + req.url);
        self.server.trigger('fromCache', req.url, res);
      }
      else {
        next();
      }
    }
  });
});