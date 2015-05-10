
var wid, hei;
var transitionDuration = 800;
var started = false;
var data = [];
var memberships = [];
var scales = {};
var totals = {};
var maxYear, minYear = 0;
var vis;
var padding = { top: 40, right: 30, bottom: 30, left: 240 }
var barHeight = 10; 
var defaultPopPercent = .08;
var boxHeight = 35;
var totalmemberships = 0 ;
var waitStart = false;
var controls = {
  display: "aligned",
  height: "fixed"
}


function setVisSize() {

  wid = $(window).width() - 2;
  hei = ($(window).height()/1.5) - 100;

  $(".vis").attr("width", wid).attr("height", hei);
  $(".vis .background").attr("width", wid).attr("height", hei);
    
}

$(window).resize(reloadTimeline);

function reloadTimeline(callback){

  // process data for scales
  processData();


  //Creates the proper objects
  if (!started){
    setVisSize();
    setBasicsParams();
    started = true;
  }


  //D3 main enter
  refreshGraph();
  addInteractionEvents();


  var defaultFilterCallback = function() {
      setControl($("#controls #layoutControls #layout-timeline"), "display", "timeline", false);
      setControl($("#controls #heightControls #height-area"), "height", "contiguous", true);
      setControl($("#controls #groupControls #group-name"), "group", "name", true);
  };  
  if (!callback){
    callback = defaultFilterCallback;
  }
    

  setTimeout(callback, 500);
  

}


function setBasicsParams(){
  
  //remove old svg
  //TODO: is it another way of doing this?


  vis = d3.select("div.vis")
    .append("svg:svg")
    .attr("class", "vis");
  
    // background
  vis.append("svg:rect")
    .attr("class", "background")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", wid)
    .attr("height", hei);


  totals.area = d3.sum(data, function(d) { return d3.sum(d.memberships, function(p){ return p.Land_area_million_km2; }) });
  totals.population = d3.sum(data, function(d) { return d3.sum(d.memberships, function(p){ return p.Estimated_Population; }) });
  
  totals.popPercent = d3.sum(data, function(d) { 
  if (isNaN(d.Percent_World_Population)) return defaultPopPercent;
      else return d.Percent_World_Population; 
    });
  //Append Fonts! 
  vis
    .append('def')
    .append('style')
    .attr("type", "text/css")
    .text('@import url(http://fonts.googleapis.com/css?family=RobotoDraft:400,500,700,400italic);')

    
    
}




/************************************************************
 * Process the data once it's imported
 ***********************************************************/

function processData() {

    
    maxYear = d3.max(data, function(d) {  return d3.max(d.memberships, function(inner) {  return inner.end    }) });
    minYear = d3.min(data, function(d) {  return d3.min(d.memberships, function(inner) {  return inner.start; }) });
    scales.years = d3.scale.linear()
      .domain([ minYear,maxYear])
      .range([ padding.left, wid - padding.right ]);


    totalmemberships = d3.sum(data, function(d){return d.memberships.length});



    if (controls.height == "memberships")
    {
        hei = (totalmemberships* boxHeight) + 100;
    }
    else{
        
        hei = (data.length * boxHeight)+100;
    }


    barHeight = (hei - padding.top - padding.bottom) / data.length;

    scales.indexes = d3.scale.linear()
      .domain([ 0,  totalmemberships- 1 ])
      .range([ padding.top, hei - padding.bottom - barHeight ]);


    scales.colorsScale = d3.scale.category20();


    scales.politicians = function(a) {
      return barHeight ;
    }
      
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


    //clear all;
    memberships = [];
    //find all other memberships by region and province
    var membershipsArray = data.map(function(d) { return d.memberships.map( function(z){ return z.role + "-" + z.organization.name }); })
    //and now we remove duplicates
    membershipsArray = d3.merge(membershipsArray);
    $.each(membershipsArray, function(i, el){
      if($.inArray(el, memberships) === -1) memberships.push(el);
    });
    //now we order them
    memberships.sort(function(a, b){ return d3.ascending(a, b);});

    // calculate ordering items
    var y_area = padding.top;
    // Height
    var y_popPercent = padding.top;
    for(i = 0; i < data.length; i++) {

      //Check sort by date 
      d = data[i].memberships = data[i].memberships.sort(function(a, b){ return d3.ascending(a.start, b.start); });
      for (var j = 0; j < d.length; j++) {
        d[j].area_y = y_area;
        
        y_area += scales.areas(d[j].Land_area_million_km2);

        d[j].popPercent_y = y_popPercent;
        if (isNaN(d[j].Percent_World_Population)) y_popPercent += scales.popPercents(defaultPopPercent);
        else y_popPercent += scales.popPercents(d[j].Percent_World_Population);

        d[j].politician = data[i];
        d[j].parent = i;

        d[j].position = j;
        //Post Position
        d[j].membershipsPosition = memberships.indexOf(d[j].role + "-" + d[j].organization.name);


        //Save previous year reference to be uses on carrear compare

        if (j -1 >=0){
          d[j].pre = d[j-1];
        }
        else{
         d[j].pre = {start:0, pre:0, tx:0} ;
        }


      };


    }

    


}

