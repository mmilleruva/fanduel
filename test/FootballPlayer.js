var assert          = require("assert");
var FootballPlayer  = require('../src/Player');

describe('Football Player', function(){
  describe('Properties', function(){
    it('Should have a default ffpg of zero', function(){
      var player = new FootballPlayer();
      assert.equal(0,player.ffpg);
    });

    it('Should have getExpectedPoints be zero by default', function(){
      var player = new FootballPlayer();
      assert.equal(0,player.getExpectedPoints());
    });
  });
});
