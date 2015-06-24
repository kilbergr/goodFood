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


app.get('/recalls', function(req, res){
	var url = 'https://api.fda.gov/food/enforcement.json?api_key=' + foodKey +'&search=reason_for_recall:"ice cream"&limit=25';
//	var url = 'https://api.fda.gov/food/enforcement.json?api_key=GQisS7xWftem2wq39sv7zlVFVe7EG18DE2eFbDkI&search=reason_for_recall:%22lemon%22&limit=25'
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

app.listen(8000, function(){
	console.log("listening on 8000");
});

