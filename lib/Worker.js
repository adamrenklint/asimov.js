var Asimov = require('./Asimov');
module.exports = Asimov.extend({

  'start': function (next) {

    var self = this;

    if (self.running) return;
    self.running = true;

    process.on('message', self.onMessage);
    process.on('exit', self.onExit);

    var amount = self.getSequence('preinit').length + self.getSequence('init').length + self.getSequence('postinit').length;

    if (!amount) {
      self.error('No initializers found');
      self.publish('app:started');
      process.send({
        'started': true,
        'intializers': false
      });
      return next && next();
    }
    //
    // self.runSequence('preinit').done(function () {
    //   self.runSequence('init').done(function () {
    //     self.runSequence('postinit').done(function () {
    //
    //       if (!self.options.muteLog) {
    //         self.logger.since(self.namespace, 'Executed ' + amount + ' initializer(s)', started);
    //         self.logger.since(self.namespace, template.replace('$', 'Started'), self.started);
    //       }
    //
    //       self.publish('app:started');
    //
    //       if (typeof next === 'function') next();
    //     }).fail(self.error);
    //   }).fail(self.error);
    // }).fail(self.error);
    //
    // return self.publicInterface();
  },

  'onMessage': function (data) {

    var self = this;
    console.log('worker received', data);
  },

  'onExit': function () {}
});
