var svg = d3.select("#chart")
  .append("svg")
  .append("g");

svg.append("g")
  .attr("class", "slices");
svg.append("g")
  .attr("class", "labels");
svg.append("g")
  .attr("class", "lines");
var width = 800,
    height = 600,
  radius = Math.min(width, height) / 2;
  currentData = "commits"

var pie = d3.layout.pie()
  .sort(null)
  .value(function(d) {
    switch(currentData) {
      case "commits":
        return d.commits
      case "additions":
        return d.additions
      case "deletions":
        return d.deletions
      case "ad":
        return d.additions + d.deletions
    }
  });

var arc = d3.svg.arc()
  .outerRadius(radius * 0.9)
  .innerRadius(radius * 0.4);

var arcOver = d3.svg.arc()
  .outerRadius(radius * 0.9 + 20)
  .innerRadius(radius * 0.4 + 10);

var outerArc = d3.svg.arc()
  .innerRadius(radius * 1)
  .outerRadius(radius * 1);

svg.attr("transform", "translate(" + width / 2 + "," + (height / 2 + 10) + ")");

var total_commits = 0
var total_additions = 0
var total_deletions = 0

function key(d){ 
  return d.data.author; 
};

function getData(d){
  switch(currentData) {
    case "commits":
      return d.data.commits
    case "additions":
      return d.data.additions
    case "deletions":
      return d.data.deletions
    case "ad":
      return d.data.additions + d.data.deletions
  }
}

function totalData(){
  switch(currentData) {
    case "commits":
      return total_commits
    case "additions":
      return total_additions
    case "deletions":
      return total_deletions
    case "ad":
      return total_additions + total_deletions
  }
}

function getUnit() {
  switch(currentData) {
    case "commits":
      return currentData
    default:
      return "lines"
  }
}


function midAngle(d){
  return d.startAngle + (d.endAngle - d.startAngle) / 2;
}

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

var color = d3.scale.ordinal()
  .range(d3.scale.category20().range());

var tooltip = d3.select("#chart")
    .append("div")
    .attr("class", "tooltipStyle")

var urlVar = getUrlVars()
var url = "http://kfwong.com:3000/api/repos/" + 
          urlVar["repoOwner"] + "/" +
          urlVar["repoName"] + "/" +
          "1a"

var url = "http://kfwong.com:3000/api/repos/tungnk1993/scrapy/1a"

d3.csv(url, function(data) {
  d3.select("#loading")
    .text("")

  data.forEach(function(d) {
    d.commits = +d.commits
    d.additions = +d.additions
    d.deletions = +d.deletions
    total_commits += d.commits
    total_additions += d.additions
    total_deletions += d.deletions
  })
  /* ------- PIE SLICES -------*/
  var slice = svg.select(".slices").selectAll("slice")
    .data(pie(data), key);

  function updateText(d) {
    percentage = Math.round(getData(d)/totalData() * 10000) / 100
    tooltip.html(key(d) + "<br>" + percentage.toString() + "% (" + getData(d).toString() + 
      " " + getUnit() + ")")
  }

  slice.enter()
    .append("path")
    .attr("d", arc)
    .style("fill", function(d) { 
      return color(key(d)); 
    })
    .attr("class", "slice")
    .on("mouseover", function(d) {
      updateText(d)
      tooltip.style("visibility", "visible");
            d3.select(this).transition()
                .duration(200)
                .attr("d", arcOver)
    })
    .on("mousemove", function(d) {
      updateText(d)
      return tooltip.style("top", (event.pageY - 90)+"px").style("left",(event.pageX + 10)+"px");
    })
    .on("mouseout", function(d) {
            d3.select(this).transition()
                .duration(200)
                .attr("d", arc)
      updateText(d)
      return tooltip.style("visibility", "hidden");     
    })
    .each(function(d) {
      this._current = d
    })

  d3.selectAll("input").on("change", function change() {
    currentData = this.value
    slice.data(pie(data),key)
    slice.transition().duration(750).attrTween("d",arcTween)
  })

  function arcTween(a) {
    var i = d3.interpolate(this._current, a);
    this._current = i(0);
    return function(t) {
      return arc(i(t));
    };
  }

  if (data.length <= 20) {
    /* ------- Name legends -------*/
    var legend = d3.select("#legends").append("svg")
        .attr("class", "legend")
        .attr("width", 100)
        .attr("height", 200)
        .selectAll("g")
        .data(data)
        .enter().append("g")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function(d) { return color(d.author); });

    legend.append("text")
        .attr("x", 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .text(function(d) { return d.author; });

  }
});
