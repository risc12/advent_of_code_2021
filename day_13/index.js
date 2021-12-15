const fs = require('fs');
const util = require('util');
const colors = require('colors');

util.inspect.defaultOptions.maxArrayLength = null;
util.inspect.defaultOptions.breakLength = Infinity;


const fileToRead = process.argv[2] || 'input.txt';

const input = fs.readFileSync(fileToRead).toString().trim()
  .split("\n")
  .reduce((acc, el) => {
    if(el === "") return acc;

    if(el.includes("fold")) {
      const fold = el.replace('fold along ', '').split('=');
      acc.folds.push([fold[0], Number(fold[1])]);
    } else {
      const dot = el.split(",").map(Number)
      acc.dots.push(dot)

      if(dot[0] > acc.maxX) acc.maxX = dot[0]
      if(dot[1] > acc.maxY) acc.maxY = dot[1]
    }

    return acc;
  },  { dots: [], folds: [], maxX: 0, maxY: 0 })


function renderSheet(sheet, fold = [], name) {
  console.log((name || "").padStart(26, "_").green);

  console.log(sheet[0].length.toString().padStart(2, 0), '', new Array(sheet[0].length).fill(0).map((_, x) => x.toString().padStart(2,0)).join(' ').yellow)


  sheet.forEach((row, y) => {
    console.log(y.toString().padStart(3, 0).yellow, '', row.map((el, x) => {
      if (fold[0] === 'x' && fold[1] === x) return el.toString().brightMagenta;
      if (fold[0] === 'y' && fold[1] === y) return el.toString().brightMagenta;

      return el > 0 ? '#'.toString().brightRed : '.'
    }).join('  '))
  });

  console.log("");
  console.log(("").padStart(26, "=").green);
  console.log("");

  return sheet;
}

// meaning fold along y
function foldWhereY(index, sheet) {
  const top = sheet.slice(0, index);
  const bottom = sheet.slice(index + 1, sheet.length);

  const difference = top.length - bottom.length; 
  const biggest = difference < 0 ? bottom : top;

  return biggest.map((r, y) => r.map((_, x) => {
    let topV = 0;
    if(top[y + difference]) topV = top[y + difference][x];

    let bottomV = 0;
    if(bottom[y]) bottomV = bottom[(bottom.length -1) - y][x];

    return topV + bottomV
  }));
}

// meaning fold along x
function foldWhereX(index, sheet) {
  const left = sheet.map((row) => row.slice(0, index));
  const right = sheet.map((row) => row.slice(index + 1, row.length));

  const difference = left[0].length - right[0].length; 
  const biggest = difference < 0 ? right : left;

  return biggest.map((r, y) => r.map((_, x) => {
    let leftV = 0;
    if(left[y][x + difference]) leftV = left[y][x + difference];

    let rightV = 0;
    if(right[y]) rightV = right[y][(right[0].length - 1) - x];

    return leftV + rightV
  }));
}

function createSheet(x, y, dots) {
  const sheet = new Array(y+ 2).fill(0).map((_) => new Array(x + 1).fill(0));

  dots.forEach(([x, y]) => {
    sheet[y][x] = 1;
  })

  return sheet;
}

function partOne() {
  const sheet = createSheet(input.maxX, input.maxY, input.dots);
  let fold  = input.folds[0];

  let finalSheet = foldWhereX(fold[1], sheet);

  return finalSheet.reduce((acc, row) => acc + row.filter((el) => el > 0).length, 0);

}

function partTwo() {
  const sheet = createSheet(input.maxX, input.maxY, input.dots);

  console.log(input.maxX, input.maxY);

  return outcome = renderSheet(input.folds.reduce((acc, fold, i) => {
    console.log(fold);
    if(i > 7)
      renderSheet(acc, fold);

    if(fold[0] === 'y') {
      return foldWhereY(fold[1], acc);
    } else {
      return foldWhereX(fold[1], acc);
    }
  }, sheet), [], 'final').reduce((acc, row) => acc + row.filter((el) => el > 0).length, 0) ;
}

// console.log(partOne());
console.log(partTwo());
