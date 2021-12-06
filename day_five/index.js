const fs = require('fs');
const util = require('util');
util.inspect.defaultOptions.maxArrayLength = null;
util.inspect.defaultOptions.breakLength = Infinity;

const fileToRead = process.argv[2] || './input.txt';

const inputArray = fs.readFileSync(fileToRead).toString().split("\n")

let maxX = 0;
let maxY = 0;

class Line {
  constructor(i, s, e) {
    this.id = i;
    this.start = s;
    this.end = e;

    const dX = e[0] - s[0];
    const dY = e[1] - s[1];

    this.slopeY = Math.sign(dY);
    this.slopeX = Math.sign(dX);
  }
}

const lines = inputArray
  .filter(e => e)
  .map(e => e
    .split('->')
    .map(coord => coord
      .split(',')
      .map((el, i) => {
        const n = Number(el)
        if (i === 0) {
          maxX = n > maxX ? n : maxX;
        } else {
          maxY = n > maxY ? n : maxY;
        }
        return n;
      }))
  )
  .map(([s, e], i) => new Line(i, s, e))

function drawLine(field, line) {
  let x = line.start[0];
  let y = line.start[1];

  field[y][x] += 1;

  while(x !== line.end[0] || y !== line.end[1]) {
    x += line.slopeX;
    y += line.slopeY;
    field[y][x] += 1;
  }
}

function partOne() {
  let field = Array(maxY + 1).fill().map(() => Array(maxX + 1).fill(0));

  lines
    // Only straight lines
    .filter(line => line.slopeX === 0 || line.slopeY === 0)
    .forEach(line => drawLine(field, line))

  return field.flat().filter(el => el > 1).length;
}

function partTwo() {
  let field = Array(maxY + 1).fill().map(() => Array(maxX + 1).fill(0));

  lines
    .forEach(line => drawLine(field, line))

  return field.flat().filter(el => el > 1).length;
}

console.log(partOne());
console.log(partTwo());
