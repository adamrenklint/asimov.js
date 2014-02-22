describe('Console Helper', function () {

  'use strict';

  var ourConsole;

  // cache reference to window.console
  var realConsole = window.console || {};

  var methods = [

    'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
    'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
    'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
    'timeStamp', 'trace', 'warn'
  ];

  beforeEach(function (done) {

    requirejs([

      'wunderbits/helpers/console'

    ], function (Console) {

      ourConsole = Console;
      done();
    });
  });

  afterEach(function () {

    // restore window.console
    window.console = realConsole;
  });

  it ('should provide hould provide noop methods when window.console is undefined', function (done) {

    var localConsole;
    window.console = undefined;

    requirejs([

      'wunderbits/helpers/console'

    ], function (Console) {

      localConsole = Console;

      _.each(methods, function (method) {

        localConsole[method].should.not.be.undefined;
      });

      done();
    });
  });

});