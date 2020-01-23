let message = "hello there";

let A = 0x67452301;
let B = 0xefcdab89;
let C = 0x98badcfe;
let D = 0x10325476;

// prettier-ignore
let S = [7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 5,  9, 14, 20, 5,  9, 14, 20, 5,  9, 14, 20, 5,  9, 14, 20, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21]

let T = [];
for (i = 0; i <= 63; i++) {
  T[i] = Math.floor(2 ** 32 * Math.abs(Math.sin(i + 1)));
}

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

let func = [F, G, H, I]

// console.log(I(0, 0, 0));

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

  let M = [];
  for (i = 0; i <= binMessage.length / 32 - 1; i++) {
    M[i] = binMessage.slice(i * 32, i * 32 + 31);
  }

  for (let i = 0; i < 16; i++) {
    let AA = A;
    let BB = B;
    let CC = C;
    let DD = D;

    AA = BB + ((AA + func[round](BB,CC,DD) + M[k] + S[round*16 + i]) <<< S[n]);
    DD = AA + ((DD + F(AA,BB,CC) + M[k] + T[i]) <<< S[n]);
    CC = DD + ((CC + F(DD,AA,BB) + M[k] + T[i]) <<< S[n]);
    BB = CC + ((BB + F(CC,DD,AA) + M[k] + T[i]) <<< S[n]);
    for(let round = 0;round < 4; round ++){
      for(let x = 0;x < 4; x ++){
        AA = BB + ((AA + func[round](BB,CC,DD) + M[k] + S[round][x % 4]) <<< S[n]);
        DD = AA + ((DD + func[round](AA,BB,CC) + M[k] + T[i]) <<< S[n]);
        CC = DD + ((CC + func[round](DD,AA,BB) + M[k] + T[i]) <<< S[n]);
        BB = CC + ((BB + func[round](CC,DD,AA) + M[k] + T[i]) <<< S[n]);
      }
    }

    for(let i = 0; i < 64; i++){
      let g;
      if(i < 16){
        N = F(BB, CC, DD)
        g = i
      }else if(i < 32){
        N = G(BB, CC, DD)
        g = (5*i + 1) % 16
      }else if(i < 48){
        N = H(BB, CC, DD)
        g = (3*i + 5) % 16
      }else if(i < 64){
        N = I(BB, CC, DD)
        g = (7*i) % 16
      }

      let temp = DD
      DD = CC
      CC = BB
      BB = BB + leftrotate((AA + N + T[i] + M[g]), S[i])
      AA = temp 
    }

    A = A + AA
    B = B + BB
    C = C + CC
    D = D + DD
  }

  const leftrotate = (x, c) => {
    return (x << c)
  }

  console.log(M.length);

  // a = b + ((a + F(b, c, d) + X[k] + T[i]) << S[s]);
};

md5hash(message);
