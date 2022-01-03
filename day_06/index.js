const fs = require('fs');
const util = require('util');

util.inspect.defaultOptions.maxArrayLength = null;
util.inspect.defaultOptions.breakLength = Infinity;

const fileToRead = process.argv[2] || './input.txt';

const inputArray = [7];// fs.readFileSync(fileToRead).toString().split(",").filter(e => e).map(e => Number(e));



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


function f(t) {
  return t<=0
    ? 1
    : f(t-7)+f(t-9)
}

function d(t) {
  return (Math.pow(2, t/7) - Math.pow(2, t/9)) 
}

/*

f(70) = f(70-7) + f(70-9)




 */

function partOne() {
  // return [
  //   solve(80),
  //   efficientSolve(80)
  // ]

  let sol = [];

  for(let t=0; t < 101; t++) {
    let out = efficientSolve(t);
    let direct = d(t);
    let delta = out - direct;

    sol.push({ out, direct, delta  });

  }

  console.table(sol);
}

function partTwo() {
  return efficientSolve(256)
}

console.log(partOne());
console.log(partTwo());
