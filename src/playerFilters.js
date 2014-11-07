var _             = require('lodash');

var filterByPosition = function(playerList, position){
  return _.filter(playerList, function(player){
    return player.position == position;
  });
};

var filterBySalary = function(playerList, salary){
  return _.filter(playerList, function(player){
    return player.salary <= salary;
  });
};

var filterBySalaryAndPosition = function(playerList, salary, position){
  return _.filter(playerList, function(player){
    return player.salary <= salary && player.position == position;
  });
};

var findMinSalaryForPosition = function(playerList, position){
  var player =  _.min(playerList, function(player){
    if (player.position == position) {
      return player.salary;
    }
    return 999999;
  });
  return player.salary;
};

var bestPositionPlayerForSalary = function(playerList, salary, position){
  var minSalary = findMinSalaryForPosition(playerList, position);

  if (salary < minSalary) {return null;}

  return  _.max(playerList, function(player){
    if (player.position == position && player.salary <= salary) {
      return player.getExpectedPoints();
    }
    return -999999;
  });
};

var bestPositionPlayersBySalary = function(playerList, salary, position){
  best = {};
  for (var curSalary = 0; curSalary < salary; curSalary = curSalary + 100) {
    best[curSalary] = bestPositionPlayerForSalary(playerList, curSalary, position);
  }
  return best;
};

module.exports = {
  filterByPosition:  filterByPosition,
  filterBySalary: filterBySalary,
  filterBySalaryAndPosition: filterBySalaryAndPosition,
  findMinSalaryForPosition: findMinSalaryForPosition,
  bestPositionPlayerForSalary: bestPositionPlayerForSalary,
  bestPositionPlayersBySalary: bestPositionPlayersBySalary
};
