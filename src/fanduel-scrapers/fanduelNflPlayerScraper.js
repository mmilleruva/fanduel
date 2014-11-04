var cheerio = require('cheerio');
var fs      = require('fs');
var util    = require('util');
var events  = require('events');

var FanduelNflPlayerScraper = function(){};
util.inherits(FanduelNflPlayerScraper, events.EventEmitter);

FanduelNflPlayerScraper.prototype.loadPlayers = function(filePath){
  var self = this;
  fs.readFile(filePath, 'utf8', function (err,data) {
    if (err) {
      throw err;
    }
    var $ = cheerio.load(data);
    fdPlayers = [];
    $('tr').each(function (idx, row){
      $row = $(row);
      var playerStatus = $row.find('.player-badge').text().trim();
      $row.find('.player-badge').remove();
      var player = {
        name:                   $row.find('.player-name').text().trim(),
        status:                 playerStatus,
        ffpg:         parseFloat($row.find('.player-fppg').text().trim()),
        position:               $row.find('.player-position').text().trim(),
        gamesPlayed:  parseInt( $row.find('.player-played').text().trim()),
        team:                   $row.find('.player-fixture b').text().trim(),
        salaryString:           $row.find('.player-salary').text().trim(),
      };
      player.salary = parseInt(player.salaryString.replace('$','').replace(',',''));
      fdPlayers.push(player);
    });
    self.emit("playersLoaded",fdPlayers);
  });
};

module.exports = FanduelNflPlayerScraper;
