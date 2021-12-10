const fs = require('fs');
const util = require('util');
const colors = require('colors');

util.inspect.defaultOptions.maxArrayLength = null;
util.inspect.defaultOptions.breakLength = Infinity;

const fileToRead = process.argv[2] || 'input.txt';

const inputArray = fs.readFileSync(fileToRead).toString().trim().split("\n")

let pairs = {
  "(": ")",
  "{": "}",
  "[": "]",
  "<": ">",
}

let openers = Object.keys(pairs);



class ValidationError extends Error {
  constructor(message, token) {
    super(message);
    this.name = "ValidationError";
    this.token = token;
  }
}

function processLine(line) {
  console.log('-->');
  let stack = [];

  let peek = () => stack[stack.length - 1];

  line.split("").forEach((character, index, arr) => {
    console.log('  ',
      arr.map((c,i) => i==index?c.brightYellow:c).join(' '),
      "|".blue,
      openers.includes(character) ? character : pairs[peek()],
      "|".blue,
      stack.join(" ")
    );

    if (openers.includes(character)) {
      stack.push(character);
    } else if (pairs[peek()] === character)  {
      stack.pop();
    } else {
      throw new ValidationError('Invalid ' + character, character)
    }
  })

  return stack;
}

function partOne() {
  let scores = {
    ")": 3,
    "]": 57,
    "}": 1197,
    ">": 25137,
  }

  return inputArray
    .map((line, index) =>  {
      try {
        processLine(line)
      } catch (e) {
        console.log('~~', index, e.token);
        return scores[e.token];
      }
    })
    .filter(i => i)
    .reduce((acc, el) => acc + el, 0)
}

function partTwo() {
  let scores = {
    ")": 1,
    "]": 2,
    "}": 3,
    ">": 4,
  }

  let outcomes = inputArray
    .map((line) =>  {
      try {
        const autocomplete = processLine(line)
        return autocomplete.reverse();
      } catch (e) {}
    })
    .filter(i => i)
    .map(completions => 
      completions
        .map(c => scores[pairs[c]])
        .reduce((acc, el) => (acc * 5) + el, 0)
    )

  console.log("=============================");
  console.log(outcomes.sort((a, b) => a - b));
  console.log("=============================");

  return outcomes[(outcomes.length -1 )/2]
}

console.log(partOne());
console.log(partTwo());
