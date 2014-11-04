var assert          = require("assert");
var FootballTeam    = require('../src/FootballTeam');
var FootballPlayer  = require('../src/FootballPlayer');

describe('Football Team', function(){

  beforeEach(function(){
    this.player1 = new FootballPlayer();
    this.player1.position = 'RB';
    this.player1.salary = 100;
    this.player1.expected = 10;

    this.player2 = new FootballPlayer();
    this.player2.position = 'RB';
    this.player2.salary = 200;
    this.player2.expected = 15;

    this.player3 = new FootballPlayer();
    this.player3.position = 'QB';
    this.player3.salary = 150;

    this.team = new FootballTeam();
    this.team.addPlayer(this.player1);
    this.team.addPlayer(this.player2);
    this.team.addPlayer(this.player3);

  });

  describe('addPlayer', function(){
    it('should add a player to its player list', function(){
      var player = new FootballPlayer();
      var team = new FootballTeam();
      team.addPlayer(player);
      assert.equal(1, team.players.length);

    });
  });

  describe('getSalary', function(){
    it('should add up the players salaries',function(){
      assert.equal(450, this.team.getSalary());
    });
  });

  describe('getExpectedPoints', function(){
    it('should add up the players expectedPoints',function(){
      assert.equal(25, this.team.getExpectedPoints());
    });
  });

  describe('getExpectedPointsWithPlayer', function(){
    it('should add up teams expectedPoints plus new player',function(){
      var player = new FootballPlayer();
      player.expected = 5;
      assert.equal(30, this.team.getExpectedPointsWithPlayer(player));
    });

    it('should not add the player to the team',function(){
      var player = new FootballPlayer();
      player.ffpg = 5;
      assert.equal(3, this.team.players.length);
    });
  });

  describe('getPlayersByPosition', function(){
    it('should return number of players at position',function(){
      assert.equal(2, this.team.numPlayersAtPosition('RB'));
      assert.equal(1, this.team.numPlayersAtPosition('QB'));
    });

    it('should return zero if there are no players at the position',function(){
      assert.equal(0, this.team.numPlayersAtPosition('K'));
    });
  });

  describe('canAddPlayer', function(){
    it('true if there is space for a player at his position',function(){
      var player = new FootballPlayer();
      player.position = 'WR';
      assert.equal(true,this.team.canAddPlayer(player));
    });

    it('false if position is already filled',function(){
      var player = new FootballPlayer();
      player.position = 'RB';
      assert.equal(false,this.team.canAddPlayer(player));
      player.position = 'QB';
      assert.equal(false,this.team.canAddPlayer(player));
    });

    it('false if total salary exceeds cap',function(){
      var player = new FootballPlayer();
      player.position = 'WR';
      player.salary = 2000;
      this.team.salaryCap = 1000;
      assert.equal(false,this.team.canAddPlayer(player));
    });
  });

  describe('tryAddPlayer', function(){
    it('true if player added',function(){
      var player = new FootballPlayer();
      player.position = 'WR';
      assert.equal(true,this.team.tryAddPlayer(player));
      assert.equal(4,this.team.players.length);
    });

    it('false if player not added',function(){
      var player = new FootballPlayer();
      player.position = 'RB';
      assert.equal(false,this.team.tryAddPlayer(player));
      assert.equal(3,this.team.players.length);
    });

  });

  describe('clone', function(){
    it('creates a new team identical to itself',function(){
      var team = this.team.clone();
      assert.equal(team.players.length, this.team.players.length);
    });

    it('creates a deep copy of the player list',function(){
      var team = this.team.clone();
      var player = new FootballPlayer();
      player.position = 'WR';
      team.addPlayer(player);
      assert.equal(4, team.players.length);
      assert.equal(3, this.team.players.length);
    });

    it('creates a shallow copy of the players',function(){
      var team = this.team.clone();
      this.team.players[0].salary = 999;
      assert.equal(999, this.team.players[0].salary);
      assert.equal(999, team.players[0].salary);
    });
  });
});
