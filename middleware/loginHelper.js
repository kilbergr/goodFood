var db = require("../models");

var loginHelpers = function(req, res, next){
	req.login = function(user){
		req.session.id = user._id;
	};

	req.logout = function(){
		req.session.id = null;
		req.user = null;
	};

	req.currentUser = function(callback){
		db.User.findById(req.session.id, function(err, user){
			if(err){
				callback(err, null);
			}
			else{
				req.user = user;
				callback(null, user);
			}
		});
	};

next();
};

module.exports = loginHelpers;