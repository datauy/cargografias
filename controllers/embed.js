var request = require('request');
var mongoose = require('mongoose');
var db = require('../db')
var EmbedUrls = mongoose.model('embedurls');

var BitlyAPI = require("node-bitlyapi");
var Bitly = new BitlyAPI({
    client_id: process.env.BITLY_CLIENT_ID,
    client_secret: process.env.BITLY_CLIENT_SECRET
});
Bitly.setAccessToken(process.env.BITLY_TOKEN);

function index(req, res){
    var id = req.params.id;
    //TODO: How to detect from where?

    var fullUrl = 'https://' + 'www.cargografias.org' + req.originalUrl;
    EmbedUrls.findById(id, function(err, item){
        if(err){
            res.status(500).send({
                status: 'error',
                error: err
            })
        }else{
            if(item){
                res.render('embed', {
                    shareUrl: fullUrl,
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
};

function createEmbedUrl(req, res){

    var embed = {
        data: req.body,
    };
    EmbedUrls.create(embed, function (err, doc){
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

function createShortUrl(req, res){


    var currentUrl = req.body.url;
    //Fociring URL for Embed Twitter request for https
    if (currentUrl.indexOf('https') < 0){
        currentUrl.replace('http', 'https');
    }
    var bitliyRequest = {longUrl: currentUrl };
    Bitly.shorten(bitliyRequest, function(err, results) {
        results = JSON.parse(results)
        res.send({
            shortUrl: results.data.url
        })
    });

}

module.exports = {
    index: index,
    createEmbedUrl: createEmbedUrl,
    createShortUrl: createShortUrl
}
