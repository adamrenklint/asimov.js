var asimov = require('../../../../index');
var FileModel = require('asimov-collection').FileModel;
var _super = FileModel.prototype;

module.exports = FileModel.extend({

  'initialize': function () {

    var self = this;
    _super.initialize.apply(self, arguments);

    self.options.outputPath = asimov.config.paths.dest;
  }
});
