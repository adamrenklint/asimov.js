/*

  template helper model proxy class

*/

define([

  '../core/FilesystemModel',
  'lodash',
  'handlebars'

], function (FilesystemModel, _, handlebars) {

  var _super = FilesystemModel.prototype;

  return FilesystemModel.extend({

    'defaults': {

      'type': 'helper',
      'path': null,
      'name': null
    },

    // 'initialize': function () {

    //   var self = this;
    //   _super.initialize.apply(self, arguments);

    //   // if (typeof self.run !== 'function') {
    //   //   throw new Error('Cannot register template helper without callback:' + JSON.stringify(self.attributes));
    //   // }
    // },

    'fetch': function (path, logger) {

      var self = this;
      var deferred = self.deferred();
      var requirePath = path.replace('.js', '').replace(process.cwd() + '/', '');
      var parts = path.split('/');
      var name = parts[parts.length - 1].replace('.js', '').toLowerCase();

      requirejs([requirePath], function (Helper) {

        var helper;

        try {

          helper = new Helper(_.merge({}, self.options, {
            'path': path,
            'requirePath': requirePath,
            'name': name
          }));

          self.on('setUrl', helper.setUrl);
        }
        catch (e) {

          throw new Error('Invalid template helper @ ' + path + ': '+ e);
        }

        self.set({
          'helper': helper,
          'path': path,
          'name': name
        });

        logger.nextAndDone();

        deferred.resolve(helper);
      });

      return deferred.promise();
    }
  });
});