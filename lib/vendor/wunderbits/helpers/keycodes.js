define([

  '../WBSingleton'

], function (WBSingleton, undefined) {

  'use strict';

  var keys = {

    // please only add keycodes
    // that we actually use in the app to this list
    // name -> keycode
    'backspace': 8,
    'tab': 9,

    'enter': 13,
    'esc': 27,

    'shift':16,

    'spacebar': 32,

    'left': 37,
    'up': 38,
    'right': 39,
    'down': 40,

    'del': 46,

    'zero': 48,
    'nine': 57,

    'padZero': 96,
    'padNine': 105,

    'dash': 189,

    // keycode -> name (for setting shortcuts)
    // extracted from mousetrap.js
    8: 'backspace',
    9: 'tab',
    13: 'enter',
    16: 'shift',
    17: 'ctrl',
    18: 'alt',
    20: 'capslock',
    27: 'esc',
    32: 'space',
    33: 'pageup',
    34: 'pagedown',
    35: 'end',
    36: 'home',
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
    45: 'ins',
    46: 'del',
    91: 'meta',
    93: 'meta',
    224: 'meta',
    // more of the same
    106: '*',
    107: '+',
    109: '-',
    110: '.',
    111: '/',
    186: ';',
    187: '=',
    188: ',',
    189: '-',
    190: '.',
    191: '/',
    192: '`',
    219: '[',
    220: '\\',
    221: ']',
    222: '\''
  };

  return WBSingleton.extend(keys);
});