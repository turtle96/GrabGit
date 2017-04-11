var data;

var height = 500;
var width = 1000;
var margin = 50;

var colorPositive = d3.scale.ordinal().range(["#00BFA5", "#80CBC4", "#26A69A", "#00796B", "#004D40"]);
var colorNegative = d3.scale.ordinal().range(["#FF5252", "#EF9A9A", "#EF5350", "#D32F2F", "#B71C1C"]);

var svg = d3.select("#chartDisplay")
		.append("svg")
		.attr("height", height)
		.attr("width", width);

d3.json("data/data.json", function(error, data) {
	var dataSet = {};
	var currentDate, currentMonth = null, currentName, monthKey;
	var keys = [];
	var added = 0, deleted = 0;

	var minDate = null, maxDate = null;
	
	console.log(data);

	data.forEach(function(author){
		//console.log(author);
		keys.push(author[0].name);

		author.forEach(function(d){
			//console.log(d);
			currentDate = moment(d.date, "MM/DD/YYYY");
			currentName = d.name;

			if (currentMonth != null && currentMonth.isSame(currentDate, "month")) {
				added += +d.add;
				deleted += +d.delete * -1;
			}
			
			if (currentMonth != null && dataSet[monthKey][currentName]) {
				dataSet[monthKey][currentName].added = added;
				dataSet[monthKey][currentName].deleted = deleted;
				dataSet[monthKey][currentName].date = monthKey;
			}

			currentMonth = currentDate;
			currentMonth.date(1);
			currentMonth.startOf('day');
			monthKey = moment(currentMonth);

			if (minDate==null || currentMonth.isBefore(minDate)) {
				minDate = moment(currentMonth);
			}
			if (maxDate==null || currentMonth.isAfter(maxDate)) {
				maxDate = moment(currentMonth);
			}

			if (!(dataSet[monthKey])) {
				dataSet[monthKey] = {date: monthKey};
				dataSet[monthKey][currentName] = {name: currentName, list: []};
				added = +d.add;
				deleted = +d.delete * -1;
			}
			else if (!(dataSet[monthKey][currentName])) {
				dataSet[monthKey][currentName] = {name: currentName, list: []};
				added = +d.add;
				deleted = +d.delete * -1;
			}

			dataSet[monthKey][currentName].list.push(d);
			
		});

		dataSet[monthKey][currentName].added = added;
		dataSet[monthKey][currentName].deleted = deleted;
		dataSet[monthKey][currentName].date = monthKey;
		added = 0;
		deleted = 0;
	});

	console.log(dataSet);
	console.log(keys);

	minDate.subtract(1, "months");
	minDate.startOf('day');   
	maxDate.add(1, "months");
	maxDate.startOf('day');
	//console.log(minDate.toString() + ", " + maxDate.toString());

 	var x0 = d3.time.scale()
 		.domain([minDate, maxDate])
 		.rangeRound([margin, width-margin]);
 
	var x1 = d3.scale.ordinal();

  	var interval = 0;
  	var startDate = moment(minDate);
  	var endDate = moment(maxDate);

  	while (startDate.isBefore(endDate, "month")) {
  		interval += 1;
  		startDate.add(1, "months");
  	}

  	console.log("Interval: " + interval);
  	var bandwidth = (width-margin*2)/interval;
  	x1.domain(keys).rangeRoundBands([0, bandwidth], 0, 0.2*keys.length);	

  	var y = d3.scale.linear()
		.rangeRound([height-margin, margin]);

	var yMax = d3.max(d3.values(dataSet), function(d) { /*console.log(d);*/ return d3.max(keys, function(key) { 
		if (d[key])
			return d[key].added; 
		return 0;
	}); });

	var yMin = d3.min(d3.values(dataSet), function(d) { return d3.min(keys, function(key) {
		if (d[key]) {
			return d[key].deleted; 
		}
		return 0;
	}); });

	console.log("y axis range: " + yMin + ", " + yMax);

	y.domain([yMin, yMax]);

	var xAxis = d3.svg.axis()
    .scale(x0)
    .orient("bottom")
    .tickFormat(d3.time.format("%b %Y"));

	var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

    colorPositive.domain(keys);
    colorNegative.domain(keys);

    path = svg.selectAll("g")
    	.data(d3.values(dataSet))
    	.enter()
    	.append("g")
    		.attr("transform", function(d) {return "translate(" + x0(d.date) + ",0)"; })
    	.selectAll(".rect")
    	.data(function(d) { 
    		var values = [];
    		keys.map(function(key) {  
	    		if (d[key]) {
	    			values.push({key: key, value: d[key].added, date: d[key].date, list: d[key].list}); 
	    			values.push({key: key, value: d[key].deleted, date: d[key].date, list: d[key].list});
	    		} 
    		});
    		
    		//console.log(values);
    		return values; 
    	})
	    	.enter().append("rect")
	    	.attr("x", function(d) { return x1(d.key) - bandwidth/2; })
	        .attr("y", function(d) { 
	        	if (d.value > 0) {
	        		return y(d.value);
	        	}
	        	else {
	        		return y(0);
	        	} 
	        })
	        .attr("width", x1.rangeBand())
	        .attr("height", function(d) { 
	        	if (d.value > 0) {
	        		return y(0) - y(d.value);
	        	}
	        	else {
	        		return y(0) - y(d.value * -1);
	        	}
	         })
	        .attr("fill", function(d) { 
	        	if (d.value > 0) {
	        		return colorPositive(d.key); 
	        	}
	        	else {
	        		return colorNegative(d.key);
	        	}
	        });
				
	path.on("mouseover", function(d) { 
		d3.select(this).style("opacity", 0.6);

		tooltip.select(".text").html(d.value + " lines<br>" + d.key + "<br>" + d.date.format("MMM YYYY").toString());
		tooltip.style("display", "block"); 
	});

	path.on("mouseout", function() { 
		d3.select(this).style("opacity", 1)
		tooltip.style("display", "none"); 
	});
	path.on("mousemove", function(d) {
	    tooltip.style('top', (d3.event.layerY + 10) + "px")
    		.style('left', (d3.event.layerX + 10) + "px");
	});

	console.log("y(0): " + y(0));
	
	svg.append("g")
		.attr("class", "axis x")
		.attr("transform", "translate(0 " + y(0) + ")")
		.call(xAxis);

	svg.append("g")
		.attr("class", "axis y")
		.attr("transform", "translate(" + margin + " 0)")
		.call(yAxis);

	var legend = svg.append("g")
		.attr("text-anchor", "end")
	    .selectAll("g")
	    .data(keys)
	    .enter().append("g")
	      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

	legend.append("rect")
		.attr("x", width - 40)
		.attr("width", 20)
		.attr("height", 20)
		.attr("fill", function(d) { return colorPositive(d); })
		.style("stroke", "#fff")
		.style("stroke-width", 2);

    legend.append("rect")
		.attr("x", width - 20)
		.attr("width", 20)
		.attr("height", 20)
		.attr("fill", function(d) { return colorNegative(d); })
		.style("stroke", "#fff")
		.style("stroke-width", 2);

	legend.append("text")
		.attr("x", width - 50)
		.attr("y", 16)
		.text(function(d) { return d; });

	path.on("click", function(d) {
	    console.log(d.list);
	    var commitDisplay = d3.select("#commitDisplay").select(".jumbotron");
	    commitDisplay.select("#helpHeader").remove();	//remove help header
	    commitDisplay.selectAll("div").remove();	//removes previous entries

	    commitDisplay.selectAll("div")
	    	.data(d.list)
	    	.enter()
	    	.append("div").classed("panel panel-custom", true)
	    	.append("div").classed("panel-body", true)
	    	.append("h4")
	    	.attr("align", "left")
	    	.html(function(d) { 
	    		var commit = ""; 
	    		var tabSpacing = "&nbsp;&nbsp;&nbsp;&nbsp;";

	    		commit += "Author: " + d.name + "<br>";

	    		if (d.email == "none@none") {
	    			d.email = "None";
	    		}
	    		commit += "Author's Email: " + d.email + "<br>";
	    		commit += "Commit Date: " + d.dateAndTime + "<br>";
	    		commit += "Commit Message:<br>" + tabSpacing + d.message.replace("\n", "<br>&nbsp;&nbsp;&nbsp;") + "<br>";
	    		commit += "<font color=#689F38>Added</font> " + d.add + " lines<br>";
	    		commit += "<font color=#D32F2F>Deleted</font> " + d.delete + " lines<br>";
	    		return commit; 
	    	});
	});
});
    
var tooltip = d3.select("#chartDisplay")
	.append("div")
	.attr("class", "tooltipStyle"); 

tooltip.append("div")
	.attr("class", "text");

