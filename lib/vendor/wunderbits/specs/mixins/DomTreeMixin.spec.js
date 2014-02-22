describe('DomTreeMixin', function () {

  'use strict';

  var view;

  beforeEach(function (done) {

    requirejs([
      'wunderbits/WBView',
      'wunderbits/mixins/DomTreeMixin'
    ], function (WBView, DomTreeMixin) {

      view = new WBView();
      DomTreeMixin.applyTo(view);

      done();
    });
  });

  afterEach(function () {

    view.destroy();
  });

  describe('#walkTextNodes', function () {

    var spy, first, second, third;

    beforeEach(function () {

      spy = sinon.spy();

      first = document.createTextNode('one');
      second = document.createTextNode('two');
      third = document.createTextNode('three');

      var outer = document.createElement('div');
      var inner = document.createElement('span');
      outer.appendChild(inner);
      outer.appendChild(second);
      inner.appendChild(third);

      view.el.appendChild(first);
      view.el.appendChild(outer);
    });

    it('should apply fn on all text nodes', function () {

      view.walkTextNodes(view.el, spy, null);

      expect(spy).to.have.been.calledThrice;
      expect(spy).to.have.been.calledWith(first);

      // wierd JSDOM bug, works for first,
      // but deepEqual for second & third goes into a recursive infinite loop
      if (!isNode) {
        expect(spy).to.have.been.calledWith(second);
        expect(spy).to.have.been.calledWith(third);
      }
    });

    it('should only walk the top level text nodes, if marked as non-recursive', function () {

      view.walkTextNodes(view.el, spy, view, false);

      expect(spy).to.have.been.calledOnce;
      expect(spy).to.have.been.calledWith(first);
    });
  });
});
