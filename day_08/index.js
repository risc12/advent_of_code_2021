const fs = require('fs');
const util = require('util');
util.inspect.defaultOptions.maxArrayLength = null;
util.inspect.defaultOptions.breakLength = Infinity;

/*

  0:      1:      2:      3:      4:
 aaaa    ....    aaaa    aaaa    ....
b    c  .    c  .    c  .    c  b    c
b    c  .    c  .    c  .    c  b    c
 ....    ....    dddd    dddd    dddd
e    f  .    f  e    .  .    f  .    f
e    f  .    f  e    .  .    f  .    f
 gggg    ....    gggg    gggg    ....

  5:      6:      7:      8:      9:
 aaaa    aaaa    aaaa    aaaa    aaaa
b    .  b    .  .    c  b    c  b    c
b    .  b    .  .    c  b    c  b    c
 dddd    dddd    ....    dddd    dddd
.    f  e    f  .    f  e    f  .    f
.    f  e    f  .    f  e    f  .    f
 gggg    gggg    ....    gggg    gggg

0: 1, 7
1: 1
2: 
3: 1, 7
4: 1
5: 
6: 5
7: 1,
8: 8,
9: 5, 4, 3
*/

const encoded = [
  'abcefg', // 0: 6
  'cf',     // 1: 2
  'acdeg',  // 2: 5
  'acdfg',  // 3: 5
  'bcdf',   // 4: 4
  'abdfg',  // 5: 5
  'abdefg', // 6: 6
  'acf',    // 7: 3
  'abcdefg',// 8: 7
  'abcdfg', // 9: 6
];

const fileToRead = process.argv[2] || './input.txt';

const inputArray = fs.readFileSync(fileToRead).toString().trim().split("\n")
  .map(line => {
    const [patterns, output] =  line.split(' | ');
    return { patterns: patterns.split(' '), output: output.split(' ') };
  });

function partOne() {
  const lengths = [
    encoded[1].length,
    encoded[4].length,
    encoded[7].length,
    encoded[8].length,
  ];

  const isSimpleValue = value => lengths.indexOf(value.length) > -1;

  return inputArray.reduce((acc, {output}) => {
    const amountOfSimpleValues = output
      .filter(isSimpleValue)
      .length

    return acc + amountOfSimpleValues;
  }, 0)
}

function solveLine(line) {
  const knowns = {};

  const theSet = (set) => ({
    hasSubset : subset => subset.split('').every(segment => set.split('').indexOf(segment) > -1)
  });

  const determine = value => {
    switch(value.length) {
      case 2:
        return 1;
      case 3:
        return 7;
      case 4:
        return 4;
      case 5:
        if(theSet(value).hasSubset(knowns[1])) return 3
        if(theSet(knowns[9]).hasSubset(value)) return 5

        return 2;
      case 6:
        if(theSet(value).hasSubset(knowns[4])) return 9
        if(theSet(value).hasSubset(knowns[1])) return 0

        return 6
      case 7:
        return 8;
    }
  }

  const identify = value => {
    const outcome = determine(value);
    knowns[outcome] = value;

    return outcome;
  };

  [2, 3, 4, 7, 6, 5].forEach(length => {
    line.patterns
      .filter(el => el.length === length)
      .forEach(el => identify(el))
  });

  return parseInt(line.output.map(el => identify(el)).reduce((acc, el) => acc + el, ''))
}

function partTwo() {
  return inputArray.reduce((acc, line) => acc + solveLine(line), 0);
}

console.log(partOne());
console.log(partTwo());
