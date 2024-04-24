// sketch.js - purpose and description here
// Author: Your Name
// Date:

var dungeon = function (p) {
  /* exported preload, setup, draw, placeTile */

  /* global generateGrid drawGrid */

  let seed = 0;
  let tilesetImage;
  let currentGrid = [];
  let numRows, numCols;

  p.preload = function(){
    tilesetImage = p.loadImage(
      "https://cdn.glitch.com/25101045-29e2-407a-894c-e0243cd8c7c6%2FtilesetP8.png?v=1611654020438"
    );
  }

  p.reseed = function() {
    seed = (seed | 0) + 1109;
    p.randomSeed(seed);
    p.noiseSeed(seed);
    p.select("#seedReport").html("seed " + seed);
    p.regenerateGrid();
  }

  p.regenerateGrid = function() {
    p.select("#asciiBox").value(p.gridToString(p.generateGrid(numCols, numRows)));
    p.reparseGrid();
  }

  p.reparseGrid = function() {
    currentGrid = p.stringToGrid(p.select("#asciiBox").value());
  }

  p.gridToString = function(grid) {
    let rows = [];
    for (let i = 0; i < grid.length; i++) {
      rows.push(grid[i].join(""));
    }
    return rows.join("\n");
  }

  p.stringToGrid = function(str) {
    let grid = [];
    let lines = str.split("\n");
    for (let i = 0; i < lines.length; i++) {
      let row = [];
      let chars = lines[i].split("");
      for (let j = 0; j < chars.length; j++) {
        row.push(chars[j]);
      }
      grid.push(row);
    }
    return grid;
  }

  p.setup = function () {
    numCols = p.select("#asciiBox").attribute("rows") | 0;
    numRows = p.select("#asciiBox").attribute("cols") | 0;

    p.createCanvas(16 * numCols, 16 * numRows).parent("canvasContainer");
    p.select("canvas").elt.getContext("2d").imageSmoothingEnabled = false;

    p.select("#reseedButton").mousePressed(p.reseed);
    p.select("#asciiBox").input(p.reparseGrid);

    p.reseed();
  }


  p.draw = function () {
    p.randomSeed(seed);
    p.drawGrid(currentGrid);

  }

  p.placeTile = function(i, j, ti, tj) {
    p.image(tilesetImage, 16 * j, 16 * i, 16, 16, 8 * ti, 8 * tj, 8, 8);
  }


  /* exported generateGrid, drawGrid */
  /* global placeTile */

  p.generateGrid = function(numCols, numRows) {
    let grid = [];

    //left side room
    let randomImin = p.floor(numCols * p.random(0, 0.25));
    let randomImax = p.floor(numCols * p.random(0.4, 0.6));
    let randomJmin = p.floor(numRows * p.random(0, 0.25));
    let randomJmax = p.floor(numRows * p.random(0.4, 0.6));
    let randomChestI = p.floor(p.random(randomImin + 2, randomImax - 2));
    let randomChestJ = p.floor(p.random(randomJmin + 2, randomJmax - 2));

    //right side room
    let randomAmin = p.floor(numCols * p.random(0.5, 0.7));
    let randomAmax = p.floor(numCols * p.random(0.85, 1));
    let randomBmin = p.floor(numRows * p.random(0.5, 0.7));
    let randomBmax = p.floor(numRows * p.random(0.85, 1));
    let randomChestA = p.floor(p.random(randomAmin + 2, randomAmax - 2));
    let randomChestB = p.floor(p.random(randomBmin + 2, randomBmax - 2));

    let paths = [1, 2];
    let pathSide = paths[(p.floor(p.random() * paths.length))];
    let ijMidX, ijMidY, abMidX, abMidY;

    ijMidX = p.floor((randomJmin + randomJmax) / 2);
    ijMidY = p.floor((randomImin + randomImax) / 2);
    abMidX = p.floor((randomBmin + randomBmax) / 2);
    abMidY = p.floor((randomAmin + randomAmax) / 2);

    //i represents the row number, j represents the column number
    for (let i = 0; i < numRows; i++) {
      let row = [];
      for (let j = 0; j < numCols; j++) {
        if (j == randomChestJ && i == randomChestI ||
          j == randomChestB && i == randomChestA) {
          row.push("C");
        }
        else if (j > randomJmin && j < randomJmax && i > randomImin && i < randomImax ||
          j > randomBmin && j < randomBmax && i > randomAmin && i < randomAmax) {
          row.push(".");
        }
        //path in top right
        else if (pathSide == 1 &&
          ((j >= ijMidY && j <= abMidY && i == ijMidY) ||
            (i >= ijMidY && i <= abMidY && j == abMidY))) {
          row.push(".");
        }
        //path in bottom left
        else if (pathSide == 2 &&
          ((i >= ijMidX && i <= abMidY && j == ijMidX) ||
            (j <= abMidY && j >= ijMidX && i == abMidY))) {
          row.push(".");
        }

        else row.push("_");
      }
      grid.push(row);
    }

    return grid;
  }

  p.drawGrid = function(grid) {
    p.background(128);


    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        let target = p.gridCode(grid, i, j);
        let tiOffset = null;
        let tjOffset = null;
        if (lookup[target] != null) {
          [tiOffset, tjOffset] = lookup[target];
        }
        if (tiOffset == null) {
          p.placeTile(i, j, (p.floor(p.random(4))), 0);
        }
        else {
          p.drawContext(grid, i, j, target, tiOffset, tjOffset);
        }
      }
    }


    p.drawCloud();
  }

  p.gridCheck = function(grid, i, j, target) {
    //if grid[i][j] doesn't have a value, return false
    if (grid[i][j] == null) return false;
    //if grid[i][j] isnt equal to target, return false
    if (grid[i][j] != target) return false;
    //otherwise return true
    return true;
  }

  p.gridCode = function(grid, i, j) {
    let northBit = 0;
    let westBit = 0;
    let eastBit = 0;
    let southBit = 0;

    if (p.gridCheck(grid, i, j, '_')) {
      return 0;
    }

    if (i == 0 || j == 0 || i == grid.length || j == grid.length) return 0;


    if (grid[i - 1][j] != null && grid[i - 1][j] != '_') {
      northBit = 1;
    }
    if (grid[i][j - 1] != null && grid[i][j - 1] != '_') {
      westBit = 1;
    }
    if (grid[i][j + 1] != null && grid[i][j + 1] != '_') {
      eastBit = 1;
    }
    if (grid[i + 1][j] != null && grid[i + 1][j] != '_') {
      southBit = 1;
    }

    let value = (1 * northBit) + (2 * westBit) + (4 * eastBit) + (8 * southBit);
    return value;
  }

  p.drawContext = function(grid, i, j, target, ti, tj) {


    //chest
    if (grid[i][j] == 'C') {
      p.placeTile(i, j, p.floor(p.random(5)), p.floor(p.random(28, 30)));
    }
    else if (target == 15 || target == 9 || target == 6) {
      p.placeTile(i, j, (p.floor(p.random(1, ti))), (p.floor(p.random(21, tj))));
    }
    //bottom right corner
    else if (target == 3) {
      p.placeTile(i, j, ti, tj);
    }
    //bottom left corner
    else if (target == 5) {
      p.placeTile(i, j, ti, tj);
    }
    //top right corner
    else if (target == 10) {
      p.placeTile(i, j, ti, tj);
    }
    //top left corner
    else if (target == 12) {
      p.placeTile(i, j, ti, tj);
    }
    //bottom wall
    else if (target == 7) {
      p.placeTile(i, j, ti, tj);
    }
    //right wall
    else if (target == 11) {
      p.placeTile(i, j, ti, tj);
    }
    //left wall
    else if (target == 13) {
      p.placeTile(i, j, ti, tj);
    }
    //top wall
    else if (target == 14) {
      p.placeTile(i, j, ti, tj);
    }
  }


  p.drawCloud = function() {
    let numClouds = p.floor(p.random(2, 4));
    p.noStroke();

    for (let i = 1; i < numClouds; i++) {
      p.fill(173, 143, 140, 120);
      p.rect(p.width * ((p.millis() / (6000.0 - 1000 * i)) % 1), p.random(p.height), p.random(p.width / 5), p.random(p.height / 5));
    }
  }

  const lookup = [
    null,
    null,
    null,
    [7, 23],
    null,
    [5, 23],
    [4, 24],
    [6, 23],
    null,
    [4, 24],
    [7, 21],
    [7, 22],
    [5, 21],
    [5, 22],
    [6, 21],
    [4, 24]
  ];
};

