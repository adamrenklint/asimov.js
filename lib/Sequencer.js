var Base = require('./Base');
var _super = Base.prototype;
var _ = require('lodash');

module.exports = Base.extend({

  'publicMethods': [
    'addSequence',
    'runSequence'
  ],

  'addSequence': function (namespace, method) {

    var self = this;
    var plural = namespace + 's';

    if (self[plural]) return false;

    self.assert('string', namespace, 'Invalid sequence namespace');
    method = typeof method === 'string' ? method : namespace;

    self[plural] = [];

    self.publicMethods.push(method);

    self[method] = self._publicInterface[method] = function (callback) {

      self.assert('function', callback, 'Invalid ' + namespace + ' function');
      self[plural].push(callback);
      self[plural] = _.unique(self[plural]);

      return self.publicInterface();
    }.bind(self);

    self.addedSequence(namespace, method);

    return self.publicInterface();
  },

  'addedSequence': function () {},

  'getSequence': function (namespace) {

    var self = this;
    var type = namespace + 's';
    return self[type].slice();
  },

  'runSequence': function (namespace, data) {

    var self = this;
    var deferred = self.deferred();
    var type = namespace + 's';
    var jobs = self.getSequence(namespace);

    self.assert('array', jobs, 'Invalid sequence for namespace "' + namespace + '"');

    var count = jobs.length;

    function error (e) {

      var message = 'Failed to execute ' + namespace;
      if (data && data.id) message += ' @ ' + job.id;

      if (e.message.indexOf(message) !== 0) e.message = message + ': ' + e.message;

      if (process.env.CRASH) {
        throw e;
      }
      else {
        return deferred.reject(e);
      }
    }

    function next (err) {

      if (err) return error(err);

      var job = jobs.shift();

      if (!job) {

        return deferred && deferred.resolve({
          'count': count,
          'namespace': namespace
        });
      }

      try {
        job(next, data);
      }
      catch (e) {
        return error(e);
      }
    }

    next();

    return deferred && deferred.promise();
  }});
