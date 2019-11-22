let message = "hello there";

let mdBuffer = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476];

// prettier-ignore
let S = [7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 5,  9, 14, 20, 5,  9, 14, 20, 5,  9, 14, 20, 5,  9, 14, 20, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21]

let T = [];
for (i = 0; i <= 63; i++) {
  T[i] = Math.floor(2 ** 32 * Math.abs(Math.sin(i + 1)));
}

console.log(T);

const F = (x, y, z) => {
  return (x & y) | (~x & z);
};
const G = (x, y, z) => {
  return (x & y) | (y & ~z);
};
const H = (x, y, z) => {
  return x ^ y ^ z;
};
const I = (x, y, z) => {
  return y ^ (x | ~z);
};

console.log(I(0, 0, 0));

const md5hash = message => {
  let binMessage = Array.from(message)
    .map(each => each.charCodeAt(0).toString(2))
    .join("")
    .concat("1");

  let messageLength = binMessage.length - 1;

  while (binMessage.length % 512 != 448) {
    binMessage += "0";
  }

  let lengthBits = messageLength.toString(2);
  while (lengthBits.length != 64) {
    lengthBits = "0" + lengthBits;
  }

  binMessage = binMessage.concat(lengthBits);

  console.log(binMessage.length);

  for (i = 0; i <= binMessage.length / 16 - 1; i++) {
    let X = binMessage.slice(i * 16, i * 16 + 15);
  }

  a = b + ((a + F(b, c, d) + X[k] + T[i]) << S[s]);
};

md5hash(message);
