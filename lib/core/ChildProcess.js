/*

  ▲ asimov.js child process proxy class

*/

define([

  './Klass',
  'child_process',
  'lodash'

], function (Klass, child, _) {

  var _super = Klass.prototype;

  return Klass.extend({

    'namespace': 'Child',

    'initialize': function (options) {

      var self = this;
      _super.initialize.apply(self, arguments);
    },

    'execute': function (command) {

      var self = this;
      var deferred = self.deferred();
      var promise = deferred.promise();

      child.exec(command, function (err, stdout, stderr) {

        if (err) {
          deferred.reject(err, stdout, stderr);
        }
        else {
          deferred.resolve(stdout || stderr);
        }
      });

      return promise;
    },

    'lines': function (command, callback) {

      var self = this;
      var deferred = self.deferred();

      self.execute(command).done(function (raw) {
        var lines = (raw || '').split('\n');
        _.each(lines, callback);
      });

      return deferred.resolve().promise;
    }
  });
});