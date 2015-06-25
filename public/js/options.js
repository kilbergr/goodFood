$(function(){


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

$('#searchForm').submit(function(event){
	event.preventDefault();
	var val =  radioValue();
	var divSubmit;
	if(val==='foodType'){
			var html = '<div><form id="newFoodSearch" action="/recalls" method="POST">' +
		'<label for="inReason">Food: <input type="text" name="recall[foodType]" id="food" autofocus>' +
		'</label><input type="submit" value="Find recalls"></div>' +
		'</form>';
		divSubmit = '#newFoodSearch';
		}
		//for searching by distribution area
		else if (val ==='location'){
				var html = '<div><form id="newLocSearch" action="/recalls" method="POST">' +
			'<label for="inReason">Location: <input type="text" name="recall[location]" id="loc" autofocus>' +
			'</label><input type="submit" value="Find recalls"></div>' +
			'</form>';
			divSubmit = '#newLocSearch';
		}
		//for searching by date range
		else if (val === 'date'){
			var html = '<div><form id="newDateSearch" action="/recalls" method="POST">' +
			'<label for="inReason">Beginning of Range: <input type="text" name="recall[dateBegin]" id="dateBegin" autofocus>' +
			'</label><label for="inReason">  End of Range: <input type="text" name="recall[dateEnd]" id="dateEnd">' +
			'</label><input type="submit" value="Find recalls"></div>' +
			'</form>';
			divSubmit = '#newDateSearch';
		}
		else{
			alert("Please select type of search!");
		}

	$('#searchForm').after(html);
	// $(divSubmit).submit(function(e) {
 //      e.preventDefault();
 //      //add info to recallQuery obj from form
 //      var foodType = $('#food').val();
 //      var location = $('#loc').val();
 //      var dateBegin= $('#dateBegin').val();
 //      var dateEnd = $('#dateEnd').val();
 //      var data = {recallQuery: {foodType: foodType, location:location, dateBegin: dateBegin, dateEnd: dateEnd}}
 //      console.log(data);

      // $.ajax({
      //   type: 'POST',
      //   url: '/recalls',
      //   data: data,
      //   dataType: 'json'
      //  }).done(function(data) {

      //    $('#searchForm').remove();

      // });
   
	});
});


