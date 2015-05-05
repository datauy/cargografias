var request = require('request');
var fs = require('fs');
var path = require('path');

function getFiles(instanceName) {
  var files = [
    '-persons.json',
    '-memberships.json',
    '-organizations.json',
    '-posts.json',
    '_locdata.json'
  ];

  files.forEach(function(file) {
    var filename = instanceName + file;
    var url = "http://v3.cargografias.org/js/datasets/gz/" + filename;
    console.log("Getting:", url);
    request(url, function(error, response, body) {
      if (error) {
        console.log("Error getting file", filename);
      } else if (response.statusCode != 200) {
        console.log("Error getting file", filename, response.statusCode, response.statusMessage);
      } else {
        var dest = path.normalize("web/js/datasets/gz/" + filename);
        fs.writeFile(dest, body, function(err) {
          if (err) console.log("Error writing", dest, err);
          else console.log("Complete:", dest);
        });
      }
    })
  })
}


function runProgram(a, b, instanceName) {
  if (!instanceName) {
    console.log("Usage: node getInstanceData.js [instanceName]");
    return;
  }
  getFiles(instanceName);
}

runProgram.apply(this, process.argv);