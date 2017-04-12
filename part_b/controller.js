function displayChart() {
	$("#chartDisplay").empty();
	$("#commitContainer").find("div").remove(".panel");

	$.getScript("bar_chart.js");
	
	$("#chartDisplay").show();
	$("#commitDisplay").show();
	$("#helpHeader").show();
}

$(document).ready(function(){

	$('#submitBtn').click(function(){
		displayChart();
	});
});



