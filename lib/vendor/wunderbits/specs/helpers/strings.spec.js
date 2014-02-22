describe('Strings Helper', function () {

  'use strict';

  var Topic;
  var string, result;

  beforeEach(function (done) {
    requirejs([
      'wunderbits/helpers/strings'
    ], function (Strings) {

      Topic = Strings;
      string = 1;
      result = 2;
      done();
    });
  });

  describe('#contains', function () {

    var haystack = ['a', 'b', 'c'];
    var nonExisting = 'bb';
    var existing = 'b';
    var nonExistingArray = ['f', 'g'];
    var existingArray = ['7','c'];

    describe('given a single needle as argument', function () {

      describe('given that the needle exists in the haystack', function () {

        it('should return true', function () {

          Topic.contains(haystack, existing).should.be.true;
        });
      });

      describe('given that the needle does not exist in the haystack', function () {

        it('should return false', function () {

          Topic.contains(haystack, nonExisting).should.be.false;
        });
      });
    });

    describe('given an array of needles as needle', function () {

      describe('given that one of the needles exists in the haystack', function () {

        it('should return true', function () {

          Topic.contains(haystack, existingArray).should.be.true;
        });
      });

      describe('given that none of the needles exists in the haystack', function () {

        it('should return false', function () {

          Topic.contains(haystack, nonExistingArray).should.be.false;
        });
      });
    });
  });


  describe('#trim', function () {

    var original = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec mauris odio, euismod eget convallis eu, lacinia et urna. Quisque ac massa augue, ac pellentesque enim. Donec placerat sapien quis urna cursus eleifend. Aliquam varius vulputate leo, et sollicitudin orci dapibus vitae. Vivamus ut orci eget orci cursus ornare. Sed ullamcorper feugiat ante, id euismod mi ornare a. In et magna purus. Integer et ipsum vitae leo fermentum dapibus. Nunc ut vehicula lectus. Curabitur risus eros, consectetur a auctor sed, sagittis commodo mauris. Nulla ultricies iaculis lacus vitae pulvinar. Aenean egestas urna id risus hendrerit interdum. Curabitur facilisis ligula eu mauris tristique eleifend. Pellentesque blandit leo quis lectus consectetur facilisis. Vivamus non urna quis mauris bibendum ultricies. Curabitur semper risus eu felis posuere malesuada. Quisque interdum, erat sed tristique scelerisque, quam tellus faucibus metus, id pharetra metus mi nec metus. Proin varius tellus at mi tempus at condimentum tortor egestas. Morbi scelerisque facilisis metus venenatis fermentum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. In in nunc eu lorem ultrices imperdiet a sed justo. Nam vel dolor leo, eu tincidunt felis. Ut gravida blandit justo, quis viverra turpis gravida ultrices. Duis pharetra tincidunt rhoncus. Nulla facilisi. Fusce gravida, sapien quis faucibus fringilla, leo risus laoreet lacus, non vehicula justo sapien sed dolor.';

    var fiveHundred = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec mauris odio, euismod eget convallis eu, lacinia et urna. Quisque ac massa augue, ac pellentesque enim. Donec placerat sapien quis urna cursus eleifend. Aliquam varius vulputate leo, et sollicitudin orci dapibus vitae. Vivamus ut orci eget orci cursus ornare. Sed ullamcorper feugiat ante, id euismod mi ornare a. In et magna purus. Integer et ipsum vitae leo fermentum dapibus. Nunc ut vehicula lectus. Curabitur risus eros, consectet...';

    it('should trim a text longer than 500 characters to exactly 500 characters', function () {

      var result = Topic.trim(original);

      result.should.equal(fiveHundred);
      result.length.should.equal(500);
    });

    it('should trim a text longer then the limit to exactly the limit amount of characters', function () {

      var string = 'I am some characters long string';
      var result = Topic.trim(string, 10);
      result.length.should.equal(10);
    });

    it('should append "..." if string was trimmed', function () {

      var string = 'I am some characters long string';
      var result = Topic.trim(string, 10);
      result = result.substr(result.length - 3, result.length);

      result.should.equal('...');
    });

    it('should remove leading whitespace', function () {

      Topic.trim(' asdak kasld kasd').should.equal('asdak kasld kasd');
    });

    it('should remove trailing whitespace', function () {

      Topic.trim('asdak kasld kasd ').should.equal('asdak kasld kasd');
    });
  });

  describe('#pad', function () {

    it('should return a string representation of a number of a minimum length padded with leading zeroes', function () {

      var nums = [

        2,
        3,
        4,
        5
      ];

      var expected = [

        '02',
        '003',
        '0004',
        '00005'
      ];

      nums.forEach(function (num, index) {

        var string = Topic.pad(num, num);
        string.should.be.equal(expected[index]);
      });
    });
  });

  describe('#sanitizeHash', function () {

    function testHash(string, expected) {

      var result = Topic.sanitizeHash(string);
      result.should.be.equal(expected);
    }

    function testHashRemoval(id) {

      Topic.sanitizeHash('#/tasks/' + id).should.not.contain(id);
      testHash('#/tasks/' + id, '#/tasks/FILTERED');

      Topic.sanitizeHash('#/lists/' + id).should.not.contain(id);
      testHash('#/lists/' + id, '#/lists/FILTERED');

      testHash('#/tasks/' + id + '/more/stuff', '#/tasks/FILTERED/more/stuff');
      testHash('#/lists/' + id + '/what/ever', '#/lists/FILTERED/what/ever');
    }

    it('should remove local web hashes', function () {

      testHashRemoval('lw123456789012345678901234567890');
    });

    it('should remove hashed api ids', function () {

      testHashRemoval('12345678901234567890123456789012');
    });

    it('should remove tokens from facebook login', function () {

      testHash('#/login/&access_token=sdlfkj23984sldkfj230948', '#/login/FACEBOOK_LOGIN');
    });

    it('should remove data from extension adds', function () {

      testHash('#/extension/add/I%20am%20any%20title/http://www.6wunderkinder.com/wunderlist/whatever/something', '#/extension/add/FILTERED/FILTERED');
    });

    it('should remove data from reset password', function () {

      testHash('#/reset/password/blah/blah', '#/reset/password/FILTERED/FILTERED');
    });

    it('should remove data from connect facebook', function () {

      testHash('#/connect/facebook/blah/blah', '#/connect/facebook/FILTERED/FILTERED');
    });

    it('should remove data from add', function () {

      testHash('#/add/?params', '#/add/FILTERED');
    });

    it('should remove data from search', function () {

      testHash('#/search/blah', '#/search/FILTERED');
    });

    it('should remove data from minisite route', function () {

      testHash('#/shared/private/stuff', '#/shared/FILTERED/FILTERED');
    });

    it('should remove data from minisite facebook route', function () {

      testHash('#/shared/fb/token', '#/shared/fb/FILTERED');
    });

    it('should remove return route data on connect facebook from share', function () {

      testHash('#/lists/lw123456789012345678901234567890/share&access_token', '#/lists/FILTERED/share/CONNECT_FACEBOOK_RETURN');
    });

    it('should remove return route data on share via facebook', function () {

      testHash('#/lists/lw123456789012345678901234567890/share?nstuff', '#/lists/FILTERED/share/FACEBOOK_SHARE_RETURN');
    });

    it('should not remove non MD5 hashed list ids', function () {

      testHash('#/lists/today', '#/lists/today');
    });
  });

  describe('#convertValueToString', function () {

    var types = {
      'boolean': {
        'true': true,
        'false': false
      },
      'number': {
        '27893': 27893,
        '0.12321': 0.12321,
        '-83': -83
      },
      'null': null
    };

    function assertTypeAsString (value, key, collection, description) {

      description = (description || '') + ' ' + key;

      if (_.isObject(value)) {

        _.each(value, function (nestedValue, nestedKey) {
          assertTypeAsString(nestedValue, nestedKey, collection, description);
        });
      }
      else {

        it('should convert type ' + description + ' to string "' + key + '"', function () {

          Topic.convertValueToString(value).should.equal(key);
        });
      }
    }

    _.each(types, assertTypeAsString);
  });
});