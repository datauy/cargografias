
require('dotenv').load();
var express = require('express');
var http = require('http');
var compression = require('compression');
var mongoose = require('mongoose');
var mongoUrl = process.env.MONGO_URL; 
var swig = require('swig');
swig.setDefaults({ cache: false });

console.log("trying to connect to", mongoUrl);

mongoose.connect(mongoUrl);
var instancesMap = null;
var allInstances = null;

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

  // Connection URL
  // // Use connect method to connect to the Server
   MongoClient.connect(mongoUrl, function(err, db) {
     assert.equal(null, err);
       console.log("Connected correctly to server");
 

       var instances = db.collection('cargoinstances');
       instances.find({}).toArray(function(err, instances){
           allInstances = instances;
            console.log('found', instances.length, 'instances');
            // console.log('instances', JSON.stringify(instances));
            instancesMap = instances.reduce(function(memo, item){ memo[item.instanceName] = item; return memo; }, {});

            allInstances.forEach(function(instance){
                app.get('/' + instance.instanceName, getRouteForInstance(instance));
                app.get('/d/' + instance.instanceName, function(req, res){ res.send(instance) });
            });

       });


    });


var app = express();

app.engine('swig', swig.renderFile);
app.set('view engine', 'swig');
app.set('views', __dirname + "/views");

// all environments
app.set('port', process.env.PORT || 3000);
app.use(compression({
  threshold : 0, // or whatever you want the lower threshold to be
  filter    : function(req, res) {
    if (req.url.indexOf('gz') > 0){
       // res.setHeader( "Content-Encoding", "gzip" );
    }
    
  }
}));


function getRouteForInstance(instance){
    return function(req, res){
           res.render('index', instance);
    }
}

app.use(express.static(__dirname + '/web'));

app.disable('etag');
var server = http.createServer(app);
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
