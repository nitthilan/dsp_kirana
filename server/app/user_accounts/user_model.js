var mongoose = require('mongoose'),
    bcrypt = require('bcryptjs');


var userSchema = new mongoose.Schema({
  // http://stackoverflow.com/questions/24430220/e11000-duplicate-key-error-index-in-mongodb-mongoose
  // http://docs.mongodb.org/manual/core/index-sparse/
  email: { type: String, unique: true, sparse: true, lowercase: true },
  password: { type: String, select: false },
  displayName: String,
  facebook: String,
  foursquare: String,
  google: String,
  github: String,
  linkedin: String,
  twitter: String
});

userSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(user.password, salt, function(err, hash) {
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(password, done) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    done(err, isMatch);
  });
};

var User = mongoose.model('User', userSchema);

