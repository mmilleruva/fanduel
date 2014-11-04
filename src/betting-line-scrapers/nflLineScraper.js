var events  = require('events');
var util    = require('util');
var request = require('request');
var cheerio = require('cheerio');
var _       = require('lodash');

var EVENTS = {
  LINES_PARSED: "Lines Parsed"
};

var LineScraper = function(){
  this.lines = [];
};

util.inherits(LineScraper, events.EventEmitter);

function parseSpread($span){
  var val = $span.text().trim();
  if (val === 'PK') {
    return 0;
  }
  return parseFloat(val);
}

LineScraper.prototype.parseLines = function(){
  var url = 'http://www.footballlocks.com/nfl_lines.shtml';
  var self = this;
  request(url, function (error, response, body) {
    var $ = cheerio.load(body);

    var lines = [];
    $('table[cols="5"] tr').each(function(idx, val){
      $val = $(val);
      // skip header row
      if( idx !== 0){
        var curGame = {
          time: $val.find(':nth-child(1)').text().trim(),
          favorite: $val.find(':nth-child(2)').text().trim(),
          line: parseSpread($val.find(':nth-child(3)')),
          underdog: $val.find(':nth-child(4)').text().trim(),
          total: $val.find(':nth-child(5)').text().trim()
        };

        if(curGame.favorite.slice(0,3) == "At "){
          curGame.favorite = curGame.favorite.slice(3);
        }
        if(curGame.underdog.slice(0,3) == "At "){
          curGame.underdog = curGame.underdog.slice(3);
        }

        var fav = {
          name: curGame.favorite,
          total: parseFloat(curGame.total),
          line: curGame.line,
        };
        var under = {
          name: curGame.underdog,
          total: parseFloat(curGame.total),
          line: curGame.line * -1,
        };

        fav.expectedPoints = (fav.total - fav.line)/2;
        under.expectedPoints = (fav.total + fav.line)/2;

        if (fav.name.length > 0) {
          lines.push(fav);
          lines.push(under);
        }
      }
    });
    lines = _.sortBy(lines, function(team){
      return -1 * team.expectedPoints;
    });
    self.lines = lines;
    self.emit(EVENTS.LINES_PARSED, lines);
  });
};

LineScraper.prototype.expectedTeamPoints = function (team){
  var lineTeam =  _.find(this.lines, function(line){
    return team.indexOf(line.name.trim()) >= 0;
  });
  if (lineTeam) {
    return lineTeam.expectedPoints;
  }
  return 0;

};

module.exports.LineScraper = LineScraper;
module.exports.EVENTS = EVENTS;
