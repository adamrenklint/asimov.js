/*

  ▲ asimov.js filesystem abstraction class

  abstracts synchronous fs actions

*/

define([

  './Klass',
  'lodash',
  'path',
  'fs',
  'watchdirectory'

], function (Klass, _, npath, fs, watchdirectory) {

  var _super = Klass.prototype;

  return Klass.extend({

    'pathExists': function (path) {

      return fs.existsSync(path);
    },

    // Reads directory at <path> and executes callback with the <filename> of each file or directory. Returns true if <path> exists, and false if it doesn't.
    'readDirectory': function (path, callback) {

      var self = this;

      if (self.pathExists(path) && self.isDirectory(path)) {
        _.each(fs.readdirSync(path), function (filename) {
          if (filename[0] !== '.') {
            callback(npath.join(path, filename), filename, path);
          }
        });
        return true;
      }
      return false;
    },

    'copyDirectoryIfExists': function (from, to) {

      var self = this;
      if (fs.existsSync(from)) {
        wrench.copyDirSyncRecursive(from, to);
        return true;
      }
      return false;
    },

    // Watches tree at <path>, executing <callback> whenever a file is added, changed or removed. Returns a function that will stop watching.
    'watchTree': function (path, callback) {

      return  watchdirectory.watchDirectory(path, {
        'initial': false
      }, function (filename) {
        callback.apply(null, arguments);
      });
    },

    'cleanDirectory': function (path) {

      var self = this;
      self.readDirectory(path, function (subPath, filename) {
        if (self.isDirectory(subPath)) {
          self.recursiveDelete(subPath);
        }
        else {
          fs.unlinkSync(subPath);
        }
      });
    },

    'writeTree': function (value, path, clean) {

      var self = this;

      if (clean) {
        self.cleanDirectory(path);
      }

      for (var key in value) {

        if (~key.indexOf('dir::')) {

          var pathName = key.replace('dir::', '');
          fs.mkdirSync(npath.join(path, pathName));
          self.writeTree(value[key], npath.join(path, pathName));
        }
        else {

          fs.writeFileSync(npath.join(path, key), value[key]);
        }
      }
    },

    // Steps through each part of <path> and makes sure all directories exist, creating if not.
    'forceExists': function (path) {

      if (path.indexOf(process.cwd()) >= 0) {
        path = path.replace(process.cwd() + '/', '');
      }

      var parts = path.split('/');

      if (parts[0].indexOf('.') > 0) {
        parts.pop();
      }

      var fullPath = '';
      _.each(parts, function (fragment) {

        if (fragment) {

          fullPath += fragment + '/';
          if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath);
          }
        }
      });
    },

    'readFile': function (path, filename, options) {

      var self = this;
      options = options || {};
      filename || (filename = _.last(path.split('/')));

      if (options.autoEncode !== false) {
        options.autoEncode = true;
      }

      if (options.autoEncode && (self.hasFileExtension(filename, 'txt') || self.hasFileExtension(filename, 'tmpl') || self.hasFileExtension(filename, 'html') || self.hasFileExtension(filename, 'styl') || self.hasFileExtension(filename, 'js'))) {
        return fs.readFileSync(path, 'utf8');
      }
      else {
        return fs.readFileSync(path);
      }
    },

    // Write <value> to <path>
    'writeFile': function (path, value) {

      return fs.writeFileSync(path, value);
    },

    'isDirectory': function (path) {

      return fs.statSync(path).isDirectory();
    },

    'getStats': function (path) {

      return fs.lstatSync(path);
    },

    'recursiveDelete': function (path) {

      var self = this;

      if (!self.pathExists(path)) return;

      if (self.isDirectory(path) && !self.getStats(path).isSymbolicLink()) {

        // console.log('how to handle this?', path, )
        // ;process.exit()

        var exists = self.readDirectory(path, function (currentPath) {
          if (!self.hasFileExtension(currentPath, 'git')) {
            if (self.isDirectory(currentPath)) {
              self.recursiveDelete(currentPath);
            }
            else {
              fs.unlinkSync(currentPath);
            }
          }
        });

        exists && fs.rmdirSync(path);
      }
      else {
        fs.unlinkSync(path);
      }
    },

    'rebuildDirectory': function (path) {

      this.recursiveDelete(path);
      fs.mkdirSync(path);
    },

    'join': function () {

      return npath.join.apply(npath, arguments);
    },

    'hasFileExtension': function (filename, extension) {

      var parts = filename.split('.');
      return parts[parts.length - 1] === extension;
    },

    'readJSON': function (path) {

      var self = this;
      var json = {};

      if (self.hasFileExtension(path, 'json')) {

        var raw = fs.readFileSync(path, 'utf8');
        var contents;

        try {

          contents = JSON.parse(raw);
        }
        catch (e) {

          throw new Error('Malformed JSON in ' + path);
        }

        json = _.merge(json, contents);
      }

      return json;
    },

    'findFirstMatch': function (needle, haystacks) {

      var self = this;
      var match = false;

      if (!_.isArray(haystacks)) {
        haystacks = [haystacks];
      }

      _.each(haystacks, function (haystack) {
        self.readDirectory(haystack, function (path) {

          if (self.isDirectory(path)) {
            match = self.findFirstMatch(needle, [path]) || match;
            return false;
          }
          else if (path.indexOf(needle) >= 0) {
            match = path;
            return false;
          }
        });
      });

      return match;
    },

    'symlink': function (srcPath, destPath, type) {

      var self = this;
      return fs.symlinkSync(srcPath, destPath, type);
    }
  });
});