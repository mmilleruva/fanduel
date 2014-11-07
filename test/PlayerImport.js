var assert          = require("assert");
var FootballPlayer  = require('../src/Player');
var PlayerImport    = require('../src/PlayerImport');

describe('PlayerImport', function(){

  describe('buildPlayer', function(){
    it('should create a player', function(){
      var playerData = ['John Doe', 'Tampa', 'WR',1,2];
      var fieldList = ['name','team', 'position', 'salary', 'ffpg' ];

      var result = PlayerImport.buildPlayer(playerData, fieldList, FootballPlayer);

      assert.equal('John Doe', result.name);
      assert.equal(2, result.ffpg);

    });

  });

  describe('importPlayerData', function(){

    it('should load test data', function(done){
      var path = __dirname + '/data/PlayerData.csv';
      var fields = ['position', 'name', 'ffpg', 'salary'];
      var result = PlayerImport.importPlayerData(path, fields, FootballPlayer,
        function(result){
          assert.equal(5, result.length);
          assert.equal('Aaron Rodgers', result[0].name);
          done();
        });
    });
  });

});
