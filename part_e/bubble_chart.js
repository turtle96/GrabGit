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
  .append("g")
  .attr("transform", "translate(0,0)");

  var tooltip = d3.select('#chart')
  .append('div')
  .attr('class', 'tooltip');
  
  tooltip.append('div')
    .attr('class', 'name');

  tooltip.append('div')
    .attr('class', 'value');

  d3.csv("locStatsCSV.csv", function(error, data){

    //convert numerical values from strings to numbers
    data = data.map(function(d){ d.value = +d.value; return d; });

    //bubbles needs very specific format, convert data to this.
    var nodes = bubble.nodes({children:data}).filter(function(d) { return !d.children; });

    //create the bubbles
    var bubbles = svg.selectAll("circle")
    .data(nodes)
    .enter()
    .append("circle")
    .attr("r", function(d){ return d.r; })
    .attr("cx", function(d){ return d.x; })
    .attr("cy", function(d){ return d.y; })
    .style("fill", function(d) { return color(d.value); });

    bubbles.on('mouseover', function(d) {
      tooltip.select('.name').html(d.name);
      tooltip.select('.value').html(d.value + " lines of code");
      tooltip.style('display', 'block');
    });

    bubbles.on('mouseout', function(d) {
      tooltip.style('display', 'none');
    });

    bubbles.on('mousemove', function(d) {
      tooltip.style('top', (d3.event.layerY + 10) + 'px')
        .style('left',(d3.event.layerX + 10) + 'px');
    });

  });

})(window.d3);