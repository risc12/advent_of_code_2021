const fs = require('fs');
const util = require('util');
const colors = require('colors');

util.inspect.defaultOptions.maxArrayLength = null;
util.inspect.defaultOptions.breakLength = Infinity;


const fileToRead = process.argv[2] || 'input.txt';
const inputArray = fs.readFileSync(fileToRead).toString().trim().split("\n").map(entry => entry.split('-'))

class Cave {
  constructor(name, connections = []) {
    this.name = name;
    this.connections = connections;

    this.isBigCave = name === name.toUpperCase();
  }

  addConnection(node) {
    this.connections.push(node);
  }

  toString() {
    return `${this.name}: \n     ${this.connections.map(c => `${c.name}`).join(' ')}`;
  }
}

class CaveSystem {
  constructor() {
    this.cavesByName = {};
  }

  addCave(name, connectionName) {
    if(!this.cavesByName[name]) {
      this.cavesByName[name] = new Cave(name);
    }

    if(!this.cavesByName[connectionName]) {
      this.cavesByName[connectionName] = new Cave(connectionName);
    }

    this.cavesByName[name].connections.push(this.cavesByName[connectionName]);
    this.cavesByName[connectionName].connections.push(this.cavesByName[name]);
  }

  print() {
    Object
      .values(this.cavesByName)
      .forEach(c => {
        console.log(c.toString());
        console.log();
      });
  }
}

function createSystem() {
  let system = new CaveSystem();

  inputArray.forEach(entry => {
    system.addCave(entry[0], entry[1]);
  });

  return system;
}

let system = new createSystem();

function createPaths(path) {
  const lastCaveName = path[path.length - 1];

  if (lastCaveName === 'end') return [path];

  const lastCave = system.cavesByName[lastCaveName];

  const nextCaves = lastCave.connections.filter(c => c.isBigCave || path.indexOf(c.name) === -1);

  return nextCaves.flatMap(c => createPaths([...path, c.name]));
}


function partOne() {
  let res = createPaths(['start']);

  res.forEach(r => console.log(r.join('->')));
  console.log(res.length)

  return res;
}

function hasOnlySingleSmallCave(path) {
  const onlySmallCaves = path.filter(c => c === c.toLowerCase());

  return [...new Set(onlySmallCaves)].length === onlySmallCaves.length;
}

function createPaths2(path) {
  const lastCaveName = path[path.length - 1];

  if (lastCaveName === 'end') return [path];

  const lastCave = system.cavesByName[lastCaveName];

  const nextCaves = lastCave.connections.filter(c => c.name !== 'start' && (c.isBigCave || hasOnlySingleSmallCave(path) || path.filter(x => x === c.name).length < 1));

  return nextCaves.flatMap(c => createPaths2([...path, c.name]));
}

function partTwo() {
  let res = [...new Set(createPaths2(['start']))];

  res.forEach(r => console.log(r.join(',').red));
  console.log(res.length)

  // return res;
}

// console.log(partOne().length);
console.log(partTwo());
