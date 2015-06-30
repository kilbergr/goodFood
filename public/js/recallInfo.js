 $(document).ready(function(){

	//parsing strings of distribution patterns to find state names (in array)
var makeRegAbbrExp = function(stateArr){
    var regExpAbbrStr = '';
    for(var i = 0; i < stateNames.length; i++){
        if(i < stateNames.length-1){
            regExpAbbrStr +='(\\b'+stateNames[i].abbreviation+'\\b\)|';
         }
        else{
            regExpAbbrStr +='(\\b'+stateNames[i].abbreviation+'\\b\)';
          }
    }
    var reAbbr = RegExp(regExpAbbrStr, 'g') ;
    return reAbbr;
}

var makeRegNameExp = function(stateArr){
    var regExpNameStr = '';
    for(var i = 0; i < stateNames.length; i++){
        if(i < stateNames.length-1){
            regExpNameStr +='(\\b'+stateNames[i].name+'\\b\)|';
        }
        else{
            regExpNameStr +='(\\b'+stateNames[i].name+'\\b\)';
        }
    }
    var reName = RegExp(regExpNameStr, 'g');
    return reName;
}

var findStateNameRegExp = function(distString, stateArr){
    var reName = makeRegNameExp(stateArr);
    var nameMatch = distString.match(reName);
    return nameMatch; 
}
var findStateAbbrRegExp = function(distString, stateArr){
   var reAbbr = makeRegAbbrExp(stateArr);
   var abbrMatch = distString.match(reAbbr);
   return abbrMatch;
}

//show more info on request
$('.showMore').on("click", function(e){
  e.preventDefault();
  $(this).next('.moreInfo').css('display', 'block');
  var pattern = $(this).children('.distribution_pattern').val();
  var distStateNames = findStateNameRegExp(pattern, stateNames);
  var distStateAbbr = findStateAbbrRegExp(pattern, stateNames);
  if(distStateNames!==null){
    distStateNames.forEach(function(state){
        addMarkers(state, stateNames);
    });
  }
 else{
    distStateAbbr.forEach(function(state){
        addMarkers(state, stateNames);
    });
  }
})

//show less info on request
$('.showLess').on("click", function(e){
    e.preventDefault();
    $(this).parent('.moreInfo').css('display', 'none');
    removeMarkers(markers);
})


$('.saveRecall')
.popup('setting', 'content', 'Log in to save')
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
	// console.log(data);
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
  }

//addMarker function
var addMarkers = function(str, stateArr){
  stateArr.forEach(function(state){
    if(state.name===str || state.abbreviation === str || state.alternative === str){
        myLatLng = new google.maps.LatLng(state.latitude, state.longitude);
        var myMarkers = [];
        var marker = new google.maps.Marker({
             position: myLatLng,
            title: state.name,
            draggable: true,
            map: map
         });
        markers.push(marker);
        return markers;
    }
    else{
       //figure out what to do
    }
  })  
 
};
//removeMarker function
var removeMarkers = function(arr){
   for (var k = 0; k < arr.length; k++) {
     arr[k].setMap(null);
  }
};

initialize();
});

