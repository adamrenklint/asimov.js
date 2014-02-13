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
  '../nodes/Crawler',
  '../nodes/Watcher',
  '../render/Queue',
  '../render/Templates',
  '../render/TemplateHelpers',
  '../server/Server',
  './Signature'

], function (Base, Config, Cache, Crawler, Watcher, Queue, Templates, TemplateHelpers, Server, Signature) {

  var _super = Base.prototype;

  return Base.extend({

    'namespace': 'Loader',

    'initialize': function () {

      var self = this;
      _super.initialize.apply(self, arguments);

      self.logger.baseDir = self.options.baseDir;
      self.logger.frameworkDir = self.options.frameworkDir;

      // Start the pretty intro, and when it's done,
      // release the beast
      var signature = new Signature(self.options);
      signature.animate(self.bootstrap.bind(self));
    },

    'bootstrap': function () {

      var self = this;
      var meta = self.options.meta;

      self.logger.startTimer();

      var startString = 'Starting server application "' + meta.name + '" @ ' + meta.version;
      var starting = self.logger.wait(self.namespace, startString.bold);
      self.logger.info(self.namespace, 'The time is ' + new Date(), false);

      // Pass in the options to merge them with the environment config
      var config = new Config(self.options);

      // Start the real bootstrap chain
      var crawler = new Crawler(config.json);

      crawler.crawl().done(function (pages, realPaths) {

        config.json.map = pages;
        config.json.realPaths = realPaths;

        var templates = config.json.templates = new Templates(config.json);
        var helpers = new TemplateHelpers(config.json);
        var queue = new Queue(config.json);
        var server = new Server(config.json);
        var cache = new Cache(config.json);
        var watcher = new Watcher(config.json);

        self.bindTo(crawler, 'changed', queue.add);
        self.bindTo(server, 'fromCache', cache.find);
        self.bindTo(queue, 'processed', cache.set);
        self.bindTo(queue, 'processed', watcher.watch);
        self.bindTo(queue, 'page:rendering', helpers.setUrl);
        self.bindTo(cache, 'notFound', queue.prio);
        self.bindTo(cache, 'found', server.respond);
        self.bindTo(helpers, 'queue', queue.add);
        self.bindTo(watcher, 'queue', queue.add);
        self.bindTo(watcher, 'changed:template', templates.readTemplates);
        self.bindTo(watcher, 'changed:page', crawler.update);

        self.bindOnceTo(queue, 'empty', starting.done);

        server.start();

        helpers.ready.done(function () {
          queue.reset(pages);
        });
      });
    }
  });
});