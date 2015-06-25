$(function(){

//thanks to http://www.dyn-web.com/tutorials/forms/radio/get-selected.php
  var radioValue = function(form, name){
  	var radios = form.elements[name];
  	 for (var i=0; i<radios.length; i++) {
        if ( radios[i].checked ) { 
        console.log(checked);// radio checked?
           var val = radios[i].value; // if so, hold its value in val
            return val; // and break out of for loop
        }
    }
   alert(val);
  }

$('#searchForm').click(function(event){
	event.preventDefault();
//for food name or distribution area, will do date later
	var html = '<div><form id="newSearch" action="/recalls" method="POST">' +
	'<label for="inReason">Food: <input type="text" name="recall[foodType]" id="foodType" autofocus>' +
	'</label></div><input type="submit" value="Find recalls">' +
'</form>';

	$('#typeOfQuery').after(html);
	$('#searchForm').submit(function(e) {
      e.preventDefault();
       radioValue(document.getElementById('searchForm'), 'search');
      var data = {place: {address: address, lat: lat, long: long}};
    

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

// radios = document.getElementById('searchForm').elements['search'];
// })

