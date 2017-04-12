function displayChart() {
	$("#chartDisplay").hide();
	$("#commitDisplay").hide();
	$("#chartDisplay").empty();	//clear graph
	$("#commitContainer").find("div").remove(".panel");	//removes only the panels for commits

	$.getScript("bar_chart.js", function(){
		$("#helpHeader").show();
		$("#commitDisplay").slideDown("slow");
		$("#chartDisplay").slideDown("slow");
	});

	
}

$(document).ready(function(){

	$('#submitBtn').click(function(){
		var form = $('form').serializeArray();
		console.log(form);
		
		displayChart();
	});
});



