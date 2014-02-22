/*

  template helpers collection class

  scans the helpers directories, loads all valid helpers
  and gives them access to the crawled content tree

*/

define([

  '../core/FilesystemCollection',
  './TemplateHelper',
  'lodash',
  'path',
  'requirejs'

], function (FilesystemCollection, TemplateHelper, _, npath, requirejs) {

  var _super = FilesystemCollection.prototype;

  return FilesystemCollection.extend({

    'namespace': 'TemplateHelpersCollection',

    'filetype': 'helper',
    'extension': 'js',

    'model': TemplateHelper,

    'readPath': function (path, logger) {

      var self = this;
      var deferred = self.deferred();
      var requirePath = path.replace('.js', '').replace(process.cwd() + '/', '');

      requirejs([requirePath], function (Helper) {

        var helper;

        try {

          helper = new Helper(_.merge({}, self.options, {
            'collection': self,
          }));
        }
        catch (e) {

          throw new Error('Invalid template helper @ ' + path);
        }

        logger.nextAndDone();

        deferred.resolve({
          'instance': helper,
          'class': Helper,
          'path': path,
          'requirePath': requirePath
        });
      });

      return deferred.promise();
    },

    // 'setUrl': function (url) {

    //   var self = this;
    //   self.trigger('setUrl', url);
    // },

    // 'triggerFromVent': function (event, data) {

    //   var self = this;
    //   event = event[0];
    //   self.trigger(event, data);
    // }
  });
});