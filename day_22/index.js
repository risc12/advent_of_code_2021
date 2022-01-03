const fs = require('fs');
const util = require('util');
const colors = require('colors');

util.inspect.defaultOptions.maxArrayLength = null;
util.inspect.defaultOptions.breakLength = Infinity;

const fileToRead = process.argv[2] || 'input.txt';

const ENABLE_PROD_LOG = false;
const log = (...args) => (ENABLE_PROD_LOG || (fileToRead !== 'input.txt')) && console.log(...args);
const plog = (...args) => fileToRead === 'input.txt' && console.log(...args);

function isFullyWithinRange(x, y, z) {
  let xInRange = (x[0] >= -50 && x[1] <= 50);
  let yInRange = (y[0] >= -50 && y[1] <= 50);
  let zInRange = (z[0] >= -50 && z[1] <= 50);

  return xInRange && yInRange && zInRange;
}

const input = fs.readFileSync(fileToRead)
  .toString()
  .trim()
  .split("\n")
  .map(line => {
    const [command, coordinates] = line.split(' ');

    const [x,y,z] = coordinates
      .split(',')
      .map(range =>
        range
          .split('=')[1]
          .split('..')
          .map(Number)
      );

    return {
      command,
      coordinates: {x, y, z}
    };
  });

function createGrid() {
  const grid = [];

  for (let x = 0; x < 101; x++) {
    grid[x] = [];
    for (let y = 0; y < 101; y++) {
      grid[x][y] = [];
      for (let z = 0; z < 101; z++) {
        grid[x][y][z] = false;
      }
    }
  }

  return grid;
}

function getScore(grid) {
  let score = 0;

  for (let x = 0; x < 101; x++) {
    for (let y = 0; y < 101; y++) {
      for (let z = 0; z < 101; z++) {
        if(grid[x][y][z]) score++;
      }
    }
  }

  return score;
}

function partOne() {
  input.forEach(line => {
    console.log(line.command);
    console.log(line.coordinates);
    console.log("--------------");
  })

  const filteredInput = input
    .filter(({ coordinates }) =>
      isFullyWithinRange(coordinates.x, coordinates.y, coordinates.z)
    );

  let grid = createGrid();

  let safeSet = (x, y, z, value) => {
    if(grid[x+50] && grid[x+50][y+50] && grid[x+50][y+50][z+50] !== undefined) {
      grid[x+50][y+50][z+50] = value;
    }
  }

  let commands = {
    on : (x,y,z) => safeSet(x, y, z, true),
    off: (x,y,z) => safeSet(x, y, z, false) 
  };

  filteredInput.forEach(line => {
    const {command, coordinates} = line;
    const {x, y, z} = coordinates;

    for(let xi = x[0]; xi <= x[1]; xi++) {
      for(let yi = y[0]; yi <= y[1]; yi++) {
        for(let zi = z[0]; zi <= z[1]; zi++) {
          commands[command](xi, yi, zi);
        }
      }
    }
  });

  return getScore(grid);
}

function partTwo() {
}


console.log(partOne());
console.log(partTwo());
