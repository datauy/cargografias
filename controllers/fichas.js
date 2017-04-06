var conn = require('../db.js');
var request = require('request');


function person(req, res) {
    console.log("ENTRO");
    var instanceName = req.params.instanceName;
    var personId = req.params.personId;
    var instances = conn.getDb().collection('cargoinstances');
    instances.find({
        instanceName: req.params.instanceName
    }).toArray(function(err, instances) {
        if (err) {
            console.log(err);
            res.send({
                'error': 'error'
            })
        } else {
            if (instances.length > 0) {
                var url = "http://" + instances[0].popitUrl + "/api/v0.1/persons/" + personId
                request(url, function(error, response, body) {
                    if (!error && response.statusCode == 200) {
                        try {
                            body = JSON.parse(body);
                            res.render('fichaPerson', {
                                person: body.result,
                                instanceName: instanceName,
                                popitUrl: instances[0].popitUrl
                            })
                        } catch (ex) {
                            res.send({
                                'error': 'error parsing response'
                            })
                        }
                    } else {
                        res.send({
                            'error': 'error'
                        })
                    }
                })
            } else {
                res.status(404).render('instancenotfound');
            }
        }
    });


}

function organization(req, res) {
    var instanceName = req.params.instanceName;
    var organizationId = req.params.organizationId;

    var instances = conn.getDb().collection('cargoinstances');
    instances.find({
        instanceName: req.params.instanceName
    }).toArray(function(err, instances) {
        if (err) {
            console.log(err);
            res.send({
                'error': 'error'
            })
        } else {

            if (instances.length > 0) {
                var url = "http://" + instances[0].popitUrl + "/api/v0.1/organizations/" + organizationId

                console.log(url);

                request(url, function(error, response, body) {
                    if (!error && response.statusCode == 200) {
                        try {
                            body = JSON.parse(body);
                            res.render('fichaOrganization', {
                                organization: body.result
                            })
                        } catch (ex) {
                            res.send({
                                'error': 'error parsing response'
                            })
                        }
                    } else {
                        res.send({
                            'error': 'error'
                        })
                    }
                })

            } else {
                res.status(404).render('instancenotfound');
            }
        }
    });


}

module.exports = {
    person: person,
    organization: organization
}
