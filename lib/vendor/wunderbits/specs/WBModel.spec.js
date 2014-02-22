describe('WBModel', function () {

  var topic, Topic;

  beforeEach(function (done) {
    requirejs([
        'wunderbits/WBModel'
    ], function (WBModel) {

      Topic = WBModel;
      topic = new Topic();
      done();
    });
  });

  it('should be a subclass of Backbone.Model', function () {

    topic.should.be.instanceOf(Backbone.Model);
  });

  describe('#initialize', function () {

    it('should assign each instance a unique attribute', function () {

      var idMap = {};
      var iterations = 10;
      var model;

      while (iterations--) {

        model = new Topic();

        model.uid.should.be.a('string');

        idMap.should.not.include.keys(model.uid);
        idMap[model.uid] = model;
      }
    });
  });
});