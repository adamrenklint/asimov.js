var Klass = require('./Klass');
var child = require('child_process');
var _ = require('lodash');
var _super = Klass.prototype;

module.exports = Klass.extend({

  'namespace': 'Child',

  'initialize': function (options) {

    var self = this;
    _super.initialize.apply(self, arguments);
  },

  'execute': function (command) {

    var self = this;
    var deferred = self.deferred();

    child.exec(command, function (err, stdout, stderr) {

      if (err) {
        deferred.reject(err, stdout, stderr);
      }
      else {
        deferred.resolve(stdout || stderr);
      }
    });

    return deferred.promise();
  },

  'spawn': function (command, options) {

    var self = this;
    var deferred = self.deferred();
    var _child = child.exec(command, options);

    return deferred.promise();
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