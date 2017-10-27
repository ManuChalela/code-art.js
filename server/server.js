var express = require("express");
var app = express();
var path = require("path");
var cons = require('consolidate');
var jsonfile = require('jsonfile');
var vis = require('vis');

var graphGlobal;
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
  graphGlobal = graph;
  res.send(graph);
});


app.get("/getWordCloud", (req, res) => {
  console.log("Getting WordCloud info ");
  //var list = jsonfile.readFileSync('views/edges.json');
  var list = jsonfile.readFileSync('views/list.json');
  res.send(list);
});

app.get("/saveGraph", (req, res) => {
  console.log("Saving graph info ");
  res.send(graphGlobal);
});
