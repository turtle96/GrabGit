$(document).ready(function(){

	$('#submitBtn').click(function(){
		var form = $('form').serializeArray();
		console.log(form);

		$("#features").fadeIn();
	});
});