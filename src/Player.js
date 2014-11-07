var Player = function(vals){
  vals = vals || {};
  this.name     = vals.name || "";
  this.status    = vals.status || '';
  this.team     = vals.team || "";
  this.ffpg     = vals.ffpg || 0;
  this.salary   = vals.salary || 0;
  this.position = vals.position || 0;
  this.regression = vals.regression;
  this.exclude = vals.exclude;
  if(vals.regression){
    this.expected = this.regression.expected;
    this.rSquared = this.regression.rSquared;
  }
};

Player.prototype.getExpectedPoints = function(){
  return  this.expected || 0;
};


module.exports = Player ;
