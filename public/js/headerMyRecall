 $(document).ready(function(){

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
})
