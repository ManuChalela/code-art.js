var x = 5;

function Absoluto(x) {
  var abso = Math.abs(x);
  return abso;
}

function Random(x) {
  //  var y = Absoluto(x);
  var y = Math.Random() * x;
  return y;
}

// function Max() {
//   return Number.MAX_VALUE;
// }

function Random2(x) {
  return Absoluto(x);
}
