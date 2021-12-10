const fs = require('fs');
const util = require('util');
util.inspect.defaultOptions.maxArrayLength = null;
util.inspect.defaultOptions.breakLength = Infinity;

const fileToRead = process.argv[2] || './input.txt';

const inputArray = fs.readFileSync(fileToRead).toString().split(",").map(Number).sort();

function triangularNumber(n) {
  return n * (n + 1) / 2;
}

function findLowestValue(arr, pricingFn = i => i) {
  let lowestValue = Infinity;

  for (let el = arr[0]; el < arr[arr.length - 1] + 1; el++) {
    const cost = arr.reduce((acc, p) => {
      const distance = Math.abs(p - el);

      const price = pricingFn(distance);

      return acc + price;
    }, 0);

    if(cost < lowestValue) {
      lowestValue = cost;
    }
  }

  return lowestValue;
}

// Example answer is 37
function partOne() {
  return findLowestValue(inputArray);
}

// Example answer is 168
function partTwo() {
  return findLowestValue(inputArray, triangularNumber);
}

console.log(partOne());
console.log(partTwo());
