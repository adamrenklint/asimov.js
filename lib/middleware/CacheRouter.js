/*
  
  ▲ asimov.js cache router middleware class

  if the url should be handled by the cache, pass on the 
  request to it. covers pages, applications bundles and styles.

*/

define([

  '../server/Middleware',
  '../core/Filesystem'

], function (Middleware, Filesystem) {

  var _super = Middleware.prototype;
  var filesystem = new Filesystem();
  
  return Middleware.extend({

    'handle': function (req, res, next) {

      var self = this;
      var urls = self.urls;

      if (!!urls[req.url]) {

        var type = 'HTML page';

        if (filesystem.hasFileExtension(req.url, 'js')) {
          type = 'application bundle';
        }
        else if (filesystem.hasFileExtension(req.url, 'css')) {
          type = 'stylesheet';
        }

        res.logger = self.logger.wait('Server', 'Responding with ' + type + ' @ ' + req.url);
        self.server.trigger('fromCache', req.url, res);
      }
      else {
        next();
      }
    }
  });
});