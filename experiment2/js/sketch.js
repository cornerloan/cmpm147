// sketch.js - purpose and description here
// Author: Your Name
// Date:

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
const VALUE1 = 1;
const VALUE2 = 2;

// Globals
let myInstance;
let canvasContainer;
var centerHorz, centerVert;

class MyClass {
    constructor(param1, param2) {
        this.property1 = param1;
        this.property2 = param2;
    }

    myMethod() {
        // code to run when method is called
    }
}

function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  // redrawCanvas(); // Redraw everything based on new size
}

// setup() function is called once when the program starts
function setup() {
  // place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
  // resize canvas is the page is resized

  // create an instance of the class
  myInstance = new MyClass("VALUE1", "VALUE2");

  $(window).resize(function() {
    resizeScreen();
  });
  resizeScreen();
}

// draw() function is called repeatedly, it's the main animation loop
function draw() {
  randomSeed(seed);
  
  background(random(100));
  
  noStroke();

  fill(skyColorPink);
  rect(0, 0, width, height / 2);
  
  //fill(skyColorBlue);
  let rand1 = random(300);
  let rand2 = random(150);
  for(let a = 0; a < 10; a++){
    ellipse(0, 0, rand1 / (10 - a), rand2 / (10 - a));
    fill(105, 173, 228, 150 - a);
  }
  
  let rand3 = random(300);
  let rand4 = random(150);
  for(let b = 0; b < 10; b++){
    ellipse(width, 0, rand3 / (10 - b), rand4 / (10 - b));
    fill(105, 173, 228, 150 - b);
  }
    
  //ellipse(0, 0, random(400), random(200));
  //ellipse(width, 0, random(100), random(100));
  
  fill(sunColor);
  ellipse(mouseX, -100*sin(mouseX/130) + 100, 50, 50);
  
  fill(cloudColor);
  let yOffset = random(30);
  ellipse(width*((millis() / 1839.0) %1), 30 + yOffset, 40, 30);
  ellipse(width*((millis() / 1839.0) %1) + random(5, 15), 30 + random(10, 15) + yOffset, 40, 30);
  ellipse(width*((millis() / 1839.0) %1) - random(5, 15), 30 + random(10, 15) + yOffset, 40, 30);

  
  fill(groundColor);
  rect(0, height/2, width, height/2);
  
  stroke(borderColor);
  fill(mountainColor);
  beginShape();
  vertex(0, height / 2);
  const steps = 10;
  for (let i = 0; i < steps + 1; i++) {
    let x = (width * i) / steps;
    let y = 
      height / 2 - (random() * random() * random() * height) / 4 - height / 20;
    vertex(x, y);
  }
  vertex(width, height / 2);
  endShape(CLOSE);
  
  noStroke();
  fill(riverColor);
  //min x = 33%    max x = 0.71
  let leftSide = width - width * random(0.5, 0.66);
  let rightSide = width * random(0.07, 0.21);
  for(let a = 0; a < 20; a++){
    rect(leftSide, (height / 2) + a*5 , rightSide, height / 10, 20);
    let sway = random([-1, 1]);
    leftSide = leftSide + random(1, 15) * sway;
  }
  
  stroke(borderColor);
  fill(treeColor);
  const trees = random(150);
  for(let i = 0; i < trees; i++){
    let z = random();
    var x = width * random(0.71, 1);
    if(random(1, 30) > 15) {
      x = width * random(0, 0.33);
    }
    let s = width / 50 / z;
    let y = height / 2 + height / 20 / z;
    triangle(x, y - s, x - s / 4, y, x + s / 4, y);
  }
}

// mousePressed() function is called once after every time a mouse button is pressed
function mousePressed() {
    // code to run when mouse is pressed
}
