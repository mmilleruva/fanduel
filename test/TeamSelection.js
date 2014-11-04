var assert            = require("assert");
var TeamSelection     = require('../src/TeamSelection');
var FootballPlayer    = require('../src/FootballPlayer');
var FootballTeam      = require('../src/FootballTeam');

describe('TeamSelection', function(){

  beforeEach(function(){
      this.player1 = new FootballPlayer();
      this.player1.position = 'RB';
      this.player1.salary = 100;
      this.player1.expected = 1;

      this.player2 = new FootballPlayer();
      this.player2.position = 'RB';
      this.player2.salary = 200;
      this.player2.expected = 1;

      this.player3 = new FootballPlayer();
      this.player3.position = 'QB';
      this.player3.salary = 150;
      this.player3.expected = 1;

      this.player4 = new FootballPlayer();
      this.player4.position = 'WR';
      this.player4.salary = 200;
      this.player4.expected = 1;

      this.player5 = new FootballPlayer();
      this.player5.position = 'WR';
      this.player5.salary = 200;
      this.player5.expected = 1;

      this.player6 = new FootballPlayer();
      this.player6.position = 'WR';
      this.player6.salary = 200;
      this.player6.expected = 1;

      this.player7 = new FootballPlayer();
      this.player7.position = 'TE';
      this.player7.salary = 200;
      this.player7.expected = 1;

      this.player8 = new FootballPlayer();
      this.player8.position = 'K';
      this.player8.salary = 200;
      this.player8.expected = 1;

      this.player9 = new FootballPlayer();
      this.player9.position = 'D';
      this.player9.salary = 200;
      this.player9.expected = 1;

      this.player10 = new FootballPlayer();
      this.player10.position = 'K';
      this.player10.salary = 200;
      this.player10.expected = 1;

      this.players = [];
      this.players.push(this.player1);
      this.players.push(this.player2);
      this.players.push(this.player3);
      this.players.push(this.player4);
      this.players.push(this.player5);
      this.players.push(this.player6);
      this.players.push(this.player7);
      this.players.push(this.player8);
      this.players.push(this.player9);
      this.players.push(this.player10);
    });

  describe('initialize', function(){
    it('should create an empty array', function(){
      var theArray = TeamSelection.initialize(10);

      assert.equal(0,theArray[0][0].getExpectedPoints());
      assert.equal(0,theArray[0][9].getExpectedPoints());
      assert.equal(undefined,theArray[0][10]);

    })
  })

  describe('selectTeamRecursive', function(){

    it('should return empty team if there is no valid team', function(){

      var players = []
      players.push(this.player1);
      players.push(this.player2);
      players.push(this.player3);
       var team = new FootballTeam();
       var result = TeamSelection.selectTeamRecursive(players,team);

       assert.equal(0,result.getExpectedPoints());
    })

    it('should return a valid team if it exists', function(){

       var team = new FootballTeam();
       var result = TeamSelection.selectTeamRecursive(this.players,team);

       assert.equal(9,result.getExpectedPoints());
    })

    it('should choose the better player for a position', function(){

       this.player10.expected = 2;
       var team = new FootballTeam();
       var result = TeamSelection.selectTeamRecursive(this.players,team);

       assert.equal(10,result.getExpectedPoints());
    })


    it('should allow for small team', function(){

       var team = new FootballTeam();
       var players =
       [  new FootballPlayer({regression:{expected: 1}, position: 'RB', salary: 1}),
          new FootballPlayer({regression:{expected: 2}, position: 'RB', salary: 2}),
          new FootballPlayer({regression:{expected: 1}, position: 'RB', salary: 1}),
          new FootballPlayer({regression:{expected: 1}, position: 'WR', salary: 1}),
          new FootballPlayer({regression:{expected: 2}, position: 'WR', salary: 2}),
       ]
        team._validTeam = {
          'RB': 1,
          'WR': 1,
        }
        team._salaryCap = 4;
       var result = TeamSelection.selectTeamRecursive(players,team);

       assert.equal(4,result.getExpectedPoints());
    })
  })

  describe('filterPlayersByPosition', function(){
    it('should filter players by position', function(){
      var result = TeamSelection.filterPlayersByPosition(this.players, 'RB');
      assert.equal(2, result.length)
    })
  })

  describe('bestPlayerForCost', function(){
    it('should select the best player for cost', function(){
      this.players[2].ffpg = 10
      var result = TeamSelection.bestPlayerForCost(this.players, 150 );
      assert.equal(10, result.ffpg)
    })
  })
})
