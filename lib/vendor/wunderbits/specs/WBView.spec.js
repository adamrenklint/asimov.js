describe('WBView', function () {

  'use strict';

  var topic, Topic, Backbone;

  beforeEach(function (done) {
    requirejs([
      'vendor/backbone',
      'wunderbits/WBView'
    ], function (_Backbone, WBView) {

      Backbone = _Backbone;
      Topic = WBView;
      topic = new Topic();

      done();
    });
  });

  it('should be a subclass of Backbone.View', function () {

    topic.should.be.instanceOf(Backbone.View);
  });

  describe('#initialize', function () {

    it('should assign each instance a unique attribute', function () {

      var idMap = {};
      var iterations = 10;
      var view;

      while (iterations--) {

        view = new Topic();

        view.uid.should.be.a('string');

        idMap.should.not.include.keys(view.uid);
        idMap[view.uid] = view;
      }
    });

    it('should listen for "destroyed:subview" and unbind all bindings with that subview as target', function () {

      var view = new Topic();
      var spy = sinon.spy();
      var view2 = new Topic();
      view.addSubview(view2);
      var binding = view.bindTo(view2, 'any:event', spy);

      expect(!!view._bindings[binding.uid]).to.be.true;

      view2.destroy();

      expect(!!view._bindings[binding.uid]).to.be.false;
    });

    function testMergeSuperClassData (key) {

      it('should merge "' + key + '" from every SuperClass when subclassing', function () {

        var firstClassData = {};
        firstClassData[key] = {
          'foo': 'bar',
          'bar': 'baz'
        };
        var FirstClass = Topic.extend(firstClassData);

        var secondClassData = {};
        secondClassData[key] = {
          'boo': 'far'
        };
        var SecondClass = FirstClass.extend(secondClassData);

        var thirdClassData = {};
        thirdClassData[key] = {
          'bar': 'zlatan'
        };
        var ThirdClass = SecondClass.extend(thirdClassData);

        var instance = new ThirdClass();

        expect(instance[key].foo).to.equal('bar');
        expect(instance[key].bar).to.equal('zlatan');
        expect(instance[key].boo).to.equal('far');

        var instance2 = new FirstClass();

        expect(instance2[key].foo).to.equal('bar');
        expect(instance2[key].bar).to.equal('baz');
        expect(instance2[key].boo).to.be.undefined;
      });
    }

    _.each(['renderData', 'state'], testMergeSuperClassData);
  });
});