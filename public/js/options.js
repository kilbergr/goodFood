$(function(){

//thanks to http://www.dyn-web.com/tutorials/forms/radio/get-selected.php
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
	if(val==='foodType'){
			var html = '<div><form id="newFoodSearch" action="/recalls" method="POST">' +
		'<label for="inReason">Food: <input type="text" name="recall[foodType]" id="foodType" autofocus>' +
		'</label><input type="submit" value="Find recalls"></div>' +
		'</form>';
		}
		//for searching by distribution area
		else if (val ==='location'){
				var html = '<div><form id="newLocSearch" action="/recalls" method="POST">' +
			'<label for="inReason">Location: <input type="text" name="recall[location]" id="location" autofocus>' +
			'</label><input type="submit" value="Find recalls"></div>' +
			'</form>';
		}
		//for searching by date range
		else if (val === 'date'){
			var html = '<div><form id="newDateSearch" action="/recalls" method="POST">' +
			'<label for="inReason">Beginning of Range: <input type="text" name="recall[dateBegin]" id="dateBegin" autofocus>' +
			'</label><label for="inReason">  End of Range: <input type="text" name="recall[dateEnd]" id="dateEnd">' +
			'</label><input type="submit" value="Find recalls"></div>' +
			'</form>';
		}
		else{
			alert("Please select type of search!");
		}

	$('#typeOfQuery').after(html);
	$('#searchForm').submit(function(e) {
      e.preventDefault();
      var foodType = $('#foodType').val();
      var location = $('#location').val();
      var dateBegin= $('#dateBegin').val();
      var dateEnd = $('#dateEnd').val();
      var data = {recallQuery: {foodType: foodType, location:location, dateBegin: dateBegin, dateEnd: dateEnd}};
      
      $.ajax({
        type: 'POST',
        url: '/recalls',
        data: data,
        dataType: 'json'
       }).done(function(data) {

        // $('#addedPoints').append(placeHTML(data.place));
         $('#searchForm').remove();

      });
     });
	});
});

// })

