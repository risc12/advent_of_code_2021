const fs = require('fs');
const util = require('util');
const colors = require('colors');

util.inspect.defaultOptions.maxArrayLength = null;
util.inspect.defaultOptions.breakLength = Infinity;


const fileToRead = process.argv[2] || 'input.txt';

const log = (...args) => fileToRead !== 'input.txt' && console.log(...args);
const plog = (...args) => fileToRead === 'input.txt' && console.log(...args);

function toBinary(hex){
    return ("0000" + (parseInt(hex, 16)).toString(2)).substr(-4);
}

function toDecimal(binary) {
  return parseInt(binary, 2);
}

function aToDecimal(arr) {
  return toDecimal(arr.join(''));
}

// Modifies arr

const input = fs.readFileSync(fileToRead)
  .toString()
  .trim()
  .split("\n")[0]
  .split("")

class Parser {
  constructor(binary) {
    this.binary = binary;
    this.index = 0;
    this.size = binary.length

    this.totalAmountOfVersions = 0;
  }

  read(n) {
    let result = [];

    while(n--) {
      result.push(this.binary[this.index])
      this.index++;
    }

    return result;
  }

  readDecimal(n) {
    return aToDecimal(this.read(n));
  }
}

class Operator {
  constructor(type, expressions) {
    this.type = type;
    this.expressions = expressions;
  }

  operatorToString() {
    switch(this.type) {
      case 0: return '+';
      case 1: return '*';
      case 2: return 'min';
      case 3: return 'max';
      case 4: return '?';
      case 5: return '>';
      case 6: return '<';
      case 7: return '==';
    }
  }

  toValue(d = 0) {
    log(' |'.repeat(d), );
    d++;

    let result;

    switch(this.type) {
      case 0: 
        result = this.expressions.reduce((acc, e) => acc + e.toValue(d), 0);
        break;
      case 1: 
        result = this.expressions.reduce((acc, e) => acc * e.toValue(d), 1);
        break;
      case 2: 
        result = this.expressions.reduce((acc, e) => Math.min(acc, e.toValue(d)), Number.MAX_SAFE_INTEGER);
        break;
      case 3: 
        result = this.expressions.reduce((acc, e) => Math.max(acc, e.toValue(d)), Number.MIN_SAFE_INTEGER);
        break;
      case 5: 
        result = this.expressions[0].toValue(d) > this.expressions[1].toValue(d) ? 1 : 0; // We expect number
        break;
      case 6: 
        result = this.expressions[0].toValue(d) < this.expressions[1].toValue(d) ? 1 : 0; // We expect number
        break;
      case 7: 
        result = this.expressions[0].toValue(d) == this.expressions[1].toValue(d) ? 1 : 0; // We expect number
        break;
    }

    log(' |'.repeat(d - 1), result, this.operatorToString(), `(${this.type})`);

    return result;
  }
}

class Literal {
  constructor(value) {
    this.value = value;
  }

  toValue (d) {
    log(' |'.repeat(d), this.value);
    return this.value;
  }
}

const decode = {
  4: (parser, _typeId, d) => {
    log(' |'.repeat(d), 'decoding value'.yellow)
    let value = []; 

    while(parser.read(1).join('') === '1') {
      let a = parser.read(4).join('');
      value.push(a)
    }

    // Last group
    value.push(parser.read(4).join(''))

    return new Literal(parseInt(value.join(''), 2));
  },
  operator: (parser, type, d) => {
    log(' |'.repeat(d),'decoding operator'.yellow)

    let lengthTypeId = parser.readDecimal(1);

    let subPackets = [];

    if(lengthTypeId === 0) {
      // The next 15 bits stand for
      // the total length in bits
      const length = parser.readDecimal(15);
      const startedAt = parser.index;

      while((parser.index - startedAt) < length) {
        let packet = readPacket(parser, d++)
        subPackets.push(packet)
      }
    } else {
      // The next 1 bits stand for
      // the amount of packets
      const length = aToDecimal(parser.read(11));

      while(subPackets.length < length){
        let packet = readPacket(parser, d++)
        subPackets.push(packet)
      }
    }

    return new Operator(type, subPackets);
  }
}

function readPacket(parser, d = 1) {
  log('-|'.repeat(d), 'reading packet \t'.yellow)
  const versionNumber = parser.readDecimal(3);
  const typeId = parser.readDecimal(3);

  parser.totalAmountOfVersions = parser.totalAmountOfVersions + versionNumber;

  log('-|'.repeat(d), '>', { versionNumber, typeId })

  // Parse body
  return (decode[typeId] || decode['operator'])(parser, typeId, d + 1);
}


function partOne() {
  log(input);
  const packet = input.flatMap(hex => toBinary(hex).split(''))
  const binary = [...packet];

  const parser = new Parser(binary);

  readPacket(parser)

  return parser.totalAmountOfVersions;
}

function partTwo() {
  log(input);
  const packet = input.flatMap(hex => toBinary(hex).split(''))
  const binary = [...packet];

  const parser = new Parser(binary);

  const parsedPackage = readPacket(parser)

  return parsedPackage.toValue();
}


console.log(partOne());
console.log(partTwo());
