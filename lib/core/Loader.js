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
      var queue = config.json.queue = new Queue(null, config.json);

      var loadedPageNodes = (new PageNodesCollection(null, config.json)).fetch(config.json.paths.content);
      var loadedTemplates = (new TemplatesCollection(null, config.json)).fetch(config.json.paths.templates);
      var loadedSiteData = (new SiteDataCollection(null, config.json)).fetch(config.json.paths.data);
      var loadedHelpers = (new TemplateHelpersCollection(null, config.json)).fetch(config.json.paths.helpers);

      self.when(loadedPageNodes, loadedTemplates, loadedSiteData, loadedHelpers).done(function () {

        var pages = config.json.pages = arguments[0][0];
        pages.ensureErrorPages();

        var templates = config.json.templates = arguments[1][0];
        var siteData = config.json.siteData = arguments[2][0];
        var helpers = config.json.helpers = arguments[3][0];

        var cache = config.json.cache = new Cache(null, config.json);
        var server = new Server(config.json);

        self.bindTo(pages, 'change:updatedAt', queue.add);
        self.bindTo(helpers, 'queue', queue.add);
        self.bindTo(queue, 'processed', cache.add);
        self.bindTo(server, 'fromCache', cache.find);
        self.bindTo(cache, 'notFound', queue.prio);
        self.bindTo(cache, 'found', server.respond);
        self.bindTo(queue, 'page:rendering', helpers.setUrl);
        self.bindOnceTo(queue, 'empty', starting.done);

        queue.reset(pages.models);
        queue.start();

        server.start();

        // helpers.each(function (model) {
        //   console.log(model.attributes);
        // });
        // process.exit(1);
      });
    }
  });
});