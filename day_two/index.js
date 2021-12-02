const fs = require('fs');

const fileToRead = process.argv[2] || './input.txt';

const inputArray = fs.readFileSync(fileToRead).toString().split("\n")

// https://adventofcode.com/2021/day/2
function partOne() {
  let horizontal = 0;
  let depth = 0;

  const commands = {
    forward: x => horizontal = horizontal + x,
    down: x => depth = depth + x,
    up: x => depth = depth - x,
  };

  inputArray.forEach(input => {
    if(!input) return;

    const [command, amount] = input.split(' ');

    commands[command](parseInt(amount));
  });

  return horizontal * depth;
}

// https://adventofcode.com/2021/day/2#part2
function partTwo() {
}

console.log(partOne());