var overworld = function(q) {
  /* exported preload, setup, draw, placeTile */

  /* global generateGrid drawGrid */

  let seed = 0;
  let tilesetImage;
  let currentGrid = [];
  let numRows, numCols;

  q.preload = function() {
    tilesetImage = q.loadImage(
      "https://cdn.glitch.com/25101045-29e2-407a-894c-e0243cd8c7c6%2FtilesetP8.png?v=1611654020438"
    );
  }

  q.reseed = function() {
    seed = (seed | 0) + 1109;
    q.randomSeed(seed);
    q.noiseSeed(seed);
    q.select("#seedReport2").html("seed " + seed);
    q.regenerateGrid();
  }

  q.regenerateGrid = function() {
    q.select("#asciiBox2").value(q.gridToString(q.generateGrid(numCols, numRows)));
    q.reparseGrid();
  }

  q.reparseGrid = function() {
    currentGrid = q.stringToGrid(q.select("#asciiBox2").value());
  }

  q.gridToString = function(grid) {
    let rows = [];
    for (let i = 0; i < grid.length; i++) {
      rows.push(grid[i].join(""));
    }
    return rows.join("\n");
  }

  q.stringToGrid = function(str) {
    let grid = [];
    let lines = str.split("\n");
    for (let i = 0; i < lines.length; i++) {
      let row = [];
      let chars = lines[i].split("");
      for (let j = 0; j < chars.length; j++) {
        row.push(chars[j]);
      }
      grid.push(row);
    }
    return grid;
  }

  q.setup = function () {
    numCols = q.select("#asciiBox2").attribute("rows") | 0;
    numRows = q.select("#asciiBox2").attribute("cols") | 0;

    q.createCanvas(16 * numCols, 16 * numRows).parent("canvasContainer2");
    q.select("canvas").elt.getContext("2d").imageSmoothingEnabled = false;

    q.select("#reseedButton2").mousePressed(q.reseed);
    q.select("#asciiBox2").input(q.reparseGrid);

    q.reseed();
  }

  q.draw = function () {
    q.randomSeed(seed);
    q.drawGrid(currentGrid);
  }

  q.placeTile = function(i, j, ti, tj) {
    q.image(tilesetImage, 16 * j, 16 * i, 16, 16, 8 * ti, 8 * tj, 8, 8);
  }

  /* exported generateGrid, drawGrid */
  /* global placeTile */

  q.generateGrid = function(numCols, numRows) {
    let grid = [];

    var riverStartPos = q.random(numCols * 0.35, numCols * 0.5);
    var riverEndPos = q.random(numCols * 0.65, numCols * 0.8);
    var lowerBound = q.floor(q.random(numRows * 0.7, numRows * 0.9));
    var riverDir = q.random([-1, 1]);
    var leftForestStart = q.random(numRows);
    var leftForestEnd = leftForestStart + q.floor(q.random(2, 5));
    var rightForest = 5;

    //i represents the row number, j represents the column number
    for (let i = 0; i < numRows; i++) {
      let row = [];
      for (let j = 0; j < numCols; j++) {
        if (j > riverStartPos && j < riverEndPos && i < lowerBound) {
          row.push("R");
        }
        else if (i >= lowerBound && j > riverStartPos && j < riverEndPos) {
          row.push("R");
        }
        else if (i >= leftForestStart && i <= leftForestEnd && j < rightForest) {
          row.push("T");
        }
        else {
          row.push("_");
        }

      }
      if (i < lowerBound) {
        let expand = q.random(-1, 1);
        riverStartPos += expand;
        riverEndPos += expand;
      }
      else {
        let ran1 = q.random([1, 2]);
        riverStartPos += ran1 * riverDir;
        riverEndPos += ran1 * riverDir;
      }

      if (i < leftForestEnd && i > leftForestStart) {
        let expand = q.random([-1, 1]);
        rightForest += expand;
      }

      grid.push(row);
    }

    return grid;
  }

  q.drawGrid = function(grid) {
    q.background(0, 226, 60);

    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        /*
        let target = gridCode(grid, i, j, grid.length);
        let tiOffset = null;
        let tjOffset = null;
        if(lookup[target] != null) {
          [tiOffset, tjOffset] = lookup[target];
        }
        if(grid[i][j] == "R"){
          if(random(4) > 3) placeTile(i, j, floor(random(4)), 13);
          else placeTile(i, j, 0, 13);
        }
        else if(grid[i][j] == "T"){
          placeTile(i, j, 14, 0);
        }
        else if(tiOffset == null){
          placeTile(i, j, (floor(random(4))), 0);
        }
        else {
          drawContext(grid, i, j, target, tiOffset, tjOffset);
        }
      }
      */
        let target = q.gridCode(grid, i, j);
        let tiOffset = null;
        let tjOffset = null;
        if (lookup[target] != null) {
          [tiOffset, tjOffset] = lookup[target];
        }
        if (grid[i][j] == 'T') {
          q.placeTile(i, j, 14, 0);
        }
        else if (grid[i][j] == '_') {
          q.placeTile(i, j, q.random(4), 0);
        }
        else if (tiOffset == null) {
          if (q.random(4) > 3) q.placeTile(i, j, q.floor(q.random(4)), 13);
          else q.placeTile(i, j, 0, 13);
        }
        else {
          q.drawContext(grid, i, j, target, tiOffset, tjOffset);
        }
      }
    }
  }

  q.gridCheck = function(grid, i, j, target) {
    //if grid[i][j] doesn't have a value, return false
    if (grid[i][j] == null) return false;
    //if grid[i][j] isnt equal to target, return false
    if (grid[i][j] != target) return false;
    //otherwise return true
    return true;
  }

  q.gridCode = function(grid, i, j) {
    let northBit = 0;
    let westBit = 0;
    let eastBit = 0;
    let southBit = 0;

    if (q.gridCheck(grid, i, j, '_') || q.gridCheck(grid, i, j, 'T')) {
      return 0;
    }

    if (i == 0 || i == grid.length - 1 || j == 0 || j == grid.length - 1 || i == grid.length || j == grid.length) return 0;


    if (grid[i - 1][j] != null && grid[i - 1][j] == 'R') {
      southBit = 1;
    }
    if (grid[i][j - 1] != null && grid[i][j - 1] == 'R') {
      eastBit = 1;
    }
    if (grid[i][j + 1] != null && grid[i][j + 1] == 'R') {
      westBit = 1;
    }

    if (grid[i + 1][j] != null && grid[i + 1][j] == 'R') {
      northBit = 1;
    }

    let value = (1 * northBit) + (2 * westBit) + (4 * eastBit) + (8 * southBit);
    return value;
  }

  q.drawContext = function(grid, i, j, target, ti, tj) {
    /*
      if(grid[i][j] == '_') {
        placeTile(i, j, random(4), 0);
      }
      */
    /*
    if(target == 15) {
      if(random(4) > 3) placeTile(i, j, floor(random(4)), 13);
      else placeTile(i, j, 0, 13);
    }
    */

    q.placeTile(i, j, ti, tj);

  }

  //[x, y]

  const lookup = [
    null,
    [10, 0],
    [9, 1],
    [9, 0],
    [11, 11],
    [11, 0],
    null,
    null,
    [10, 2],
    null,
    [9, 2],
    null,
    [11, 2],
    null,
    null,
    [0, 13]
  ];

};


let sketch1 = new p5(dungeon, 'dungeon');
let sketch2 = new p5(overworld, 'overworld');