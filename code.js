const esprima = require('esprima');
var source = 'answer = 42; hola = 5; isCold = "Si"; answer = 50;';
const tokens = esprima.tokenize(source);
//console.log(tokens);

var identificadores = tokens.filter(function (el) {
    return (el.type === "Identifier");
});
console.log("El código es: ");
console.log(source);
//console.log("Los identificadores son: ");
//console.log(identificadores);
function arrayObjectIndexOf(myArray, searchTerm, property) {
    for(var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm) return i;
    }
    return -1;
}
var armarArray = [];
console.log("El array de Identificadores es: ");
identificadores.forEach(function (element) {
    var indice = arrayObjectIndexOf(armarArray,element.value, "id");
    if(indice == -1){ // No encontró el identificador, lo agrega.
        armarArray.push(new Identifier(element.value,1));
    } else { // Encontró el identificador, suma uno.
        armarArray[indice].quantity++;
    }
});

console.log(armarArray);

function Identifier(id, quantity) {
    this.id = id;
    this.quantity = quantity;
}