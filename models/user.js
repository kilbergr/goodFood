var bcrypt = require("bcrypt");
var SALT_WORK_FACTOR = 10;
var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: {
      type: String,
      lowercase: true,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    avatar: String,
    
    comments: [{
               type: mongoose.Schema.Types.ObjectId,
               ref: "Comment"
               }],
    myRecalls: [{
               type: mongoose.Schema.Types.ObjectId,
               ref: "MyRecall"
               }],

  });
//presave hook: runs right before we save user
userSchema.pre('save', function(next) {
  //refers to the instance of whatever is created by the schema (in this case, user)
  var user = this;
  //if the password has not been modified, callback next function
  //if one of these conditions has been met, continue with save
  if (!user.isModified('password')) {
    return next();
  }
  return bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) {
      return next(err);
    }
    return bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) {
        return next(err);
      }
      //final step, actually setting password to that user
      user.password = hash;
      return next();
    });
  });
});

// don't want to call this first param "user"! We have another user defined!
userSchema.statics.authenticate = function (formData, callback) {
  //These are CLASS METHODS--methods called on models
 // this refers to model name db.User.findOne
  this.findOne({
      email: formData.email
    },
    function (err, user) {
        //if the username is not in the database
        if (user === null){
          //most secure message
        callback("Invalid username or password",null);
      }
      else {
        //checkPassword has been defined below
        user.checkPassword(formData.password, callback);
      }

    });
};

userSchema.methods.checkPassword = function(password, callback) {
  //methods is a method on each instance--instance method
  //called a helper function

  var user = this;
  //password is plaintext, user.password is encrypted
  bcrypt.compare(password, user.password, function (err, isMatch) {
    if (isMatch) {
      //null no error, just return the user
      callback(null, user);
    } 
    //error, null user
    else {
      callback("Invalid username or password", null);
    }
  });
};
//in app.js, when a user tries to login, this will happen:
//db.User.authenticate(req.body.user, function(err, user){

//})

var User = mongoose.model("User", userSchema);

module.exports = User;