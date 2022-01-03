const fs = require('fs');
const util = require('util');
const colors = require('colors');

util.inspect.defaultOptions.maxArrayLength = null;
util.inspect.defaultOptions.breakLength = Infinity;


const fileToRead = process.argv[2] || 'input.txt';

const ENABLE_PROD_LOG = false;
const log = (...args) => (ENABLE_PROD_LOG || (fileToRead !== 'input.txt')) && console.log(...args);
const plog = (...args) => fileToRead === 'input.txt' && console.log(...args);

function renderGrid(grid, name = "", fn = i=>i) {
  log(name.green)
  log('');
  log('h:', grid.length);
  log('w:', grid[0].length);
  log('');

  log('  ', new Array(grid[0].length).fill(0).map((_, x) => x.toString().padStart(2,0)).join(' ').yellow)


  grid.forEach((row, y) => {
    log(y.toString().padStart(2, 0).yellow, row.map((el, x) => {
      return fn(el, x, y, row, grid);
    }).join('  '))
  });

  log("");
  log(("").padStart(26, "=").green);
  log("");

  return grid;
}


function gridMap(grid, fn) {
  return grid.map((row, y) => 
    row.map((el, x) => {
      return fn({ el, x, y, row, grid });
    })
  );
}

const input = fs.readFileSync(fileToRead)
  .toString()
  .trim()
  .split("\n\n")

const algorithm = input[0].split('').map(e => e === '#' ? 1 : 0);
const inputImage = input[1].split("\n").map(row => row.split(""));

const renderFn = i => i == 1 ? '#'.yellow : '.'.grey;

let valueOfRest = 0;

function setValueOfRest () {
  let binary = new Array(9).fill(valueOfRest).join('');

  console.log(binary);
  const valueIndex = parseInt(binary, 2);
  console.log(valueIndex);

  valueOfRest = algorithm[valueIndex];
}

const neighbours = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 0],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1]
];

function step(grid) {
  let newGrid = [];

  for(let y = -1; y < grid.length + 1; y++) {
    let newRow = [];

    for(let x = -1; x < grid[0].length + 1; x++) {
      const valueIndex = parseInt(neighbours.map( ([nY, nX]) => {
        if(grid[y + nY] && grid[y + nY][x + nX] !== undefined) return grid[y + nY][x + nX];

        return valueOfRest;
      }).join(''), 2);

      newRow.push(algorithm[valueIndex])
    }

    newGrid.push(newRow);
  }

  setValueOfRest();

  return newGrid;
}

function partOne() {
  const bGrid = gridMap(inputImage, i => i.el ===  '#' ? 1 : 0);

  let a = step(bGrid);
  renderGrid(a, "a", renderFn)

  let b = step(a);
  renderGrid(b, "b", renderFn)

  let score = 0;

  gridMap(b, item => { if(item.el == 1) { score +=1; } })

  return score;
}

function partTwo() {
  let grid = gridMap(inputImage, i => i.el ===  '#' ? 1 : 0);

  for(let i = 0; i < 50; i++) {
    grid = step(grid);
  }


  let score = 0;

  gridMap(grid, item => { if(item.el == 1) { score +=1; } })

  return score;
}


console.log(partOne());
console.log(partTwo());
