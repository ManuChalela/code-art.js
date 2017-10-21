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
      //console.log(network);
      //var downloadNetwork = document.getElementById("mynetwork");
      // var imageNetwork = document.getElementById("mynetwork").toDataURL("image/png")
      //   .replace("image/png", "image/octet-stream");
      // download.setAttribute("href", imageNetwork);
      network.on("afterDrawing", function(ctx) {
        var dataURL = ctx.canvas.toDataURL();
        //   document.getElementById('canvasImg').src = dataURL;
        document.getElementById('mynetwork').src = dataURL;
        console.log("afterDrawing");
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
      });
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
      wordcloud.on("afterDrawing", function(ctx) {
        var dataURL = ctx.canvas.toDataURL();
        //   document.getElementById('canvasImg').src = dataURL;
        document.getElementById('canvasImgWC').src = dataURL;
        console.log("wordcloud");
        //domtoimage.toJpeg(document.getElementById('canvasImg'), {
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
    } else {
      wordcloud.innerHTML = "Unable to construct wordcloud.";
    }
  });
});
