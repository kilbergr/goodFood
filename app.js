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
app.get('/myRecalls', function(req,res){
  db.myRecall.find({}, function(err,myRecalls){
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
    });
});
//to add to personal database
app.post('/myRecalls', function(req,res){
  var myRecall = new db.MyRecall(req.body.myRecall);
	myRecall.save(function(err,myRecall) {
      	res.format({
        'text/html': function(){
          res.render("myRecalls");
        },
        'application/json': function(){
          res.send({myRecall:myRecall});
        },
        'default': function(){
          res.status(406).send('Not Acceptable');
        }
      })
     })
});



app.get('/recalls/:id', function(req, res){
	db.Recall.findById(req.params.id, function(err,recall){
    res.render("recalls/show", {recall:recall});
  });
})

app.post('/recalls/:id')

app.listen(8080, function(){
	console.log("listening on 8080");
});

