const fs = require('fs');

const fileToRead = process.argv[2] || './input.txt';


function rowsToColumns(rows) {
  const columns = [];
  for (let i = 0; i < rows[0].length; i++) {
    const column = [];
    for (let j = 0; j < rows.length; j++) {
      column.push(rows[j][i]);
    }
    columns.push(column);
  }
  return columns;
}

class Board {
  constructor(rows) {
    this.rows = rows;
    this.numbers = rows.reduce((acc, row) => acc.concat(row), []);

    this.checkedNumbers = new Array(this.rows.length).fill().map(() => new Array(this.rows[0].length).fill())
    console.log(this.rows);

  }

  mark(number) {
    console.log('mark', number);
    const index = this.numbers.indexOf(number);

    if(index == -1) { console.log('miss'); return; }


    const column = Math.floor(index / this.rows[0].length);
    const row = index % this.rows[0].length;
    console.log('hit', row, column);

    this.checkedNumbers[column][row] = true;

    console.log(this.checkedNumbers);

    return this.hasBingo();
  }

  rowsHaveBingo() {
    if (this.bingo) return true;

    return this.checkedNumbers.some(row => row.every(i => i));
  }

  columnsHaveBingo() {
    if (this.bingo) return true;

    const columns = rowsToColumns(this.checkedNumbers);
    return columns.some(column => column.every(number => number));
  }

  hasBingo() {
    if (this.bingo) return true;

    const rHasBingo = this.rowsHaveBingo();
    const cHasBingo = this.columnsHaveBingo();

    console.log('B!, r, c', rHasBingo || cHasBingo, rHasBingo, cHasBingo);
    const hasBingo = rHasBingo || cHasBingo;

    this.bingo = hasBingo;
    return hasBingo;
  }

  calculateScore() {
    let score = 0;
    this.checkedNumbers.forEach((row, rowIndex) => {
      row.forEach((isChecked, columnIndex) => {
        if(!isChecked) score += parseInt(this.rows[rowIndex][columnIndex]);
      })
    })

    return score;
  }
}

const inputArray = fs.readFileSync(fileToRead).toString().split("\n")
const [input, ...boardsInput] = inputArray;
const drawedNumbers = input.split(',');
const boards = boardsInput.reduce((acc, el, i) => {
  if(i === 0) return acc;
  if(el === '') {
    acc.boards.push(acc.currentBoard.map(row => row.split(' ').filter(el => el !== '')));
    acc.currentBoard = [];
  } else {
    acc.currentBoard.push(el);
  }

  return acc;
}, { boards: [], currentBoard: []})
  .boards
  .map(board => new Board(board));

// https://adventofcode.com/2021/day/2
function partOne() {
  let winningBoard = undefined;
  let winningNumber = undefined;

  for (number of drawedNumbers) {
    for (const board of boards) {
      const hasBingo = board.mark(number);

      if(hasBingo) {
        console.log('hb', hasBingo)
        winningBoard = board;
        break;
      }
    }

    if(winningBoard) {
      winningNumber = number;
      break;
    }
  }

  console.log(winningBoard.calculateScore());
  console.log(winningNumber);

  return winningBoard.calculateScore() * winningNumber;
}

// https://adventofcode.com/2021/day/2#part2
function partTwo() {
  let boardsToSkip = [];
  let lastBoard = undefined;
  let lastNumber = undefined;

  for (number of drawedNumbers) {
    for (const board of boards) {
      if (boardsToSkip.indexOf(board) > -1) continue;

      const hasBingo = board.mark(number);

      if(hasBingo) {
        boardsToSkip.push(board);
        lastNumber = number;
      }

      lastBoard = board;
    }
  }

  console.log('lb, ln', boards.indexOf(lastBoard), lastBoard, lastBoard.calculateScore(), lastNumber);

  return lastBoard.calculateScore() * lastNumber;
}

// console.log(partOne());
console.log(partTwo());
