
var wid, hei;
var transitionDuration = 800;

var data = [];
var scales = {};
var totals = {};

var vis;
var padding = { top: 40, right: 140, bottom: 30, left: 30 }
var barHeight = 10; 
var defaultPopPercent = .08;

var controls = {
  display: "aligned",
  height: "fixed"
}

$(document).ready(function() {

  vis = d3.select("body").append("svg:svg")
    .attr("class", "vis");

  setVisSize();

  d3.json("dataset.ar.json", function(d) {
  
    data = d;
    
    // parse data
    for(i = 0; i < data.length; i++) {
      d = data[i];
      for(prop in d) {
        if (!isNaN(d[prop])) {
          d[prop] = parseFloat(d[prop]);
        } else if (d[prop] == "Yes") {
          d[prop] = true;
        } else if (d[prop] == "No") {
          d[prop] = false;
        }
      }
    }

    // sort + totals -- not in processData because we only need to do it once
    
    data.sort(function(a, b) { return d3.ascending(a.Start, b.Start); });
    
    totals.area = d3.sum(data, function(d) { return d.Land_area_million_km2; });
    totals.population = d3.sum(data, function(d) { return d.Estimated_Population; });
    totals.popPercent = d3.sum(data, function(d) { 
      if (isNaN(d.Percent_World_Population)) return defaultPopPercent;
      else return d.Percent_World_Population; 
    });
    
    // process data for scales, etc.
    processData();

    //console.log(data);
    drawStarting();
    addInteractionEvents();
    
    setTimeout(function() {
      setControl($("#controls #layoutControls #layout-timeline"), "display", "timeline", false);
      setControl($("#controls #heightControls #height-area"), "height", "area", true);
    }, 500);
  
  });

});

function setVisSize() {

  wid = $(window).width() - 4;
  hei = $(window).height() - 50;

  $(".vis").attr("width", wid).attr("height", hei);
  $(".vis .background").attr("width", wid).attr("height", hei);
    
}

$(window).resize(function() {
  setVisSize();
  processData();
  redraw();
});

/************************************************************
 * Process the data once it's imported
 ***********************************************************/

function processData() {

    barHeight = (hei - padding.top - padding.bottom) / data.length;
    
    scales.years = d3.scale.linear()
      .domain([ d3.min(data, function(d) { return d.Start; }), d3.max(data, function(d) { return d.End; }) ])
      .range([ padding.left, wid - padding.right ]);
  
    scales.indexes = d3.scale.linear()
      .domain([ 0, data.length - 1 ])
      .range([ padding.top, hei - padding.bottom - barHeight ]);
      
    scales.areas = function(a) {
      var percentage = a / totals.area;
      var range = hei - padding.top - padding.bottom;
      return range * percentage;
    }

    scales.popPercents = function(a) {
      if (isNaN(a)) a = defaultPopPercent;
      var percentage = a / totals.popPercent;
      var range = hei - padding.top - padding.bottom;
      return range * percentage;
    }
    
    // calculate ordering items
    
    var y_area = padding.top;
    for(i = 0; i < data.length; i++) {
      d = data[i];
      d.area_y = y_area;
      y_area += scales.areas(d.Land_area_million_km2);
    }

    var y_popPercent = padding.top;
    for(i = 0; i < data.length; i++) {
      d = data[i];
      d.popPercent_y = y_popPercent;
      
      if (isNaN(d.Percent_World_Population)) y_popPercent += scales.popPercents(defaultPopPercent);
      else y_popPercent += scales.popPercents(d.Percent_World_Population);
    }
    

}

/************************************************************
 * Initial rendering of the vis
 ***********************************************************/

function drawStarting() {

  // background
  vis.append("svg:rect")
    .attr("class", "background")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", wid)
    .attr("height", hei);

  // year ticks
  vis.selectAll("line")
    .data(scales.years.ticks(10))
    .enter().append("svg:line")
      .attr("class", "tickLine")
      .attr("x1", padding.left)
      .attr("x2", padding.left)
      .attr("y1", padding.top)
      .attr("y2", hei - padding.bottom);

  // empire containers
  vis.selectAll("g")
    .data(data)
    .enter().append("svg:g")
      .attr("class", "barGroup")
      .attr("index", function(d, i) { return i; })
      .attr("transform", function(d, i) { return "translate(" + padding.left + ", " + scales.indexes(i) + ")"; });

  // bars
  vis.selectAll("g.barGroup")
    .append("svg:rect")
      .attr("class", "bar")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", function(d) { return scales.years(d.End) - scales.years(d.Start); })
      .attr("height", barHeight);

  // peak lines
  vis.selectAll("g.barGroup")
    .append("svg:line")
      .attr("class", "peakLine")
      .attr("x1", function(d) { return scales.years(d.Peak) - scales.years(d.Start); })
      .attr("x2", function(d) { return scales.years(d.Peak) - scales.years(d.Start); })
      .attr("y1", 0)
      .attr("y2", barHeight);

  // bar labels
  vis.selectAll("g.barGroup")
    .append("svg:text")
      .attr("class", "barLabel")
      .attr("x", function(d) { return scales.years(d.End) - scales.years(d.Start); })
      .attr("y", 0)
      .attr("dx", 5)
      .attr("dy", ".35em")
      .style("fill", function(d) { if (d.Contiguous === false) return "#0ff"; })
      .text(function(d) { return d.Name; });

  // tick labels
  vis.selectAll("text.rule")
    .data(scales.years.ticks(10))
    .enter().append("svg:text")
      .attr("class", "rule")
      .attr("x", padding.left)
      .attr("y", 20)
      .attr("dy", 0)
      .attr("text-anchor", "middle")
      .text(function(d) { return formatYear(d); });
    
}

