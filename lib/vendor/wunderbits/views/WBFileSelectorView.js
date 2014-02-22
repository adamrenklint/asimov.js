define([

  '../lib/dependencies',
  '../WBView'

], function (dependencies, WBView, undefined) {

  'use strict';

  var _ = dependencies._;
  var $ = dependencies.$;
  var _super = WBView.prototype;

  var fileSelectorMarkup = '<input type="file" multiple style="display:none" />';
  // bind drop events on document globally
  // and use document as a publishing channel too
  var doc = $(document.body);
  function cancel (e) {

    e = e.originalEvent || e;
    e.preventDefault();
    e.stopPropagation();
    return false;
  }

  function stop () {

    doc.trigger('drop:stop');
  }

  var stopTimer;
  doc.bindDrops = function () {

    // Hack jquerypp's dragover special treatment
    var oldDragover = $.event.special.dragover;
    $.event.special.dragover = null;

    doc.on('dragstart', function (e) {

      doc.trigger('drag:origin', e.target);
    });

    // publish drop starts
    doc.on('dragover', function (e) {

      doc.trigger('drop:start');
      cancel(e);
      clearTimeout(stopTimer);
    });

    // give jq++ back what it had
    $.event.special.dragover = oldDragover;

    // Ignore drops on document
    doc.on('drop', function (e) {

      stop();
      cancel(e);
    });

    // publish drop cancellations
    doc.on('dragleave', function (e) {

      e = e.originalEvent || e;
      stopTimer = setTimeout(stop, 200);
    });

    doc.bindDrops = null;
  };

  var WBFileSelectorView = WBView.extend({

    'input': null,

    'events': {
      'click': 'select'
    },

    'initialize': function (options) {

      var self = this;
      options = options || {};
      _super.initialize.call(self);

      // bind drop events to document, if not done already
      doc.bindDrops && doc.bindDrops();

      // optionally use a custom drop target
      if(options.dropTarget && options.dropTarget.length) {
        self.dropTarget = options.dropTarget;
      }
      // or fall back to the view element as drop target
      else {
        self.dropTarget = self.$el;
      }

      // pass in a click block function
      if (options.blocker) {
        self.blocker = options.blocker;
      }

      // the urlBlocker is for giving the ability to decide which elements should get the dragover
      // state. Unfortunately, the state is global. This would specifically fix an instance where
      // the detail view and settings modal are open, and when a picture is dragged into the window,
      // both would light up with dragover states.
      if (options.urlBlocker) {

        self.urlBlocker = options.urlBlocker;
      }

      // bind drag/drop events
      self._bindDropEvents();

      return self;
    },

    'select': function (e) {

      var self = this;

      if (self.blocker && self.blocker()) {
        return;
      }

      // prevent infinite loop
      if (e && $(e.target).is('input[type=file]')) {
        return;
      }

      // attach a file input to dom
      self.input = $(fileSelectorMarkup);
      self.$el.append(self.input);

      // trigger click on the file selector & handle selection
      self.input.on('change', function (e) {
        self._filesSelected(e);
      });
      self.input.click();
    },

    '_filesSelected': function (e) {

      var self = this;

      // remove the input selector & cleanup
      self.input.off('change', self._filesSelected);
      self.input.remove();
      self.input = null;

      // publish files
      var files = e.target.files;
      files.length && self.trigger('selected:files', files);
    },

    '_bindDropEvents': function () {

      var self = this;
      self.bindTo(doc, 'drop:start', self._dropStart);
      self.bindTo(doc, 'drop:stop', self._dropStop);
      self.bindTo(self.dropTarget, 'drop', self._drop);

      // global
      self.bindTo(doc, 'drag:origin', self._setOrigin);
      self.bindTo(doc, 'drop', self._drop);
    },

    '_setOrigin': function (e, target) {

      var self = this;
      self.dropOrigin = target;
    },

    '_dropStart': function () {

      var self = this;
      if (!self.urlBlocker || window.location.hash.indexOf(self.urlBlocker) === -1) {
        self.dropTarget.addClass('drop');
      }
    },

    '_dropStop': function () {

      var self = this;

      self.dropTarget.removeClass('drop');
    },

    '_drop':  function (e) {

      var self = this;
      cancel(e);
      e = e.originalEvent;

      // if there is an origin to this drop
      // e.g. drag started in the app, ignore it
      if (self.dropOrigin) {

        self.dropOrigin = null;
        self._dropStop();
        return;
      }

      self.dropTarget.removeClass('drop');

      var dataTransfer = e.dataTransfer;
      var files = dataTransfer.files;
      var items = dataTransfer.items;

      // Files
      if (files.length > 0) {

        // Handle folders in chrome
        if (items && 'webkitGetAsEntry' in items[0]) {
          var realFiles = [];
          _.each(items, function (item, index) {
            var entry = item.webkitGetAsEntry();
            if (entry && entry.isFile) { // !entry.isDirectory
              realFiles.push(files[index]);
            }
          });
          files = realFiles;
        }
        // Handle folders in firefox
        else {
          files = _.filter(files, function (file) {
            return file.size > 0;
          });
        }

        files.length && self.trigger('selected:files', files);
      }
      // Dropped Text
      else {

        // copy the text
        dataTransfer.dropEffect = 'copy';

        var text = e.dataTransfer.getData("text/plain");
        !!text && self.trigger('dropped:text', text);

        var html = e.dataTransfer.getData("text/html");
        !!html && self.trigger('dropped:html', html);
      }
    }

  });

  return WBFileSelectorView;
});