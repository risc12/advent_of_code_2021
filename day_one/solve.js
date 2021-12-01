const fs = require('fs');

const array = fs.readFileSync('input.txt').toString().split("\n").map(el => parseInt(el));

// https://adventofcode.com/2021/day/1
function partOne() {
  const increasedElements = array.map((el, index, array) => {
    if(index === 0)  return false;

    const prev = array[index - 1];

    return el > prev;
  })

  const amountOfIncreasedElements = increasedElements.filter(el => el).length;

  console.log(amountOfIncreasedElements);
}

// https://adventofcode.com/2021/day/1#part2
function partTwo() {

}
