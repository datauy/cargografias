
var wid, hei;
var transitionDuration = 800;
var started = false;
var data = [];
var scales = {};
var totals = {};
var maxYear, minYear = 0;
var vis;
var padding = { top: 40, right: 30, bottom: 30, left: 240 }
var barHeight = 10; 
var defaultPopPercent = .08;
var boxHeight = 35;
var waitStart = false;

//TODO: move to loader? .init()?
var controls = {}
controls['display'] = 'timeline';
controls['height'] = 'contiguous';
controls['group'] = 'name';




function setVisSize() {

  wid = $(window).width() - 2;
  hei = ($(window).height()/1.5) - 100;

  $(".vis").attr("width", wid).attr("height", hei);
  $(".vis .background").attr("width", wid).attr("height", hei);
    
}

$(window).resize(reloadTimeline);

function reloadTimeline(){

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


  
  

}


function setBasicsParams(){
  
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
        
    hei = (data.length * boxHeight)+100;
    


    barHeight = (hei - padding.top - padding.bottom) / data.length;

    // scales.indexes = d3.scale.linear()
    //   .domain([ 0,  totalmemberships- 1 ])
    //   .range([ padding.top, hei - padding.bottom - barHeight ]);


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

    //Todo: Move to plugin loader
    window.cargo.plugins.memberships.processData();

    // calculate ordering items
    var y_area = padding.top;
    // Height
    var y_popPercent = padding.top;
    for(i = 0; i < data.length; i++) {

      data[i].position = i;
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

        
        

        window.cargo.plugins.memberships.processIndex(d[j],j);

        //Save previous year reference to be uses on carrear compare

        if (j -1 >=0){
          d[j].pre = d[j-1];
        }
        else{
         d[j].pre = {start:0, pre:0, tx:0} ;
        }

        //Used for beziers
        if (j+1 < d.length){
          d[j].after = d[j+1];  
        }
        

      };


    }

    


}

/************************************************************
 * Initial rendering of the vis
 ***********************************************************/

