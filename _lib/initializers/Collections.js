var Initializer = require('./Initializer');
var PageNodesCollection = require('../nodes/PageNodesCollection');
var StyleSheetNodesCollection = require('../nodes/StyleSheetNodesCollection');
var ScriptNodesCollection = require('../nodes/ScriptNodesCollection');
var TemplatesCollection = require('../render/TemplatesCollection');
var SiteDataCollection = require('../core/SiteDataCollection');
var TemplateHelpersCollection = require('../render/TemplateHelpersCollection');
var _ = require('lodash');

var _super = Initializer.prototype;

module.exports = Initializer.extend({

  'run': function (next) {

    var self = this;
    var options = self.options;

    // Create our resource collections - ORDER IS IMPORTANT!
    options.templates = new TemplatesCollection(null, options);
    options.pages = new PageNodesCollection(null, options);
    options.siteData = new SiteDataCollection(null, options);
    options.helpers = new TemplateHelpersCollection(null, options);

    // This makes sure all page nodes, even in sub collections,
    // have access to the master collection with all pages
    // self.mediator.publish('collection:pages', options.pages);

    self.options = options;
    next();
  }
});
