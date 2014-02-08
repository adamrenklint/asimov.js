define([

  './lib/dependencies',
  './lib/createUID',

  './mixins/WBSubviewsMixin',
  './mixins/WBBindableMixin',
  './mixins/WBEventsMixin',
  './mixins/WBStylesApplierMixin',
  './mixins/HidableViewMixin',
  './mixins/LocalizedViewMixin',
  './mixins/ABTestableMixin',
  './mixins/PathLinksViewMixin',
  './mixins/WBDeferrableMixin'

], function (
  dependencies, createUID,
  WBSubviewsMixin, WBBindableMixin, WBEventsMixin, WBStylesApplierMixin,
  HidableViewMixin, LocalizedViewMixin, ABTestableMixin, PathLinksViewMixin,
  WBDeferrableMixin,
  undefined
) {

  'use strict';

  var Backbone = dependencies.Backbone;
  var _ = dependencies._;
  var w_ = dependencies.w_;

  var _super = Backbone.View.prototype;

  return Backbone.View.extend({

    'renderData': {},
    'state': {},
    'styles': [],

    'initialize': function () {

      var self = this;

      //w_.bindAll.apply(self, w_.functions(self));

      self.uid = createUID();

      // Enable inheritance of renderData and state to subclasses
      // Must be done before the mixins are applied, specifically the styles mixin as it will apply the styles right away
      self.renderData = self._mergeFromSuper(self, 'renderData');
      self.state = self._mergeFromSuper(self, 'state');
      self.styles = self._concatFromSuper(self, 'styles');

      WBSubviewsMixin.applyTo(self);
      WBBindableMixin.applyTo(self);
      WBEventsMixin.applyTo(self);
      LocalizedViewMixin.applyTo(self);
      ABTestableMixin.applyTo(self);
      WBStylesApplierMixin.applyTo(self);
      PathLinksViewMixin.applyTo(self);
      HidableViewMixin.applyTo(self);
      WBDeferrableMixin.applyTo(self);

      self.bindTo(self, 'destroyed:subview', self.unbindFromTarget);

      _super.initialize.apply(self, arguments);

      self.localize();

      // TODO: options are not being passed, and that breaks stuff
      // var _render = _.debounce(self.render.bind(self), 1);
      // self.render = function () {
      //   _render();
      //   return self;
      // };
    },

    '_mergeFromSuper': function (instance, key) {

      var self = this;
      var baseData = instance[key];

      if (instance.constructor && instance.constructor.__super__) {
        baseData = w_.merge(self._mergeFromSuper(instance.constructor.__super__, key), baseData);
      }

      return _.extend({}, baseData);
    },

    '_concatFromSuper': function (instance, key) {

      var self = this;
      var baseData = instance[key] || [];

      if (instance.constructor && instance.constructor.__super__) {
        baseData = [].concat(self._concatFromSuper(instance.constructor.__super__, key), baseData);
      }

      return [].concat(baseData);
    },

    'formatData': function (data) {

      var self = this;
      self.renderData || (self.renderData = {});
      data && w_.merge(self.renderData, data);
      return self.renderData;
    },

    'render': function (data) {

      var self = this;

      data || (data = {});
      data = self.formatData(data);

      self.$el.empty();

      if (typeof self.template === 'function') {
        self.$el.html(self.template(data || {}));
      }

      self.renderLocalized();

      self.setupPathLinksHandler();

      if (self.ABMode) {
        self.renderAB();
      }

      self.delegateEvents();

      self.isRendered = true;

      return self;
    }
  });
});