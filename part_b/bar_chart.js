var data;

var height = 600;
var width = 1000;
var margin = 80;

var colorPositive = d3.scale.ordinal().range(["#00BFA5", "#9CCC65", "#009688", "#CDDC39"]);
var colorNegative = d3.scale.ordinal().range(["#FF5252", "#673AB7", "#C2185B", "#FF1744"]);

var svg = d3.select("#display")
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
				deleted = +d.delete;
			}
			else if (!(dataSet[monthKey][currentName])) {
				dataSet[monthKey][currentName] = {name: currentName, list: []};
				added = +d.add;
				deleted = +d.delete;
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
	console.log(minDate.toString() + ", " + maxDate.toString());

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
  	x1.domain(keys).rangeRoundBands([0, bandwidth], 0, 0.1*keys.length);	

  	var y = d3.scale.linear()
		.rangeRound([height-margin, margin]);

	var yRange = d3.max(d3.values(dataSet), function(d) { /*console.log(d);*/ return d3.max(keys, function(key) { 
		if (d[key])
			return d[key].added; 
		return 0;
	}); });

	var yMinRange = d3.min(d3.values(dataSet), function(d) { /*console.log(d);*/ return d3.max(keys, function(key) { 
		if (d[key])
			return d[key].deleted; 
		return 0;
	}); });

	console.log("y axis range: " + yMinRange + ", " + yRange);

	y.domain([yMinRange, yRange]);

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
	    			values.push({key: key, value: d[key].added, date: d[key].date}); 
	    			values.push({key: key, value: d[key].deleted, date: d[key].date});
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

		tooltip.select(".count").html(d.value + " lines<br/>" + d.key + "<br/>" + d.date.format("MMM YYYY").toString());
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
});
    
var tooltip = d3.select("#display")
  .append("div")
  .attr("class", "tooltip"); 

  tooltip.append("div")
    .attr("class", "count");
