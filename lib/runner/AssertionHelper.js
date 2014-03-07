define([

  '../core/Base',
  './AssertionHelper',
  'lodash',
  'requirejs',
  'zombie',
  'mocha',
  'URIjs',
  'path',
  '../core/Loader',
  '../vendor/wunderbits.core/public/lib/createUID',

], function (Base, AssertionHelper, _, requirejs, zombie, Mocha, uri, npath, Loader, createUID) {

  function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  var _super = Base.prototype;
  var mocha = new Mocha();
  var port = getRandomInt(3000, 3999);
  var server;

  return Base.extend({

    'initialize': function () {

      var self = this;
      _super.initialize.apply(self, arguments);

      self.it = self.options.test.it;
    },

    'throwError': function (message, callback) {

      var self = this;

      if (typeof message !== 'string') {
        callback = message;
        message = null;
      }

      var wrapper = function () {
        expect(callback).to.throw(message || Error);
      };

      if (typeof callback !== 'function') {
        wrapper = null;
      }

      self.it('should throw an error', wrapper);
    },

    'notThrowError': function (message, callback) {

      var self = this;

      if (typeof message !== 'string') {
        callback = message;
        message = null;
      }

      var wrapper = function () {
        expect(callback).to.not.throw(message || Error);
      };

      if (typeof callback !== 'function') {
        wrapper = null;
      }

      self.it('should not throw an error', wrapper);
    },

    'loadPage': function () {

      var self = this;
      throw new Error('BIG FUDGE');
    }
  });
});