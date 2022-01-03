const fs = require('fs');
const util = require('util');
const colors = require('colors');

util.inspect.defaultOptions.maxArrayLength = null;
util.inspect.defaultOptions.breakLength = Infinity;

const fileToRead = process.argv[2] || 'input.txt';

const ENABLE_PROD_LOG = false;
const log = (...args) => (ENABLE_PROD_LOG || (fileToRead !== 'input.txt')) && console.log(...args);

const input = fs.readFileSync(fileToRead)
  .toString()
  .trim()
  .split('\n')


class ALU {
  logState(i, line) {
    log('*************************************')
    log(line)
    log('i:', i);
    log('w:', this.register.w);
    log('x:', this.register.x);
    log('y:', this.register.y);
    log('z:', this.register.z);
    log('inputs', this.inputs);
    log('*************************************')
  }

  intializeRegisters() {
    this.register = {
      i: 0,
      w: 0,
      x: 0,
      y: 0,
      z: 0,
    };
  }

  loadProgram(program) {
    this.program = program;
  }

  runWith(inputs = []) {
    this.intializeRegisters();
    this.inputs = inputs;

    this.logState('init');

    this.program
      .forEach((line, i) => {
        this.register.i = i;
        const [command, a, b] = line.split(' ');

        this.register[a] = this[command](this.register[a], this.registerOrLiteral(b));

        this.logState(i, line)
      });
  }

  registerOrLiteral(value) {
    if(value === 'w' || value === 'x' || value === 'y' || value === 'z') return this.register[value];

    return parseInt(value);
  }

  inp() {
    return this.inputs.shift();
  }

  add(a, b) {
    return a + b;
  }

  mul(a, b) {
    return a * b;
  }

  div(a, b) {
    let outcome = a/b;

    return Math.sign(outcome) === 1 ? Math.floor(outcome) : Math.ceil(outcome);
  }

  mod(a, b) {
    return a % b;
  }

  eql(a, b) {
    return (a === b) ? 1 : 0;
  }
}

function checkNumber(alu, number, i) {
  let s = number.toString();

  if(s.includes("0")) return false;

  alu.runWith(s.split("").map(Number));

  let foundLegal = alu.register.z === 0;

  if(i % 10000 === 0)
    console.log(number)

  return foundLegal;
}

function partOne() {
  console.log('starting');
  const alu = new ALU();

  alu.loadProgram(input);

  const MAX_NUMBER = 99999999999999;
  const MIN_NUMBER = 11111111111111;

  let i = 0;

  for(let n = MAX_NUMBER; n > MIN_NUMBER; n--) {
    checkNumber(alu, n, i)
    i++
  }
}


console.log(partOne());
