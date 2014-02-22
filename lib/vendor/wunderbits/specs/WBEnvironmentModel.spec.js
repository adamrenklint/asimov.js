describe('WBEnvironmentModel', function () {

  var topic;

  beforeEach(function (done) {
    requirejs([
        'wunderbits/WBEnvironmentModel',

    ], function (WBEnvironmentModel) {

      topic = WBEnvironmentModel.init();

      done();
    });
  });

  describe('#isOnline', function () {

    it('should return true if there is an online connection', function () {

      topic._isOnline = true;

      topic.isOnline().should.be.true;
    });

    it('should return false if there is no online connection', function () {

      topic._isOnline = false;

      topic.isOnline().should.be.false;
    });

    it('should trigger online if it was previously offline', function () {

      var spy = sinon.spy();

      topic._isOnline = false;
      topic.on('online' , spy);

      topic._onOnlineConnection();

      spy.should.have.been.calledOnce;
    });

    it('should not trigger online if it was previously online', function () {

      var spy = sinon.spy();

      topic._isOnline = true;
      topic.on('online' , spy);

      topic._onOnlineConnection();

      spy.should.not.have.been.calledOnce;
    });

    it('should trigger offline if it was previously online', function () {

      var spy = sinon.spy();

      topic._isOnline = true;
      topic.on('offline' , spy);

      topic._onOfflineConnection();

      spy.should.have.been.calledOnce;
    });

    it('should not trigger offline if it was previously offline', function () {

      var spy = sinon.spy();

      topic._isOnline = false;
      topic.on('offline' , spy);

      topic._onOfflineConnection();

      spy.should.not.have.been.calledOnce;
    });
  });
});