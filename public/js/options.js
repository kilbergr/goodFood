$(function(){

  function optionHTML(option) {
    return '<div data-id="' + search._id + '"><p><a href="/searchs/' + search._id + '/">' + search.address + 
           '</a></p><p>loc: ' + search.loc + ', date: ' + search.date + '</p>' +
           '<p><a href="/searchs/' + search._id + '/edit">Change a search</a></p><hr></div>';
     }

$('#lookUp').click(function(e) {
    e.preventDefault();
    var html = '<br/><form id="searchform" action="/search" method="POST">' +
  '<div class="form-group">' +
    '<label for="name">Food: </label>' +
    '<input type="text" name="search[foodType]" id="foodType" autofocus>' +
  '</div><div>OR</div>' + 
  '<div class="form-group">' +
    '<label for="loc">Location: </label>' +
    '<input type="text" name="search[loc]" id="loc"></div><div>OR</div><div>' +
    '<label for="date">Date of Interest: </label>' +
    '<input type="text" name="search[date]" id="date">' +
  '</div>' +
  '<input type="submit" value="Search">' +
'</form>';

    $('#needID').after(html);
    $('#newplaceform').submit(function(e) {
      e.preventDefault();
      var foodType = $('#foodType').val();
      var loc = $('#loc').val();
      var date = $('#date').val();
      var data = {search: {address: address, loc: loc, date: date}};
    

      $.ajax({
        type: 'POST',
        url: '/search',
        data: data,
        dataType: 'json'
       }).done(function(data) {

         $('#addedPoints').append(searchHTML(data.search));
         $('#addsearch').remove();
      });
    });
  });
})

