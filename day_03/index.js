const fs = require('fs');

const fileToRead = process.argv[2] || './input.txt';

const inputArray = fs.readFileSync(fileToRead).toString().split("\n")


function getBitCount(arr) {
  const bitCount = [];

  arr.forEach(el => {
    const bits = el.split('');

    bits.forEach((b, index) => {
      const bit = parseInt(b);

      bitCount[index] = bitCount[index] || {};
      bitCount[index][bit] = bitCount[index][bit] || 0;
      bitCount[index][bit]++;

      if(bitCount[index][0] === bitCount[index][1]) {
        bitCount[index].sig = undefined;
        bitCount[index].eq = true;
      } else if(bitCount[index][0] > bitCount[index][1]) {
        bitCount[index].sig = 0;
        bitCount[index].eq = false;
      } else {
        bitCount[index].sig = 1;
        bitCount[index].eq = false;
      }
    });
  })

  return bitCount;
}

// https://adventofcode.com/2021/day/3
function partOne() {
  const bitCount = getBitCount(inputArray);

  const gammaBinary = [];
  const epsilonBinary = [];

  bitCount.forEach((count) => {
    gammaBinary.push(count.sig);
    epsilonBinary.push(1 - count.sig);
  });

  return parseInt(gammaBinary.join(''), 2) * parseInt(epsilonBinary.join('') , 2);
}



// https://adventofcode.com/2021/day/3#part2
function partTwo() {
  function looper(arr, equality) {
    let numbers = arr;

    for(i = 0; i < arr[0].length; i++) {
      const bitCount = getBitCount(numbers);
      const toKeep = equality(bitCount[i].eq, bitCount[i].sig);

      numbers = numbers.filter(el => el[i] === toKeep.toString());

      if(numbers.length === 1) return numbers;
    }

    return numbers;
  }

  function getOxygen() {
    return looper(inputArray, (eq, sig) => eq ? 1 : sig)
  }

  function getCo2() {
    return looper(inputArray, (eq, sig) => eq ? 0 : 1 - sig)
  }

  const oxygen = parseInt(getOxygen(), 2)
  const co2 = parseInt(getCo2(), 2)

  return oxygen * co2;
}

console.log(partOne());
console.log(partTwo());
