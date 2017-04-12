(function(d3) {
  'use strict';

  var diameter = 500, //max size of the bubbles
      color    = d3.scale.category20c() //color category

  var bubble = d3.layout.pack()
  .sort(null)
  .size([diameter, diameter])
  .padding(1.5);

  var svg = d3.select('#chart')
  .append('svg')
  .attr("width", diameter)
  .attr("height", diameter)
  .attr("class", "bubble");

  d3.csv("locStatsCSV.csv", function(error, data){

    //convert numerical values from strings to numbers
    data = data.map(function(d){ d.value = +d.value; return d; });

    //bubbles needs very specific format, convert data to this.
    var nodes = bubble.nodes({children:data}).filter(function(d) { return !d.children; });

    //setup the chart
    var bubbles = svg.append("g")
    .attr("transform", "translate(0,0)")
    .selectAll(".bubble")
    .data(nodes)
    .enter();

    //create the bubbles
    bubbles.append("circle")
      .attr("r", function(d){ return d.r; })
      .attr("cx", function(d){ return d.x; })
      .attr("cy", function(d){ return d.y; })
      .style("fill", function(d) { return color(d.value); });

  });

})(window.d3);