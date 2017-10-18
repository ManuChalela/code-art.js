$("#get-nodes").on("click", function() {
  $.get('/getGraph', function(graph) {
    var container = document.getElementById('mynetwork');
    if (graph) {
      var options = {
        nodes: {
          shape: 'dot',
          size: 20,
          font: {
            size: 22
          },
          borderWidth: 2,
          shadow: true,
        },
        edges: {
          width: 2,
          shadow: true
        }
      };
      network = new vis.Network(container, graph, options);
    } else {
      container.innerHTML = "Unable to construct graph.";
    }
  });
});
$("#get-wordcloud").on("click", function() {
  $.get('/getWordCloud', function(list) {
    if (list) {
      console.log("hola list!");
      WordCloud(document.getElementById('my_canvas'), {
        list: list
      });
    }
  });
});
