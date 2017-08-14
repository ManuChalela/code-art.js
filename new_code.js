const esprima = require('esprima');
var source = 'answer = 42; hola = 5; isCold = "Si"; answer = 50;';
const tokens = esprima.tokenize(source);
var identificadores = tokens.filter(function (el) {
    return (el.type === "Identifier");
});

console.log("El código es: ");
console.log(source);
//var armarArray = [];
var listIdentifiers = [];
identificadores.forEach(function (element) {
    //var indice = arrayObjectIndexOf(armarArray,element.value, "id");
    var indice = arrayObjectIndexOf(listIdentifiers,element.value, "id");
    if(indice == -1){ // No encontró el identificador, lo agrega.
  //      armarArray.push(new Identifier(element.value,1));
        var list = [element.value, 1];
        listIdentifiers.push.apply(listIdentifiers, list);
    } else { // Encontró el identificador, suma uno.
    //    armarArray[indice].quantity++;
        listIdentifiers[indice].size++;
    }
});

console.log("El array de Identificadores es: ");
console.log(listIdentifiers);
console.log("listIdentifiers");
function arrayObjectIndexOf(myArray, searchTerm, property) {
    for(var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm) return i;
    }
    return -1;
}

function Identifier(id, quantity) {
    this.id = id;
    this.quantity = quantity;
}

function Item (id, size){
    this.id = id;
    this.size = size;
}