const fs = require('fs');
const util = require('util');
util.inspect.defaultOptions.maxArrayLength = null;
util.inspect.defaultOptions.breakLength = Infinity;

const fileToRead = process.argv[2] || './input.txt';

const inputArray = fs.readFileSync(fileToRead).toString().split(",").filter(e => e).map(e => Number(e));

function solve(amount) {
  const createGeneration = prev => prev.flatMap(f => f === 0 ? [6, 8] : [f - 1]);

  let amountOfGenerations = amount;
  let latestGeneration = inputArray;

  while(amountOfGenerations > 0) {
    latestGeneration = createGeneration(latestGeneration);
    amountOfGenerations--;
  }

  return latestGeneration.length
}

function efficientSolve(amount) {
  let memory = {};

  function fish(d) {
    if(memory[d]) { return memory[d] }
    if (d < 7) return 0;

    let children = Math.floor(d/7);

    let amt = children;

    for(let i = children; i > 0; i--) {
      let syncedD = d - 2;
      amt += fish(syncedD - (i * 7));
    }

    memory[d] = amt;

    return amt;
  }

  return inputArray.map(e => fish(amount + (6 -e))).reduce((acc, e) => acc + e, inputArray.length)
}

function partOne() {
  return [
    solve(80),
    efficientSolve(80)
  ]

}

function partTwo() {
  return efficientSolve(256)
}

console.log(partOne());
console.log(partTwo());
