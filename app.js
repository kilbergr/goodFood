var express = require("express"),
app = express(),
db = require("./models"),
bodyParser = require("body-parser"),
methodOverride = require("method-override"),
morgan = require("morgan"),
favicon = require("serve-favicon"),
request = require("request"),
session = require("cookie-session"),
loginMiddleware = require("./middleware/loginHelper"),
routeMiddleware = require("./middleware/routeHelper");
//using dotenv to hide APIs
require('dotenv').load();
	//food API
 var foodKey= process.env.DB_FOOD;

app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(morgan('tiny'));
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(loginMiddleware);

//cookie set
app.use(session({
	maxAge: 3600000,
	secret: 'itsasecret',
	name: 'oatmealraisin'
}));


//LOGIN RELATED ROUTES
//signup page
app.get('/signup', routeMiddleware.preventLoginSignup, function(req,res){
  res.render('users/signup');
});

//create new user
app.post("/signup", function (req, res) {
  var newUser = req.body.user;
  db.User.create(newUser, function (err, user) {
    if (user) {
      req.login(user);
      res.redirect("/search");
    } else {
      console.log(err);
      // TODO - handle errors in ejs!
      res.render("users/signup");
    }
  });
});

//login page for existing users
app.get("/login", routeMiddleware.preventLoginSignup, function (req, res) {
  res.render("users/login");
});

app.post("/login", function (req, res) {
  db.User.authenticate(req.body.user,
  function (err, user) {
    if (!err && user !== null) {
      req.login(user);
      res.redirect("/search");
    } else {
      // TODO - handle errors in ejs!
      res.render("users/login");
    }
  });
});

app.get('/logout', function(req, res){
	req.logout();
	res.redirect('/');
})

//search page routes
app.get('/', function(req, res){
	res.redirect('/search')
});

//to show search page
app.get('/search', function(req, res){
	res.render('recalls/search')
})


app.get('/recalls', function(req, res){
	var url = 'https://api.fda.gov/food/enforcement.json?api_key=' + foodKey +'&search=reason_for_recall:"ice cream"&limit=25';
	request(url, function(error, response, body){
	 	if(error){
	 		console.log(error); 
			res.render('errors/500');
		}
		 else if(!error && response.statusCode !==200){
      res.render('errors/404')
		}
		else{
		  var recalls = JSON.parse(body).results;
		  console.log(recalls[0]);
		  recalls.forEach(function(recall){
		 		var add = recall.distribution_pattern;
				var states = findState(add, stateNames);
	  })
			res.render('recalls/index', {recalls:recalls});
		}
	})
})

app.post('/recalls', function(req, res){
	var recall = new db.Recall(req.body.recall);
	if(recall.foodType!==undefined){
		//can change later such that you can check a number of these boxes. Will change the terms then to search=field:term+AND+field:term
		//should look like https://api.fda.gov/food/enforcement.json?api_key=APIKEYHERE&search=reason_for_recall:"ice cream"&limit=25'
		var url = 'https://api.fda.gov/food/enforcement.json?api_key=' + foodKey +'&search=reason_for_recall:"' + recall.foodType + '"&limit=25';
	}
	else if (recall.location!==undefined){
		//should look like https://api.fda.gov/food/enforcement.json?api_key=APIKEYHERE&search=distribution_pattern:"ID"&limit=25
		var url = 'https://api.fda.gov/food/enforcement.json?api_key=' + foodKey +'&search=distribution_pattern:"' + recall.location + '"&limit=25';
	}
	else if (recall.dateBegin!==undefined && recall.dateEnd!==undefined){
		//should look like https://api.fda.gov/food/enforcement.json?api_key=APIKEYHERE&search=[2004-01-01+TO+2005-01-01]&limit=25
		var url= 'https://api.fda.gov/food/enforcement.json?api_key=' + foodKey +'&search=report_date:['+recall.dateBegin+'+TO+'+recall.dateEnd+']&limit=25';
//var url= 'https://api.fda.gov/food/enforcement.json?api_key=' + foodKey +'&search=['+recall.yearBegin+'-'+ recall.monthBegin + '-' + recall.dayBegin + '+TO+'+recall.yearEnd+'-'+ recall.monthEnd + '-' + recall.dayEnd +']&limit=25';
	}
	
	//console.log(url);
	request(url, function(error, response, body){
	 	if(error){
	 		console.log(error);
			res.render('errors/500');
		}
	 else if(!error && response.statusCode !==200){
	 	console.log(response.statusCode);
    res.render('errors/404')
	}
	else{
		console.log(response.statusCode);
	  var recalls = JSON.parse(body).results;
		res.render('recalls/index', {recalls:recalls});
		}
	})
});

