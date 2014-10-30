var PlayerImport    = require('./src/PlayerImport');
var TeamSelection   = require('./src/TeamSelection');
var FootballPlayer  = require('./src/FootballPlayer');
var FootballTeam    = require('./src/FootballTeam');
var finalData       = require('./data/finalData');
var _               = require('lodash');

var playerList = _.map(finalData, function(player){
  return new FootballPlayer(player);
})

console.log(playerList.length);
playerList = _.filter(playerList, function(player){

     return player.getExpectedPoints() > 7 && ! player.exclude && player.status != 'Q';
    });
console.log(playerList.length);
playerList = filterDominatedPlayers(playerList, {
          'WR': 3,
          'RB': 2,
          'QB': 1,
          'TE': 1});

console.log(playerList.length);
console.log(playerList);
main(playerList);

function main(playerList){
    var team = new FootballTeam();
    team._validTeam = {
          'WR': 3,
          'RB': 2,
          'QB': 1,
          'TE': 1,
        };
    team.salaryCap = 49700;
    console.log(team._validTeam);
    team = TeamSelection.selectTeamRecursive(playerList, team);

    console.log(team);
    console.log("Salary Spent: "+ team.getSalary() );
    console.log("Expected Points: "+ team.getExpectedPoints() );
}

function filterDominatedPlayers(players, validTeam){

  var returnList = [];
  _.each(players,function(player){
   var domPlayers =  _.filter(players, function(otherPlayer){
      return (player.position == otherPlayer.position &&
             player.salary > otherPlayer.salary &&
             player.expected < otherPlayer.expected) ;
    });

    if (domPlayers.length < validTeam[player.position]) {
      returnList.push(player);
    };
  })
  return returnList;
}

