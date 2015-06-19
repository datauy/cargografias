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
	}

}