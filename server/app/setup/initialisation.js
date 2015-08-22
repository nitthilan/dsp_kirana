var mongoose = require('mongoose');
var mkdirp = require('mkdirp');

module.exports = function(config){
  var log = require(config.root+'./setup/log.js').appLogger;
  var User = mongoose.model('User');

  // Drop the User table
  /* User.remove({}, function(err) {
    log.info('User collection removed and added only one user '+err);
    // Create a user into the table
    var user = new User();
    user.email = 'demouser@brightboard.co.in';
    user.password = 'demouser';
    user.displayName = 'BrightBoarder'
    user.save();
  }); */
  // Make the temporary and public files folder:
  /*mkdirp(config.temp_folder_path, function(err) {
    if(err) log.error("Error in creating temporary folder");
    return
  });
  mkdirp(config.static_path+"public_files/", function(err) {
    if(err) log.error("Error in creating public files folder");
    return
  });*/
}
