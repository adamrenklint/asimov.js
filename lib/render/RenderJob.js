/*

  render job class

  determine which render strategy to use
  implements or wraps strategy callbacks

*/

define([

  '../core/Base',
  './PageRenderJob',
  './ScriptRenderJob',
  './StyleSheetRenderJob',
  'lodash'

], function (Base, PageRenderJob, ScriptRenderJob, StyleSheetRenderJob, _) {

  var _super = Base.prototype;

  return Base.extend({

    'limit': 5000,

    'namespace': 'Render',

    'initialize': function (options) {

      var self = this;
      _super.initialize.apply(self, arguments);

      self.page = new PageRenderJob(self.options);
      self.script = new ScriptRenderJob(self.options);
      self.styleSheet = new StyleSheetRenderJob(self.options);

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
});