var x = 5;
var globall = "si";

function Absoluto(x) {
  var abso = Math.abs(x);
  var res = 0;
  while (res < abso) {
    console.log("hola");
    res++;
    console.log("probando.");
  }
  for (var i = 0; i < abso; i++) {
    console.log(i);
  }
  return abso;
}

function Random(x) {
  var y = Math.Random() * x;
  for (var i = 0; i < 10; i++) {
    console.log(y);
  }
  return y;
}

function Max() {
  var n = Number.MAX_VALUE;
}

function Random2(x) {
  return Absoluto(x);
}

function Mult(x, y, z) {
  var w = x * Absoluto(y) * z;
}
