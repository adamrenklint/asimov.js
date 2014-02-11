/*
  
  directory router middleware class

  manages directory access for certain file types

*/

define([

  '../server/Middleware',
  'lodash'

], function (Middleware, _) {

  var _super = Middleware.prototype;
  
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

          if (self.filesystem.hasFileExtension(req.url, allowed)) {

            var path = 'content' + req.url;

            if (self.filesystem.pathExists(path)) {

              var fullType = type + '/' + allowed;

              var logger = self.logger.wait('Server', 'Responding with ' + fullType + ' @ ' + req.url);
              
              var content = self.filesystem.readFile(path);
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