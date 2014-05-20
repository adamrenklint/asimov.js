var Asimov = require('./Asimov');
module.exports = Asimov.extend({

  'start': function (next) {

    var self = this;

    if (self.running) return;
    self.running = true;

    console.log('start worker', process.pid);

    process.on('message', self.onMessage);
    process.on('exit', self.onExit);
  },

  'onMessage': function (data) {

    var self = this;
    console.log('worker received', data);
  },

  'onExit': function () {}
});
