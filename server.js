require('dotenv').load();
var express = require('express');
var http = require('http');
var compression = require('compression');
var mongoose = require('mongoose');
var mongoUrl = process.env.MONGO_URL;
var swig = require('swig');
var fichasController = require('./controllers/fichas.js')

swig.setDefaults({
    cache: false,
    locals: {
        config: {
            baseStaticPath: process.env.BASE_STATIC_PATH 
        }
    }
});
var Q = require('q');

console.log("trying to connect to", mongoUrl);

mongoose.connect(mongoUrl);
var instancesMap = null;
var allInstances = null;
var db = null;

var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

MongoClient.connect(mongoUrl, function(err, _db) {
    db = _db;
    if (err) {
        console.log("cannot connect to db", err);
    } else {
        console.log("Connected correctly to server");
    }
});

var app = express();

app.engine('swig', swig.renderFile);
app.set('view engine', 'swig');
app.set('views', __dirname + "/views");

// all environments
app.set('port', process.env.PORT || 3000);

app.get('/', function(req, res) {
    req.params.instanceName = 'cargografias';
    instanceRouteHandler(req,res);
});

app.use(express.static(__dirname + '/web'));

app.get('/:instanceName', instanceRouteHandler);
        
function instanceRouteHandler(req, res) {

    var instances = db.collection('cargoinstances');
    instances.find({instanceName: req.params.instanceName}).toArray(function(err, instances) {
        if (err) {
            res.send('error');
            console.log(err); 
        } else {
            if(instances.length > 0){
                res.render('index', instances[0]) 
            }else{
                res.status(404).render('instancenotfound'); 
            }
        }
    });

}

app.get('/d/:instanceName', function(req, res) {

    var instances = db.collection('cargoinstances');
    instances.find({instanceName: req.params.instanceName}).toArray(function(err, instances) {
        if (err) {
            res.send('error');
            console.log(err); 
        } else {
            if(instances.length > 0){
                res.send(instances[0]) 
            }else{
                res.status(404).render('instancenotfound'); 
            }
        }
    });

});

app.get('/:instanceName/ficha/:personId', fichasController.index)

app.disable('etag');
var server = http.createServer(app);
server.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});
