const fs = require('fs');
const util = require('util');
const colors = require('colors');

util.inspect.defaultOptions.maxArrayLength = null;
util.inspect.defaultOptions.breakLength = Infinity;

const fileToRead = process.argv[2] || 'input.txt';

const ENABLE_PROD_LOG = false;
const log = (...args) => (ENABLE_PROD_LOG || (fileToRead !== 'input.txt')) && console.log(...args);
const plog = (...args) => fileToRead === 'input.txt' && console.log(...args);

const input = fs.readFileSync(fileToRead)
  .toString()
  .trim()


const layout = [
"#############".split(""),
"#...........#".split(""),
"###.#.#.#.###".split(""),
"  #.#.#.#.#  ".split(""),
"  #########  ".split(""),
]

const renderMap = map => {
  const mapString = map.map((row,y) => row.map((b,x) => {
    
    if(b === '#') return '█'.blue;
    if(b === '.') return '░'.grey;
    if(b === 'A') {
      if(y > 1 && x === 3) return ' A '.green;
      return 'A'.red;
    }
    if(b === 'B') {
      if(y > 1 && x === 5) return 'B'.green;
      return 'B'.red;
    }
    if(b === 'C') {
      if(y > 1 && x === 7) return 'C'.green;
      return 'C'.red;
    }
    if(b === 'D') {
      if(y > 1 && x === 9) return 'D'.green;
      return 'D'.red;
    }

    return ' ';

  }).join("")).join("\n");

  console.log(mapString);
}

const enerygyByType = {
  A: 1,
  B: 10,
  C: 100,
  D: 1000,
};

function partOne() {
  console.log(input)
  console.log(layout)

  renderMap(layout);
}

function partTwo() {
}


console.log(partOne());
console.log(partTwo());
