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

/*
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
*/

var express = require("express");
var app = express();
var path = require("path");
var cons = require('consolidate');
var jsonfile = require('jsonfile');
var vis = require('vis');

app.engine('html', cons.swig)
app.set('view engine', 'html')
app.use(express.static('./views'));

app.listen(8080, () => {
  console.log("Server started on port 8080. Go to http://localhost:8080");
});


app.get("/", function(req, res) {
  res.render('code-art-graph')
});

app.get("/getGraph", (req, res) => {
  console.log("Getting graph info ");
  var parserOptions = {
    edges: {
      inheritColors: false,
      arrows: 'to'
    },
    nodes: {
      fixed: true,
      parseColor: false
    }
  }
  var nodes = jsonfile.readFileSync('./nodes.json');
  var edges = jsonfile.readFileSync('./links.json');

  var graph = {
    nodes: nodes,
    edges: edges
  }
  res.send(graph);
});

app.get("/getWordCloud", (req, res) => {
  console.log("Getting WordCloud info ");
  var list = jsonfile.readFileSync('views/list.json');
  //console.log(list);
  res.send(list);
});
