var express = require("express"),
app = express(),
db = require("./models"),
bodyParser = require("body-parser"),
methodOverride = require("method-override"),
morgan = require("morgan"),
favicon = require("serve-favicon"),
request = require("request");
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


	//parsing strings of distribution patterns to find state names (in array)
 var findState = function(str, arr){
 	var upCased = str.toUpperCase();
 	var distStates = [];
 	for (var i = 0; i < arr.length; i++){
 		if(upCased.indexOf(arr[i])!= -1){
 			distStates.push(arr[i]);
 		};
 	}
 	return distStates;
 };

//getting states' APIs
var mapStates=function(arr){
	var apiArr = [];
	for(var j = 0; j < arr.length; j++){
		var state = encodeURIComponent(arr[j]);
		var apiUrl = 'http://maps.googleapis.com/maps/api/geocode/json?address=' + state;
		apiArr.push(apiUrl);
	}
	return apiArr;
}



stateNames = ["NATIONALLY", "NATIONWIDE", "NATIONAL", "USA", "ALABAMA", "ALASKA", "ARIZONA", "ARKANSAS", "CALIFORNIA", "COLORADO", "CONNECTICUT", "DELAWARE", "FLORIDA", "GEORGIA", "HAWAII", "IDAHO", "ILLINOIS", "INDIANA", "IOWA", "KANSAS", "KENTUCKY", "LOUISIANA", "MAINE", "MARYLAND", "MASSACHUSETTS", "MICHIGAN", "MINNESOTA", "MISSISSIPPI", "MISSOURI", "MONTANA", "NEBRASKA", "NEVADA", "NEW HAMPSHIRE", "NEW JERSEY", "NEW MEXICO", "NEW YORK", "NORTH CAROLINA", "NORTH DAKOTA", "OHIO", "OKLAHOMA", "OREGON", "PENNSYLVANIA", "RHODE ISLAND", "SOUTH CAROLINA", "SOUTH DAKOTA", "TENNESSEE", "TEXAS", "UTAH", "VERMONT", "VIRGINIA", "WASHINGTON", "WEST VIRGINIA", "WISCONSIN", "WYOMING", "DISTRICT OF COLUMBIA", "PUERTO RICO", "GUAM", "AMERICAN SAMOA", "U.S. VIRGIN ISLANDS", "NORTHERN MARIANA ISLANDS", "AK","AL","AR","AZ","CA","CO","CT","DC","DE","FL","GA","GU","HI","IA","ID", "IL","IN","KS","KY","LA","MA","MD","ME","MH","MI","MN","MO","MS","MT","NC","ND","NE","NH","NJ","NM","NV","NY", "OH","OK","OR","PA","PR","PW","RI","SC","SD","TN","TX","UT","VA","VI","VT","WA","WI","WV","WY"]; 

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
app.get('/myRecalls', function(req,res){
  db.MyRecall.find({}, function(err,myRecalls){
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
  console.log(req.body.myRecall);
	myRecall.save(function(err,myRecall) {
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
});



app.get('/myRecalls/:id', function(req, res){
	db.MyRecall.findById(req.params.id, function(err,myRecall){
    res.render("myRecalls/show", {myRecall:myRecall});
  });
})

app.delete('/myRecalls/:id', function(req, res){
	db.MyRecall.findByIdAndRemove(req.params.id, function(err, myRecall){
		if(err){
			//TODO with error

			console.log(err);
			res.render('myRecalls/show')
		}
		else{
			res.redirect('/myRecalls');
		}
	})
})

app.listen(process.env.PORT || 8080, function(){
	console.log("listening on 8080");
});

