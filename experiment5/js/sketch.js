/* exported getInspirations, initDesign, renderDesign, mutateDesign */


function getInspirations() {
  return [
    /*
    {
      name: "Lunch atop a Skyscraper", 
      assetUrl: "https://cdn.glitch.global/3abd0223-86fb-43ce-a00a-fde12615bcd5/lunch-on-a-skyscraper.jpg?v=1714798266994",
      credit: "Lunch atop a Skyscraper, Charles Clyde Ebbets, 1932"
    },
    {
      name: "Train Wreck", 
      assetUrl: "https://cdn.glitch.global/3abd0223-86fb-43ce-a00a-fde12615bcd5/train-wreck.jpg?v=1714798264965",
      credit: "Train Wreck At Monteparnasse, Levy & fils, 1895"
    },
    {
      name: "Migrant mother", 
      assetUrl: "https://cdn.glitch.global/3abd0223-86fb-43ce-a00a-fde12615bcd5/migrant-mother.jpg?v=1714778906791",
      credit: "Migrant Mother near Nipomo, California, Dorothea Lange, 1936"
    },
    {
      name: "Disaster Girl", 
      assetUrl: "https://cdn.glitch.global/3abd0223-86fb-43ce-a00a-fde12615bcd5/girl-with-fire.jpg?v=1714778905663",
      credit: "Four-year-old Zoë Roth, 2005"
    },
    */
    {
      name: "Flower",
      assetUrl: "img/Flower.jpg",
      credit: "Flower in Black and White, Beth, 2009"
    },
    {
      name: "World War 2 Kiss",
      assetUrl: "img/World War 2 Kiss.jpg",
      credit: "V-J Day in Times Square, Alfred Eisenstaedt, 1945"
    },
    {
      name: "Mist in Yosemite",
      assetUrl: "img/Mist in Yosemite.jpg",
      credit: "Unknown"
    },
  ];
}

function initDesign(inspiration) {
  // set the canvas size based on the container
  let canvasContainer = $('.image-container'); // Select the container using jQuery
  let canvasWidth = canvasContainer.width(); // Get the width of the container
  let aspectRatio = inspiration.image.height / inspiration.image.width;
  let canvasHeight = canvasWidth * aspectRatio; // Calculate the height based on the aspect ratio
  resizeCanvas(canvasWidth, canvasHeight);
  $(".caption").text(inspiration.credit); // Set the caption text

  // add the original image to #original
  const imgHTML = `<img src="${inspiration.assetUrl}" style="width:${canvasWidth}px;">`
  $('#original').empty();
  $('#original').append(imgHTML);


  let design = {
    bg: 128,
    fg: []
  }

  for (let i = 0; i < 300; i++) {
    design.fg.push({
      x: random(width),
      y: random(height),
      w: random(width / 6),
      h: random(height / 6), fill: random(255)
    })
  }
  return design;
}

function renderDesign(design, inspiration) {

  background(design.bg);
  noStroke();
  for (let box of design.fg) {
    let rand = random(3);
    fill(box.fill, 128);
    if (rand < 1.5) ellipse(box.x, box.y, box.w, box.h);
    else rect(box.x, box.y, box.w, box.h);
  }
}

function mutateDesign(design, inspiration, rate) {
  design.bg = mut(design.bg, 0, 255, rate);
  for (let box of design.fg) {
    box.fill = mut(box.fill, 0, 255, rate);
    box.x = mut(box.x, 0, width, rate);
    box.y = mut(box.y, 0, height, rate);
    box.w = mut(box.w, 0, width / 2, rate);
    box.h = mut(box.h, 0, height / 2, rate);
  }
}

function mut(num, min, max, rate) {
  return constrain(randomGaussian(num, (rate * (max - min)) / 60), min, max);
}



/* exported preload, setup, draw */
/* global memory, dropper, restart, rate, slider, activeScore, bestScore, fpsCounter */
/* global getInspirations, initDesign, renderDesign, mutateDesign */




let bestDesign;
let currentDesign;
let currentScore;
let currentInspiration;
let currentCanvas;
let currentInspirationPixels;

function preload() {

  let allInspirations = getInspirations();

  for (let i = 0; i < allInspirations.length; i++) {
    let insp = allInspirations[i];
    insp.image = loadImage(insp.assetUrl);
    let option = document.createElement("option");
    option.value = i;
    option.innerHTML = insp.name;
    dropper.appendChild(option);
  }

  dropper.onchange = e => inspirationChanged(allInspirations[e.target.value]);
  currentInspiration = allInspirations[0];

  restart.onclick = () =>
    inspirationChanged(allInspirations[dropper.value]);
}

function inspirationChanged(nextInspiration) {
  currentInspiration = nextInspiration;
  currentDesign = undefined;
  memory.innerHTML = "";
  setup();
}

function setup() {
  currentCanvas = createCanvas(width, height);
  //currentCanvas = createCanvas(600, 410);
  currentCanvas.parent(document.getElementById("active"));
  currentScore = Number.NEGATIVE_INFINITY;
  currentDesign = initDesign(currentInspiration);
  bestDesign = currentDesign;
  image(currentInspiration.image, 0, 0, width, height);
  loadPixels();
  currentInspirationPixels = pixels;
}

function evaluate() {
  loadPixels();

  let error = 0;
  let n = pixels.length;

  for (let i = 0; i < n; i++) {
    error += sq(pixels[i] - currentInspirationPixels[i]);
  }
  return 1 / (1 + error / n);
}

function memorialize() {
  let url = currentCanvas.canvas.toDataURL();

  let img = document.createElement("img");
  img.classList.add("memory");
  img.src = url;
  img.width = width;
  img.heigh = height;
  img.title = currentScore;

  document.getElementById("best").innerHTML = "";
  document.getElementById("best").appendChild(img.cloneNode());

  img.width = width / 2;
  img.height = height / 2;

  memory.insertBefore(img, memory.firstChild);

  if (memory.childNodes.length > memory.dataset.maxItems) {
    memory.removeChild(memory.lastChild);
  }
}

let mutationCount = 0;

function draw() {

  if (!currentDesign) {
    return;
  }
  randomSeed(mutationCount++);
  currentDesign = JSON.parse(JSON.stringify(bestDesign));
  rate.innerHTML = slider.value;
  mutateDesign(currentDesign, currentInspiration, slider.value / 100.0);

  randomSeed(0);
  renderDesign(currentDesign, currentInspiration);
  let nextScore = evaluate();
  activeScore.innerHTML = nextScore;
  if (nextScore > currentScore) {
    currentScore = nextScore;
    bestDesign = currentDesign;
    memorialize();
    bestScore.innerHTML = currentScore;
  }

  fpsCounter.innerHTML = Math.round(frameRate());
}