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
            //color: '#f00',
            color: function(item) {
              //console.log(item);
              for (var i = 0; i < list.length; i++) {
                var array = list[i];
                for (var j = 0; j < array.length; j++) {
                  if (array[j] == item) {
                    //    console.log(array[2]);
                    //return '\'' + array[2] + '\'';
                    return array[2];
                  }
                }
              }
            },
            fontWeight: function(item) {
              console.log(item);
              var fontWeightList;
              for (var i = 0; i < list.length; i++) {
                var array = list[i];
                for (var j = 0; j < array.length; j++) {
                  if (array[j] == item) {
                    if (array[4]) {
                      //return '\'' + array[4] + " " + '\'';
                      fontWeightList.push('\'' + array[4] + " " + '\'');
                    } else {
                      console.log("Error en fontWeight!");
                    }
                  }
                }
              }
              return fontWeightList;
            },
            fontFamily: function(item) {
              for (var i = 0; i < list.length; i++) {
                var array = list[i];
                for (var j = 0; j < array.length; j++) {
                  if (array[j] == item) {
                    //return '\'' + array[2] + '\'';
                    return '\'' + array[3] + '\'';
                  }
                }
              }
              console.log(item);
            },
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
            var resultFormat = 'Name: ' + item[0] + ', Size: ' + item[1] + ', Color: ' + item[2] + ', Font Family: ' + item[3];
            if (item[4])
              resultFormat += ', Font Weight: ' + item[4];
            resultFormat += '<br>' + ''
            return resultFormat;
          }
        },
        list: list,
        //  color: '#15a4fa',
        color: function(item) {
          //console.log(item);
          for (var i = 0; i < list.length; i++) {
            var array = list[i];
            for (var j = 0; j < array.length; j++) {
              if (array[j] == item) {
                //    console.log(array[2]);
                //return '\'' + array[2] + '\'';
                return array[2];
              }
            }
          }
        },
        // fontWeight: function(item) {
        //   console.log(item);
        //   for (var i = 0; i < list.length; i++) {
        //     var array = list[i];
        //     for (var j = 0; j < array.length; j++) {
        //       if (array[j] == item) {
        //         console.log("fontWeight: " + array[4]);
        //         if (array[4]) {
        //           return '\'' + array[4] + " " + '\'';
        //         } else {
        //           console.log("Error en fontWeight!");
        //         }
        //       }
        //     }
        //   }
        // },
        // fontFamily: function(item) {
        //   for (var i = 0; i < list.length; i++) {
        //     var array = list[i];
        //     for (var j = 0; j < array.length; j++) {
        //       if (array[j] == item) {
        //         console.log(array[3]);
        //         //return '\'' + array[2] + '\'';
        //         return '\'' + array[3] + '\'';
        //       }
        //     }
        //   }
        //   console.log(item);
        // },
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
$("#get-own-wordcloud").on("click", function() {
  $.get('/getWordCloud', function(list) {
    var ownWordcloud = document.getElementById('ownWordcloud');
    if (list) {
      var ctx = ownWordcloud.getContext("2d");
      var dataURL = ownWordcloud.toDataURL();
      document.getElementById('ownWordcloud').src = dataURL;
      for (var i = 0; i < list.length; i++) {
        var array = list[i];
        var fontSize = 12;
        var minFontSize = 10;
        // Scale factor here is to make sure fillText is not limited by
        // the minium font size set by browser.
        // It will always be 1 or 2n.
        var mu = 1;
        if (fontSize < minFontSize) {
          mu = function calculateScaleFactor() {
            var mu = 2;
            while (mu * fontSize < minFontSize) {
              mu += 2;
            }
            return mu;
          }();
        }
        ctx.font = array[1] + ' ' + (fontSize * mu).toString(10) + 'px ' + array[3];
        ctx.fillStyle = array[2];
        ctx.fillText(array[0], i, i * 20);
      }
      // ctx.font = "20px " + list[0][3];
      // ctx.fillStyle = list[0][2];
      // ctx.fillText(list[0][0], 10, 10);
      //
      // ctx.font = "20px " + list[1][3];
      // ctx.fillStyle = list[1][2];
      // ctx.fillText(list[1][0], 10, 30);
    } else {
      ownWordcloud.innerHTML = "Unable to construct your own wordcloud.";
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
