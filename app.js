var express = require("express"),
app = express(),
db = require("./models"),
bodyParser = require("body-parser"),
methodOverride = require("method-override"),
morgan = require("morgan"),
request = require("request");
//using dotenv to hide APIs
require('dotenv').load();
	//food API
 var foodKey= process.env.DB_food;

app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(morgan('tiny'));

app.get('/', function(req, res){
	res.redirect('/search')
});

//to show search page
app.get('/search', function(req, res){
	res.render('recalls/search')
})

//to choose type of search
app.post('/search', function(req, res){
	var search = new db.Search(req.body.search);
	
})

app.get('/recalls', function(req, res){
	var url = 'https://api.fda.gov/food/enforcement.json?api_key=' + foodKey +'&search=reason_for_recall:"' + food + '"&limit=25';
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
			res.render('recalls/index', {recalls:recalls});
		}
	})
});

app.listen(8080, function(){
	console.log("listening on 8080");
});