function refreshGraph() {
  if (data.length == 0){
      d3.selectAll("div.vis svg").remove();

      started = false;
      return;
  }
  var visCenter = (wid - padding.left - padding.right) / 2 + padding.left;
  /************************************************************
  * reload height
  ***********************************************************/

  // hei = ($(window).height()/1.5);
  hei = (data.length  * boxHeight)+75 ;  
  //Memberships.Height
  window.cargo.plugins.memberships.setBoxHeight();
  
  
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




  /************************************************************
  * Refresh Years domain based upon the processData.
  ***********************************************************/

  scales.years = d3.scale.linear()
      .domain([ minYear,maxYear])
      .range([ padding.left, wid - padding.right ]);

  /************************************************************
  * Process Politicians names 
  ***********************************************************/

  var names = vis.selectAll("g.group")
    .data(data, function(d){return d.id;});
    
  names.enter().append("g")
    .attr('class', 'group')
    .append('text')
    .attr('class', 'group')
    .attr('class', 'itemLabel')
    .attr('dy','.33em')
    .attr("x", padding.left / 9)
    .attr("y", function(d,i){
      return (i+1)*(barHeight/2) ;
    })
    .text(function(d) {
      
      return d.name;

    });

    names.each(function(politician, j){
       
      
      var memberships = 
          d3.select(this)
            .selectAll("g.barGroup")
            .data(politician.memberships, function(d,i){ return d.id;});
      
      memberships.enter()
            .append("g")
            .attr("index", function(d, i) { return j; })
            .attr("membership", function(d, i) { return i; })
            .attr("class", function(d) {
              //TODO: change to type and region?
              return "barGroup bar " + d.post.cargotipo.toLowerCase()  + " " + d.organization.level.toLowerCase() + " " + d.role.toLowerCase();
            })
            .style("fill-opacity", function(d) { 
                return 1;
            });

      ///Set current height      
      barHeight = ((hei - padding.top - padding.bottom) / data.length);
      //Set a index for boxes, from padding top to hei - padding top
      scales.indexes = d3.scale.linear()
            .domain([ 0,  data.length - 1 ])
            .range([ padding.top, hei - padding.bottom - barHeight]);
      

      
      memberships.attr("transform", function(d, i) {
                var transform = {
                  tx:0,
                  ty:0 
                };
                //TimeLine
                if (controls.display == "timeline") {
                    transform.tx = scales.years(d.start);
                    transform.ty = scales.indexes(d.parent);  
                }
                  
                //CareerMeeter
                else if (controls.display == "aligned") {
                  var first = scales.years.ticks()[0];

                  if (d.position=== 0) { 
                    transform.tx = padding.left;
                  }
                  else {
                    transform.tx =d.pre.tx + 
                    //width of the previous
                    (scales.years(d.pre.end)- scales.years(d.pre.start)) +  
                    //distance between previous
                    (scales.years(d.start) - scales.years(d.pre.end))
                  }
                  transform.ty = scales.indexes(d.parent);  
                }
                 
                if (controls.height == "memberships") { 
                  transform = window.cargo.plugins.memberships.updateBoxes(d,i);
                  
                }
                
                
                d.tx = transform.tx;
                d.ty = transform.ty;
                return "translate(" + transform.tx + ", " + transform.ty + ")"; 
            });
            
      
    memberships
      .append("rect")
      .attr("index", function(d, i) { return j; })
      .attr("membership", function(d, i) { return i; })
      .attr("class", function(d) {
        //TODO: change to type and region?
        return "barGroup bar " + d.post.cargotipo.toLowerCase()  + " " + d.organization.level.toLowerCase() + " " + d.role.toLowerCase();
      })
      .attr("width", 100)
      .attr("height", barHeight - 1);

    memberships
        .append("text")
        .attr("y", barHeight / 2)
        .attr("dy", ".35em")
        .text(function(d) { return d.role; });
  
      memberships.exit().remove();


       // window.cargo.plugins.memberships.updateAdditionalGraphs(politician,this);
     
    });
  
  names.exit().remove();


  // empire containers
      vis.selectAll("g.barGroup")
        .transition()
          .duration(transitionDuration)
          .style("fill-opacity", function(d) { 
            //if (controls.height == "population" && isNaN(d.Percent_World_Population)) return .4;
            //else 
            return 1;
          });



  /************************************************************
  * Process Labels
  ***********************************************************/
  

  vis.selectAll('svg text.itemLabel')
        .attr("x", padding.left / 7)
        .attr("y", function(d,i) {
          
          return (i)*barHeight + (barHeight/2) + padding.top;

        })
        .text(function(d,i) {
          //Memberships.IndexLabel
          var label = window.cargo.plugins.memberships.updateIndexLabel();
          if (controls.height == "memberships"){ return label;}
          else{ return d.name;} 
        });

  //Memberships.UpdateLabel
  window.cargo.plugins.memberships.updateLabels();
  
 

  
    
      

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
        else if (controls.display == "memberships") return window.cargo.plugins.memberships.getYearTickPosition();
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
        else if (controls.display == "memberships") return window.cargo.plugins.memberships.getYearTickPosition();
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



}
//In order to isolate order/filtering this method will execute everthing
function setControlFix(o){
  setControls(o);
  reloadTimeline();
  
}

function setControls(o){
  
  //Membership.Action
  if (o ==="memberships"){
       controls['display'] = 'timeline';
       controls['height'] = 'memberships';
  }
  // 'name 'orderLine('height', 'contiguous')
  else if (o ==="career"){
      controls['display'] = 'aligned';
      controls['height'] = 'contiguous';
  }
  // 'timeline' filterLine('display','timeline')
  else{
      controls['display'] = 'timeline';
      controls['height'] = 'contiguous';
      controls['group'] = 'name';
  }
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


