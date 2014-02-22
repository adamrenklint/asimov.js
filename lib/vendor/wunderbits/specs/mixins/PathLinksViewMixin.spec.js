describe('PathLinksViewMixin', function () {

  'use strict';

  var view, wbRuntime;

  beforeEach(function (done) {

    requirejs([
      'wunderbits/WBRuntime',
      'views/Toolbar/ToolbarView',
      'templates/toolbars'
    ], function (WBRuntime, ToolbarView, template) {

      wbRuntime = WBRuntime;

      view = new ToolbarView();
      view.template = template;

      view.render();

      done();
    });
  });

  it('should trigger route path when anchor with data-path is clicked', function () {
  
    var spy = new sinon.spy();
    wbRuntime.on('route:me', spy);

    view.$('#user').click();

    expect(spy).to.have.been.called.once;
  });
});