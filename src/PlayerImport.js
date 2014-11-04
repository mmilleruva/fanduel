var fs = require('fs');

var importPlayerData = function(filePath, fieldList, playerConstructor, cb){

  fs.readFile(filePath, 'UTF-8', function(err, data){
    if (err !== null) {
      throw err;
    }
    var lines = data.split(/\n/);

    var playerList = [];
    for (var i = 0; i < lines.length; i++) {

      var playerData = lines[i].split(/,/);
      if (playerData.length == fieldList.length) {
        playerList.push(buildPlayer(playerData, fieldList, playerConstructor));
      }

    }
     cb(playerList);
  });
};

var buildPlayer = function(playerData, fieldList, playerConstructor){

  var player = new playerConstructor();

  for (var j = 0; j < fieldList.length; j++) {
    player[fieldList[j]] = playerData[j];
    if (fieldList[j] == 'salary' || fieldList[j] == 'ffpg') {
      player[fieldList[j]] = parseFloat(player[fieldList[j]]);
    }
  }
  return player;
};


module.exports.importPlayerData = importPlayerData;
module.exports.buildPlayer = buildPlayer;
