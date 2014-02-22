/*

  ▲ asimov.js base class

  empowers the skeleton class with logging,
  filesystem and child process

*/

define([

  './Klass',
  '../logger/Logger',
  './Filesystem',
  './ChildProcess'

], function (Klass, Logger, Filesystem, ChildProcess) {

  var _super = Klass.prototype;
  var logger = new Logger();
  var filesystem = new Filesystem();
  var child = new ChildProcess();

  return Klass.extend({

    'initialize': function () {

      var self = this;
      _super.initialize.apply(self, arguments);

      self.logger = logger;
      self.filesystem = filesystem;
      self.child = child;
    }
  });
});