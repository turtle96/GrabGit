var repo = getUrlVars();
console.log(repo);

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

function getUrlVars()
		{
		    var vars = [], hash;
		    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
		    for(var i = 0; i < hashes.length; i++)
		    {
		        hash = hashes[i].split('=');
		        vars.push(hash[0]);
		        vars[hash[0]] = hash[1];
		    }
		    return vars;
		}

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

	displayChart(names, since, until, repo);
}

function displayChart(names, since, until, repo) {
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
		display(names, since, until, repo);
		$("#helpHeader").show();
		$("#commitDisplay").slideDown("slow");
		$("#chartDisplay").slideDown("slow");
	});

}