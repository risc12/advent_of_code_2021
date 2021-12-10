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
  let horizontal = 0;
  let depth = 0;
  let aim = 0;

  const commands = {
    forward: x => {
      horizontal = horizontal + x;
      depth = depth + (aim * x)

    },
    down: x => aim = aim + x,
    up: x => aim = aim - x,
  };

  inputArray.forEach(input => {
    if(!input) return;

    const [command, amount] = input.split(' ');

    commands[command](parseInt(amount));
  });

  return horizontal * depth;
}

console.log(partOne());
console.log(partTwo());
