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

function pushIntervals(dataSet, d, month, year) {

	var interval = 0;
	if (year == d.year) {
		interval = d.month - month;
	}
	else {
		var yearInterval = d.year - year;
		while (yearInterval != 1) {
			interval += 12;
			yearInterval -= 1;
		}
		interval += (12-month) + d.month;
	}
	interval -= 1;
	//console.log("Interval: " + month + " " + year + ", " + d.month + " " + d.year + " " + interval);
	var monthOffset = month + 1;
	var yearOffset = year;
	var dateOffset;
	while (interval != 0) {
		if (monthOffset == 13) {
			monthOffset = 1;
			yearOffset += 1;
		}
		dateOffset = monthOffset + "/1/" + yearOffset;
		dataSet[0].push({y:0, date:dateOffset, data:null});
		dataSet[1].push({y:0, date:dateOffset, data:null});
		interval -= 1;
		monthOffset += 1;
	}
}

var data;

var height = 600;
var width = 900;
var margin = 80;

var color = d3.scaleOrdinal().range(["#00BFA5", "#FF5252"]);

var svg = d3.select("#display")
		.append("svg")
		.attr("height", height)
		.attr("width", width);

d3.json("data/data.json", function(error, data) {
	var authorSets = [];
	
	console.log(data);

	data.forEach(function(author){
		var dataSet = [[], []];
		var month = +author[0].month, year = +author[0].year, date = author[0].month + "/1/" + author[0].year;
		var add = 0;
		var del = 0;
		var dataPoint;
		var dataList = [];

		author.forEach(function(d){
			//console.log(d);

			d.name = d.name;
			d.email = d.email;
			d.date = d.date;
			d.month = +d.month;
			d.year = +d.year;
			d.dateAndTime = d.dateAndTime;
			d.message = d.message;
			d.add = +d.add;
			if (d.delete != 0) {
				d.delete = +d.delete * -1;
			}
			else {
				d.delete = 0;
			}

			if (month == d.month && year == d.year) {	//same month and year
				add += d.add;
				del += d.delete;
				dataList.push(d);
			}
			else {
				if (month == author[0].month && year == author[0].year) {	//first set of data needs to be pushed first
					dataSet[0].push({y:add, date:date, data:dataList});
					dataSet[1].push({y:del, date:date, data:dataList});
					//pushIntervals(dataSet, d, month, year);
				}
				else {
					//pushIntervals(dataSet, d, month, year);
					dataSet[0].push({y:add, date:date, data:dataList});
					dataSet[1].push({y:del, date:date, data:dataList});
				}
				
				date = d.month + "/1/" + d.year;
				month = d.month;
				year = d.year;	
				add = d.add;
				del = d.delete;
				dataList = [];
				dataList.push(d);
			}
			dataPoint = d;	//keeps track of last set to be pushed after loop
		});

		date = dataPoint.month + "/1/" + dataPoint.year;
		dataSet[0].push({y:add, date:date, data:dataList});
		dataSet[1].push({y:del, date:date, data:dataList});

		//console.log(dataSet);
		authorSets.push({name:dataPoint.name, list:dataSet});
	});

	console.log(authorSets);

	function offSetMonth(date, num) {
		var month = date.getMonth() + num;
		var year = date.getFullYear();

		if (month == 13) {
			month = 1;
			year += 1;
		}
		else if (month == 0) {
			month = 12;
			year -= 1;
		}
		return month + "/1/" + year;
	}
	var minDate = new Date(data[0][0].date),
		maxDate = new Date(data[0][data[0].length-1].date);

	for (var i=1 ; i<data.length; i++) {
		var date = new Date(data[i][0].date);
		if (date < minDate) {
			minDate = date; 
		}
		date = new Date(data[i][data[i].length-1].date);
		if (date > maxDate) {
			maxDate = date;
		}
	}

	minDate = new Date(offSetMonth(minDate, -1));
	maxDate = new Date(offSetMonth(maxDate, 1));

	var x = d3.scaleTime()
		.domain([minDate, maxDate])
		.range([margin, width-margin]);

	var y = d3.scaleLinear()
		.range([height-margin, 0+margin]);

	var xAxis = d3.axisBottom()
		.scale(x)
		//.orient("bottom")
		.tickFormat(d3.timeFormat("%b %y"));

	var yAxis = d3.axisLeft()
		.scale(y)
		.ticks(15);

	// var largestExtent = [0,0];
	// authorSets.forEach(function(dataSet){
	// 	barStack(dataSet.list);
	// 	if (dataSet.list.extent[0]<largestExtent[0] && dataSet.list.extent[1]>largestExtent[1]) {
	// 		largestExtent = dataSet.list.extent;
	// 	}
	// });

	// y.domain(largestExtent);

	// barStack(dataSet);
	// y.domain(dataSet.extent);

	var x0 = d3.scaleBand()
    .rangeRound([0, width])
    .paddingInner(0.1);

	var x1 = d3.scaleBand()
    .padding(0.05);

    var keys = [];
    authorSets.forEach(function(author) {
    	keys.push(author.name);
    })
    console.log(keys);

    x0.domain(authorSets.map(function(d) { return d.name; }));
  	x1.domain(keys).rangeRound([0, x0.bandwidth()]);

	path = svg.selectAll(".series")
	//.data(dataSet)
	.data(authorSets)
	.enter()
	.append("g")
		.classed("series", true)
		.style("fill", function(d,i) { return color(i) })
		.style("opacity", 0.8)
			.selectAll("rect")
			.data(Object)
			.enter()
			.append("rect")
				.attr("x", function(d) {console.log(d.date); return x(new Date(d.date)) - 9 })
				.attr("y", function(d) {console.log(d.y0); return y(d.y0) })
				.attr("height", function(d) { return y(0) - y(d.size) })
				.attr("width", 18);
				
				
	path.on("mouseover", function(d) { 
		d3.select(this).style("opacity", 0.6)
		var value;
		if (d.y0 != 0) {
			value = d.y0;
		}
		else {
			value = d.y0 - d.size;
		}
		tooltip.select(".count").html(value + " lines");
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

	console.log("y(0)", y(0));
	console.log("margin", margin); 

	svg.append("g")
		.attr("class", "axis x")
		.attr("transform", "translate(0 " + y(0) + ")")
		.call(xAxis);

	svg.append("g")
		.attr("class", "axis y")
		.attr("transform", "translate(" + margin + " 0)")
		.call(yAxis);
});



/* Here we add tooltips */

// Prep the tooltip bits, initial display is hidden
// var tooltip = svg.append("g")
//   .attr("class", "tooltip")
//   .style("display", "none");
    
var tooltip = d3.select("#display")
  .append("div")
  .attr("class", "tooltip"); 

  tooltip.append("div")
    .attr("class", "count");
// tooltip.append("rect")
//   .attr("width", 30)
//   .attr("height", 20)
//   .attr("fill", "white");
  //.style("opacity", 0.5);

// tooltip.append("text")
//   .attr("x", 15)
//   .attr("dy", "1.2em")
//   .style("text-anchor", "middle")
//   .attr("font-size", "12px")
//   .attr("font-weight", "bold");