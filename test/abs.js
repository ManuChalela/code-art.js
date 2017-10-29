var x = 5;
var globall = "si";

function Absoluto(x) {
  var abso = Math.abs(x) + globall;
  globall = 7;
  return abso;
}
