var libPath = '../../lib/';
var MetaNode = require(libPath + 'nodes/MetaNode');
var Test = require(libPath + 'runner/Test');

Test.run('nodes/MetaNode', function (test) {

  var instance;

  test.beforeEach(function () {

    instance = new MetaNode();
  });

  test.spec('parseRawMeta (string raw)', function () {

    test.when('multiple delimiter sizes are used', function () {

      test.it('should extract each content block', function () {

        var raw = 'foo: asd\n\n--\n\nbar: asdf\n------\nbaz: asdfe';
        var result = instance.parseRawMeta(raw);

        expect(Object.keys(result).length).to.equal(3);
        expect(result.foo).to.equal('asd');
        expect(result.bar).to.equal('asdf');
        expect(result.baz).to.equal('asdfe');
      });
    });
  });
});