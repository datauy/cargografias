var request = require('request');

function index(req, res){
	var instanceName = req.params.instanceName;
	var personId = req.params.personId;

	var url = "https://" + instanceName + ".popit.mysociety.org/api/v0.1/persons/" + personId

	request(url, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	  	try{
	  		body = JSON.parse(body);
		    res.render('ficha', {person: body.result})
	  	}catch(ex){
	  		res.send({'error': 'error parsing response'})
	  	}
	  }else{
	  	res.send({ 'error': 'error'})
	  }
	})

}

module.exports = {
	index: index
}