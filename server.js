/*var http = require('http');
var fs = require('fs');
var index = fs.readFileSync('code-art-graph.html');

http.createServer(function(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/html'
  });
  res.end(index);
}).listen(8080);
*/


var express = require("express");
var app = express();
var path = require("path");
var cons = require('consolidate');
var jsonfile = require('jsonfile');

app.engine('html', cons.swig)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html')

app.listen(8080, () => {
  console.log("Server started!");
});

app.get("/", function(req, res) {
  res.render('graph')
});


app.get("/getNodes", (req, res) => {
  console.log("Get nodes");
  jsonfile.readFile('views/graph.json', (err, obj) => {
    //res.send(JSON.stringify(obj));
    res.send(obj);
  });
});
