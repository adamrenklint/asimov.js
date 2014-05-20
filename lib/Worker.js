var Asimov = require('./Asimov');
module.exports = Asimov.extend({

  'start': function () {

    console.log('start worker', process.pid);
  }
});
