const esprima = require('esprima');
var source = 'answer = 42; hola = 5; isCold = "Si"; answer = 50;';
//const source = require('browserify');
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

identificadores.forEach(function (element) {
    var indice = arrayObjectIndexOf(armarArray,element.value, "id");
    if(indice == -1){ // No encontró el identificador, lo agrega.
        armarArray.push(new Identifier(element.value,1));
    } else { // Encontró el identificador, suma uno.
        armarArray[indice].quantity++;
    }
});

console.log("El array de Identificadores es: ");
console.log(armarArray);

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
/*
const d3 = require('d3');
const D3Node = require('d3-node');
const D3Cloud = require('d3-cloud');

const d3n = new D3Node();
d3n.createSVG(100,100)
    .append("circle")
    .attr("cx", 50)
    .attr("cy", 50)
    .attr("r", 40)
    .style("stroke-width", "3")
    .style("fill", "yellow")
    .style("stroke", "black");
d3n.svgString();
d3n.html();
//console.log(d3n.html());
// create output files
const op = require('./output.js');
const output = new op('circle', d3n);

let tags = [{"key": "Cat", "value": 26}, {"key": "fish", "value": 19}, {"key": "things", "value": 18}, {"key": "look", "value": 16}, {"key": "two", "value": 15}, {"key": "like", "value": 14}, {"key": "hat", "value": 14}, {"key": "Oh", "value": 13}, {"key": "mother", "value": 12}, {"key": "One", "value": 12}, {"key": "Now", "value": 12}, {"key": "Thing", "value": 12}, {"key": "house", "value": 10}, {"key": "fun", "value": 9}, {"key": "know", "value": 9}, {"key": "good", "value": 9}, {"key": "saw", "value": 9}, {"key": "bump", "value": 8}, {"key": "hold", "value": 7}, {"key": "fear", "value": 6}, {"key": "game", "value": 6}, {"key": "play", "value": 6}, {"key": "Sally", "value": 6}, {"key": "wet", "value": 6}, {"key": "little", "value": 6}, {"key": "box", "value": 6}, {"key": "came", "value": 6}, {"key": "away", "value": 6}, {"key": "sit", "value": 5}, {"key": "ran", "value": 5}, {"key": "big", "value": 5}, {"key": "something", "value": 5}, {"key": "put", "value": 5}, {"key": "fast", "value": 5}, {"key": "go", "value": 5}, {"key": "ball", "value": 5}, {"key": "pot", "value": 5}, {"key": "show", "value": 4}, {"key": "cup", "value": 4}, {"key": "get", "value": 4}, {"key": "cake", "value": 4}, {"key": "pick", "value": 4}, {"key": "went", "value": 4}, {"key": "toy", "value": 4}, {"key": "ship", "value": 4}, {"key": "net", "value": 4}, {"key": "tell", "value": 4}, {"key": "fan", "value": 4}, {"key": "wish", "value": 4}, {"key": "day", "value": 4}, {"key": "new", "value": 4}, {"key": "tricks", "value": 4}, {"key": "way", "value": 4}, {"key": "sat", "value": 4}, {"key": "books", "value": 3}, {"key": "hook", "value": 3}, {"key": "mess", "value": 3}, {"key": "kites", "value": 3}, {"key": "rake", "value": 3}, {"key": "red", "value": 3}, {"key": "shame", "value": 3}, {"key": "bit", "value": 3}, {"key": "hands", "value": 3}, {"key": "gown", "value": 3}, {"key": "call", "value": 3}, {"key": "cold", "value": 3}, {"key": "fall", "value": 3}, {"key": "milk", "value": 3}, {"key": "shook", "value": 3}, {"key": "tame", "value": 2}, {"key": "deep", "value": 2}, {"key": "Sank", "value": 2}, {"key": "head", "value": 2}, {"key": "back", "value": 2}, {"key": "fell", "value": 2}, {"key": "hop", "value": 2}, {"key": "shut", "value": 2}, {"key": "dish", "value": 2}, {"key": "trick", "value": 2}, {"key": "take", "value": 2}, {"key": "tip", "value": 2}, {"key": "top", "value": 2}, {"key": "see", "value": 2}, {"key": "let", "value": 2}, {"key": "shake", "value": 2}, {"key": "bad", "value": 2}, {"key": "another", "value": 2}, {"key": "come", "value": 2}, {"key": "fly", "value": 2}, {"key": "want", "value": 2}, {"key": "hall", "value": 2}, {"key": "wall", "value": 2}, {"key": "Thump", "value": 2}, {"key": "Make", "value": 2}, {"key": "lot", "value": 2}, {"key": "hear", "value": 2}, {"key": "find", "value": 2}, {"key": "lots", "value": 2}, {"key": "bet", "value": 2}, {"key": "dear", "value": 2}, {"key": "looked", "value": 2}, {"key": "gone", "value": 2}, {"key": "sun", "value": 2}, {"key": "asked", "value": 1}, {"key": "shine", "value": 1}, {"key": "mind", "value": 1}, {"key": "bite", "value": 1}, {"key": "step", "value": 1}, {"key": "mat", "value": 1}, {"key": "gave", "value": 1}, {"key": "pat", "value": 1}, {"key": "bent", "value": 1}, {"key": "funny", "value": 1}, {"key": "give", "value": 1}, {"key": "games", "value": 1}, {"key": "high", "value": 1}, {"key": "hit", "value": 1}, {"key": "run", "value": 1}, {"key": "stand", "value": 1}, {"key": "fox", "value": 1}, {"key": "man", "value": 1}, {"key": "string", "value": 1}, {"key": "kit", "value": 1}, {"key": "Mothers", "value": 1}, {"key": "tail", "value": 1}, {"key": "dots", "value": 1}, {"key": "pink", "value": 1}, {"key": "white", "value": 1}, {"key": "kite", "value": 1}, {"key": "bed", "value": 1}, {"key": "bumps", "value": 1}, {"key": "jumps", "value": 1}, {"key": "kicks", "value": 1}, {"key": "hops", "value": 1}, {"key": "thumps", "value": 1}, {"key": "kinds", "value": 1}, {"key": "book", "value": 1}, {"key": "home", "value": 1}, {"key": "wood", "value": 1}, {"key": "hand", "value": 1}, {"key": "near", "value": 1}, {"key": "Think", "value": 1}, {"key": "rid", "value": 1}, {"key": "made", "value": 1}, {"key": "jump", "value": 1}, {"key": "yet", "value": 1}, {"key": "PLOP", "value": 1}, {"key": "last", "value": 1}, {"key": "stop", "value": 1}, {"key": "pack", "value": 1}, {"key": "nothing", "value": 1}, {"key": "got", "value": 1}, {"key": "sad", "value": 1}, {"key": "kind", "value": 1}, {"key": "fishHe", "value": 1}, {"key": "sunny", "value": 1}, {"key": "Yes", "value": 1}, {"key": "bow", "value": 1}, {"key": "tall", "value": 1}, {"key": "always", "value": 1}, {"key": "playthings", "value": 1}, {"key": "picked", "value": 1}, {"key": "strings", "value": 1}, {"key": "Well", "value": 1}, {"key": "lit", "value": 1}];

var w = 1024,
    h = 1024;

const d3nWC = new D3Node();
d3nWC.createSVG(w,h).append("svg");
const wordcloud = new D3Cloud();
var frequency_list = [{"text":"study","size":40},{"text":"motion","size":15},{"text":"forces","size":10},{"text":"electricity","size":15},{"text":"movement","size":10},{"text":"relation","size":5},{"text":"things","size":10},{"text":"force","size":5},{"text":"ad","size":5},{"text":"energy","size":85},{"text":"living","size":5},{"text":"nonliving","size":5},{"text":"laws","size":15},{"text":"speed","size":45},{"text":"velocity","size":30},{"text":"define","size":5},{"text":"constraints","size":5},{"text":"universe","size":10},{"text":"physics","size":120},{"text":"describing","size":5},{"text":"matter","size":90},{"text":"physics-the","size":5},{"text":"world","size":10},{"text":"works","size":10},{"text":"science","size":70},{"text":"interactions","size":30},{"text":"studies","size":5},{"text":"properties","size":45},{"text":"nature","size":40},{"text":"branch","size":30},{"text":"concerned","size":25},{"text":"source","size":40},{"text":"google","size":10},{"text":"defintions","size":5},{"text":"two","size":15},{"text":"grouped","size":15},{"text":"traditional","size":15},{"text":"fields","size":15},{"text":"acoustics","size":15},{"text":"optics","size":15},{"text":"mechanics","size":20},{"text":"thermodynamics","size":15},{"text":"electromagnetism","size":15},{"text":"modern","size":15},{"text":"extensions","size":15},{"text":"thefreedictionary","size":15},{"text":"interaction","size":15},{"text":"org","size":25},{"text":"answers","size":5},{"text":"natural","size":15},{"text":"objects","size":5},{"text":"treats","size":10},{"text":"acting","size":5},{"text":"department","size":5},{"text":"gravitation","size":5},{"text":"heat","size":10},{"text":"light","size":10},{"text":"magnetism","size":10},{"text":"modify","size":5},{"text":"general","size":10},{"text":"bodies","size":5},{"text":"philosophy","size":5},{"text":"brainyquote","size":5},{"text":"words","size":5},{"text":"ph","size":5},{"text":"html","size":5},{"text":"lrl","size":5},{"text":"zgzmeylfwuy","size":5},{"text":"subject","size":5},{"text":"distinguished","size":5},{"text":"chemistry","size":5},{"text":"biology","size":5},{"text":"includes","size":5},{"text":"radiation","size":5},{"text":"sound","size":5},{"text":"structure","size":5},{"text":"atoms","size":5},{"text":"including","size":10},{"text":"atomic","size":10},{"text":"nuclear","size":10},{"text":"cryogenics","size":10},{"text":"solid-state","size":10},{"text":"particle","size":10},{"text":"plasma","size":10},{"text":"deals","size":5},{"text":"merriam-webster","size":5},{"text":"dictionary","size":10},{"text":"analysis","size":5},{"text":"conducted","size":5},{"text":"order","size":5},{"text":"understand","size":5},{"text":"behaves","size":5},{"text":"en","size":5},{"text":"wikipedia","size":5},{"text":"wiki","size":5},{"text":"physics-","size":5},{"text":"physical","size":5},{"text":"behaviour","size":5},{"text":"collinsdictionary","size":5},{"text":"english","size":5},{"text":"time","size":35},{"text":"distance","size":35},{"text":"wheels","size":5},{"text":"revelations","size":5},{"text":"minute","size":5},{"text":"acceleration","size":20},{"text":"torque","size":5},{"text":"wheel","size":5},{"text":"rotations","size":5},{"text":"resistance","size":5},{"text":"momentum","size":5},{"text":"measure","size":10},{"text":"direction","size":10},{"text":"car","size":5},{"text":"add","size":5},{"text":"traveled","size":5},{"text":"weight","size":5},{"text":"electrical","size":5},{"text":"power","size":5}];
wordcloud.size([800,300]).words(frequency_list).rotate(0).fontSize(function (d) {
    return d.size();
}).on("end", draw).start();

function draw(words) {
    d3.select("body").append("svg")
        .attr("width", 850)
        .attr("height", 350)
        .attr("class", "wordcloud")
        .append("g")
        // without the transform, words words would get cutoff to the left and top, they would
        // appear outside of the SVG area
        .attr("transform", "translate(320,200)")
        .selectAll("text")
        .data(words)
        .enter().append("text")
        .style("font-size", function(d) { return d.size + "px"; })
        .style("fill", function(d, i) { return color(i); })
        .attr("transform", function(d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) { return d.text; });
}

function end(tags) { console.log(JSON.stringify(tags)); }
//const outputWC = new op('word-cloud', wordcloud);
*/