//states and their longitudes/latitudes
 var stateNames = [
 {
        "name": "Canada",
        "latitude": 52.1396545,
        "longitude":  -106.6467271  
    },
   {
        "name": "Nationwide",
        "abbreviation": "USA",
        "alternative": "nationally",
        "latitude": 38.526600,
        "longitude":  -96.726486
    },
        {
        "name": "nationwide",
        "abbreviation": "US",
        "alternative": "Nationally",
        "latitude": 38.526600,
        "longitude":  -96.726486
    },
    {
        "name": "Alabama",
        "abbreviation": "AL",
        "latitude": 32.806671,
        "longitude": -86.791130
    },
    {
        "name": "Alaska",
        "abbreviation": "AK",
        "latitude": 61.370716,
        "longitude": -152.404419
    },
    {
        "name": "Arizona",
        "abbreviation": "AZ",
        "latitude": 33.729759,
        "longitude": -111.431221
    },
    {
        "name": "Arkansas",
        "abbreviation": "AR",
        "latitude": 34.969704,
        "longitude": -92.373123
    },
    {
        "name": "California",
        "abbreviation": "CA",
        "latitude": 36.116203,
        "longitude": -119.681564
    },
    {
        "name": "Colorado",
        "abbreviation": "CO",
        "latitude": 39.059811,
        "longitude":  -105.311104
    },
    {
        "name": "Connecticut",
        "abbreviation": "CT",
        "latitude": 41.597782,
        "longitude":  -72.755371
    },
    {
        "name": "Delaware",
        "abbreviation": "DE",
        "latitude": 39.318523,
        "longitude": -75.507141
    },
    {
        "name": "District Of Columbia",
        "abbreviation": "DC",
        "alternative": "Washington, DC",
        "latitude": 38.897438,
        "longitude":  -77.026817
    },
    {
        "name": "Florida",
        "abbreviation": "FL",
        "latitude": 27.766279,
        "longitude": -81.686783
    },
    {
        "name": "Georgia",
        "abbreviation": "GA",
        "latitude": 33.040619,
        "longitude":  -83.643074
    },
    {
        "name": "Hawaii",
        "abbreviation": "HI",
        "latitude": 21.094318,
        "longitude": -157.498337
    },
    {
        "name": "Idaho",
        "abbreviation": "ID",
        "latitude": 44.240459,
        "longitude":  -114.478828
    },
    {
        "name": "Illinois",
        "abbreviation": "IL",
        "latitude": 40.349457,
        "longitude":  -88.986137
    },
    {
        "name": "Indiana",
        "abbreviation": "IN",
        "latitude": 39.849426,
        "longitude":  -86.258278
    },
    {
        "name": "Iowa",
        "abbreviation": "IA",
        "latitude": 42.011539,
        "longitude":  -93.210526
    },
    {
        "name": "Kansas",
        "abbreviation": "KS",
        "latitude": 38.526600,
        "longitude":  -96.726486
    },
    {
        "name": "Kentucky",
        "abbreviation": "KY",
        "latitude": 37.668140,
        "longitude":  -84.670067
    },
    {
        "name": "Louisiana",
        "abbreviation": "LA",
        "latitude": 31.169546,
        "longitude": -91.867805
    },
    {
        "name": "Maine",
        "abbreviation": "ME",
        "latitude": 44.693947,
        "longitude":  -69.381927
    },
    {
        "name": "Maryland",
        "abbreviation": "MD",
        "latitude": 39.063946,
        "longitude":  -76.802101
    },
    {
        "name": "Massachusetts",
        "abbreviation": "MA",
        "latitude": 42.230171,
        "longitude":  -71.530106
    },
    {
        "name": "Michigan",
        "abbreviation": "MI",
        "latitude": 43.326618,
        "longitude": -84.536095
    },
    {
        "name": "Minnesota",
        "abbreviation": "MN",
        "latitude": 45.694454,
        "longitude":  -93.900192
    },
    {
        "name": "Mississippi",
        "abbreviation": "MS",
        "latitude": 32.741646,
        "longitude":  -89.678696
    },
    {
        "name": "Missouri",
        "abbreviation": "MO",
        "latitude": 38.456085,
        "longitude":  -92.288368
    },
    {
        "name": "Montana",
        "abbreviation": "MT",
        "latitude": 46.921925,
        "longitude":  -110.454353
    },
    {
        "name": "Nebraska",
        "abbreviation": "NE",
        "latitude": 41.125370,
        "longitude":  -98.268082
    },
    {
        "name": "Nevada",
        "abbreviation": "NV",
        "latitude": 38.313515,
        "longitude":  -117.055374
    },
    {
        "name": "New Hampshire",
        "abbreviation": "NH",
        "latitude": 43.452492,
        "longitude":  -71.563896
    },
    {
        "name": "New Jersey",
        "abbreviation": "NJ",
        "latitude": 40.298904,
        "longitude": -74.521011
    },
    {
        "name": "New Mexico",
        "abbreviation": "NM",
        "latitude": 34.840515,
        "longitude": -106.248482
    },
    {
        "name": "New York",
        "abbreviation": "NY",
        "latitude": 42.165726,
        "longitude": -74.948051
    },
    {
        "name": "North Carolina",
        "abbreviation": "NC",
        "latitude": 35.630066,
        "longitude": -79.806419
    },
    {
        "name": "North Dakota",
        "abbreviation": "ND",
        "latitude": 47.528912,
        "longitude": -99.784012
    },
    {
        "name": "Ohio",
        "abbreviation": "OH",
        "latitude": 40.388783,
        "longitude": -82.764915
    },
    {
        "name": "Oklahoma",
        "abbreviation": "OK",
        "latitude": 35.565342,
        "longitude":  -96.928917
    },
    {
        "name": "Oregon",
        "abbreviation": "OR",
        "latitude": 44.572021,
        "longitude": -122.070938
    },
    {
        "name": "Pennsylvania",
        "abbreviation": "PA",
        "latitude": 40.590752,
        "longitude": -77.209755
    },
    {
        "name": "Puerto Rico",
        "abbreviation": "PR",
        "latitude": 18.4500,
        "longitude": -66.1000
    },
    {
        "name": "Rhode Island",
        "abbreviation": "RI",
        "latitude": 41.680893,
        "longitude": -71.511780
    },
    {
        "name": "South Carolina",
        "abbreviation": "SC",
        "latitude": 33.856892,
        "longitude":  -80.945007
    },
    {
        "name": "South Dakota",
        "abbreviation": "SD",
        "latitude": 44.299782,
        "longitude":  -99.438828
    },
    {
        "name": "Tennessee",
        "abbreviation": "TN",
        "latitude": 35.747845,
        "longitude":  -86.692345
    },
    {
        "name": "Texas",
        "abbreviation": "TX",
        "latitude": 31.054487,
        "longitude":  -97.563461
    },
    {
        "name": "Utah",
        "abbreviation": "UT",
        "latitude": 40.150032,
        "longitude":  -111.862434
    },
    {
        "name": "Vermont",
        "abbreviation": "VT",
        "latitude": 44.045876,
        "longitude":  -72.710686
    },
    {
        "name": "Virginia",
        "abbreviation": "VA",
        "latitude":  37.769337,
        "longitude":  -78.169968
    },
    {
        "name": "Washington",
        "abbreviation": "WA",
        "latitude":  47.400902,
        "longitude": -121.490494
    },
    {
        "name": "West Virginia",
        "abbreviation": "WV",
        "latitude": 38.491226,
        "longitude": -80.954453
    },
    {
        "name": "Wisconsin",
        "abbreviation": "WI",
        "latitude": 44.268543,
        "longitude":  -89.616508
    },
    {
        "name": "Wyoming",
        "abbreviation": "WY",
        "latitude": 42.755966,
        "longitude": -107.302490
    }
]