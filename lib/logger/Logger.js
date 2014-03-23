/*

  ▲ asimov.js logger class

  allows logging and manipulation of buffer collection
  cannot be instance of Base, because of circular dependencies

*/

define([

  'colors',
  'lodash',
  '../core/Klass',
  './LogBuffer'

], function (colors, _, Klass, LogBuffer) {

  function censor(censor) {
    var i = 0;

    return function(key, value) {
      if(i !== 0 && typeof(censor) === 'object' && typeof(value) == 'object' && censor == value)
        return '[Circular]';

      if(i >= 29) // seems to be a harded maximum of 30 serialized objects?
        return '[Unknown]';

      ++i; // so we know we aren't using the original object anymore

      return value;
    };
  }

  var start;
  var _super = Klass.prototype;

  return Klass.extend({

    'timeToken': '$',

    'pending': function (namespace, message) {

      var self = this;
      message += '...';
      return self.log(namespace, message);
    },

    'log': function (namespace, message) {

      var self = this;
      message = '[' + namespace + '] ' + message;

      if (!self.lastNamespace || namespace !== self.lastNamespace) {
        message = '\n' + message;
        self.lastNamespace = namespace;
      }

      message = message.replace(process.cwd(), '');

      console.log(message);
    },

    'since': function (namespace, message, then) {

      var self = this;
      var time = self.getTime(then);

      message = time ? message + ' +' + time : message;
      self.log(namespace, message);
    },

    'getTime': function (then) {

      var now = new Date();
      var difference = now - then;
      var timeString = (difference/1000) + 's';
      return difference && timeString || '';
    }
  });
});