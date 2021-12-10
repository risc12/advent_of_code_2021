const fs = require('fs');
const util = require('util');
const colors = require('colors');

util.inspect.defaultOptions.maxArrayLength = null;
util.inspect.defaultOptions.breakLength = Infinity;

const fileToRead = process.argv[2] || 'input.txt';

const inputArray = fs.readFileSync(fileToRead).toString().trim().split("\n")
  .map(row => row.split("").map(Number))

function getNeighbours(x, y, grid){
  const neighbours = [];

  if(x > 0) neighbours.push([x-1,y]);
  if(x < grid.length-1) neighbours.push([x+1, y]);

  if(y > 0) neighbours.push([x, y-1]);
  if(y < grid[0].length-1) neighbours.push([x, y+1]);

  return neighbours;
}

function getLowPoints(grid) {
  let lowpoints = [];

  grid.forEach((row, x) => {
    row.forEach((value, y) => {
      const neighbours = getNeighbours(x, y, grid);

      const isLowpoint = neighbours.every(coord => grid[coord[0]][coord[1]] > value)

      if(isLowpoint) lowpoints.push([x, y]);
    })
  })

  return lowpoints;
}

function renderGrid(grid, neighbours, current = [], visited = [], inBassin = [], borders, bassinByLowpoint) {
  if (fileToRead === 'input.txt') return; // Grid is too large, doesn't fit in console

  const isIn = set => point => set.some(el => el[0] === point[0] && el[1] === point[1]);
  const isInNeighbours = isIn(neighbours);
  const isInVisited = isIn(visited);
  const isInBassin = isIn(inBassin);
  const isInBorders = isIn(borders);

  console.log(current)
  console.log('X 1 2 3 4 5 6 7 8 9 10'.magenta)
  grid.forEach((row, x) => {
    console.log(x.toString().magenta, row.map((v, y) =>  {
      let r = v.toString();
      if (isInNeighbours([x, y])) r = r.bgGray;
      if (isInVisited([x, y])) r = r.strikethrough;
      if (isInBassin([x, y])) r = r.brightYellow;
      if (isInBorders([x, y])) r = r.bgBlue.black;

      if (current[0] == x && current[1] == y) r = r.bold;

      return r;
    }).join(' '));
  });

  console.log('');
  console.log(Object.entries(bassinByLowpoint).map(([k, v]) => [k, v.length]))
  console.log('----------------------'.dim)
  console.log('');
}

function partOne() {
  const lowpoints = getLowPoints(inputArray);

  return lowpoints.reduce((acc, el) => acc + inputArray[el[0]][el[1]] + 1, 0);
}

function partTwo() {
  const grid = inputArray;
  const lowpoints = getLowPoints(grid);

  let inBassin = [...lowpoints];
  let visited = [];
  let borders = [];

  let bassinByLowpoint = {};

  function findBassin(point, lowPoint) {
    let neighbours = getNeighbours(...point, grid);

    renderGrid(grid, neighbours, point, visited, inBassin, borders, bassinByLowpoint);

    visited.push(point);

    neighbours.forEach(neighbour => {
      if(!visited.some(v => v[0] === neighbour[0] && v[1] === neighbour[1])) {
        if(grid[neighbour[0]][neighbour[1]] < 9) {
          inBassin.push(neighbour);
          bassinByLowpoint[lowPoint].push(neighbour);
          findBassin(neighbour, lowPoint);
        } else { 
          borders.push(neighbour);
        }
      }
    })
  }

  lowpoints.map(lowPoint => {
    bassinByLowpoint[lowPoint] = [lowPoint];
    findBassin(lowPoint, lowPoint);
  });
  
  renderGrid(grid, [], [], visited, inBassin, borders, bassinByLowpoint);

  return Object
    .entries(bassinByLowpoint)
    .map(([k, v]) => [k, v.length])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .reduce((acc, [_k, el]) => {
      return acc * el
    }, 1)
  // renderGrid(inputArray, lowpoints)
}

console.log(partOne());
console.log(partTwo());
