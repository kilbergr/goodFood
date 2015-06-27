$(document).ready(function(){


  var radioValue = function(){
  //	var radios = form.elements[name];
  	var radios = document.getElementById('searchForm').elements['search'];
  	 for (var i=0; i<radios.length; i++) {
  	 	//if that button is checked
        if ( radios[i].checked ) { 
        	//save and return that value	
          var val = radios[i].value; 
            return val; 
          }
        }
      }

// $("#dateBegin").datepicker({
// 	format: "yyyy-mm-dd"
// });

//Show submission form on radio
$('#searchForm').submit(function(event){
	event.preventDefault();
	var val =  radioValue();
	var divSubmit;
	if(val==='foodType'){
			var html = '<div><form id="newFoodSearch" action="/recalls" method="POST">' +
		'<label for="inReason">Food: <input type="text" name="recall[foodType]" id="food" autofocus></label>';
		//divSubmit = '#newFoodSearch';
		}
		//for searching by distribution area
		else if (val ==='location'){
				var html = '<div><form id="newLocSearch" action="/recalls" method="POST">' +
			'<label for="inReason">Location: <input type="text" name="recall[location]" id="loc" autofocus></label>';
			//divSubmit = '#newLocSearch';
		}
		//for searching by date range
		else if (val === 'date'){
			var html = '<div><form id="newDateSearch" action="/recalls" method="POST">' +
			//Trying datepicker and failing
			//'<label for="inReason">Beginning of Range: <input type="text" name="test" id="dateBegin"></label>'
		  //'<label for="inReason">Beginning of Range: <input type="text" name="recall[dateBegin]" id="dateBegin" placeholder="YYYY-MM-DD">'
			'<label for="inReason">Beginning of Range: <input type="text" name="recall[dateBegin]" id="dateBegin" autofocus placeholder="YYYY-MM-DD">' +
	    '</label><label for="inReason">  End of Range: <input type="text" name="recall[dateEnd]" id="dateEnd" placeholder="YYYY-MM-DD"></label>'
			//divSubmit = '#newDateSearch';
		}
		else {
			alert('Please choose a search type');
		}	
	$('#searchForm').after(html + '<input type="submit" value="Find recalls"></div></form>');
  
	});

//show more info on request
$('#showMore').submit(function(e){
	e.preventDefault();
	$('#moreInfo').css('display', 'block');
	google.maps.event.trigger(map, 'resize');
})

//show less info on request
$('#showLess').submit(function(e){
	e.preventDefault();
	$('#moreInfo').css('display', 'none');
})

$('#saveRecall').submit(function(e){
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

  function saveRecall() {
    $.getJSON("/myRecalls").done(function(data) {
      console.log(data);
    }).fail(function(err){
    	console.log(err.responseText);
    });
  }


saveRecall();

     
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
//beginning view--for some reason has to be weirdly centered to show US
 var mapOptions = {
      zoom: 3,
      center: {lat: 55.8282, lng: -128.5795},
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
google.maps.event.addDomListener(window, 'load', initialize);
initialize();
// google.maps.event.trigger($("#map-canvas")[0], 'resize');
 });


		/*else if (val === 'date'){
			var html = '<div><form id="newDateSearch" action="/recalls" method="POST">' +
	'<label for="inReason">Beginning of Range:' +
			'<select name="yearBegin">' +
			'<option value="2015">2015</option>' +
			'<option value="2014">2014</option>' +
			'<option value="2013">2013</option>' +
			'<option value="2012">2012</option>' +
			'<option value="2011">2011</option>' +
			'<option value="2010">2010</option>' +
			'<option value="2009">2009</option>' +
			'<option value="2008">2008</option>' +
			'<option value="2007">2007</option>' +
			'<option value="2006">2006</option>' +
			'<option value="2005">2005</option>' +
			'<option value="2004">2004</option>' +
			'</select>' +
			'<select name="monthBegin">' +
			'<option value="01">01</option>' +
			'<option value="02">02</option>' +
			'<option value="03">03</option>' +
			'<option value="04">04</option>' +
			'<option value="05">05</option>' +
			'<option value="06">06</option>' +
			'<option value="07">07</option>' +
			'<option value="08">08</option>' +
			'<option value="09">09</option>' +
			'<option value="10">10</option>' +
			'<option value="11">11</option>' +
			'<option value="12">12</option>' +
			'</select>' +
			'<select name="dayBegin">' +
			'<option value="01">01</option>' +
			'<option value="02">02</option>' +
			'<option value="03">03</option>' +
			'<option value="04">04</option>' +
			'<option value="05">05</option>' +
			'<option value="06">06</option>' +
			'<option value="07">07</option>' +
			'<option value="08">08</option>' +
			'<option value="09">09</option>' +
			'<option value="10">10</option>' +
			'<option value="11">11</option>' +
			'<option value="12">12</option>' +
			'<option value="13">13</option>' +
			'<option value="14">14</option>' +
			'<option value="15">15</option>' +
			'<option value="16">16</option>' +
			'<option value="17">17</option>' +
			'<option value="18">18</option>' +
			'<option value="19">19</option>' +
			'<option value="20">20</option>' +
			'<option value="21">21</option>' +
			'<option value="22">22</option>' +
			'<option value="23">23</option>' +
			'<option value="24">24</option>' +
			'<option value="25">25</option>' +
			'<option value="26">26</option>' +
			'<option value="27">27</option>' +
			'<option value="28">28</option>' +
			'<option value="29">29</option>' +
			'<option value="30">30</option>' +
			'<option value="31">31</option>' +
			'</select></div></label>' +
			'<label for="inReason">  End of Range:' +
			'<select name="yearEnd">' +
			'<option value="2015">2015</option>' +
			'<option value="2014">2014</option>' +
			'<option value="2013">2013</option>' +
			'<option value="2012">2012</option>' +
			'<option value="2011">2011</option>' +
			'<option value="2010">2010</option>' +
			'<option value="2009">2009</option>' +
			'<option value="2008">2008</option>' +
			'<option value="2007">2007</option>' +
			'<option value="2006">2006</option>' +
			'<option value="2005">2005</option>' +
			'<option value="2004">2004</option>' +
			'</select>' +
			'<select name="monthEnd">' +
			'<option value="01">01</option>' +
			'<option value="02">02</option>' +
			'<option value="03">03</option>' +
			'<option value="04">04</option>' +
			'<option value="05">05</option>' +
			'<option value="06">06</option>' +
			'<option value="07">07</option>' +
			'<option value="08">08</option>' +
			'<option value="09">09</option>' +
			'<option value="10">10</option>' +
			'<option value="11">11</option>' +
			'<option value="12">12</option>' +
			'</select>' +
			'<select name="dayEnd">' +
			'<option value="01">01</option>' +
			'<option value="02">02</option>' +
			'<option value="03">03</option>' +
			'<option value="04">04</option>' +
			'<option value="05">05</option>' +
			'<option value="06">06</option>' +
			'<option value="07">07</option>' +
			'<option value="08">08</option>' +
			'<option value="09">09</option>' +
			'<option value="10">10</option>' +
			'<option value="11">11</option>' +
			'<option value="12">12</option>' +
			'<option value="13">13</option>' +
			'<option value="14">14</option>' +
			'<option value="15">15</option>' +
			'<option value="16">16</option>' +
			'<option value="17">17</option>' +
			'<option value="18">18</option>' +
			'<option value="19">19</option>' +
			'<option value="20">20</option>' +
			'<option value="21">21</option>' +
			'<option value="22">22</option>' +
			'<option value="23">23</option>' +
			'<option value="24">24</option>' +
			'<option value="25">25</option>' +
			'<option value="26">26</option>' +
			'<option value="27">27</option>' +
			'<option value="28">28</option>' +
			'<option value="29">29</option>' +
			'<option value="30">30</option>' +
			'<option value="31">31</option>' +
			'</select></div></label>' +
		
'<label for="inReason">Beginning of Range: <input type="text" name="recall[dateBegin]" id="dateBegin" autofocus></label>' +
'<label for="inReason">End of Range: <input type="text" name="recall[dateEnd]" id="dateEnd">' +
			'<input type="submit" value="Find recalls"></div>' +
			'</form>';
				*/