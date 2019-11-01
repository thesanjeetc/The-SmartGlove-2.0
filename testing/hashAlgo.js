let message = "hello there";

const stringToBinary = string => {
  let abc = Array.from(string)
    .map(each => each.charCodeAt(0).toString(2))
    .join("");
  console.log("TCL: abc", abc);
  return abc;
};

const addPadding = bin => {
  let newBin = bin.concat("1");
  console.log("TCL: bin", bin);
};

let a = stringToBinary(message);
addPadding(a);
