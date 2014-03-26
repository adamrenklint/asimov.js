/*

  base initializer class

*/

define([

  '../core/Initializer',
  '../nodes/PageNodesCollection',
  '../nodes/StyleSheetNodesCollection',
  '../nodes/ScriptNodesCollection',
  '../render/TemplatesCollection',
  '../core/SiteDataCollection',
  '../render/TemplateHelpersCollection',
  'lodash'

], function (Initializer, PageNodesCollection, StyleSheetNodesCollection, ScriptNodesCollection,TemplatesCollection, SiteDataCollection, TemplateHelpersCollection, _) {

  var _super = Initializer.prototype;

  return Initializer.extend({

    'run': function (next) {

      var self = this;
      var options = self.options;

      // Create our resource collections - ORDER IS IMPORTANT!
      options.styleSheets = new StyleSheetNodesCollection(null, options);
      options.scripts = new ScriptNodesCollection(null, options);
      options.templates = new TemplatesCollection(null, options);
      options.pages = new PageNodesCollection(null, options);
      options.siteData = new SiteDataCollection(null, options);
      options.helpers = new TemplateHelpersCollection(null, options);

      // This makes sure all page nodes, even in sub collections,
      // have access to the master collection with all pages
      self.mediator.publish('collection:pages', options.pages);

      self.options = options;
      next();
    }
  });
});