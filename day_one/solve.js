const fs = require('fs');

const fileToRead = process.argv[2] || 'input.txt';

const inputArray = fs.readFileSync(fileToRead).toString().split("\n").map(el => parseInt(el));

function getAmountOfIncreasedElements(array) {
  let amountOfIncreases = 0;

  array.forEach((element, index, array) => {
    if(index === 0)  return false;

    const prev = array[index - 1];

    if(element > prev) amountOfIncreases++;
  })

  return amountOfIncreases;
}

// https://adventofcode.com/2021/day/1
function partOne() {
  return getAmountOfIncreasedElements(inputArray);
}

// https://adventofcode.com/2021/day/1#part2
function partTwo() {
  const sumOfSlidingWindows = inputArray
    .map((element, index, array) => {
      const nextElement = array[index + 1];
      const elementAfterThat = array[index + 2];

      const isSlidingWindowPossible = nextElement && elementAfterThat;

      if(!isSlidingWindowPossible) return undefined;

      return element + nextElement + elementAfterThat;
    })

  return getAmountOfIncreasedElements(sumOfSlidingWindows);
}

console.log(partOne());
console.log(partTwo());
