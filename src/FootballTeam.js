_ = require('lodash');

var SALARY_CAP = 60000;
var VALID_TEAM = {
  'QB': 1,
  'RB': 2,
  'WR': 3,
  'TE': 1,
  'K':  1,
  'D':  1
};

var FootballTeam = function(){
  this._validTeam = VALID_TEAM;
  this.salaryCap = SALARY_CAP;
  this.players = [];
};

FootballTeam.prototype.addPlayer = function(player){
  this.players.push(player);
};

FootballTeam.prototype.getSalary = function(){
 var total = 0;

  _.forEach(this.players, function(player){
    total = total + player.salary;
  });

 return total;
};

FootballTeam.prototype.getExpectedPoints = function(){
  var total = 0;

  _.forEach(this.players, function(player){
    total = total + player.getExpectedPoints();
  });

  return total;
};

FootballTeam.prototype.getExpectedPointsWithPlayer = function(player){
  var total = this.getExpectedPoints();
  return total + player.getExpectedPoints();
};

FootballTeam.prototype.numPlayersByPosition = function(){

  var playersByPosition = _.countBy(this.players, function(player){
    return player.position;
  });

  return playersByPosition;
};

FootballTeam.prototype.isValid = function(){
  if(this.getSalary() <= this.salaryCap ){
    var playersByPos = this.numPlayersByPosition();
    return _.isEqual(playersByPos, this._validTeam);
  }
  return false;
};

FootballTeam.prototype.numPlayersAtPosition = function(pos){
  var playersByPostion = this.numPlayersByPosition();
  return playersByPostion[pos] || 0;
};

FootballTeam.prototype.canAddPlayer = function(player){

  var allowedPlayers = this._validTeam[player.position] || 0
  var currentPlayers = this.numPlayersAtPosition(player.position);

  if (currentPlayers + 1 <= allowedPlayers){
    if (this.salaryCap >= this.getSalary() + player.salary) {
      return true;
    }
  }
  return false;
};

FootballTeam.prototype.tryAddPlayer = function(player){
  if(this.canAddPlayer(player)){
    this.addPlayer(player);
    return true;
  }
  return false;
};

FootballTeam.prototype.clone = function(){
  var team = new FootballTeam();
  _.forEach(this.players, function(player){
    team.addPlayer(player);
  });
  team._validTeam = this._validTeam;
  team.salaryCap = this.salaryCap;
  return team;
};

FootballTeam.prototype.remainingPositions = function(){
  var keys = _.keys(this._validTeam);
  var playersAtPos = this.numPlayersByPosition();
  var openPos = []
  for (var i = 0; i < keys.length; i++) {
    var curKey = keys[i];
    var playerCount = playersAtPos[curKey] || 0 ;
    var curSpotsRemaining = this._validTeam[curKey] - playerCount;

    if (curSpotsRemaining > 0) {
      openPos.push(curKey);
    };
  };
  return openPos;
};

module.exports = FootballTeam;
