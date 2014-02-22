describe('Keycodes Helper', function () {

  'use strict';

  var Topic;

  beforeEach(function (done) {

    requirejs([
      'wunderbits/helpers/keycodes'
    ], function (Keycodes) {

      Topic = Keycodes;
      done();
    });
  });


  it('should map readable names for used keycodes to their corresponding keycode number', function () {

    var keys = {

      'backspace': 8,
      'tab': 9,

      'enter': 13,
      'esc': 27,

      'spacebar': 32,

      'shift':16,

      'left': 37,
      'up': 38,
      'right': 39,
      'down': 40,

      'del': 46,

      'zero': 48,
      'nine': 57,

      'padZero': 96,
      'padNine': 105
    };

    _.each(keys, function (val, key) {

      expect(Topic[key]).to.equal(val);
    });
  });
});