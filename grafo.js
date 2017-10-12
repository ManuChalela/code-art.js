var Graph = require("graph-data-structure");
var graph = Graph();
graph.addNode("a");
graph.addNode("b");
graph.addEdge("a", "b");
console.log(graph.topologicalSort());