/************************************************************
 * Initial rendering of the vis
 ***********************************************************/

function refreshGraph() {

  var visCenter = (wid - padding.left - padding.right) / 2 + padding.left;
  /************************************************************
  * reload height
  ***********************************************************/

  hei = ($(window).height()/1.5);

  if (controls.height == "memberships")
  {
    hei = (totalmemberships * boxHeight)+200 ;  
  }
  else{
      hei = (data.length * boxHeight) + 200;
  }
  /************************************************************
  * Transition cargo size.
  ***********************************************************/

  d3.selectAll('.vis')
    .transition()
    .attr('width', wid)
    .attr('height', hei);

  d3.selectAll('.background')
    .transition()
    .attr('width', wid)
    .attr('height', hei);

  /************************************************************
  * If there is no items, just remove the vis.
  ***********************************************************/


  if (data.length == 0){
      d3.select("div.vis svg")
        .transition()
        .remove();
      started = false;

  }

  /************************************************************
  * Refresh Years domain based upon the processData.
  ***********************************************************/

  scales.years = d3.scale.linear()
      .domain([ minYear,maxYear])
      .range([ padding.left, wid - padding.right ]);

  /************************************************************
  * Process Politicians names 
  ***********************************************************/

  var names = vis.selectAll("g")
    .data(data, function(d){return d.id;});
    

  names.enter().append("g")
    .append('text')
    .attr('class', 'group')
    .attr('class', 'itemLabel')
    .attr('dy','.33em')
    .attr("x", padding.left / 9)
    .attr("y", function(d,i){
      return (i+1)*(barHeight/2) ;
    })
    .text(function(d) {
      console.log(d.name);
      return d.name;

    });

    names.each(function(politician, j){

     
    });

  names.exit().remove();

 
  vis.selectAll('svg text.itemLabel')
        .attr("x", padding.left / 7)
        .attr("y", function(d,i) {
          
          return (i)*barHeight + (barHeight/2) + padding.top;

        })
        .text(function(d,i) {
          if (controls.height == "memberships"){ return '';}
          else{ return d.name;} 
        });

  vis.selectAll('text.membershipLabel')
        .attr("y", function(d,i) {return (i)*barHeight + (barHeight/2) + padding.top;})
        .text(function(d,i) {
          if (controls.height == "memberships"){ return d;}
          else{ return '';} 
        });
  
 

  vis.selectAll("g.barGroup")
    .append("svg:text")
      .attr("class", "barLabel")
      .attr("x", function(d) { 
        return scales.years(d.start); })
      .attr("y", 0);

  /************************************************************
  * Process Years  
  ***********************************************************/
  var yearsNumbers = scales.years.ticks(10);
  
  /************************************************************
  * Add Years Lines
  ***********************************************************/
  var yearTicks = vis.selectAll("line.tickLine")
    .data(yearsNumbers); 


  yearTicks.enter().append("line")
      .attr("class", "tickLine")
      .attr("x1", padding.left)
      .attr("x2", padding.left)
      .attr("y1", padding.top)
      .attr("y2", hei - padding.bottom);

    
  yearTicks.transition().duration(transitionDuration)
      .style("opacity", function(d) {
        //On CarreerMeter hide years. 
        if (controls.display == "aligned")  return 0;
        else return 1;
      })
      .attr("x1", function(d, i) {
        if (controls.display == "timeline") return scales.years(d);
        else if (controls.display == "centered") return visCenter;
        //On CarreerMeter move years to left
        else return padding.left;
      })
      .attr("x2", function(d) {
        if (controls.display == "timeline") return scales.years(d);
        else if (controls.display == "centered") return visCenter;
        //On CarreerMeter move years to left
        else return padding.left;
      })
      .attr("y1", padding.top)
      .attr("y2", hei - padding.bottom);

  yearTicks.exit().remove();


  
  /************************************************************
  * Add Years Labels
  ***********************************************************/
  
  
  var yearLabelsSelection = 
    vis.selectAll("text.rule")
      .data(yearsNumbers, function(d,i){ return i;});

  yearLabelsSelection
      .enter()
      .append("text")
      .attr("class", "rule")
      .attr("text-anchor", "middle");

  // tick labels
  yearLabelsSelection
    .transition()
      .duration(transitionDuration)
      .style("opacity", function(d) {
        //On CarreerMeter hide years. 
        if (controls.display == "aligned")  return 0;
        else return 1;
      }).attr("x", function(d) {
        if (controls.display == "timeline") return scales.years(d);
        else if (controls.display == "centered") return visCenter;
        else return padding.left;     
      })
      .attr("y", 20)
      .attr("dy", 0);
  yearLabelsSelection
    .text(function(d) { return formatYear(d); });


  yearLabelsSelection.exit().remove();

    
}



