window.cargo  =  window.cargo || {};
window.cargo.plugins  = window.cargo.plugins || {};
window.cargo.plugins.memberships =  {
	key: "memberships",

	height: 0,
	data : [],
	count : function(){
    	return d3.sum(data, function(d){return d.memberships.length});
	},
	processData: function(){
	  //Memberships.processData
      //clear all;
      var memberships = [];
      //find all other memberships by region and province
      var membershipsArray = data.map(function(d) { return d.memberships.map( function(z){ return z.role + "-" + z.organization.name }); })
      //and now we remove duplicates
      membershipsArray = d3.merge(membershipsArray);
      $.each(membershipsArray, function(i, el){
        if($.inArray(el, memberships) === -1) memberships.push(el);
      });
      //now we order them
      memberships.sort(function(a, b){ return d3.ascending(a, b);});
      this.data = memberships;

	},
	processIndex: function(d,i){
		//Memberiship.ProcessIndex
        d.membershipsPosition = this.data.indexOf(d.role + "-" + d.organization.name);

	},
	setBoxHeight: function(){
		if (controls.height == "memberships")
		{
		    hei =  (this.data.length  * boxHeight)*2 ;
		    barHeight = (hei - padding.top - padding.bottom) / this.data.length ;
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
				ty: scales.indexes(d.membershipsPosition)
			};
			return transform;

	},
	updateAdditionalGraphs:function(d,context){
		console.log(d.name);
		var curves = d3.select(context)
			.selectAll('path.curves')
	        .data(d.memberships, function(d,i){ return i;});

        curves.enter()
	        .append('path')
	        .attr('class', 'curves')
	        .attr('opacity', 0)
	        .attr('fill', 'none')
	        .attr('stroke', 'red')
	        .attr('stroke-width', '2px');

        var controlLenght = 20;

        if (controls.height != "memberships"){
        	curves
	        .transition()
	        .duration(transitionDuration)
	        .attr('opacity', 0);
        	return;
        }

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
	          var fromY = scales.indexes(d.membershipsPosition) + barHeight /2;

			//Jump!
	          var control1X = fromX + controlLenght;
	          var control1Y = fromY;

	        //Scale Right
	          var toX = scales.years(d.after.start) - 2;	
	          var toY = scales.indexes(d.after.membershipsPosition) + barHeight /2;
	        //Jump!
	          var contorl2X = toX - controlLenght;
	          var control2Y = toY;

	          //From here! http://www.sitepoint.com/html5-svg-cubic-curves/
	          var b = "M" + fromX + "," + fromY + " C" + control1X + "," + control1Y + " " + contorl2X + "," + control2Y + " " + toX + "," + toY;

	          return b;

	        });
	        // .attr('stroke', function(d) {
	        //   return d.colorStroke;
	        // });


        curves.exit().remove();
	},
	updateLabels: function(){
		this.setBoxHeight();
        
	  var labels = vis.selectAll('text.membershipLabel')
	    .data(this.data, function(d,i){ return i;});

	  labels.enter()
	    .append('text')
	    .attr('class', 'membershipLabel')
	    
      	.attr("x", function(){ return padding.left / 7;})
		.attr("y", function(d,i) {return (i)*(barHeight) + padding.top;})
	    
	  
	 

	 labels
	 	.transition()
      	.duration(transitionDuration)
      	.style("opacity", function(d) {
		    //On CarreerMeter hide years. 
	        if (controls.height == "memberships")  return 1;
	        	else return 0;
		      })
      	.attr('dy','.33em')
      	.attr("x", function(){ return padding.left / 7;})
      	.attr("y", function(d,i) {return (i)*(barHeight) + barHeight/2+ padding.top;})
      	.text(function(d) {
	    	console.log(d);
	    	return d;
	    });
	 labels.exit().remove();


	  		
		    
	  		
	},
	updateIndexLabel: function(){
		return '';
	},
	getYearTickPosition: function(){
		return padding.left;     
	}

}