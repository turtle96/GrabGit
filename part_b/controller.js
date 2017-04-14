$(document).ready(function(){

	$('#submitBtn').click(function(){
		submitForm();
	});

	$(document).keypress(function(e) {
	    if(e.which == 13) {
	    	submitForm();
	    }
	});
});

function submitForm() {
	var form = $('form').serializeArray();
	form = form.map(function(a) { return a.value;});
	console.log(form);

	displayChart(form);
}

function displayChart(names) {
	var flag = false;
	names.forEach(function(name) {
		if (name) {
			flag = true;
		}
	});

	if (!flag) {
		alert("Please enter a name.");
		return;
	}

	$("#chartDisplay").hide();
	$("#commitDisplay").hide();
	$("#chartDisplay").empty();	//clear graph
	$("#commitContainer").find("div").remove(".panel");	//removes only the panels for commits

	$.getScript("bar_chart.js", function(){
		display(names);
		$("#helpHeader").show();
		$("#commitDisplay").slideDown("slow");
		$("#chartDisplay").slideDown("slow");
	});

}