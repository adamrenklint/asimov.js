/*

  site data collection class

  loads the arbitrary data files

*/

define([

  '../nodes/PageNodesCollection',
  '../nodes/MetaNode'

], function (PageNodesCollection, MetaNode) {

  var _super = PageNodesCollection.prototype;

  return PageNodesCollection.extend({

    'namespace': 'SiteDataCollection',

    'filetype': 'data file',

    'model': MetaNode,

    'initialize': function (options) {

      var self = this;
      _super.initialize.apply(self, arguments);
    }
  });
});