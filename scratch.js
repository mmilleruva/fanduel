
var _               = require('lodash');
var NflStatScraper  = require('./src/stat-scrapers/nflStatScraper');
var FanDuelScraper  = require('./src/fanduel-scrapers/fanduelNflPlayerScraper');
var LineScraper     = require('./src/betting-line-scrapers/nflLineScraper');
var fantasyPoints   = require('./src/stat-calculators/nflExpectedFantasyPoints');

var scraper = new NflStatScraper();
var fanDuelScraper = new FanDuelScraper();

var lineScraper = new LineScraper.LineScraper();

var lines = [];
var finalPlayers = [];
// Wire up process
lineScraper.on(LineScraper.EVENTS.LINES_PARSED, function(theLines){
  lines = theLines;
  //fanDuelScraper.loadPlayers('./data/fanduel_raw.html');
});
fanDuelScraper.on("playersLoaded", function(players){
  _.each(players, function(player){
    scraper.setNFLID(player);
  });
});
scraper.on("NFLIDSet", scraper.setPlayerStats);
scraper.on("playerStatsSet", function(player){
  expectedPoints = lineScraper.expectedTeamPoints(player.team);
  fantasyPoints(player,expectedPoints);
  finalPlayers.push(player);
  console.log(player);
  console.log(",");
});


// Start Chain
fanDuelScraper.loadPlayers('./data/fanduel_raw.html');
lineScraper.parseLines();