/************************************************************
 * Redraw the vis with transition
 ***********************************************************/

function redraw() {

  $("#infobox").hide();

  var visCenter = (wid - padding.left - padding.right) / 2 + padding.left;

  // year ticks
  vis.selectAll("line.tickLine")
    .transition()
      .duration(transitionDuration)
      .attr("x1", function(d, i) {
        if (controls.display == "timeline") return scales.years(d);
        else if (controls.display == "centered") return visCenter;
        else return padding.left;
      })
      .attr("x2", function(d) {
        if (controls.display == "timeline") return scales.years(d);
        else if (controls.display == "centered") return visCenter;
        else return padding.left;
      })
      .attr("y1", padding.top)
      .attr("y2", hei - padding.bottom);

  // empire containers
  vis.selectAll("g")
    .transition()
      .duration(transitionDuration)
      .style("fill-opacity", function(d) { 
        if (controls.height == "population" && isNaN(d.Percent_World_Population)) return .4;
        else return 1;
      })
      .attr("transform", function(d, i) {
        var tx, ty;
        if (controls.display == "timeline") tx = scales.years(d.Start);
        else if (controls.display == "centered") tx = visCenter - (scales.years(d.Peak) - scales.years(d.Start));
        else tx = padding.left;

        if (controls.height == "area") ty = d.area_y;
        else if (controls.height == "population") ty = d.popPercent_y; 
        else ty = scales.indexes(i);                
        return "translate(" + tx + ", " + ty + ")"; 
      });

  // bars
  vis.selectAll("g.barGroup rect.bar")
    .transition()
      .duration(transitionDuration)
      .style("fill-opacity", function(d) { 
        if (controls.height == "population" && isNaN(d.Percent_World_Population)) return .25;
        else return .75;
      })
      .attr("height", function(d) {
        if (controls.height == "area") return scales.areas(d.Land_area_million_km2); 
        else if (controls.height == "population") return scales.popPercents(d.Percent_World_Population); 
        else return barHeight;
      });

  // bar labels
  var labelHeight = 0;
  vis.selectAll("g.barGroup text.barLabel")
    .transition()
      .duration(transitionDuration)
      .attr("y", function(d) {
        if (controls.height == "area") return scales.areas(d.Land_area_million_km2)/2 - labelHeight; 
        else if (controls.height == "population") return scales.popPercents(d.Percent_World_Population)/2 - labelHeight; 
        else return barHeight/2 - labelHeight;      
      });
      
  // peak lines
  vis.selectAll("g.barGroup line.peakLine")
    .transition()
      .duration(transitionDuration)
      .attr("y2", function(d) {
        if (controls.height == "area") return scales.areas(d.Land_area_million_km2); 
        else if (controls.height == "population") return scales.popPercents(d.Percent_World_Population); 
        else return barHeight;      
      });
      
  // tick labels
  vis.selectAll("text.rule")
    .transition()
      .duration(transitionDuration)
      .attr("x", function(d) {
        if (controls.display == "timeline") return scales.years(d);
        else if (controls.display == "centered") return visCenter;
        else return padding.left;     
      })
      .attr("y", 20)
      .attr("dy", 0);
      
}

/************************************************************
 * Add interaction events after initial drawing
 ***********************************************************/
function addInteractionEvents() {

  // bar group hover
  $("g.barGroup").click(
    function(e) { showInfoBox( e, $(this).attr("index") ); }
  );
  $(".vis .background, .vis .mouseLine").click(function(e) { 
    showInfoBox( e, null); 
  });
  
}

/************************************************************
 * Display info box for data index i, at mouse
 ***********************************************************/
function showInfoBox(e, i) {

  if (i == null) $("#infobox").hide();
  else {
    var d = data[i];
    
    var info = "<span class='title'>" + d.Name + "</span>";
    info += "<br />" + formatYear(d.Start) + " - " + formatYear(d.End);
    if (!isNaN(d.Land_area_million_km2)) info += "<br />" + " Peak (" + formatYear(d.Peak) + "): " + d.Land_area_million_km2 + " million sq km";
    if (!isNaN(d.Estimated_Population)) info += "<br />" + d.Estimated_Population + " million people in " + formatYear(d.Population_Year);
    else info += "<br />" + "no population data available";
    if (!isNaN(d.Percent_World_Population)) info += "<br />" + "(" + Math.round(d.Percent_World_Population * 100) + "% of world population)";
    if (d.Contiguous === false) info += "<br />" + "non-contiguous";
    
    var infoPos;
    if (i <= data.length/2) infoPos = { left: e.pageX, top: e.pageY };
    else infoPos = { left: e.pageX-200, top: e.pageY-80 };
    
    $("#infobox")
      .html(info)
      .css(infoPos)
      .show();
  }

}

function setControl(elem, con, val, re) {
  $(elem).parents(".controlGroup").find("a").removeClass("active");
  $(elem).addClass("active");
  controls[con] = val;
  if (re == true) redraw();
}

function parseTransform(s) {
  if (s.substr(0, 10) == "translate(") {
    s = s.substring(10, s.length-1);
    s = s.split(",");
    var v1 = parseFloat($.trim(s[0]));
    var v2 = parseFloat($.trim(s[1]));
  }
  return { val1: v1, val2: v2 };
}

function formatYear(y) {
  if (y <= 0) return y*-1 + " BCE";
  else return y;
}
