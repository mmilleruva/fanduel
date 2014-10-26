var assert          = require("assert");
var FootballPlayer  = require('../src/FootballPlayer');

describe('Football Player', function(){
  describe('Properties', function(){
    it('Should have a default ffpg of zero', function(){
      var player = new FootballPlayer();
      assert.equal(0,player.ffpg);
    });
  });
});
