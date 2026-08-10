var express = require("express");
var app = express();
var path = require("path");
var jsonfile = require('jsonfile');
var vis = require('vis');

var graphGlobal;
var viewsDirectory = path.join(__dirname, '..', 'views');
app.use(express.static(viewsDirectory));

app.listen(8080, () => {
  console.log("Server started on port 8080. Go to http://localhost:8080");
});

app.get("/", function(req, res) {
  res.sendFile(path.join(viewsDirectory, 'code-art-graph.html'));
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
  var nodes = jsonfile.readFileSync(path.join(__dirname, '..', 'nodes.json'));
  var edges = jsonfile.readFileSync(path.join(__dirname, '..', 'links.json'));

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
  // var list = jsonfile.readFileSync('views/list.json');
  var list = jsonfile.readFileSync(path.join(viewsDirectory, 'finalList.json'));
  res.send(list);
});

app.get("/saveGraph", (req, res) => {
  console.log("Saving graph info ");
  res.send(graphGlobal);
});
