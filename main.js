var PlayerImport    = require('./src/PlayerImport');
var TeamSelection   = require('./src/TeamSelection');
var FootballPlayer  = require('./src/FootballPlayer');
var FootballTeam    = require('./src/FootballTeam');
var finalData       = require('./data/finalData');
var _               = require('lodash');


var file = './data/player_data.csv';
var fields = ['position', 'name', 'ffpg', 'salary'];

var playerList = _.map(finalData, function(player){
  return new FootballPlayer(player);
})
console.log(playerList.length);
playerList = _.filter(playerList, function(player){

     return player.getExpectedPoints() > 0 && ! player.exclude;
    });
console.log(playerList.length);
playerList = filterDominatedPlayers(playerList);
console.log(playerList);
console.log(playerList.length);

main(playerList);

function main(playerList){
    var team = new FootballTeam();
    team._validTeam = {
          'WR': 3,
          'RB': 2,
          'QB': 1,
          'TE': 1,
        }
    team.salaryCap = 49800;

    team = TeamSelection.selectTeamRecursive(playerList, team);

    console.log(team);
    console.log("Salary Spent: "+ team.getSalary() );
    console.log("Expected Points: "+ team.getExpectedPoints() );
}

function filterDominatedPlayers(players){
  var sorted = _.sortBy(players, function(player){
    return player.getExpectedPoints() * -1;
  });

  var curBest = {};

  var returnList = [];
  _.each(sorted,function(player){
    // Add position if it doesn't exist
    if(!curBest[player.position]){
      curBest[player.position] = player.salary
      returnList.push(player);
    }
    else{
      if(curBest[player.position] > player.salary){
        curBest[player.position] = player.salary
        returnList.push(player);
      }
    }
  })
  return returnList;
}
// PlayerImport.importPlayerData(file, fields, FootballPlayer,

// )

