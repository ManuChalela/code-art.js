 var gnuplot = require('gnuplot');
 // gnuplot()
 //   .set('term png')
 //   .unset('output')
 //   .plot('[-6:6] sin(x)')
 //   .end();

 var plot = require('plotter').plot;
 plot({
   data: {
     'tick': [3, 1, 2, 3, 4],
     'line': {
       1: 5,
       5: 6
     }
   },
   filename: 'output.png'
 });