/************************************************************
 * Add interaction events after initial drawing
 ***********************************************************/
function addInteractionEvents() {

  // bar group hover
  $("g.barGroup").hover(function(e) { 
    showInfoBox( e, $(this).attr("index"),  $(this).attr("membership")  ); 
    }
  );
  $(".vis .background, .vis .mouseLine").hover(function(e) { 
    showInfoBox( e, null); 
  });



  
}

/************************************************************
 * Display info box for data index i, at mouse
 ***********************************************************/
function showInfoBox(e, i, j) {


  //TODO: Cambiar por angular?

  if (i == null) $("#infobox").hide();
  else {
    //TODO: Can we move this to angular?
    var politician = data[i];
    var membership = politician.memberships[j];
    


    var info = "<span class='title'>" + politician.name + "</span>";
    info += "<br />";
    info += "<img src='" + politician.image + "'>" ;
    info += "<br />" + membership.role ;
    info += "<br />" + membership.organization.name ;
    info += "<br />" + formatYear(membership.start) + " - " + formatYear(membership.end);
    

    //Initial pos;
    var infoPos;
    if (i <= data.length/2) infoPos = { left: e.pageX, top: e.pageY };
    else infoPos = { left: e.pageX-200, top: e.pageY-80 };
    
    var classes = "bar " + membership.post.cargotipo.toLowerCase()  + " " + membership.organization.level.toLowerCase() + " " + membership.role.toLowerCase();
    //clear all clases
    document.getElementById('infobox').className = '';
    
    $("#infobox")
      .addClass(classes)
      .html(info)
      .css(infoPos)
      .show();
  }

}
//In order to isolate order/filtering this method will execute everthing
function setControlFix(o){
  var cb = getFilterCallback(o);
  if (!started){
    reloadTimeline(cb);
  }
  else {
    cb();
  }
  
}

function getFilterCallback(o){
  var cb = function(){};
  // 'membership' orderLine('height', 'memberships')
  if (o ==="memberships"){
    cb = function(){
        setControl($("#controls #heightControls #layout-timeline"), 'display', 'timeline', false);
        setControl($("#controls #heightControls #height-area"), 'height', o, true);
      };
  }
  // 'career' filterLine('display','aligned')
  else if (o ==="name"){
    cb = function(){
       setControl($("#controls #heightControls #layout-timeline"), 'display', 'timeline', true);
       setControl($("#controls #heightControls #height-area"), "height", "contiguous", true);
    };

  }
  // 'name 'orderLine('height', 'contiguous')
  else if (o ==="career"){
    cb = function(){
      setControl($("#controls #heightControls #layout-timeline"), 'display', 'aligned', true);
      setControl($("#controls #heightControls #height-area"),'height', 'contiguous', true);
    };
  }
  // 'timeline' filterLine('display','timeline')
  else{
    cb = function(){
       setControl($("#controls #heightControls #layout-timeline"), 'display', 'timeline', true);
       setControl($("#controls #heightControls #height-area"), "height", "contiguous", true);
    };
  }
  return cb;
}

function setControl(elem, con, val, re) {

  $(elem).parents(".controlGroup").find("a").removeClass("active");
  $(elem).addClass("active");
  controls[con] = val;
  if (re) refreshGraph();
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


