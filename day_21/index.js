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
  .split("\n")
  .map(line => line.split(': ')[1])
  .map(e => Number(e))


function* deterministicDice() {
  let state = 0;

  while (true) {
    if (state === 100) state = 0;
    state++
    yield state;
  }
}

function getNewPosition(position, steps) {
  let pos = ((position + steps - 1) % 10) + 1

  return pos;
}

function turn([position, score], dice) {
  const diceRoll = [
    dice.next().value,
    dice.next().value,
    dice.next().value
  ].reduce((a, e) => a + e, 0);

  const newPosition = getNewPosition(position, diceRoll);

  return [newPosition, score + newPosition];
}

function partOne() {
  let dice = deterministicDice();

  let players = input.map(e => [e, 0]);

  let i = 0;

  while(!players.some(p => p[1] >= 1000)) {
    players[i%2] = turn(players[i%2], dice);
    players.forEach((p, i) => i === 1 ? log(i.toString().cyan, p) : log(i.toString().yellow, p))

    i++
  }

  let losingPlayerScore = players.find(p => p[1] < 1000)[1];
  let amountOfDiceRolls = i * 3;

  return losingPlayerScore * amountOfDiceRolls;

}

function partTwo() {
}


console.log(partOne());
console.log(partTwo());
