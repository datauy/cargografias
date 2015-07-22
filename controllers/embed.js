var request = require('request');
var mongoose = require('mongoose');
var db = require('../db')
var EmbedUrls = mongoose.model('embedurls');

function index(req, res){
    var id = req.params.id;
    EmbedUrls.findById(id, function(err, item){
        if(err){
            res.status(500).send({
                status: 'error', 
                error: err
            })
        }else{
            if(item){
                res.render('embed', {
                    data: item.toObject().data,
                    dataJSONString: JSON.stringify(item.toObject().data)
                })                        
            }else{
                res.status(404).send({
                    status: 'not found'
                })
            }
        }
    })
}

function createEmbedUrl(req, res){
    EmbedUrls.create({
        data: req.body
    }, function (err, doc){
        if(err){
            console.log(err);
            res.status(500).send({
                status: 'error', 
                error: err
            })
        }else{
            res.send({
                status:'ok', 
                embed: doc
            })
        }
    })
}

module.exports = {
    index: index,
    createEmbedUrl: createEmbedUrl
}
