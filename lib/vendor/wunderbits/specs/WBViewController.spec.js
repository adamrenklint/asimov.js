describe('WBViewController', function () {

  'use strict';

  var Topic;

  beforeEach(function (done) {
    requirejs([
      'wunderbits/WBViewController'
    ], function (WBViewController) {

      Topic = WBViewController;
      done();
    });
  });

});