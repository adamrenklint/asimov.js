/*

  render job class

  determine which render strategy to use
  implements or wraps strategy callbacks

*/

define([

  '../core/Base',
  './PageRenderJob',
  './AppBundleRenderJob',
  './StyleSheetRenderJob',
  '../../node_modules/lodash'

], function (Base, PageRenderJob, AppBundleRenderJob, StyleSheetRenderJob, _) {

  var _super = Base.prototype;

  return Base.extend({

    'namespace': 'Render',

    'initialize': function (options) {

      var self = this;
      _super.initialize.apply(self, arguments);

      self.page = new PageRenderJob(self.options);
      self.appBundle = new AppBundleRenderJob(self.options);
      self.styleSheet = new StyleSheetRenderJob(self.options);

      self.bindTo(self.page, 'rendering', self.whenPageIsRendering);
    },

    'run': function (job) {

      var self = this;

      if (!job || !job.nodeType) {

        throw new Error('Invalid render job');
      }

      if (typeof self[job.nodeType]) {

        if (self.options.logVerbose) {

          var nextAndDone = job.logger.nextAndDone;
          var verboseLogger = self.logger.wait(self.namespace, 'Rendering ' + job.nodeType + ' @ ' + job.url);

          job.logger.nextAndDone = function verboseRenderLogger () {

            nextAndDone();
            verboseLogger.nextAndDone();
          };
        }

        return self[job.nodeType].run({
          'nodeType': job.nodeType,
          'logger': job.logger,
          'meta': job.meta,
          'url': job.url,
          'name': job.name
        });
      }
    },

    'whenPageIsRendering': function (url, data) {

      var self = this;
      self.trigger('page:rendering', url, data);
    }
  });
});