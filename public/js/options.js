$(document).ready(function(){


  var radioValue = function(){
  //	var radios = form.elements[name];
  var valArr = [];
  	var radios = document.getElementById('searchForm').elements['search'];
  	 for (var i=0; i<radios.length; i++) {
  	 	//if that button is checked
        if ( radios[i].checked ) { 
        	//save and return that value	
           valArr.push(radios[i].value); 
          }       
        }
       return valArr; 
      }

// $("#dateBegin").datepicker({
// 	format: "yyyy-mm-dd"
// });

//Show submission form on radio
$('#searchForm').submit(function(event){
	event.preventDefault();
	
	var vals =  radioValue();
	// var divSubmit;
	if(vals[0]==='foodType'){
		if(vals[1]==='location'){
			if(vals[2]==='date'){
				// food type with location and data search
				var html = '<div class="ui fluid icon input"><form id="newSearch" action="/recalls" method="POST">' +
				'<div><label for="inReason">Food: <input type="text" name="recall[foodType]" id="food" autofocus placeholder="Search by food..."> </label></div>' +
				'<div><label for="inReason">Location: <input type="text" name="recall[location]" id="loc" placeholder="Search by location..."></label></div>' + 
				'<div><label for="inReason">Beginning of Range: <input type="text" name="recall[dateBegin]" id="dateBegin" autofocus placeholder="YYYY-MM-DD">' +
	    	'</label><label for="inReason">  End of Range: <input type="text" name="recall[dateEnd]" id="dateEnd" placeholder="YYYY-MM-DD"></label></div>';
			}
			// food type with location search
			else {
				var html = '<div class="ui fluid icon input"><form id="newSearch" action="/recalls" method="POST">' +
				'<div><label for="inReason">Food: <input type="text" name="recall[foodType]" id="food" autofocus placeholder="Search by food..."> </label></div>' +
				'<div><label for="inReason">Location: <input type="text" name="recall[location]" id="loc" autofocus placeholder="Search by location..."></label></div>';
			}
		}
		// just food type
		else {
			var html = '<div class="ui fluid icon input"><form id="newSearch" action="/recalls" method="POST">' +
			'<label for="inReason">Food: <input type="text" name="recall[foodType]" id="food" autofocus placeholder="Search by food..."> </label>';
		}
		//divSubmit = '#newFoodSearch';
	}
		//for searching by distribution area
		else if (vals[0] ==='location'){
			if(vals[1]==='date'){
				var html = '<div class="ui fluid icon input"><form id="newSearch" action="/recalls" method="POST">' +
				'<div><label for="inReason">Location: <input type="text" name="recall[location]" id="loc" autofocus placeholder="Search by location..."></label></div>' +
				'<div><label for="inReason">Beginning of Range: <input type="text" name="recall[dateBegin]" id="dateBegin" autofocus placeholder="YYYY-MM-DD">' +
	    	'</label><label for="inReason">  End of Range: <input type="text" name="recall[dateEnd]" id="dateEnd" placeholder="YYYY-MM-DD"></label></div>';
			}
			else {
				var html = '<div class="ui fluid icon input"><form id="newSearch" action="/recalls" method="POST">' +
				'<label for="inReason">Location: <input type="text" name="recall[location]" id="loc" autofocus placeholder="Search by location..."></label>';
			//divSubmit = '#newLocSearch';
			}
		}
		//for searching by date range
		else if (vals[0] === 'date'){
			var html = '<div class="ui icon input"><form id="newSearch" action="/recalls" method="POST">' +
			//Trying datepicker and failing
			//'<label for="inReason">Beginning of Range: <input type="text" name="test" id="dateBegin"></label>'
		  //'<label for="inReason">Beginning of Range: <input type="text" name="recall[dateBegin]" id="dateBegin" placeholder="YYYY-MM-DD">'
			'<label for="inReason">Beginning of Range: <input type="text" name="recall[dateBegin]" id="dateBegin" autofocus placeholder="YYYY-MM-DD">' +
	    '</label><label for="inReason">  End of Range: <input type="text" name="recall[dateEnd]" id="dateEnd" placeholder="YYYY-MM-DD"></label>';
			//divSubmit = '#newDateSearch';
		}
		else {
			alert('Please choose a search type');
		}	
	$('#searchForm').after(html + '<input class="invertBtn" type="submit" value="Find recalls" class="search icon"></div></form>');
	$('#searchForm').css('display', 'none');
	});
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