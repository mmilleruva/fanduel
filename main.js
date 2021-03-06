var PlayerImport    = require('./src/PlayerImport');
var TeamSelection   = require('./src/TeamSelection');
var FootballPlayer  = require('./src/Player');
var FootballTeam    = require('./src/FootballTeam');
var finalData       = require('./data/finalData');
var _               = require('lodash');
var util            = require('util');

var playerList = _.map(finalData, function(player){
  return new FootballPlayer(player);
})


function main(playerList){
    var team = new FootballTeam();
    team._validTeam = {
          'WR': 3,
          'RB': 2,
          'QB': 1,
          'TE': 1,
        };
    team.salaryCap = 49700;
    team = TeamSelection.selectTeamRecursive(playerList, team);

    console.log("########### Players Chosen #################\n");
    console.log(util.inspect(team, false, null));
    console.log("\n\n########### Summary #################");
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

var teamList = [
  'Seattle Seahawks',
  'San Francisco 49ers',
  'Denver Broncos',
  'Cincinnati Bengals',
  'Indianapolis Colts',
  'New England Patriots',
  'Kansas City Chiefs',
]



playerList = _.filter(playerList, function(player){
    return player.getExpectedPoints() > 7  && player.regression.teamPoints > 20 && ! player.exclude && player.status == '' && player.regression.obs > 4;
    });

playerList = filterDominatedPlayers(playerList, {
          'WR': 3,
          'RB': 2,
          'QB': 1,
          'TE': 1});

main(playerList);

