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
      console.log(list);
      var option1 = {
        color: '#15a4fa',
        noDataLoadingOption: {
          backgroundColor: '#eee',
          text: '',
          textStyle: {
            color: '#f00',
            fontSize: 400
          }
        }
      }
      var wc1 = new Js2WordCloud(document.getElementById('my_wordcloud'))
      wc1.showLoading()
      setTimeout(function() {
        wc1.hideLoading()
        wc1.setOption(option1)
      }, 2000)

      var option8 = {
        tooltip: {
          show: true,
          formatter: function(item) {
            return item[0] + ': ' + item[1] + '<br>' + ''
          }
        },
        list: list,
        color: 'blue'
      }
      setTimeout(function() {
        wc1.setOption(option8)
      }, 4000)

      window.onresize = function() {
        wc1.resize()
      }

    }
  });
});
