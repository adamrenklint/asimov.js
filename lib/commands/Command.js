var Base = require('../core/Base');
var _super = Base.prototype;

module.exports = Base.extend({

  'lineDelimiter': '\n\n',
  'lines': [],
  'padding': '      ',

  'logLines': function () {

    var self = this;
    self.lines.forEach(function (line) {
      console.log(self.padding + line);
    });
  }
});