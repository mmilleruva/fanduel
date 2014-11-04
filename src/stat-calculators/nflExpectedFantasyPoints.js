_ = require('lodash');
var ss = require('simple-statistics');

function fantasyPoints(stats){
  stats.rushYD     =  stats.rushYD  || 0;
  stats.rushTD     =  stats.rushTD  || 0;
  stats.passYD     =  stats.passYD  || 0;
  stats.passTD     =  stats.passTD  || 0;
  stats.INT        =  stats.INT     || 0;
  stats.rec        =  stats.rec     || 0;
  stats.recYD      =  stats.recYD   || 0;
  stats.recTD      =  stats.recTD   || 0;
  stats.fumbles    =  stats.fumbles || 0;

  return stats.rushYD     * .1  +
         stats.rushTD     * 6   +
         stats.passYD     * .04 +
         stats.passTD     * 4   +
         stats.INT        * -1  +
         stats.rec        * 0.5  +
         stats.recYD      * 0.1 +
         stats.recTD      * 6   +
         stats.fumbles    * -2;
 }


function expectedFantasyPoints(player, expectedTeamPoints){
  var regressionData = [];
  var gamesStarted = 0;
  _.each(player.gameStats, function(gameStats){
    gameStats.fantasyPoints = fantasyPoints(gameStats);

    //add observation only for games players started in
    if (gameStats.gameStarted == 1) {
      gamesStarted = gamesStarted + 1;
      regressionData.push([gameStats.score, gameStats.fantasyPoints])
    };
  });

  var regression = ss.linear_regression().data(regressionData).line();
  //build regression object
  player.regression = {
    m: ss.linear_regression().data(regressionData).m(),
    b: ss.linear_regression().data(regressionData).b(),
    rSquared: ss.r_squared(regressionData, regression),
    teamPoints: expectedTeamPoints,
    obs: gamesStarted
  };
  player.regression.expected = regression(expectedPoints);
}

module.exports = expectedFantasyPoints;
