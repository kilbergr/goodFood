 $(document).ready(function(){
  
	//parsing strings of distribution patterns to find state names (in array)
 var findState = function(str, arr){
 	var upCased = str.toUpperCase();
 	var words = upCased.split(" ");
 	var distStates = [];
 	for (var i = 0; i < arr.length; i++){
 		for (var j = 0; j < words.length; j++){
 			if(words[j].indexOf(arr[i])!= -1){
        distStates.push(arr[i]);
      };
    }

  }
  console.log(distStates);

};



stateNames = ["NATIONALLY", "NATIONWIDE", "NATIONAL", "USA", "ALABAMA", "ALASKA", "ARIZONA", "ARKANSAS", "CALIFORNIA", "COLORADO", "CONNECTICUT", "DELAWARE", "FLORIDA", "GEORGIA", "HAWAII", "IDAHO", "ILLINOIS", "INDIANA", "IOWA", "KANSAS", "KENTUCKY", "LOUISIANA", "MAINE", "MARYLAND", "MASSACHUSETTS", "MICHIGAN", "MINNESOTA", "MISSISSIPPI", "MISSOURI", "MONTANA", "NEBRASKA", "NEVADA", "NEW HAMPSHIRE", "NEW JERSEY", "NEW MEXICO", "NEW YORK", "NORTH CAROLINA", "NORTH DAKOTA", "OHIO", "OKLAHOMA", "OREGON", "PENNSYLVANIA", "RHODE ISLAND", "SOUTH CAROLINA", "SOUTH DAKOTA", "TENNESSEE", "TEXAS", "UTAH", "VERMONT", "VIRGINIA", "WASHINGTON", "WEST VIRGINIA", "WISCONSIN", "WYOMING", "DISTRICT OF COLUMBIA", "PUERTO RICO", "GUAM", "AMERICAN SAMOA", "U.S. VIRGIN ISLANDS", "NORTHERN MARIANA ISLANDS", "AK","AL","AR","AZ","CA","CO","CT","DC","DE","FL","GA","GU","HI","IA","ID", "IL","IN","KS","KY","LA","MA","MD","ME","MH","MI","MN","MO","MS","MT","NC","ND","NE","NH","NJ","NM","NV","NY", "OH","OK","OR","PA","PR","PW","RI","SC","SD","TN","TX","UT","VA","VI","VT","WA","WI","WV","WY"]; 


//show more info on request
$('.showMore').on("click", function(e){
	e.preventDefault();
	$('#moreInfo').css('display', 'block');
	findState($(".distribution_pattern").val(), stateNames);
	// var data = {place: {}};
 //   data.place.address = $('#address').val();
 //   data.place.lat = $('#lat').val();
 //   data.place.long = $('#long').val();
})

//show less info on request
$('.showLess').on("click", function(e){
	e.preventDefault();
	$('#moreInfo').css('display', 'none');
})



//saving the recall info in your recalls database with AJAX 
$('.saveRecall').submit(function(e){
	e.preventDefault();
	var reason_for_recall = $(".reason_for_recall").val();
	var product_description = $(".product_description").val();
	var distribution_pattern = $(".distribution_pattern").val();
	var recalling_firm = $(".recalling_firm").val();
	var classification = $(".classification").val();
	var report_date = $(".report_date").val();
	var data = {myRecall: {reason_for_recall: reason_for_recall, product_description: product_description, distribution_pattern: distribution_pattern, classification:classification, recalling_firm:recalling_firm, report_date:report_date}};
	console.log(data);
  $.ajax({	
    type: 'POST',
    url: '/myRecalls',
    data: data,
    dataType: 'json'
  }).done(function(data) {
    console.log(data);
  });
})




//Google Maps Section
//styling
var map,
markers =[];
function initialize() {

  var styles = [
  {
    featureType: "all",
    stylers: [
    { hue: "#00ffee" },
    { saturation: -50 }
    ]
  },{
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [

    { saturation: 80 }
    ]
  },{
    featureType: "poi.business",
    elementType: "labels",
    stylers: [
    { visibility: "off" }
    ]
  }
  ];

  var styledMap = new google.maps.StyledMapType(styles,
    {name: "Styled Map"});
//centering on US
var mapOptions = {
  zoom: 3,
  center: {lat: 40.7033127, lng: -90.979681},
  mapTypeControlOptions: {
    mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
  }
};
map = new google.maps.Map(document.getElementById('map-canvas'),
  mapOptions);

map.mapTypes.set('map_style', styledMap);
map.setMapTypeId('map_style');

var mapDiv = document.getElementById('map-canvas');

     //will add event for click on more info
     google.maps.event.trigger('.showMore', 'click', function(event) {
     //show locations mentioned
     console.log("map event");
   });
   }
   initialize();
//google.maps.event.trigger(map, 'resize');
// google.maps.event.trigger($("#map-canvas")[0], 'resize');
});