//to view personal database
app.get('/myRecalls', routeMiddleware.ensureLoggedIn, function(req,res){
  db.MyRecall.find({}, function(err,myRecalls){
  		req.currentUser(function(err,user){
  			if(err){
  				console.log(err);
  				res.render('recalls/index')
  			}
  			else {
  				res.format({ 
  					'text/html': function(){
  						res.render("myRecalls/index", {myRecalls:myRecalls});
  					},
  					'application/json': function(){
  						res.send({myRecalls:myRecalls});
  					},
  					'default': function(){
  						res.status(404).send('Not Acceptable');
  					}
			    })
  			}
  		});
  	});
});

//to add to personal database
app.post('/myRecalls', routeMiddleware.ensureLoggedIn, function(req,res){
  var myRecall = new db.MyRecall(req.body.myRecall);
  console.log(req.body.myRecall);
	myRecall.save(function(err,myRecall) {
		if(err){
			console.log(err);
			res.render('myRecalls/index');
		}
		else{
			req.currentUser(function(err,user){
			//add user to saved recall
			myRecall.user = user._id;
			//user.myRecalls.push(myRecall);
			myRecall.save();
			//user.save();
     	res.format({
        'text/html': function(){
         res.render("myRecalls");
        },
        'application/json': function(){
          res.send({myRecall:myRecall});
        },
        'default': function(){
          res.status(404).send('Not Acceptable');
        }
       })
     })
		}
	})
});


app.get('/myRecalls/:id', function(req, res){
	db.MyRecall.findById(req.params.id)
		.populate('comments')
		.exec(function(err,myRecall){
			if(err){
				console.log(err);
				res.render('myRecalls/index');
			}
			else{
				 res.render("myRecalls/show", {myRecall:myRecall});
			}
    });
	});

app.delete('/myRecalls/:id', routeMiddleware.ensureLoggedIn, routeMiddleware.ensureCorrectRecaller, function(req, res){
	db.MyRecall.findByIdAndRemove(req.params.id, function(err, myRecall){
		if(err){
			//TODO with error
			console.log(err);
			res.render('myRecalls/show')
		}
		else{
			res.redirect('/myRecalls');
		}
	});
});

//comment routes
//new
app.get('/myRecalls/:myRecall_id/comments/new', routeMiddleware.ensureLoggedIn, function(req, res){
	req.currentUser(function(err,user){
		db.MyRecall.findById(req.params.myRecall_id)
		.populate('comments')
		.exec(function(err, myRecall){
			if(err){
				//TODO: error handling
				console.log(err);
				res.render('/myRecalls');
			}
			else{
				res.render('comments/new', {myRecall:myRecall, user:user});
			}
		});
	});
});

//create
app.post('/myRecalls/:myRecall_id/comments', routeMiddleware.ensureLoggedIn, function(req, res){
	db.Comment.create(req.body.comment, function (err, comment){
		if(err){
			//TODO: error handling
			console.log(err);
			res.render('comments/new');
		}
		else{
			req.currentUser(function(err,user){
				db.MyRecall.findById(req.params.myRecall_id, function(err, myRecall){
				//add user to comment
				myRecall.comments.push(comment);
				comment.myRecall = myRecall._id;
				comment.user = user._id;
				comment.save();
				myRecall.save();
				res.redirect('/myRecalls/' + req.params.myRecall_id + "/comments");
				});
			});
		}
	});
});

//show
app.get('/myRecalls/:myRecall_id/comments/:id', function(req, res){
		db.Comment.findById(req.params.id)
		.populate('myRecall')
		.exec(function(err, comment){
			if(err){
			//TODO: error handling
				console.log(err);
				res.render('comments');
			}
			else
			res.render('comments/show', {comment:comment, myRecall:comment.myRecall});
		});
});

//edit
app.get('/myRecalls/:myRecall_id/comments/:id/edit', routeMiddleware.ensureLoggedIn, routeMiddleware.ensureCorrectCommenter, function(req, res){
	db.Comment.findById(req.params.id, function(err, comment){
		res.render('comments/edit', {comment:comment});
	});
});

//update
app.put('/myRecalls/:myRecall_id/comments/:id', routeMiddleware.ensureLoggedIn, function(req, res){
	db.Comment.findByIdAndUpdate(req.params.id, req.body.comment, function(err, comment){
		if(err){
			//TODO: error handling
			console.log(err);
			res.render('comments/edit');
		}
		else{
			res.redirect('/myRecalls/' + comment.myRecall + "/comments");
		}
	});
});

//destroy
app.delete('/myRecalls/:myRecall_id/comments/:id', routeMiddleware.ensureLoggedIn, routeMiddleware.ensureCorrectCommenter, function(req, res){
	db.Comment.findByIdAndRemove(req.params.id, function(err, comment){
		if(err){
			//TODO: error handling
			console.log(err);
			res.render('comments/index');
		}
		else{
			res.redirect('/myRecalls/' + comment.myRecall + '/comments');
		}
	});
});



app.listen(process.env.PORT || 8080, function(){
	console.log("listening on 8080");
});

