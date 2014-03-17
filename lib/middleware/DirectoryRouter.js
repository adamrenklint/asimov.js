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

    'findAndRespond': function (path, type, res) {

      var self = this;

      path = self.filesystem.findFirstMatch(path, [
        self.options.paths.content,
        process.cwd()
      ]);

      if (path) {

        var content = self.filesystem.readFile(path);
        res.writeHead(200, {
          'Content-Type': type
        });
        res.end(content, 'binary');

        return true;
      }

      return false;
    },

    'use': function (req, res, next) {

      var self = this;
      var done = false;

      if (self.isHiddenPath(req.url)) {
        return next();
      }

      _.each(self.allowed, function (extensions, type) {
        _.each(extensions, function (allowed) {

          if (self.filesystem.hasFileExtension(req.url, allowed)) {

            type = type + '/' + allowed;

            var logger = self.logger.wait('Server', 'Responding with ' + type + ' @ ' + req.url);

            done = done || self.findAndRespond(req.url, type, res);

            if (done) {

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