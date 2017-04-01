var colourGreen = "#4caf50";
var colourGreenDark = "#2e7d32";
var colourRed = "#ef5350";
var colourRedDark = "#d32f2f";

var svg = d3.select("#display"),
  margin = {top: 40, right: 120, bottom: 30, left: 70},
  width = +svg.attr("width") - margin.left - margin.right,
  height = +svg.attr("height") - margin.top - margin.bottom;

svg = svg.append("svg")
    .attr("width", svg.attr("width"))
    .attr("height", svg.attr("height"));

var g = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x0 = d3.scaleBand()
    .rangeRound([0, width])
    .paddingInner(0.1);

var x1 = d3.scaleBand()
    .padding(0.05);

var y = d3.scaleLinear()
    .rangeRound([height, 0]);

var z = d3.scaleOrdinal()
    .range([colourGreen, colourRed]);

var tooltip = d3.select("#display")
      .append("div")
      .attr("class", "tooltip");      
tooltip.append("div")
    .attr("class", "count");
tooltip.append("div")
    .attr("class", "percent");


d3.csv("part2data.csv", function(error, data) {
  data.forEach(function(d){
      d.month = d.month.trim();
      d.add = +d.add; //casts each count field as number (retrieved as strings)
      d.delete = +d.delete * -1;
  });

  //console.log(data);

  var keys = data.columns.slice(1);

  x0.domain(data.map(function(d) { return d.month; }));
  x1.domain(keys).rangeRound([0, x0.bandwidth()]);
  y.domain([0, d3.max(data, function(d) { return d3.max(keys, function(key) { return d[key]; }); })]).nice();

  var rect = g.append("g")
      .selectAll("g")
      .data(data)
      .enter().append("g")
        .attr("transform", function(d) { return "translate(" + x0(d.month) + ",0)"; })
      .selectAll("rect")
      .data(function(d) { return keys.map(function(key) { return {key: key, value: d[key]}; }); })
      .enter().append("rect")
        .attr("x", function(d) { return x1(d.key); })
        .attr("y", function(d) { return y(d.value); })
        .attr("width", x1.bandwidth())
        .attr("height", function(d) { return height - y(d.value); })
        .attr("fill", function(d) { return z(d.key); });

  g.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x0))
      .append("text")
        .attr("x", 1100)
        .attr("y", 0)
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("text-anchor", "end")
        .text("Months");

  g.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y).ticks(10))
    .append("text")
      .attr("x", 2)
      .attr("y", -10)
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "start")
      .text("Lines of code");

  var legend = g.append("g")
      .attr("text-anchor", "end")
    .selectAll("g")
    .data(keys.slice().reverse())
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 20)
      .attr("width", 20)
      .attr("height", 20)
      .attr("fill", z)
      .style("stroke", "#fff")
      .style("stroke-width", 2);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 16)
      .text(function(d) { return d; });

  rect.on("mouseover", function(d) {
    d3.select(this).style("fill", function(d) {
      if (d.key == "add") 
        return colourGreenDark;
      else
        return colourRedDark;
    })

    if (d.key == "add") {
      var total = d3.sum(data.map(function(d) { return d.add; }));
      //console.log(total);
      var percent = Math.round(1000 * d.value / total) / 10;

      tooltip.select(".count").html(d.value + " lines");
      tooltip.select(".percent").html(percent + "% of added lines");
      tooltip.style("display", "block");           
    }
    else {
      var total = d3.sum(data.map(function(d) { return d.delete; }));
      //console.log(total);
      var percent = Math.round(1000 * d.value / total) / 10;
      tooltip.select(".count").html(d.value + " lines");
      tooltip.select(".percent").html(percent + "% of deleted lines");
      tooltip.style("display", "block"); 
    }
    
  });

  rect.on("mouseout", function(d) {
    d3.select(this).style("fill", function(d) {
      if (d.key == "add")
        return colourGreen;
      else return colourRed;
    })

    tooltip.style("display", "none");
  });

  rect.on("mousemove", function(d) {
    tooltip.style('top', (d3.event.layerY + 10) + "px")
    .style('left', (d3.event.layerX + 10) + "px");
  });
  
});