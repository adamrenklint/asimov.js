var Base = require('../../../../index').Base;
// var PageRenderJob = require('./PageRenderJob');
// var ScriptRenderJob = require('./ScriptRenderJob');
// var StyleSheetRenderJob = require('./StyleSheetRenderJob');
var _ = require('lodash');
var _super = Base.prototype;

module.exports = Base.extend({

  'limit': 10 * 1000,

  'namespace': 'Render',

  'initialize': function (options) {

    var self = this;
    _super.initialize.apply(self, arguments);

    // self.page = new PageRenderJob(self.options);
    // self.script = new ScriptRenderJob(self.options);
    // self.styleSheet = new StyleSheetRenderJob(self.options);

    self.pending = {};
    self.delay('checkTimeouts', 1000);
  },

  'checkTimeouts': function () {

    var self = this;
    var now = (new Date()).valueOf();
    var limit = now - self.limit;

    _.each(self.pending, function (deferreds, timestamp) {
      if (timestamp < limit) {
        _.invoke(deferreds, 'reject');
        self.pending[timestamp] = [];
      }
    });

    self.delay('checkTimeouts', 1000);
  },

  'run': function (job) {

    var self = this;
    var type = job && job.attributes && job.attributes.type;

    if (!type) {

      throw new Error('Invalid render job: ' + JSON.stringify(job.attributes));
    }

    process.exit(1);

    if (self[type]) {

      self.mediator.trigger('rendering:' + job.attributes.type, job);

      var promise = self[type].run(job);

      var timestamp = (new Date()).valueOf();
      self.pending[timestamp] = self.pending[timestamp] || [];
      self.pending[timestamp].push(promise);

      return promise;
    }
  }
});
