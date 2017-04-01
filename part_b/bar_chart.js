function barStack(seriesData) {
	console.log(seriesData);
	var l = seriesData.length
	while (l--) {
		var posBase = 0; // positive base
		var negBase = 0; // negative base

		seriesData.forEach(function(d) {
			d = d[l]
			d.size = Math.abs(d.y)
			d.date = d.date;
			d.data = d.data;
			console.log(d);
			if (d.y < 0) {
				d.y0 = negBase
				negBase -= d.size
			} else
			{
				d.y0 = posBase = posBase + d.size
			}
		})
	}
	seriesData.extent = d3.extent(
		d3.merge(
			d3.merge(
				seriesData.map(function(e) { 
					return e.map(function(f) { return [f.y0,f.y0-f.size] }) 
				})
			)
		)
	)
}

var data;

var height = 600;
var width = 900;
var margin = 80;

var color = d3.scale.ordinal().range(["#00BFA5", "#FF5252"]);

var svg = d3.select("#display")
		.append("svg")
		.attr("height", height)
		.attr("width", width);

d3.json("data/data.json", function(error, data) {
	var dataSet = {};
	var currentDate, currentMonth, currentName, monthKey;
	var keys = [];
	var added = 0, deleted = 0;

	var minDate = null, maxDate = null;
	
	console.log(data);

	data.forEach(function(author){
		//console.log(author);
		keys.push(author[0].name);

		author.forEach(function(d){
			//console.log(d);

			if (currentMonth != undefined && currentMonth.isSame(currentDate, "month")) {
				added += +d.add;
				deleted += +d.delete;
			}
			else if (currentMonth != undefined) {
				console.log("HERE");
				dataSet[monthKey][currentName]["added"] = added;
				dataSet[monthKey][currentName]["deleted"] = deleted;
			}

			currentDate = moment(d.date, "MM/DD/YYYY");
			currentName = d.name;

			currentMonth = moment().year(currentDate.year()).month(currentDate.month()).date(1);
			currentMonth.startOf('day');
			monthKey = currentMonth.month() + "/" + currentMonth.year();

			if (minDate==null || currentMonth.isBefore(minDate)) {
				minDate = currentMonth;
			}
			if (maxDate==null || currentMonth.isAfter(maxDate)) {
				maxDate = currentMonth;
			}

			if (!(dataSet[monthKey])) {
				dataSet[monthKey] = {date: currentMonth};
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

		dataSet[monthKey][currentName]["added"] = added;
		dataSet[monthKey][currentName]["deleted"] = deleted;
		added = 0;
		deleted = 0;
	});

	console.log(dataSet);
	console.log(keys);

	minDate.subtract(1, "months");
	minDate.startOf('day');   
	maxDate.add(1, "months");
	maxDate.startOf('day');   ;	//fix double tick glitch
	console.log(minDate.toString() + ", " + maxDate.toString());

 	var x0 = d3.time.scale()
 		.domain([minDate, maxDate])
 		.rangeRound([margin, width-margin]);
 
	var x1 = d3.scale.ordinal();

  	//x1.domain(keys).rangeRoundBands([0, x0.rangeBand()]);
  	x1.domain(keys).rangeRoundBands([0, 10]);	

  	var y = d3.scale.linear()
		.rangeRound([height-margin, margin]);

	var yRange = d3.max(d3.values(dataSet), function(d) { console.log(d); return d3.max(keys, function(key) { 
		if (d[key])
			return d[key].added; 
		return 0;
	}); });

	console.log(yRange);

	y.domain([0, yRange]);

	var xAxis = d3.svg.axis()
    .scale(x0)
    .orient("bottom")
    .tickFormat(d3.time.format("%b %Y"));

	var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

    path = svg.selectAll("g")
    	.data(d3.values(dataSet))
    	.enter()
    	.append("g")
    		.attr("transform", function(d) { return "translate(" + x0(d.date) + ",0)"; })
    	.selectAll(".rect")
    	.data(function(d) { console.log(d); return keys.map(function(key) { 
    		//console.log(d[key]); 
    		if (d[key]) {
    			return {key: key, value: d[key].added};
    		} 

    		return {key: key, value: 0};
    	}); })
	    	.enter().append("rect")
	    	.attr("x", function(d) { return x1(d.key); })
	        .attr("y", function(d) { console.log(y(d.value)); return y(d.value); })
	        .attr("width", x1.rangeBand())
	        .attr("height", function(d) { return height - y(d.value) - y(yRange); })
	        .attr("fill", function(d,i) { return color(i) });

	
				
	path.on("mouseover", function(d) { 
		d3.select(this).style("opacity", 0.6)
		var value = d.value;
		// if (d.y0 != 0) {
		// 	value = d.y0;
		// }
		// else {
		// 	value = d.y0 - d.size;
		// }
		tooltip.select(".count").html(value + " lines\n" + d.key);
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
