/*
  
  ▲ asimov.js log buffer

  allows management and manipulation of log buffers
  cannot be instance of Base, because of circular dependencies

*/

define([

  '../core/Klass',
  'lodash'

], function (Klass, _) {

  var _super = Klass.prototype;

  return Klass.extend({

    'initialize': function () {

      var self = this;
      _super.initialize.apply(self, arguments);

      self.logger = self.options.logger;
      var message = self.options.message;

      if (self.options.replaceDir) {
        message = message.replace(self.options.replaceDir, '');
      }

      self.meta = {
        'original': message,
        'message': message,
        'time': (new Date()).valueOf()
      };

      self.done = _.debounce(self.done, 5);
      self.update = _.debounce(self.update, 1);
    },

    'addTime': function () {

      var self = this;
      self.meta.original = self.meta.message = self.meta.message + ' ' + self.logger.timeToken;
    },

    'done': function () {

      var self = this;
      self.meta.message = self.meta.message.replace('> ', '# ');
      self.update();
      self.meta.time = null;
      self.isDone = true;
    },

    'update': function () {

      var self = this;
      self.logger.update(self);
    },

    'nextAndDone': function () {

      var self = this;
      return self.next().done();
    },

    'next': function () {

      var self = this;
      var numericToken = self.logger.numericToken;

      self.meta.count = self.meta.count || 0;
      self.meta.count++;

      if (self.meta.original.indexOf(' ' + numericToken + ' ') >= 0) {
        self.meta.message = self.meta.original.replace(numericToken, self.meta.count);  
      }

      self.update();
      return self;
    },

    'remove': function () {

      var self = this;
      self.logger.remove(self);
    }
  });
});