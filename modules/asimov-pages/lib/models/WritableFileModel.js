var FileModel = require('asimov-collection').FileModel;
var _super = FileModel.prototype;

module.exports = FileModel.extend({

  'write': function () {

    var self = this;
    console.log('write...', self.attributes.processed);
  }
});
