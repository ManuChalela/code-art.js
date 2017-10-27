var person = {
  firstName: "John",
  lastName: "Doe",
  fullName: function() {
    return this.firstName + " " + this.lastName;
  }
}
var myObject = {
  firstName: "Mary",
  lastName: "Doe",
}
person.fullName.call(myObject); // Will return "Mary Doe"

function local() {
  var full = person.fullName.call(myObject);
  anonymous();
}

function anonymous() {
  var anonymous1 = 1;
}
