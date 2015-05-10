window.cargo  =  window.cargo || {};
window.cargo.plugins  = window.cargo.plugins || {};
window.cargo.plugins.memberships =  {
	key: "memberships",
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
		    hei = (totalmemberships * boxHeight)+200 ;    
		 }
	},
	updateIndexLabel: function(){
		return '';
	},
	updateLabel: function(){
		vis.selectAll('text.membershipLabel')
	        .attr("y", function(d,i) {return (i)*barHeight + (barHeight/2) + padding.top;})
	        .text(function(d,i) {
	          if (controls.height == "memberships"){ return d;}
	          else{ return '';} 
	        });
	},
	getYearTickPosition: function(){
		return padding.left;     
	}

}