var request = require('request');

function index(req, res){
    var id = req.params.id;
    //TODO Load the thing from the DB 
    res.render('embed', {
        shareUrl: "https://www.cargografias.org/cargo2/embed/1234"
    })
}

module.exports = {
    index: index
}
