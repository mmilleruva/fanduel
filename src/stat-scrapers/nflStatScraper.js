var request = require('request');
var cheerio = require('cheerio');
var async   = require('async');
var _       = require('lodash');
var util    = require('util');
var events  = require('events');


var StatScraper = function(){};

util.inherits(StatScraper, events.EventEmitter);


function generateUrl(playerName, id){
  return "http://www.nfl.com/player/" + playerName.toLowerCase().replace(' ','') + "/" + id + "/gamelogs";
}

function parseQBStats($val){
  return {
          gameStarted : parseInt($val.find(':nth-child(6)').text().trim().replace("--",'0')),
          passYD: $val.find(':nth-child(10)').text().trim().replace("--",'0'),
          passTD: $val.find(':nth-child(12)').text().trim().replace("--",'0'),
          INT:    $val.find(':nth-child(13)').text().trim().replace("--",'0'),
          rushYD: $val.find(':nth-child(18)').text().trim().replace("--",'0'),
          rushTD: $val.find(':nth-child(20)').text().trim().replace("--",'0'),
          fumbles:$val.find(':nth-child(22)').text().trim().replace("--",'0')
        };
}

function parseRBStats($val){
  return {
          gameStarted : parseInt($val.find(':nth-child(6)').text().trim().replace("--",'0')),
          rushYD: $val.find(':nth-child(8)').text().trim().replace("--",'0'),
          rushTD: $val.find(':nth-child(11)').text().trim().replace("--",'0'),
          rec:    $val.find(':nth-child(12)').text().trim().replace("--",'0'),
          recYD:  $val.find(':nth-child(13)').text().trim().replace("--",'0'),
          recTD:  $val.find(':nth-child(16)').text().trim().replace("--",'0'),
          fumbles:$val.find(':nth-child(18)').text().trim().replace("--",'0')
        };
}

function parseRecStats($val){
  return {
          gameStarted : parseInt($val.find(':nth-child(6)').text().trim().replace("--",'0')),
          rec:    $val.find(':nth-child(7)').text().trim().replace("--",'0'),
          recYD:  $val.find(':nth-child(8)').text().trim().replace("--",'0'),
          recTD:  $val.find(':nth-child(11)').text().trim().replace("--",'0'),
          rushYD: $val.find(':nth-child(13)').text().trim().replace("--",'0'),
          rushTD: $val.find(':nth-child(16)').text().trim().replace("--",'0'),
          fumbles:$val.find(':nth-child(18)').text().trim().replace("--",'0')
        };
}

StatScraper.prototype.setPlayerStats = function(player){
  var self = this;

  var url = generateUrl(player.name, player.nflId);
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {

      player.gameStats = [];
      var $ = cheerio.load(body);

      player.team = $('.player-team-links').find(':nth-child(1)').text();
      var stats     = $('table.data-table1').eq(1);

      stats.find('tbody tr:not(.border-td)').each(function(index, val){
        var $val = $(val);
        if ($val.children().length > 10) {
          var score = $val.find(':nth-child(4) a').text().trim();
          var totalScore = /(.*)\-/m.exec(score);
          var gameStats = {};
          if(player.position == 'QB'){
            gameStats = parseQBStats($val);
          }

          if(player.position == 'RB'){
            gameStats = parseRBStats($val);
          }

          if(player.position == 'TE' || player.position == 'WR' ){
            gameStats = parseRecStats($val);
          }

          if (totalScore) {
            gameStats.score = parseInt(totalScore[1]);
            player.gameStats.push(gameStats);
          }
        }
      });
    }
    self.emit('playerStatsSet', player);
  });
};

StatScraper.prototype.setNFLID = function(player){
  var self = this;
  var theUrl = 'http://www.bing.com/search?q='+player.name+' nfl';
  request(theUrl, function (error, response, body) {
    var playerName = player.name.replace(' ', '');
    var regexString = "nfl.com/player/"+playerName+"/(\\d+)";
    var re = new RegExp(regexString,'i');
    var result = re.exec(body);
    if(result){
      player.nflId = result[1];

    };
    self.emit('NFLIDSet',player);
  });
};

module.exports = StatScraper;
