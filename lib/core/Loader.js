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
  '../nodes/PageNodesCollection',
  '../nodes/StyleSheetNodesCollection',
  '../nodes/ScriptNodesCollection',
  './SiteDataCollection',
  '../watcher/Watcher',
  '../render/Queue',
  '../render/OutputWriter',
  '../render/TemplatesCollection',
  '../render/TemplateHelpersCollection',
  '../server/Server',
  'lodash'

], function (Base, Config, PageNodesCollection, StyleSheetNodesCollection, ScriptNodesCollection, SiteDataCollection, Watcher, Queue, OutputWriter, TemplatesCollection, TemplateHelpersCollection, Server, _) {

  var _super = Base.prototype;

  return Base.extend({

    'initialize': function () {

      var self = this;
      _super.initialize.apply(self, arguments);

      self.logger.baseDir = process.cwd();
      self.logger.frameworkDir = self.options.frameworkDir;

      self.logger.pending('main', 'Loading asimov.js @ ' + self.options.pkg.version);
      self.logger.log('main', 'The time is ' + new Date());

      _.defer(self.bootstrap);
    },

    'runSequential': function (paths) {

      var self = this;
      var deferred = self.deferred();
      console.log('time to run initializers');
      // each path, find the file
      // create the initializer instance and exec run(),
      // receiving a next() function as callback
      return deferred.promise();
    },

    'bootstrap': function () {

      var self = this;
      var meta = self.options.meta;

      var started = new Date();
      self.logger.pending(self.namespace, 'Starting project "' + meta.name + '" @ ' + meta.version);

      // Pass in the options to merge them with the environment config
      var config = new Config(self.options);
      config.json.outputPath = process.cwd() + '/' + config.json.paths.outputDir;

      return self.runSequential(self.options.paths.initializers).done(function () {

        console.log('all initializers done!');
      });


      // INTITIALIZERS:

      // create all resource collections first
      // - initializers and middleware should have access to pages, and ?

      // then run all custom initializers
      // then run the framework initializer, which just calls fetch on the collections that need it

      // or should framework initializers go first?
      // or is both creating the collection and fetching initializers, two separate ones?


      // No fetching on these two collections, they will be populated
      // when style and script tags are included by template helpers
      var styleSheets = config.json.styleSheets = new StyleSheetNodesCollection(null, config.json);
      var scripts = config.json.scripts = new ScriptNodesCollection(null, config.json);

      var templates = config.json.templates = new TemplatesCollection(null, config.json);
      var pages = config.json.pages = new PageNodesCollection(null, config.json);
      var watcher = new Watcher(null, config.json);
      self.bindTo(templates, 'change:raw', watcher.watch);

      self.mediator.publish('collection:pages', pages);

      var server = new Server(config.json);
      var serverName = server.start();

      // if (process.argv.indexOf('--open') > 0) {
      //   _.defer(function () {
      //     self.child.execute('open ' + serverName);
      //   });
      // }

      // Load the building blocks
      var loadedTemplates = templates.fetch(config.json.paths.templates);
      var loadedSiteData = (new SiteDataCollection(null, config.json)).fetch(config.json.paths.data);
      var loadedHelpers = (new TemplateHelpersCollection(null, config.json)).fetch(config.json.paths.helpers);


      self.when(loadedTemplates, loadedSiteData, loadedHelpers).done(function () {

        // Deconstruct the weird promise payload, and give others access
        // var templates = config.json.templates = arguments[0][0];
        var siteData = config.json.siteData = arguments[1][0];
        var helpers = config.json.helpers = arguments[2][0];

        var output = new OutputWriter(config.json);
        var queue = new Queue(null, config.json);

        var collections = [pages, styleSheets, scripts];
        _.each(collections, function (collection) {
          self.bindTo(collection, 'change:raw', queue.add);
          self.bindTo(collection, 'change:rendered', output.write);
          self.bindTo(collection, 'change:rendered', watcher.watch);
          self.bindTo(collection, 'remove', output.clear);
        });

        self.bindOnceTo(queue, 'empty', function () {
          self.logger.since(self.namespace, 'Started project "' + meta.name + '"', started);
        });

        queue.start();

        pages.fetch(config.json.paths.content).done(function () {

          pages.ensureErrorPages();

          // _.each(modifiedTracker.getExisting(), function (oldModifiedAt, path) {

          //   if (path.indexOf('.styl') > 0) {
          //     var name = path.split('/').pop();
          //     var model = styleSheets.create({
          //       'name': name
          //     });

          //     self.defer(model.fetch);
          //   }
          // });

          // var changed = modifiedTracker.getModified();
          // watcher.forceChange(changed);
        });
      });
    }
  });
});