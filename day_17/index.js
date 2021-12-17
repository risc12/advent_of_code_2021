const fs = require('fs');
const util = require('util');
const colors = require('colors');

util.inspect.defaultOptions.maxArrayLength = null;
util.inspect.defaultOptions.breakLength = Infinity;


const fileToRead = process.argv[2] || 'input.txt';

const log = (...args) => fileToRead !== 'input.txt' && console.log(...args);
const plog = (...args) => fileToRead === 'input.txt' && console.log(...args);

const input = fs.readFileSync(fileToRead)
  .toString()
  .trim()
  .split("\n")[0]
  .split(":")[1]
  .split(", ")
  .map(el => el.split('=')[1])
  .map(el => el.split('..').map(Number))


class Area {
  constructor(xRange, yRange) {
    this.xRange = xRange.sort((a, b) => a - b);
    this.yRange = yRange.sort((a, b) => a - b);
  }

  contains([x, y]) {
    const withinX = this.xRange[0] <= x && this.xRange[1] >= x;
    const withinY = this.yRange[0] <= y && this.yRange[1] >= y;

    return withinX && withinY;
  }
}


class Projectile {
  constructor({ x = 0, y = 0, vx, vy, targetArea }) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;

    this.targetArea = targetArea;
  }

  step() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy -= 1;

    if(this.vx > 0) {
      this.vx  = this.vx-1;
    }

    if(this.vx < 0) {
      this.vx = this.vx + 1;
    }
  }

  get inTarget() {
    return this.targetArea.contains([this.x, this.y]);
  }

  toValue() {
    return {x: this.x, y: this.y, vx: this.vx, vy: this.vy, inTarget: this.inTarget }
  }
}

function tryTrajectory(trajectory, targetArea) {
  let projectile = new Projectile({ vx: trajectory[0], vy: trajectory[1], targetArea });

  let results = [projectile.toValue()];

  let i = 0;

  while(i < 200 && !projectile.inTarget) {
    projectile.step();
    results.push(projectile.toValue())
    i++;
  }

  if (projectile.inTarget) {
    return results;
  }
}

function partOne() {
  console.log(input);

  let top = [];

  const targetArea = new Area(input[0], input[1]);

  for(let x = 200; x > -1; x--) {
    for(let y = 200; y > -10; y--) {
      let results = tryTrajectory([x, y], targetArea);

      if(results) {
        top.push(results.map(r => r.y).sort((a, b) => a - b).pop())
      }
    }
  }

  return top.sort((a, b) => a - b).pop();
}

function partTwo() {
  console.log(input);

  let hits = 0;

  const targetArea = new Area(input[0], input[1]);

  for(let x = 400; x > -1; x--) {
    for(let y = 200; y > -100; y--) {
      let results = tryTrajectory([x, y], targetArea);

      if(results) {
        hits++
      }
    }
  }

  return hits;
}


console.log(partOne());
console.log(partTwo());
