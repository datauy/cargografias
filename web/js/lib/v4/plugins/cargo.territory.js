window.cargo  =  window.cargo || {};
window.cargo.plugins  = window.cargo.plugins || {};
window.cargo.plugins.territory =  {
	key: "territory",

	height: 0,
	data : [],
	colorScale: function(i){
		return category20(i);
	},
	count : function(){
    	return territories.length;
	},
	processData: function(){
	  //territories.processData
      //clear all;
      var territories = [];
      //find all other territories by region and province
      var territoriesArray = data.map(function(d) { return d.memberships.map( function(z){ return z.organization.name.capitalize() + '-' + z.role; }); })
      //and now we remove duplicates
      territoriesArray = d3.merge(territoriesArray);
      $.each(territoriesArray, function(i, el){
        if($.inArray(el, territories) === -1) territories.push(el);
      });
      //now we order them
      territories.sort(function(a, b){ return d3.ascending(a, b);});
      this.data = territories;

	},
	processIndex: function(d,i){
		//Memberiship.ProcessIndex
        d.territoryPosition = this.data.indexOf(d.organization.name.capitalize() + '-' + d.role);

	},
	setBoxHeight: function(){
		if (controls.height == "territory")
		{
		    hei =  (this.data.length  * boxHeight *1.25) ;
		    barHeight = (hei - padding.top - padding.bottom) / this.data.length;
		 }
	},
	updateBoxes: function(d,i){
		this.setBoxHeight();
		
            //Overwrites years
            //depends on total of type of memberships
		 scales.indexes = d3.scale.linear()
              .domain([ 0,  this.data.length - 1 ])
              .range([ padding.top, hei - padding.bottom - barHeight ]);

			var transform = {
				tx: scales.years(d.start),
				ty: scales.indexes(d.territoryPosition)
			};
			return transform;

	},
updateAdditionalGraphs:function(d,context){
		
		var curves = d3.select(context)
			.selectAll('path.curves')
	        .data(d.memberships, function(d,i){ return i;});

        curves.enter()
	        .append('path')
	        .attr('class', 'curves bezier')
	       	.attr('index',d.position)
	        .attr('opacity', 0)
	        .attr('fill', 'none')
	        .attr('stroke', 'red')
	        .attr('stroke-width', '2px');

        var controlLenght = 20;

        if (controls.height != "memberships" && controls.height != "territory"){
        	curves
	        .transition()
	        .duration(transitionDuration)
	        .attr('opacity', 0);
        	return;
        }
        else if (controls.height == "territory"){

	        curves
		        .transition()
		        .duration(transitionDuration)
		        .attr('opacity', 1)
		        .attr('d', function(d) {
		        	if (!d.after || !d.pre){
		        		return "";
		        	}
		        //Scale Left
		          var fromX = scales.years(d.end) ;	
		          var fromY = scales.indexes(d.territoryPosition) + barHeight /2;

				//Jump!
		          var control1X = fromX + controlLenght;
		          var control1Y = fromY;

		        //Scale Right
		          var toX = scales.years(d.after.start) - 2;	
		          var toY = scales.indexes(d.after.territoryPosition) + barHeight /2;
		        //Jump!
		          var contorl2X = toX - controlLenght;
		          var control2Y = toY;

		          //From here! http://www.sitepoint.com/html5-svg-cubic-curves/
		          var b = "M" + fromX + "," + fromY + " C" + control1X + "," + control1Y + " " + contorl2X + "," + control2Y + " " + toX + "," + toY;

		          return b;

		        }).attr('stroke', function(d) {
		          return window.cargo.plugins.territory.colorScale(d.parent);
		        });


	        curves.exit().remove();
    	}
	},
	updateLabels: function(){

		this.setBoxHeight();
        
	  var labels = vis.selectAll('text.territoryLabel')
	    .data(this.data, function(d,i){ return i;});

	  labels.enter()
	    .append('text')
	    .attr('class', 'territoryLabel')

	    
      	.attr("x", function(){ return padding.left / 7;})
		.attr("y", function(d,i) {return (i)*(barHeight) + padding.top;})
	    
	  
	 

	 labels
	 	.transition()
      	.duration(transitionDuration)
      	.style("opacity", function(d) {
		    //On CarreerMeter hide years.
		    if (controls.height == "territory"){
	         return 1;
	     	}
	     	else {
	     		return 0;
	     	}
		}).attr('dy','.33em')
      	.attr("x", function(){ return padding.left / 7;})
      	.attr("y", function(d,i) {return (i)*(barHeight) + barHeight/2+ padding.top;})
      	.text(function(d,i) {
	    	return d.split('-')[0];
	    })
	 labels.exit().remove();


	  		
		    
	  		
	},
	updateIndexLabel: function(){
		return '';
	},
	getYearTickPosition: function(){
		return padding.left;     
	},
	showOnlyHim: function(e,i){
		if (controls.height == "territory" || controls.height =="memberships"){
			$("svg.vis path[index!=" + i + "]").css('opacity',0.2);
  			$("svg.vis path[index=" + i + "]").css('opacity',1);
  		}
  		else {
  			$("svg.vis path").css('opacity',0);
  		}
	},
	showAll: function(e,i){
		if (controls.height == "territory" || controls.height =="memberships"){
			$("svg.vis path.territory").css('opacity',1);
		}
		else {
			$("svg.vis path.territory").css('opacity',0);
		}
	},

}