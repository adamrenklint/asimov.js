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

    'respondFromFolder': function (path, type, res) {

      var self = this;

      if (self.filesystem.pathExists(path)) {

        var content = self.filesystem.readFile(path);
        res.writeHead(200, {
          'Content-Type': type
        });
        res.end(content, 'binary');

        return true;
      }

      return false;
    },

    'respondFromSiteFolder': function (path, type, res) {

      var self = this;

      if (path.indexOf('/site/') < 0) {
        return false;
      }

      path = path.replace('/site/', 'site/images/');

      return self.respondFromFolder(path, type, res);
    },

    'respondFromContentFolder': function (path, type, res) {

      var self = this;
      path = self.getRealContentPath(path);
      return self.respondFromFolder(path, type, res);
    },

    'getRealContentPath': function (path) {

      var self = this;
      var pieces = path.split('/');
      var subpath = [];
      var testPath;

      while (pieces) {

        subpath.push(pieces.pop());
        testPath = pieces.join('/');

        if (self.options.paths[testPath]) {

          path = 'content/' + self.options.paths[testPath] + '/' + subpath.join('/');
          break;
        }
      }
      return path;
    },

    'handle': function (req, res, next) {

      var self = this;
      var done = false;

      _.each(self.allowed, function (extensions, type) {
        _.each(extensions, function (allowed) {

          if (self.filesystem.hasFileExtension(req.url, allowed)) {

            type = type + '/' + allowed;

            var logger = self.logger.wait('Server', 'Responding with ' + type + ' @ ' + req.url);

            done = done || self.respondFromSiteFolder(req.url, type, res);
            done = done || self.respondFromContentFolder(req.url, type, res);

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