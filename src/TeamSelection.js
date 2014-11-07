var _             = require('lodash');
var FootballTeam  = require('./FootballTeam');

var SALARY_INCREMENT = 100;

var selectTeam = function(players, salaryCap){
  var solutionArray = initialize(players.length);

  for (var i = 1; i < players.length; i++) {
    for (var j = 0; j < salaryCap; j = j + SALARY_INCREMENT) {

      var curPlayer = players[i-1];
      //check players Salary is less then current level
      if(curPlayer.salary <= j){

        var newSolution = solutionArray[i - 1][j - curPlayer.salary];

        //check if current player would make a valid team
        if (newSolution.canAddPlayer(curPlayer)) {
          var curBest = solutionArray[i - 1][j];
        }
        //current best solutionArray
      }
    }
  }
};

var filterPlayers = function(openSpots, players){
  return _.filter(players, function(player){
    return _.contains(openSpots, player.position);
  });
};

var selectTeamRecursive = function(players, team){
  if (team.isValid()) {
    return team;
  }

  if(players.length <= 0) {
    return new FootballTeam();
  }

  var bestTeam = new FootballTeam();
  var bestScore = 0;

  for (var i = 0; i < players.length; i++) {
    var curPlayer = players[i];
    if (team.canAddPlayer(players[i])) {
      //create new team with the player added

      var newTeam = team.clone();
      newTeam.addPlayer(players[i]);

      //create new list of
      var newPlayerList = players.slice(i + 1, players.length);
      var openPos = newTeam.remainingPositions();
      newPlayerList = filterPlayers(openPos, newPlayerList);
      var curTeam = selectTeamRecursive(newPlayerList, newTeam);
      if(team.players.length === 0){

      }
      if (curTeam.getExpectedPoints() > bestScore) {
        bestScore = curTeam.getExpectedPoints();
        bestTeam = curTeam;
      }
    }
  }
  return bestTeam;
};

var initialize = function(playerCount){
  var solutionArray = [];
  solutionArray[0] = [];
  var emptyTeam = new FootballTeam();
  for (var i = 0; i < playerCount; i++) {
    solutionArray[0][i] = emptyTeam;
  }
  return solutionArray;
};

module.exports.SelectTeam = selectTeam;
module.exports.initialize = initialize;
module.exports.selectTeamRecursive = selectTeamRecursive;
