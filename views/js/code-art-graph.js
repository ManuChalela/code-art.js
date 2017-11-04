var wordcloudGlobal;
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
      networkGlobal = network;
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
            fontSize: 20
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
            return item[0] + ', ' + item[1] + ', ' + item[2] + '<br>' + ''
          }
        },
        list: list,
        //  color: '#15a4fa',
        color: function(item) {
          console.log(item);
          for (var i = 0; i < list.length; i++) {
            var array = list[i];
            for (var j = 0; j < array.length; j++) {
              if (array[j] == item) {
                console.log(array[2]);
                //return '\'' + array[2] + '\'';
                return array[2];
              }
            }
          }
          // index.forEach(function(elem) {
          //   console.log(elem);
          // });
          //console.log(index);
          // console.log("item 2: " + index[2]);
          // var sape = '\'' + index[2] + '\'';
          // console.log(sape);
          // return sape;
        },
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
$("#save-nodes").on("click", function() {
  $.get('/saveGraph', function(graphGlobal) {
    var container = document.getElementById('mynetwork');
    if (graphGlobal) {
      var canvasGraph = document.getElementById('canvasGraph');
      var ctx = canvasGraph.getContext('2d');
      var dataURL = canvasGraph.toDataURL();
      document.getElementById('mynetwork').src = dataURL;
      console.log(dataURL);
      console.log("afterDrawing networkGlobal");
      domtoimage.toJpeg(document.getElementById('mynetwork'), {
          quality: 0.95
        })
        .then(function(dataUrl) {
          var link = document.createElement('a');
          link.download = 'my_network.jpeg';
          link.href = dataUrl;
          link.click();
        });
    } else {
      container.innerHTML = "Unable to download graph.";
    }
  });
});

$("#save-wordcloud").on("click", function() {
  var container = document.getElementById('my_wordcloud');
  var canvasWordcloud = document.getElementById('canvasWordcloud');
  var ctx = canvasWordcloud.getContext('2d');
  var dataURL = canvasWordcloud.toDataURL();
  document.getElementById('my_wordcloud').src = dataURL;
  console.log(dataURL);
  console.log("afterDrawing WordCloud global");
  domtoimage.toJpeg(document.getElementById('my_wordcloud'), {
      quality: 0.95
    })
    .then(function(dataUrl) {
      var link = document.createElement('a');
      link.download = 'my_wordcloud.jpeg';
      link.href = dataUrl;
      link.click();
    });
});
