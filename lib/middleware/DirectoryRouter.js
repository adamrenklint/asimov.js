/*
  
  ▲ asimov.js directory router middleware class

  manages directory access for certain file types

*/

define([

  '../server/Middleware',
  '../core/Filesystem',
  'lodash'

], function (Middleware, Filesystem, _) {

  var _super = Middleware.prototype;
  var filesystem = new Filesystem();
  
  return Middleware.extend({

    'allowed': {
      'image': [
        'gif',
        'jpg',
        'jpeg',
        'png',
        'webp'
      ]
    },

    'handle': function (req, res, next) {

      var self = this;
      var done = false;

      _.each(self.allowed, function (extensions, type) {
        _.each(extensions, function (allowed) {

          if (filesystem.hasFileExtension(req.url, allowed)) {

            var path = 'content' + req.url;

            if (filesystem.pathExists(path)) {

              var fullType = type + '/' + allowed;

              var logger = self.logger.wait('Server', 'Responding with ' + fullType + ' @ ' + req.url);
              
              var content = filesystem.readFile(path);
              res.writeHead(200, {
                'Content-Type': fullType
              });
              res.end(content, 'binary');

              done = true;
              logger.nextAndDone();

              return false;
            }
          }
        });
      });

      done || next();
    }
  });
});