var Asimov = require('./Asimov');
var child = require('child_process');

module.exports = Asimov.extend({

  'start': function (next) {

    var self = this;
  
    if (!self.options.muteLog) {
      self.logAsimovHeader();

      self.logger.pending('start', 'Loading asimov.js @ ' + self.config('ASIMOV').version);
      self.logger.log('start', 'The time is ' + self.started);
    }

    var c = child.fork(process.cwd() + '/index.js', {
      'env': {
        'ROLE': 'worker'
      }
    });

    // c.on('error', function () {
    //   console.log(arguments)
    // })
    // c.on('message', function () {
    //   console.log(arguments)
    // })
  },

  'logAsimovHeader': function () {

    var self = this;

    if (self.options.muteLog) return;

    console.log(self.lineDelimiter + '\n');
    self.logLines(self.signature);
    console.log(self.lineDelimiter);
  }
});
