var Asimov = require('./Asimov');
module.exports = Asimov.extend({

  'start': function (next) {

    var self = this;

    if (self.running) return;
    self.running = true;

    var started = new Date();

    process.on('message', self.onMessage);
    // process.on('exit', self.onExit);
    process.on('SIGHUP', self.shutdown);

    var amount = self.getSequence('preinit').length + self.getSequence('init').length + self.getSequence('postinit').length;

    if (!amount) {

      self.publish('app:started');

      process.send && process.send({
        'event': 'app:started',
        'initializers': amount
      });

      return next && next();
    }

    self.runSequence('preinit').done(function () {
      self.runSequence('init').done(function () {
        self.runSequence('postinit').done(function () {

          self.publish('app:started');

          process.send && process.send({
            'event': 'app:started',
            'initializers': amount,
            'started': started.valueOf()
          });

          if (typeof next === 'function') next();
        }).fail(self.error);
      }).fail(self.error);
    }).fail(self.error);

    return self.publicInterface();
  },

  'onMessage': function (data) {

    var self = this;
    console.log('worker received', data);
  },

  'shutdown': function () {

    var self = this;
    console.log('shut down worker', process.pid);
    setTimeout(function () {
      process.exit();
    });
  }
});
