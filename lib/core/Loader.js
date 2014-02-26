/*

  loader class

  loads the environment config,
  starts the signature animation,
  bootstraps main components
  and hooks up their communication

*/

define([

  './Base',
  './Config',
  '../server/Cache',
  '../nodes/PageNodesCollection',
  '../nodes/StyleSheetNodesCollection',
  './SiteDataCollection',
  '../watcher/Watcher',
  '../render/Queue',
  '../render/TemplatesCollection',
  '../render/TemplateHelpersCollection',
  '../server/Server',
  './Signature',
  'lodash'

], function (Base, Config, Cache, PageNodesCollection, StyleSheetNodesCollection, SiteDataCollection, Watcher, Queue, TemplatesCollection, TemplateHelpersCollection, Server, Signature, _) {

  var _super = Base.prototype;

  return Base.extend({

    'namespace': 'Loader',

    'initialize': function () {

      var self = this;
      _super.initialize.apply(self, arguments);

      self.logger.baseDir = process.cwd();
      self.logger.frameworkDir = self.options.frameworkDir;

      var signature = new Signature(self.options);
      signature.animate(self.bootstrap);
    },

    'bootstrap': function () {

      var self = this;
      var meta = self.options.meta;

      self.logger.startTimer();

      var startString = 'Starting application "' + meta.name + '" @ ' + meta.version;
      var starting = self.logger.wait(self.namespace, startString.bold);
      self.logger.info(self.namespace, 'The time is ' + new Date(), false);

      // Pass in the options to merge them with the environment config
      var config = new Config(self.options);
      var queue = config.json.queue = new Queue(null, config.json);

      var styleSheets = config.json.styleSheets = new StyleSheetNodesCollection(null, config.json);

      var pages = config.json.pages = new PageNodesCollection(null, config.json);
      // var loadedPageNodes = ().fetch(config.json.paths.content);
      var loadedTemplates = (new TemplatesCollection(null, config.json)).fetch(config.json.paths.templates);
      var loadedSiteData = (new SiteDataCollection(null, config.json)).fetch(config.json.paths.data);
      var loadedHelpers = (new TemplateHelpersCollection(null, config.json)).fetch(config.json.paths.helpers);

      self.when(loadedTemplates, loadedSiteData, loadedHelpers).done(function () {

        // var pages =  = arguments[0][0];
        pages.ensureErrorPages();

        var templates = config.json.templates = arguments[0][0];
        var siteData = config.json.siteData = arguments[1][0];
        var helpers = config.json.helpers = arguments[2][0];

        var cache = config.json.cache = new Cache(null, config.json);
        var server = new Server(config.json);
        var watcher = new Watcher(null, config.json);

        var collections = [pages];//, styleSheets];
        _.each(collections, function (collection) {
          self.bindTo(collection, 'change:raw', queue.add);
          self.bindTo(collection, 'change:rendered', cache.add);
        });

        // self.bindTo(pages, 'change:raw', queue.add);
        // self.bindTo(styleSheets, 'change:raw', queue.add);
        // self.bindTo(pages, 'change:rendered', cache.add);
        // self.bindTo(styleSheets, 'change:rendered', cache.add);

        // TODO: need collections for stylesheets and appBundles,
        // or make pages collection generic with an overriden add()
        // to choose the right model based on the raw data type

        // self.bindTo(helpers, 'queue', queue.add);
        // // self.bindTo(queue, 'processed', cache.add);
        // // self.bindTo(queue, 'processed', watcher.watch);
        self.bindTo(server, 'fromCache', cache.find);
        self.bindTo(cache, 'notFound', queue.prio);
        self.bindTo(cache, 'found', server.respond);
        self.bindTo(queue, 'page:rendering', helpers.setUrl);
        self.bindOnceTo(queue, 'empty', starting.done);

        queue.start();
        server.start();

        // pages.add({
        //   'raw': 'adaasd'
        // });

        pages.fetch(config.json.paths.content);

        // setTimeout(function () {
        //   _.each(watcher.attributes, function (value, key) {
        //     _.each(value, function (dep) {
        //       console.log(key + ' >>> ', dep.attributes.path + ' . ' + dep.id);
        //     });
        //   });
        //   process.exit(1);
        // }, 1000);

        // helpers.each(function (model) {
        //   console.log(model.attributes);
        // });
        // process.exit(1);
      });
    }
  });
});