/*
  
  ▲ asimov.js signature animator class

  uses logger to animate framework header signature

*/

define([

  '../core/Base',
  'lodash'

], function (Base, _) {

  var _super = Base.prototype;

  return Base.extend({

    'rows': [
      '  ',
      '  ',
      '▲ asimov.js 0.9.0                '.bold,
      '  a simple web framework',
      '  by adam renklint        ',
      '  ',
      '  '
    ],

    'animate': function (callback) {

      var self = this;
      var rows = _.toArray(self.rows);
      var padding = '            ';
      var buffer = '\n' + padding;

      function render () {

        if (rows[0]) {

          self.logger.clear();

          var chars = _.toArray(rows[0]);
          var next = chars.shift();
          rows[0] = chars.join('');

          buffer += next;

          console.log(buffer[self.logger.color] + '\n\n');

          if (!rows[0]) {
            buffer += '\n' + padding;
            rows.shift();
          }

          _.delay(render, 25);
        }
        else {

          self.logger.clear();
          self.signature = buffer;
          self.logger.log(self.signature);

          callback();
        }
      };

      self.logger.clear();
      _.delay(render, 250);
    }
  });
});