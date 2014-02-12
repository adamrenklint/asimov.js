/*

  template helpers class

  scans the helpers directories, loads all valid helpers
  and gives them access to the crawled content tree

*/

define([

  '../core/Base',
  'lodash'

], function (Base, _) {

  var _super = Base.prototype;

  return Base.extend({

    'namespace': 'Helpers',

    'initialize': function (options) {

      var self = this;
      _super.initialize.apply(self, arguments);

      var ready = self.deferred();
      self.ready = ready.promise();

      self.byName = {};

      self.promises = [];
      self.loadAllHelpers();

      self.when.call(self, self.promises).done(ready.resolve, ready);
    },

    'setUrl': function (url) {

      var self = this;
      self.trigger('setUrl', url);
    },

    'loadAllHelpers': function () {

      var self = this;
      var paths = self.options.paths.helpers;

      _.each(paths, self.loadHelpers);
    },

    'loadHelpers': function (path) {

      var self = this;
      var log;

      path = path.replace('framework', self.options.frameworkDir);

      self.filesystem.readDirectory(path, function (subpath, filename) {

        if (self.filesystem.hasFileExtension(filename, 'js')) {

          var deferred = self.deferred();
          self.promises.push(deferred.promise());

          var requirePath = subpath.replace('.js', '');
          var name = filename.replace('.js', '').toLowerCase();

          require([requirePath], function (Helper) {

            var helper;

            try {

              helper = self.byName[name] = new Helper(_.merge(self.options, {
                'name': name,
                'helpers': self.byName
              }));

              helper.bindTo(self, 'setUrl', helper.setUrl);
            }
            catch (e) {

              throw new Error('Invalid template helper @ ' + subpath);
            }

            if (!log) {
              log = self.logger.wait(self.namespace, 'Loading 0 template helper(s) @ ' + path);
            }

            self.bindTo(helper, 'vent', self.triggerFromVent);

            log.nextAndDone();
            deferred.resolve();
          });
        }
      });
    },

    'triggerFromVent': function (event, data) {

      var self = this;
      event = event[0];
      self.trigger(event, data);
    }
  });
});