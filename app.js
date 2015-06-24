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

//var url = 'https://api.fda.gov/food/enforcement.json?api_key=' + foodKey +'search=reason_for_recall:"' + input.food + '"&limit=25'; ']&limit=25';

app.get('/recalls', function(req, res){
	var url = "https://api.fda.gov/food/enforcement.json?search=reason_for_recall:'ice cream'" ;
  request(url, function(error, response, body){
	 	if(error){
			res.render('errors/500')
		}
		 else if(!error && response.statusCode !==200){
      res.render('errors/500')
		}
		else{
		  var recalls = JSON.parse(body).response.docs;
			res.render('recalls/index', {recalls:recalls});
		}
	})
});
