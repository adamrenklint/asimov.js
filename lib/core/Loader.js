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
  './SiteDataCollection',
  '../nodes/Watcher',
  '../render/Queue',
  '../render/TemplatesCollection',
  '../render/TemplateHelpersCollection',
  '../server/Server',
  './Signature'

], function (Base, Config, Cache, PageNodesCollection, SiteDataCollection, Watcher, Queue, TemplatesCollection, TemplateHelpersCollection, Server, Signature) {

  var _super = Base.prototype;

  return Base.extend({

    'namespace': 'Loader',

    'initialize': function () {

      var self = this;
      _super.initialize.apply(self, arguments);

      self.logger.baseDir = process.cwd();
      self.logger.frameworkDir = self.options.frameworkDir;

      var signature = new Signature(self.options);
      signature.animate(self.bootstrap.bind(self));
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

      var loadedPageNodes = (new PageNodesCollection(null, config.json)).fetch(config.json.paths.content);
      var loadedTemplates = (new TemplatesCollection(null, config.json)).fetch(config.json.paths.templates);
      var loadedSiteData = (new SiteDataCollection(null, config.json)).fetch(config.json.paths.data);
      var loadedHelpers = (new TemplateHelpersCollection()).fetch(config.json.paths.helpers);

      self.when(loadedPageNodes, loadedTemplates, loadedSiteData, loadedHelpers).done(function () {

        var pages = config.json.pages = arguments[0][0];
        var templates = config.json.templates = arguments[1][0];
        var siteData = config.json.siteData = arguments[2][0];
        var helpers = config.json.helpers = arguments[3][0];

        var queue = new Queue(null, config.json);
        // var cache = new Cache(config.json);

        self.bindTo(pages, 'change:updatedAt', queue.add);
        // self.bindTo(queue, 'processed', cache.add);

        queue.reset(pages.models);
        queue.start();

        // helpers.each(function (model) {
        //   console.log(model.attributes);
        // });
        // process.exit(1);
      });

      /*

        what should happen?

        - the crawler crawls /content and returns a PageNodesCollection (<Collection, PageNode < Model)
          PageNode contains a MetaNodesCollection

        --- wait, why do I need the crawler - isn't the PageNodeList itself replacing the crawler?

        - create a TemplatesCollection (Template < Model)
        - create a TemplatesHelpersLoader();
        - create Queue, Server, Cache - no change

        - create Watcher
          watcher.watch(collection.models) for any model that has attrs.path
      */


      // crawler.crawl().done(function (pages, realPaths) {

      //   config.json.map = pages;
      //   config.json.realPaths = realPaths;

      //   var templates = config.json.templates = new Templates(config.json);
      //   var helpers = new TemplateHelpers(config.json);
      //
      //   var server = new Server(config.json);
      //   var cache = new Cache(config.json);
      //   var watcher = new Watcher(config.json);

      //   self.bindTo(templates, 'changed', crawler.updateTemplate);
      //   self.bindTo(crawler, 'changed', queue.add);
      //   self.bindTo(server, 'fromCache', cache.find);
      //   self.bindTo(queue, 'processed', cache.set);
      //   self.bindTo(queue, 'processed', watcher.watch);
      //   self.bindTo(queue, 'page:rendering', helpers.setUrl);
      //   self.bindTo(cache, 'notFound', queue.prio);
      //   self.bindTo(cache, 'found', server.respond);
      //   self.bindTo(helpers, 'queue', queue.add);
      //   self.bindTo(watcher, 'queue', queue.add);

      //   self.bindOnceTo(queue, 'empty', starting.done);

      //   server.start();

      //   helpers.ready.done(function () {
      //     queue.reset(pages);
      //   });
      // });
    }
  });
});