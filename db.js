var mongoose = require('mongoose');
var mongoUrl = process.env.MONGO_URL;
var MongoClient = require('mongodb').MongoClient;
var db = null;

console.log("trying to connect to", mongoUrl);

mongoose.connect(mongoUrl);

MongoClient.connect(mongoUrl, function(err, _db) {
    db = _db;
    if (err) {
        console.log("cannot connect to db", err);
    } else {
        console.log("Connected correctly to server");
    }
});

mongoose.model('embedurls', new mongoose.Schema({
    data: mongoose.Schema.Types.Mixed
}), 'embedurls');

function getDb(){
    return db;
}

module.exports = {
    getDb: getDb
}