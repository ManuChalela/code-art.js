//var networkGlobal;
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
$("#save-nodes").on("click", function() {
  $.get('/saveGraph', function(graphGlobal) {
    var container = document.getElementById('mynetwork');
    if (graphGlobal) {
      console.log("graphGlobal")
      console.log(graphGlobal);
      //var ctx = graphGlobal.getContext('2d');
      //var ctx;
      //let ctx = container.get(0).getContext('2d');
      var canvasGraph = document.getElementById('canvasGraph');
      var ctx = canvasGraph.getContext('2d');

      var dataURL = canvasGraph.toDataURL();
      //   document.getElementById('canvasImg').src = dataURL;
      document.getElementById('mynetwork').src = dataURL;
      console.log(dataURL);
      console.log("afterDrawing networkGlobal");
      //domtoimage.toJpeg(document.getElementById('canvasImg'), {
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
  // $.get('/saveWordcloud', function() {
  //   var container = document.getElementById('my_wordcloud');
  //   var canvasWordcloud = document.getElementById('canvasWordcloud');
  //   var ctx = canvasWordcloud.getContext('2d');
  //   var dataURL = canvasWordcloud.toDataURL();
  //   document.getElementById('my_wordcloud').src = dataURL;
  //   //canvasWordcloud.src = dataURL;
  //   console.log(dataURL);
  //   console.log("afterDrawing WordCloud global");
  //   domtoimage.toJpeg(document.getElementById('my_wordcloud'), {
  //       quality: 0.95
  //     })
  //     .then(function(dataUrl) {
  //       var link = document.createElement('a');
  //       link.download = 'my_wordcloud.jpeg';
  //       link.href = dataUrl;
  //       link.click();
  //     });
  //
  // });
  var container = document.getElementById('my_wordcloud');
  var canvasWordcloud = document.getElementById('canvasWordcloud');
  var ctx = canvasWordcloud.getContext('2d');
  var dataURL = canvasWordcloud.toDataURL();
  document.getElementById('my_wordcloud').src = dataURL;
  //canvasWordcloud.src = dataURL;
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
