const fs = require('fs');
const util = require('util');
const colors = require('colors');

util.inspect.defaultOptions.maxArrayLength = null;
util.inspect.defaultOptions.breakLength = Infinity;

const fileToRead = process.argv[2] || 'input.txt';

const inputArray = fs.readFileSync(fileToRead).toString().trim().split("\n")
  .map((row, y) => {
    return row.split('').map(v => ({ v: Number(v), f: false }));

  })

const drawGrid = grid => {
  return 
  grid.forEach((row, y) => {
    console.log(y, '|', row.map(e => e.f ? e.v.toString().padStart(2, 0).brightYellow : e.v.toString().padStart(2, 0)).join(' '));
  })
  console.log('-----------------------'.green)
}


const getNeighbours = grid => (x, y) => {
  const neighbours = [
    { x: x - 1, y: y - 1 },
    { x: x, y: y - 1 },
    { x: x + 1, y: y - 1 },
    { x: x - 1, y: y },
    { x: x + 1, y: y },
    { x: x - 1, y: y + 1 },
    { x: x, y: y + 1 },
    { x: x + 1, y: y + 1 },
  ];

  return neighbours.filter(n => {
    return n.x >= 0 && n.x < grid[0].length && n.y >= 0 && n.y < grid.length
  });
}

let amountOfFlashes = 0;
let isSynced = false;

const step = grid => {
  // Step one
  grid.forEach((r, y) => r.forEach((e, x) => grid[y][x] = ({ ...e, v: e.v + 1 }) ));
  console.log('STEP 1');
  drawGrid(grid);

  let toFlash = [];

  // Step two
  grid.forEach((r, y) => {
    r.forEach((e, x) => {
      if (e.v > 9) toFlash.push([x, y])
    })
  });

  console.log('STEP 2');
  drawGrid(grid);

  const flash = (x,y) => {
    if(grid[y][x].f) return;

    grid[y][x].f = true;
    toFlash.push([x, y])

    getNeighbours(grid)(x,y).forEach(({x, y}) => {
      if(toFlash.find(([fx, fy]) => {
        return (fx === x && fy === y)
      })) return;

      const e = grid[y][x];

      e.v = e.v + 1;

      if (e.v > 9) {
        flash(x, y)
      }
    })

    amountOfFlashes++;
    grid[y][x].v = 0;
  }

  toFlash.forEach(([x,y]) => {
    flash(x,y)
  });

  console.log('STEP 3');
  drawGrid(grid);
  // ... Flash the neighbours of the flashed octopusses

  isSynced = grid.flatMap((r) => r).every(el => el.f)

  grid.forEach((r, y) => r.forEach((e, x) => grid[y][x] = ({ ...e, f: e.v > 9 }) ));

  // Step three
  // ... Reset the count of the octopusses that flashed
}


function partOne() {
  for(let s = 1; s <=100; s++) {
    console.log('+++++++++++++++++++++++'.green);
    console.log(`${s}`.magenta);

    step(inputArray);

    console.log(amountOfFlashes);
  }

  return amountOfFlashes;
}

function partTwo() {
  let s = 0;
  while(!isSynced) {
    console.log('+++++++++++++++++++++++'.green);
    console.log(`${s}`.magenta);

    step(inputArray);

    console.log(amountOfFlashes);

    s++;
  }
  
  return s;
}

// console.log(partOne());
console.log(partTwo());
