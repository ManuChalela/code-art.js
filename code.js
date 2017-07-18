const esprima = require('esprima');
var source = 'answer = 42; hola = 5; isCold = "Si";';
const tokens = esprima.tokenize(source);
console.log(tokens);

var identificadores = tokens.filter(function (el) {
    return (el.type === "Identifier");
});
console.log("El código es: ");
console.log(source);
console.log("Los identificadores son: ");
console.log(identificadores);

var armarArray = [];
console.log("El array de Identificadores es: ");
identificadores.forEach(function (element) {
    if(armarArray.indexOf(element.value) == -1){
        armarArray.push({ "id": element.value});
    } else {
        var indice = armarArray.indexOf(element.value);
        console.log(indice);
    }
});

console.log(armarArray);
