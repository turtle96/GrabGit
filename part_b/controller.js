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
	console.log(form);
	var names = form.map(function(a) { 
		if (a.name.includes("authorName")) {
			return a.value;
		}
		else {
			return "";
		}
	});
	console.log(names);

	var since = form[5].value;
	var until = form[6].value;

	console.log(since + " " + until);

	displayChart(names, since, until);
}

function displayChart(names, since, until) {
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
		display(names, since, until);
		$("#helpHeader").show();
		$("#commitDisplay").slideDown("slow");
		$("#chartDisplay").slideDown("slow");
	});

}