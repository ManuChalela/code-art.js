// var option = {
//   tooltip: {
//     show: true,
//     formatter: function(item) {
//       return item[0] + ': ' + item[1] + '<br>' + ''
//     }
//   },
//   list: [
//     ['name', 38],
//     ['false', 38],
//     ['var', 28],
//     ['rstudio', 26],
//     ['true', 22],
//     ['url', 20],
//     ['server', 20],
//     ['wordcloud', 15],
//     ['virtual', 15],
//     ['target', 14],
//     ['key', 14],
//     ['google', 13],
//     ['null', 12],
//     ['data', 12],
//     ['linux', 11],
//     ['function', 10],
//     ['postid', 8],
//     ['posts', 8],
//     ['twitter', 8],
//     ['blog', 8],
//     ['facebook', 8],
//     ['comments', 8],
//     ['machine', 7],
//     ['environment', 5],
//     ['ubuntu', 5],
//     ['password', 5],
//     ['ssh', 5],
//     ['draws', 5],
//     ['sans', 4]
//   ],
//   color: '#15a4fa',
//   shape: 'circle',
//   ellipticity: 1
// }
// var wc = new Js2WordCloud(document.getElementById('container'))
// wc.showLoading({
//   backgroundColor: '#fff',
//   text: '',
//   effect: 'spin'
// })
// setTimeout(function() {
//   wc.hideLoading()
//   wc.setOption(option)
// }, 2000)
//
// setTimeout(function() {
//   wc.setOption({
//     noDataLoadingOption: {
//       backgroundColor: '#f00',
//       text: ''
//     }
//   })
// }, 4000)
//
// setTimeout(function() {
//   wc.setOption(option)
// }, 6000)
//
// /////////////////
//
// var option1 = {
//   color: '#15a4fa',
//   noDataLoadingOption: {
//     backgroundColor: '#eee',
//     text: '',
//     textStyle: {
//       color: '#f00',
//       fontSize: 20
//     }
//   }
// }
// var wc1 = new Js2WordCloud(document.getElementById('container1'))
// wc1.showLoading()
// setTimeout(function() {
//   wc1.hideLoading()
//   wc1.setOption(option1)
// }, 2000)
//
// var option8 = {
//   tooltip: {
//     show: true,
//     formatter: function(item) {
//       return item[0] + ': ' + item[1] + '<br>' + ''
//     }
//   },
//   list: [
//     ['Al', 500000],
//     ['fin', 50],
//     ['pude', 40]
//   ],
//   color: 'red'
// }
// setTimeout(function() {
//   wc1.setOption(option8)
// }, 4000)
//
// window.onresize = function() {
//   wc.resize()
//   wc1.resize()
// }