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

    'namespace': 'Render',

    'initialize': function (options) {

      var self = this;
      _super.initialize.apply(self, arguments);

      self.page = new PageRenderJob(self.options);
      self.script = new ScriptRenderJob(self.options);
      self.styleSheet = new StyleSheetRenderJob(self.options);

      self.bindTo(self.page, 'rendering', self.whenPageIsRendering);
    },

    'run': function (job) {

      var self = this;
      var type = job && job.attributes && job.attributes.type;

      if (!type) {

        throw new Error('Invalid render job: ' + JSON.stringify(job.attributes));
      }

      if (self[type]) {

        // if (self.options.logVerbose) {

        //   var nextAndDone = job.logger.nextAndDone;
        //   var verboseLogger = self.logger.wait(self.namespace, 'Rendering ' + job.nodeType + ' @ ' + job.url);

        //   job.logger.nextAndDone = function verboseRenderLogger () {

        //     nextAndDone();
        //     verboseLogger.nextAndDone();
        //   };
        // }

        return self[type].run(job);
      }
    },

    'whenPageIsRendering': function (model) {

      var self = this;
      self.trigger('page:rendering', model);
    }
  });
});