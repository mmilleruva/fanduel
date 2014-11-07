var assert   = require("assert");
var expect   = require('chai').expect;
var Player   = require('../src/Player');
var filters  = require('../src/playerFilters');

describe('player filters', function(){

  beforeEach(function(){
    this.player1 = new Player();
    this.player1.position = 'RB';
    this.player1.salary = 100;
    this.player1.expected = 10;

    this.player2 = new Player();
    this.player2.position = 'RB';
    this.player2.salary = 200;
    this.player2.expected = 15;

    this.player3 = new Player();
    this.player3.position = 'QB';
    this.player3.salary = 150;

    this.player4 = new Player();
    this.player4.position = 'WR';
    this.player4.salary = 150;

    this.players = [this.player1, this.player2, this.player3, this.player4];

  });

  describe('filterByPosition', function(){
    it('should filter by position', function(){
      var result = filters.filterByPosition(this.players, 'RB');
      assert.equal(result.length, 2);
    });
  });

  describe('filterBySalary', function(){
    it('should filter by salary', function(){
      var result = filters.filterBySalary(this.players, 150);
      assert.equal(result.length, 3);
    });
  });

  describe('filterBySalaryAndPosition', function(){
    it('should filter by salary and position', function(){
      var result = filters.filterBySalaryAndPosition(this.players, 150, 'WR');
      assert.equal(result.length, 1);
    });
  });

  describe('findMinSalaryForPosition', function(){
    it('should find min salary by position', function(){
      var result = filters.findMinSalaryForPosition(this.players, 'RB');
      assert.equal(result, 100);
    });
  });

  describe('bestPositionPlayerForSalary', function(){
    it('should find best position player for a salary', function(){
      var result = filters.bestPositionPlayerForSalary(this.players, 200, 'RB');
      assert.equal(result.getExpectedPoints(), 15);
    });
  });

  describe('bestPositionPlayerForSalary', function(){
    it('should find best position player for a salary', function(){
      var result = filters.bestPositionPlayersBySalary(this.players, 300, 'RB');
      assert.equal(result[0], null);
      assert.equal(result[100].getExpectedPoints(), 10);
      assert.equal(result[200].getExpectedPoints(), 15);
    });
  });
});
