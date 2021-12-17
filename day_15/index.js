const fs = require('fs');
const util = require('util');
const colors = require('colors');

util.inspect.defaultOptions.maxArrayLength = null;
util.inspect.defaultOptions.breakLength = Infinity;

const fileToRead = process.argv[2] || 'input.txt';

const input = fs.readFileSync(fileToRead).toString().trim()
  .split("\n")
  .map(line => line.split('').map(el => Number(el)));

function renderGrid(grid, fn, name) {
  console.log(name.green)
  console.log('');
  console.log('h:', grid.length);
  console.log('w:', grid[0].length);
  console.log('');

  console.log('  ', new Array(grid[0].length).fill(0).map((_, x) => x.toString().padStart(2,0)).join(' ').yellow)


  grid.forEach((row, y) => {
    console.log(y.toString().padStart(2, 0).yellow, row.map((el, x) => {
      return fn(el, x, y, row, grid);
    }).join('  '))
  });

  console.log("");
  console.log(("").padStart(26, "=").green);
  console.log("");

  return grid;
}

function partOne() {
  renderGrid(input, el => el, "Initial");
}

function partTwo() {
}

console.log(partOne());
console.log(partTwo());
