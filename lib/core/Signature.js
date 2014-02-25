/*

  signature animator class

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
      '▲ asimov.js %version%                '.bold,
      '  a simple web framework',
      '  for awesome websites and apps        ',
      '  ',
      '  '
    ],

    'startDelay': 250,
    'renderDelay': 11,

    'animate': function (callback) {

      var self = this;
      var rows = _.toArray(self.rows);
      var padding = '            ';
      var buffer = '\n' + padding;

      function render () {

        if (rows[0]) {

          rows[0] = rows[0].replace('%version%', self.options.pkg.version);
          var chars = _.toArray(rows[0]);
          var next = chars.shift();
          rows[0] = chars.join('');

          buffer += next;

          console.log(self.logger.clearCommand + '\n' + buffer[self.logger.color] + '\n\n');

          if (!rows[0]) {
            buffer += '\n' + padding;
            rows.shift();
          }

          _.delay(render, self.renderDelay);
        }
        else {

          self.signature = buffer.replace(self.logger.clearCommand, '');
          self.logger.logClear(self.signature);

          callback();
        }
      };

      self.logger.clear();
      _.delay(render, self.startDelay);
    }
  });
});