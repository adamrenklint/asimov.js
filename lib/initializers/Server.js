

/*

  base initializer class

*/

define([

  '../core/Initializer',
  '../server/Server',
  'lodash'

], function (Initializer, Server, _) {

  var _super = Initializer.prototype;

  return Initializer.extend({

    'run': function (next) {

      var self = this;
      var options = self.options;

      var server = new Server(options);
      var serverName = server.start();

      if (process.argv.indexOf('--open') > 0) {
        _.defer(function () {
          self.child.execute('open ' + serverName);
        });
      }

      next();
    }
  });
});