require('dotenv').load();
var express = require('express');
var http = require('http');
var compression = require('compression');
var mongoose = require('mongoose');
var mongoUrl = process.env.MONGO_URL;
var swig = require('swig');
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
        reload()
    }
});

function reload() {
    return Q.promise(function(resolve, reject, notify) {
        var instances = db.collection('cargoinstances');
        instances.find({}).toArray(function(err, instances) {
            if (err) {
                reject(err);
            } else {
                allInstances = instances;
                console.log('found', instances.length, 'instances');
                instancesMap = instances.reduce(function(memo, item) {
                    memo[item.instanceName] = item;
                    return memo;
                }, {});
                resolve(instances);
            }
        });
    });
}


var app = express();

app.engine('swig', swig.renderFile);
app.set('view engine', 'swig');
app.set('views', __dirname + "/views");

// all environments
app.set('port', process.env.PORT || 3000);
app.use(compression({
    threshold: 0, // or whatever you want the lower threshold to be
    filter: function(req, res) {
        if (req.url.indexOf('gz') > 0) {
            // res.setHeader( "Content-Encoding", "gzip" );
        }

    }
}));


function getRouteForInstance(instance) {
    return function(req, res) {
        res.render('index', instance);
    }
}

app.get('/reload', function(req, res) {
    reload().then(function() {
        res.send('ok');
    }).catch(function(err) {
        res.status(500).send('cannot reload data');
    });
});

app.get('/', function(req, res) {
    res.render('index', instancesMap.cargografias);
    reload();
});

app.get('/:instanceName', function(req, res) {
    var instance = instancesMap[req.params.instanceName];
    if(instance){
        res.render('index', instance)
        reload();
    }else{
        res.status(404).render('instancenotfound');
    }
});

app.get('/d/:instanceName', function(req, res) {
    res.send(instance)
});

app.use(express.static(__dirname + '/web'));

app.disable('etag');
var server = http.createServer(app);
server.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});
