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
    var wordcloud = document.getElementById('my_wordcloud');
    if (list) {
      console.log(list);
      var option = {
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
      var wc = new Js2WordCloud(wordcloud);
      wc.showLoading()
      setTimeout(function() {
        wc.hideLoading()
        wc.setOption(option)
      }, 10)

      var option8 = {
        tooltip: {
          show: true,
          formatter: function(item) {
            return item[0] + ': ' + item[1] + '<br>' + ''
          }
        },
        list: list,
        color: '#15a4fa',
        shape: 'circle',
        ellipticity: 1
      }
      setTimeout(function() {
        wc.setOption(option8)
      }, 4000)

      window.onresize = function() {
        wc.resize()
      }
    } else {
      wordcloud.innerHTML = "Unable to construct wordcloud.";
    }
  });
});
