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
		    hei = (this.count() * boxHeight)+200 ;    
		 }
	},
	updateLabels: function(){
	  var labels = vis.selectAll('text.membershipLabel')
	    .data(this.data, function(d,i){ return i;});

	  labels.enter()
	    .append('text')
	    .attr('class', 'membershipLabel')
	    .attr('dy','.33em')
  		.style("opacity", function(d) {
		    //On CarreerMeter hide years. 
	        if (controls.height == "memberships")  return 1;
	        	else return 0;
      	})
      	.transition()
  		.duration(transitionDuration)
	    .attr("x", padding.left / 7)
		.attr("y", function(d,i) {
	        	return (i)*barHeight + (barHeight/2) + padding.top;})
	    .text(function(d) {
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