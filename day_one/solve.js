const fs = require('fs');

const inputArray = fs.readFileSync('input.txt').toString().split("\n").map(el => parseInt(el));

function findIncreasedElements(array) {
  return array.map((element, index, array) => {
    if(index === 0)  return false;

    const prev = array[index - 1];

    return element > prev;
  })

}

// https://adventofcode.com/2021/day/1
function partOne() {
  const increasedElements = findIncreasedElements(inputArray);
  const amountOfIncreasedElements = increasedElements.filter(el => el).length;

  return amountOfIncreasedElements
}

// https://adventofcode.com/2021/day/1#part2
function partTwo() {
  const slidingWindows = inputArray
    .map((element, index, array) => {
      const nextElement = array[index + 1];
      const elementAfterThat = array[index + 2];
      const isSlidingWindowPossible = nextElement && elementAfterThat;

      if(!isSlidingWindowPossible) return undefined;

      return [element, nextElement, elementAfterThat];
    })
    .filter(el => el);

  const sumOfSlidingWindows = slidingWindows.map(element => {
    return element.reduce((acc, curr) => acc + curr);
  });

  const increasedElements = findIncreasedElements(sumOfSlidingWindows);

  const amountOfIncreasedElements = increasedElements.filter(el => el).length;

  return amountOfIncreasedElements;
}

console.log(partTwo())
