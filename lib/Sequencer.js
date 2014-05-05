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
    method = method || namespace;

    self[plural] = [];
    self.publicMethods.push(method);

    self[method] = function (callback) {

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
    return self[type];
  },

  'runSequence': function (namespace, done) {

    var self = this;
    var type = namespace + 's';
    var jobs = self.getSequence(namespace);

    self.assert('array', jobs, 'Invalid sequence for namespace "' + namespace + '"');

    var count = jobs.length;

    function next () {

      var job = jobs.shift();

      if (!job) {

        done && done({
          'count': count,
          'namespace': namespace
        });

        return;
      }

      job(next, self.publicInterface());
    }

    next();

    return self.publicInterface();
  }});
