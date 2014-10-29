
var _              = require('lodash');
var NflStatScraper = require('./src/stat-scrapers/nflStatScraper');
var FanDuelScraper = require('./src/fanduel-scrapers/fanduelNflPlayerScraper');



var scraper = new NflStatScraper();
var fanDuelScraper = new FanDuelScraper();


// Wire up process
fanDuelScraper.on("playersLoaded", function(players){
  console.log("playersLoaded");
  _.each(players, function(player){

    scraper.setNFLID(player);
  });
});
scraper.on("NFLIDSet", scraper.setPlayerStats);
scraper.on("playerStatsSet", function(player){
  console.log(player);
})


// Start Chain
fanDuelScraper.loadPlayers('./data/fanduel_raw.html');

