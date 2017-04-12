function displayChart() {
	$.getScript("bar_chart.js");
	$("#chartDisplay").show();
	$("#commitDisplay").show();
}

$(document).ready(function(){

	$('#submitBtn').click(function(){
		displayChart();
	});
});



