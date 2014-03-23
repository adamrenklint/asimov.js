/*

  ▲ asimov.js logger class

  allows logging and manipulation of buffer collection
  cannot be instance of Base, because of circular dependencies

*/

define([

  'colors',
  'lodash',
  '../core/Klass'

], function (colors, _, Klass) {


  var start;
  var _super = Klass.prototype;

  return Klass.extend({

    'pending': function (namespace, message, color) {

      var self = this;
      message += '...';
      return self.log(namespace, message, color);
    },

    'log': function (namespace, message, color) {

      var self = this;
      message = '[' + namespace + '] ' + message;

      if (!self.lastNamespace || namespace !== self.lastNamespace) {
        message = '\n' + message;
        self.lastNamespace = namespace;
      }

      message = message.replace(process.cwd(), '');

      if (color) {
        message = message[color];
      }

      console.log(message);
    },

    'since': function (namespace, message, then, color) {

      var self = this;
      var time = self.getTime(then);
      time = time ? ' +' + time : '';
      color && (time = time[color])

      self.log(namespace, message + time, color);
    },

    'getTime': function (then) {

      var now = new Date();
      var difference = now - then;
      var timeString = (difference/1000) + 's';
      return difference && timeString || '';
    },

    'low': function (namespace, message) {

      var self = this;
      if (self.logVerbose) {
        self.pending(namespace, message, 'grey');
      }
    },

    'lowSince': function (namespace, message, date) {

      var self = this;
      if (self.logVerbose) {
        self.since(namespace, message.grey, date, 'grey');
      }
    }
  });
});