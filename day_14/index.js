const fs = require('fs');
const util = require('util');
const colors = require('colors');

util.inspect.defaultOptions.maxArrayLength = null;
util.inspect.defaultOptions.breakLength = Infinity;

const compose = (...fns) => fns.reduce((f, g) => (...args) => f(g(...args)));
const repeat = (fn, times) => compose(...(new Array(times).fill(fn)));


const fileToRead = process.argv[2] || 'input.txt';

const input = fs.readFileSync(fileToRead).toString().trim()
  .split("\n")
  .reduce((acc, el, i) => {
    if(el === "") return acc;

    if(i === 0) {
      acc.template = el;
    } else {
      const rule = el.split(" -> ");
      acc.rules[rule[0]] = rule[1];
    }

    return acc;
  },  { rules: {}, template: '' })

  const count = arr => arr
    .reduce((els, e) => {
      els[e] = els[e] || 0;
      els[e]++;

      return els;
    }, {})

const sortByValue = obj =>
  Object
    .entries(obj)
    .sort((a, b) => b[1] - a[1]);

const calculateScore = arr => arr[0][1] - arr[arr.length - 1][1]

const getAnswer = polymer => {
  const counts = count(polymer);
  const scores = sortByValue(counts);
  const score = calculateScore(scores);

  return score;
}

function doStepSlow(arr, rules){
  return arr
    .flatMap((el, i, arr) => {
      const pair = [el, arr[i + 1]];
      const insertion = rules[pair.join('')];


      if(insertion) return [el, insertion];

      return [el];
    });
}

function doStepsSlow(arr, rules, amount) {
  let step = arr;

  for(let i = 0; i < amount; i++) {
    step = doStepSlow(step, rules)
  }

  return step;
}

function partOne() {
  const steps = doStepsSlow(input.template.split(''), input.rules, 10);

  console.log(steps);

  return getAnswer(steps);
}

const replacements = Object.fromEntries(
  Object.entries(input.rules).map(([k, v]) => {
    const [before] = k.split('');

    return [k, [before, v].join('')];
  })
)

function closestPowerOf2(x) { return Math.pow(2, Math.floor(Math.log2(x))); }

function findReplacement(string, size, d=1) {
  let loops = string.length === size ? 1 : (string.length/(size - 1));

  let newString = '';

  for(let i=0; i < loops; i++) {
    let step = i === 0 ? 0 : ((i * (size - 1)));

    const sub = string.substr(step, size);

    if(replacements[sub]) {
      newString += replacements[sub];
      continue;
    } else {
      console.log(closestPowerOf2(size) / 2, size)
      newString += findReplacement(sub, closestPowerOf2(size) / 2);
      continue;
    }
  }

  replacements[string] = newString;

  return newString;
}


function partTwo() {
  let step = input.template;

  for(let i = 0; i < 40; i++) {
    // console.log('--------------------------  Step'.yellow, i, step.yellow)
    console.log(i, step.length);

    const x = 30;

    step = findReplacement(step, step.length) + step[step.length - 1];
  }

  return getAnswer(step.split(''));
}

console.log(partTwo());
