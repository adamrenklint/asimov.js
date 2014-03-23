/*

  site data collection class

  loads the arbitrary data files

*/

define([

  '../nodes/PageNodesCollection',
  '../nodes/MetaNode',
  'lodash'

], function (PageNodesCollection, MetaNode, _) {

  var _super = PageNodesCollection.prototype;

  return PageNodesCollection.extend({

    'namespace': 'SiteDataCollection',

    'filetype': 'data file',

    'model': MetaNode,

    'initialize': function (options) {

      var self = this;
      _super.initialize.apply(self, arguments);
    },

    'getJSON': function () {

      var self = this;
      var json = {};

      self.each(function (model) {
        _.each(model.attributes, function (value, key) {
          json[key] = value;
        });
      });

      json.root = "/";

      return json;
    }
  });
});