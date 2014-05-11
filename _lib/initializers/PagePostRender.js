var Initializer = require('./Initializer');
var _super = Initializer.prototype;

module.exports = Initializer.extend({

  'run': function (next) {

    var self = this;
    var options = self.options;

    self.bindTo(self.mediator, 'post:render:page', 'postRender');

    next();
  },

  'postRender': function (page) {

    var self = this;
    var rendered = page.attributes.rendered;

    if (process.env.ENV !== 'production') {
      rendered = rendered.replace('</head>', '<script>document.write(\'<script src="http://\' + (location.host || \'localhost\').split(\':\')[0] + \':' + self.options.reloadPort + '/livereload.js"></\' + \'script>\')</script></head>');
    }

    if (rendered.indexOf('favicon') < 0 || rendered.indexOf('shortcut icon') < 0 ) {
      rendered = rendered.replace('</head>', '<link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" /></head>');
    }

    page.set({ 'rendered': rendered }, { 'silent': true });
  }
});